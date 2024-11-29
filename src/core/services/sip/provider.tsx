import { TransportConnectionTimeout } from './configs';
import { onRegistered, onUnregistered } from './events/registration';
import {
  onTransportConnected,
  onTransportConnectError,
  onTransportDisconnected,
} from './events/transport';
import { useCallActions } from './hooks';
// import { createAudioSession, handleSessionEvents } from './sipService';
import { useSipStore } from './store';
import { LineObject, SipContextType, SipProviderProps, SipUserAgent } from './types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserAgent, RegistererState, Registerer } from 'sip.js';

const SipContext = createContext<SipContextType | undefined>(undefined);

const RegisterExpires = 300;

export const SipProvider: React.FC<SipProviderProps> = ({ children, config }) => {
  const { userAgent, setSipStore } = useSipStore();
  const { ReceiveCall } = useCallActions({ config });

  const [activeSessions, setActiveSessions] = useState<Map<number, LineObject>>(new Map());

  useEffect(() => {
    // Create user agent for SIP connection
    createUserAgent();
    return () => {
      userAgent?.stop();
    };
  }, [config]);

  // Create user agent for SIP connection
  const createUserAgent = useCallback(() => {
    const ua = new UserAgent({
      uri: UserAgent.makeURI(`sip:${config.username}@${config.domain}`),
      transportOptions: {
        server: `wss://${config.wssServer}:${config.webSocketPort}${config.serverPath}`,
        traceSip: false,
        connectionTimeout: TransportConnectionTimeout,
      },
      authorizationUsername: config.username,
      authorizationPassword: config.password,
      autoStart: false,
      autoStop: true,
      delegate: {
        onInvite: ReceiveCall as any,
        onMessage: () => console.log('Received message'), //TODO ReceiveOutOfDialogMessage
      },
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
    ua.transport.onDisconnect = (error: any) => {
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
    updateUserAgent(ua);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // Update UserAgent
  const updateUserAgent = (userAgent: SipUserAgent) => {
    setSipStore({ userAgent });
  };

  console.log(123, { userAgent });

  const startAudioCall = async (
    lineObj: LineObject,
    dialledNumber: string,
    extraHeaders?: string[],
  ) => {
    if (!userAgent) return;

    // const session = createAudioSession(userAgent, lineObj, dialledNumber, extraHeaders);

    // setActiveSessions((prev) =>
    //   new Map(prev).set(lineObj.LineNumber, { ...lineObj, SipSession: session }),
    // );

    // handleSessionEvents(session, lineObj, setActiveSessions);
    // await session.invite().catch(console.error);
  };

  return (
    <SipContext.Provider value={{ userAgent, activeSessions, startAudioCall }}>
      {children}
    </SipContext.Provider>
  );
};

export const useSip = () => {
  const context = useContext(SipContext);
  if (!context) throw new Error('useSip must be used within a SipProvider');
  return context;
};
