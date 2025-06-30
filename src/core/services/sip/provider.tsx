import { EnableVideoCalling, RegisterExpires, TransportConnectionTimeout } from './configs';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
} from './events/transport';
import { useSessionMethods, useSessionEvents } from './hooks';
import { detectDevices, getMediaPermissions } from './methods/initialization';
import { useSipStore } from './store';
import { SipContextType, SipProviderProps, SipUserAgent } from './types';
import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { UserAgent, RegistererState, Registerer, UserAgentDelegate } from 'sip.js';

export const SipContext = createContext<SipContextType | undefined>(undefined);
export const SipProvider: React.FC<SipProviderProps> = ({ children, config }) => {
  const {
    userAgent,
    devicesInfo: {
      hasAudioDevice,
      hasSpeakerDevice,
      hasVideoDevice,
      audioInputDevices,
      videoInputDevices,
      speakerDevices,
    },
    setSipStore,
  } = useSipStore();
  const store = useSipStore();
  const methods = useSessionMethods();
  const events = useSessionEvents();
  console.log({ isRegistered: userAgent });
  useEffect(() => {
    setSipStore({ config });
    (async function () {
      await initialize();
    })();
    return () => {
      userAgent?.stop();
    };
  }, [config]);

  const initialize = async () => {
    // Get Audio Access Permission
    await getMediaPermissions('audio');

    // User Connected Devices Detection
    initiateDetectedDevices();

    // Create user agent for SIP connection
    createUserAgent();
  };

  // Create user agent for SIP connection
  const createUserAgent = useCallback(() => {
    let ua = new UserAgent({
      uri: UserAgent.makeURI(`sip:${config.username}@${config.domain}`),
      transportOptions: {
        server: `wss://${config.wssServer}:${config.webSocketPort}${config.serverPath}`,
        traceSip: false,
        connectionTimeout: TransportConnectionTimeout,
      },
      authorizationUsername: config.username,
      authorizationPassword: config.password,
      delegate: {
        onInvite: methods.receiveCall as any,
        onMessage: () => console.log('Received message'), //TODO ReceiveOutOfDialogMessage
      } as UserAgentDelegate,
    }) as SipUserAgent;
    // Setting custom properties and methods for userAgent
    ua.isRegistered = function () {
      return ua && ua.registerer && ua.registerer.state === RegistererState.Registered;
    };

    ua.sessions = ua._sessions; // Assign sessions
    ua.registrationCompleted = false;
    ua.registering = false;
    ua.transport.ReconnectionAttempts = config?.TransportReconnectionAttempts || 0;
    ua.transport.attemptingReconnection = false;
    ua.BlfSubs = [];
    ua.lastVoicemailCount = 0;

    // Handle the transport connection states
    ua.transport.onConnect = () => {
      onTransportConnected(ua);
    };
    ua.transport.onDisconnect = (error?: Error) => {
      if (error) {
        onTransportConnectError(error, ua);
      } else {
        onTransportDisconnected(ua);
      }
    };

    const RegistererOptions = {
      logConfiguration: false, // If true, constructor logs the registerer configuration.
      expires: RegisterExpires,
      extraHeaders: [],
      extraContactHeaderParams: [],
      refreshFrequency: 75, // Determines when a re-REGISTER request is sent. The value should be specified as a percentage of the expiration time (between 50 and 99).
    };
    console.log(111, { ua });

    ua.registerer = new Registerer(ua, RegistererOptions);
    console.log('Creating Registerer... Done');

    ua.registerer.stateChange.addListener(function (newState) {
      console.log('User Agent Registration State:', newState);
      console.log({ newState });
      switch (newState) {
        case RegistererState.Initial:
          // Nothing to do
          break;
        case RegistererState.Registered:
          onRegistered(ua);
          break;
        case RegistererState.Unregistered:
          onUnregistered(ua);
          break;
        case RegistererState.Terminated:
          // Nothing to do
          break;
      }
    });
    ua.start();
    console.log(111, { ua });
    Object.defineProperty(ua, '_key', {
      enumerable: false,
      value: 1,
    });
    updateUserAgent(ua);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // Detect devices
  const initiateDetectedDevices = () => {
    //TODO useHook
    detectDevices((deviceInfos) => {
      console.log({ deviceInfos });
      if (!deviceInfos) return;
      let tmpHasAudioDevice = hasAudioDevice;
      let tmpAudioInputDevices = audioInputDevices;
      let tmpHasSpeakerDevice = hasSpeakerDevice;
      let tmpSpeakerDevices = speakerDevices;
      let tmpHasVideoDevice = hasVideoDevice; // Safari and Firefox don't have these
      let tmpVideoInputDevices = videoInputDevices;
      for (let i = 0; i < deviceInfos.length; ++i) {
        if (deviceInfos[i].kind === 'audioinput') {
          tmpHasAudioDevice = true;
          tmpAudioInputDevices.push(deviceInfos[i]);
        } else if (deviceInfos[i].kind === 'audiooutput') {
          tmpHasSpeakerDevice = true;
          tmpSpeakerDevices.push(deviceInfos[i]);
        } else if (deviceInfos[i].kind === 'videoinput') {
          if (EnableVideoCalling == true) {
            tmpHasVideoDevice = true;
            tmpVideoInputDevices.push(deviceInfos[i]);
          }
        }
      }
      setSipStore({
        devicesInfo: {
          hasAudioDevice: tmpHasAudioDevice,
          audioInputDevices: tmpAudioInputDevices,
          hasSpeakerDevice: tmpHasSpeakerDevice,
          speakerDevices: tmpSpeakerDevices,
          hasVideoDevice: tmpHasVideoDevice,
          videoInputDevices: tmpVideoInputDevices,
        },
      });
    });
  };
  // Update UserAgent
  const updateUserAgent = (userAgent: SipUserAgent) => {
    setSipStore({ userAgent });
  };

  return <SipContext.Provider value={{ store, methods, events }}>{children}</SipContext.Provider>;
};

export const useSipProvider = () => {
  const context = useContext(SipContext);
  if (!context) throw new Error('useSipProvider must be used within a SipProvider');
  return context;
};
