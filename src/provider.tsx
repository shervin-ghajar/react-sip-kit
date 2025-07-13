import { defaultSipConfigs } from './configs';
import { SipConfigs } from './configs/types';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
  reconnectTransport,
} from './events/transport';
import { useSessionMethods } from './hooks';
import { detectDevices, getMediaPermissions } from './methods/initialization';
import { useSipStore } from './store';
import { SipContextType, SipProviderProps, SipUserAgent } from './types';
import { deepMerge } from './utils';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { Registerer, RegistererState, UserAgent, UserAgentDelegate } from 'sip.js';

export const SipContext = createContext<SipContextType | undefined>(undefined);
export const SipProvider = ({ children, configs }: SipProviderProps) => {
  const userAgent = useSipStore((state) => state.userAgent);
  const lines = useSipStore((state) => state.lines);
  const setSipStore = useSipStore((state) => state.setSipStore);
  const hasAudioDevice = useSipStore((state) => state.devicesInfo.hasAudioDevice);
  const hasSpeakerDevice = useSipStore((state) => state.devicesInfo.hasSpeakerDevice);
  const hasVideoDevice = useSipStore((state) => state.devicesInfo.hasVideoDevice);
  const audioInputDevices = useSipStore((state) => state.devicesInfo.audioInputDevices);
  const videoInputDevices = useSipStore((state) => state.devicesInfo.videoInputDevices);
  const speakerDevices = useSipStore((state) => state.devicesInfo.speakerDevices);

  const mergedConfigs = useMemo(
    () => deepMerge(defaultSipConfigs, configs as SipConfigs),
    [configs],
  );
  const { receiveSession } = useSessionMethods();

  useEffect(() => {
    setSipStore({ configs: mergedConfigs });
    (async function () {
      await initialize();
    })();
    return () => {
      userAgent?.stop();
    };
  }, [mergedConfigs]);

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
      uri: UserAgent.makeURI(
        `sip:${mergedConfigs.account.username}@${mergedConfigs.account.domain}`,
      ),
      transportOptions: {
        server: `wss://${mergedConfigs.account.wssServer}:${mergedConfigs.account.webSocketPort}${mergedConfigs.account.serverPath}`,
        traceSip: false,
        connectionTimeout: mergedConfigs.registration.transportConnectionTimeout,
      },
      authorizationUsername: mergedConfigs.account.username,
      authorizationPassword: mergedConfigs.account.password,
      delegate: {
        onInvite: receiveSession as any,
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
    ua.transport.reconnectionAttempts =
      mergedConfigs.registration.transportReconnectionAttempts || 0;
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
      expires: mergedConfigs.registration.registerExpires, // The expiration time in seconds for the registration.
      extraHeaders: [],
      extraContactHeaderParams: [],
      refreshFrequency: 75, // Determines when a re-REGISTER request is sent. The value should be specified as a percentage of the expiration time (between 50 and 99).
    };

    ua.registerer = new Registerer(ua, RegistererOptions);
    console.log('Creating Registerer... Done');

    ua.registerer.stateChange.addListener(function (newState) {
      console.log('User Agent Registration State:', newState);
      console.log({ 'SIP-STATUS': newState });
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

    console.log('User Agent Connecting to WebSocket...');
    ua.start().catch(function (error) {
      onTransportConnectError(error);
    });
    console.log('createUserAgent', { ua });
    updateUserAgent(ua);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedConfigs]);

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
          if (mergedConfigs.features.enableVideo) {
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
  const updateUserAgent = (ua: SipUserAgent) => {
    setSipStore({ userAgent: ua });
  };

  return (
    <SipContext.Provider
      value={{
        status: userAgent?.isConnected() ? 'connected' : 'disconnected',
        lines,
        transport: {
          reconnectTransport,
        },
      }}
    >
      {children}
    </SipContext.Provider>
  );
};

export const useSipProvider = <MetaDataType extends object = object>() => {
  const context = useContext(SipContext);
  if (!context) throw new Error('useSipProvider must be used within a SipProvider');

  return context as SipContextType<MetaDataType>;
};
