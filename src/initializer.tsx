import { SipAccountConfig, SipConfigs } from './configs/types';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
} from './events/transport';
import { sessionMethods } from './methods/session';
import { getSipStore } from './store';
import { SipUserAgent } from './types';
import { getMediaDevices } from './utils';
import { Registerer, RegistererState, UserAgent, UserAgentDelegate } from 'sip.js';

export class SipInitializer {
  private ua?: SipUserAgent;
  private configs: SipConfigs;
  private username: SipAccountConfig['username'];

  constructor(configs: SipConfigs) {
    this.configs = configs;
    this.username = configs.account.username;

    // write configs to store
    getSipStore().setConfig(this.username, configs);
  }

  public async init() {
    await this.detectDevices();
    await this.createUserAgent();
  }

  private async detectDevices() {
    const devices = await getMediaDevices(this.username);
    getSipStore().setSipStore({ devicesInfo: devices });
  }

  private async createUserAgent() {
    console.log({
      domain: `sip:${this.username}@${this.configs.account.domain}`,
      server: `wss://${this.configs.account.wssServer}:${this.configs.account.webSocketPort}${this.configs.account.serverPath}`,
    });

    const ua = new UserAgent({
      uri: UserAgent.makeURI(`sip:${this.username}@${this.configs.account.domain}`),
      transportOptions: {
        server: `wss://${this.configs.account.wssServer}:${this.configs.account.webSocketPort}${this.configs.account.serverPath}`,
        traceSip: false,
        connectionTimeout: this.configs.registration.transportConnectionTimeout,
      },
      authorizationUsername: this.username,
      authorizationPassword: this.configs.account.password,
      delegate: {
        onInvite: sessionMethods({ username: this.username }).receiveSession as any,
        onMessage: () => console.log('Received message'),
      } as UserAgentDelegate,
    }) as SipUserAgent;

    // Custom properties
    ua.isRegistered = () =>
      ua && ua.registerer && ua.registerer.state === RegistererState.Registered;
    ua.sessions = ua._sessions;
    ua.registrationCompleted = false;
    ua.registering = false;
    ua.transport.reconnectionAttempts =
      this.configs.registration.transportReconnectionAttempts || 0;
    ua.transport.attemptingReconnection = false;
    ua.BlfSubs = [];
    ua.lastVoicemailCount = 0;

    // Transport events
    ua.transport.onConnect = () => onTransportConnected(this.username, ua);
    ua.transport.onDisconnect = (error?: Error) => {
      if (error) onTransportConnectError(error, this.username, ua);
      else onTransportDisconnected(this.username, ua);
    };

    // Registerer
    ua.registerer = new Registerer(ua, {
      logConfiguration: false,
      expires: this.configs.registration.registerExpires,
      extraHeaders: [],
      extraContactHeaderParams: [],
      refreshFrequency: 75,
    });

    ua.registerer.stateChange.addListener((newState) => {
      console.log(`UserAgent ${this.username} registration:`, newState);
      switch (newState) {
        case RegistererState.Registered:
          onRegistered(this.username, ua);
          break;
        case RegistererState.Unregistered:
          onUnregistered(this.username, ua);
          break;
      }
    });

    await ua.start().catch((err) => onTransportConnectError(err, this.username));
    this.ua = ua;

    // save to store
    getSipStore().setUserAgent(this.username, ua);
    console.log(`✅ SIP UserAgent created for ${this.username}`, ua);
  }

  public getUserAgent() {
    return this.ua;
  }

  public async stop() {
    if (this.ua) {
      await this.ua.stop();
      console.log(`🛑 SIP UserAgent stopped for ${this.username}`);
    }
  }
}
