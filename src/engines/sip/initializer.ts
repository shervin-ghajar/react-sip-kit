import { RtcConfig, SipAccountConfig, SipConfig } from '../../configs/types';
import { getRtcStore } from '../../store';
import { getMediaDevices } from '../../utils';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
} from './events/transport';
import { sessionMethods } from './methods/session';
import { Registerer, RegistererState, UserAgent, UserAgentDelegate } from 'sip.js';
import { SipInvitationType, SipUserAgent } from './types';

export class SipEngineInitializer {
  private ua?: SipUserAgent;
  private config: SipConfig;
  private username: SipAccountConfig['username'];
  private configKey: RtcConfig['key'];
  private mode: 'full-sip' | 'signaling-only' = 'full-sip';

  constructor(config: SipConfig, key: string, mode?: 'full-sip' | 'signaling-only') {
    this.config = config;
    this.username = config.account.username;
    this.configKey = key;
    this.mode = mode ?? this.mode;
  }

  public async init() {
    await this.detectDevices();
    await this.createUserAgent();
  }

  private async detectDevices() {
    const devices = await getMediaDevices(this.configKey);
    getRtcStore().setRtcStore({ devicesInfo: devices });
  }

  private async createUserAgent() {
    const { onInvite, ...restDelegate } = this.config.registration.delegate!;

    const sessionDescriptionHandlerFactoryOptions =
      this.mode === 'signaling-only'
        ? {
            peerConnectionConfiguration: {
              iceTransportPolicy: 'all',
            },
            iceGatheringTimeout: 1,
          }
        : {
            peerConnectionConfiguration: {
              bundlePolicy: 'balanced',
              ...this.config.registration.peerConnectionConfiguration,
            },
            iceGatheringTimeout: this.config.registration.iceGatheringTimeout,
          };

    const ua = new UserAgent({
      uri: UserAgent.makeURI(`sip:${this.username}@${this.config.account.domain}`),
      transportOptions: {
        server: `wss://${this.config.account.wssServer}:${this.config.account.webSocketPort}${this.config.account.serverPath}`,
        traceSip: false,
        connectionTimeout: this.config.registration.transportConnectionTimeout,
      },
      sessionDescriptionHandlerFactoryOptions,
      authorizationUsername: this.username,
      authorizationPassword: this.config.account.password,
      hackIpInContact: this.config.registration.hackIpInContact,
      contactParams: this.config.registration.contactParams,
      delegate: {
        onInvite: (invitation) => {
          sessionMethods({ configKey: this.configKey }).receiveSession(
            invitation as unknown as SipInvitationType,
          );
          onInvite?.(invitation);
        },
        ...(restDelegate ?? {}),
      } as UserAgentDelegate,
    }) as SipUserAgent;

    // Custom properties
    ua.isRegistered = () =>
      ua && ua.registerer && ua.registerer.state === RegistererState.Registered;
    ua.sessions = ua._sessions;
    ua.registrationCompleted = false;
    ua.registering = false;
    ua.transport.reconnectionAttempts = this.config.registration.transportReconnectionAttempts || 0;
    ua.transport.attemptingReconnection = false;
    ua.BlfSubs = [];
    ua.lastVoicemailCount = 0;

    // Transport events
    ua.transport.onConnect = () => onTransportConnected(this.configKey, ua);
    ua.transport.onDisconnect = (error?: Error) => {
      if (error) onTransportConnectError(error, this.configKey, ua);
      else onTransportDisconnected(this.configKey, ua);
    };

    // Registerer
    ua.registerer = new Registerer(ua, {
      logConfiguration: false,
      expires: this.config.registration.registerExpires,
      extraHeaders: [],
      extraContactHeaderParams: [],
      refreshFrequency: 75,
    });

    ua.registerer.stateChange.addListener((newState) => {
      console.log(`UserAgent ${this.username} registration:`, newState);
      switch (newState) {
        case RegistererState.Registered:
          onRegistered(this.configKey, ua);
          break;
        case RegistererState.Unregistered:
          onUnregistered(this.configKey, ua);
          break;
      }
    });

    await ua.start().catch((err) => onTransportConnectError(err, this.configKey));
    this.ua = ua;

    // save to store
    getRtcStore().setEngine(this.configKey, ua);
    console.log(`✅ SIP UserAgent created for ${this.configKey}`, ua);
  }

  public getUserAgent() {
    return this.ua;
  }

  public async stop() {
    if (this.ua) {
      await this.ua.stop();
      console.log(`🛑 SIP UserAgent stopped for ${this.configKey}`);
    }
  }
}
