import { defaultRegistrationConfig } from '../../../../configs';
import { RtcConfig } from '../../../../configs/types';
import { register } from '../../methods/registration';
import {
  getRtcStore,
  getEngineInstance,
  getRtcUsernameConfigs,
  setRtcStore,
} from '../../../../store';
import { SipUserAgent } from '../../types';

/* -------------------------------------------------------------------------- */
export function onTransportConnected(
  configKey: RtcConfig['key'],
  userAgent = getEngineInstance(configKey) as SipUserAgent,
) {
  console.log('Connected to Web Socket!');
  if (!userAgent) return;
  // Reset the reconnectionAttempts
  userAgent.isReRegister = false;
  userAgent.transport.attemptingReconnection = false;

  // Auto start register
  if (!userAgent.transport.attemptingReconnection && !userAgent.registering) {
    window.setTimeout(function () {
      register(configKey, userAgent);
    }, 500);
  } else {
    console.warn(
      'onTransportConnected: register() called, but attemptingReconnection is true or registering is true',
    );
  }
  const { engines, statuses } = getRtcStore();

  userAgent.transport.reconnectionAttempts =
    getRtcUsernameConfigs(configKey)?.registration?.transportReconnectionAttempts ||
    defaultRegistrationConfig.transportReconnectionAttempts;

  setRtcStore({
    engines: { ...engines, [configKey]: userAgent },
    statuses: {
      ...statuses,
      [configKey]: userAgent.transport.isConnected() ? 'connected' : 'connecting',
    },
  });
}

export function onTransportConnectError(
  error: Error,
  configKey: RtcConfig['key'],
  userAgent = getEngineInstance(configKey) as SipUserAgent,
) {
  console.warn('WebSocket Connection Failed:', error);
  if (!userAgent) return;
  // We set this flag here so that the re-register attempts are fully completed.
  userAgent.isReRegister = false;

  // If there is an issue with the WS connection
  // We unregister, so that we register again once its up
  console.log('Unregister...');
  try {
    userAgent.registerer.unregister();
  } catch (e) {
    // I know!!!
  }

  reconnectTransport(configKey, userAgent);
  const { engines, statuses } = getRtcStore();
  setRtcStore({
    engines: { ...engines, [configKey]: userAgent },
    statuses: { ...statuses, [configKey]: 'disconnected' },
  });
}
export function onTransportDisconnected(configKey: RtcConfig['key'], userAgent: SipUserAgent) {
  console.log('Disconnected from Web Socket!');

  userAgent.isReRegister = false;

  const { engines } = getRtcStore();
  setRtcStore({
    engines: { ...engines, [configKey]: userAgent },
  });
}

export function reconnectTransport(
  configKey: RtcConfig['key'],
  userAgent = getEngineInstance(configKey) as SipUserAgent,
  forceReconnect: boolean = false,
) {
  if (!userAgent) return;

  userAgent.registering = false; // if the transport was down, you will not be registered
  if (userAgent.transport && userAgent.transport.isConnected()) {
    // Asked to re-connect, but ws is connected
    onTransportConnected(configKey, userAgent);
    return;
  }
  console.log('Reconnect Transport...');

  setTimeout(function () {
    console.log('ReConnecting to WebSocket...');

    if (userAgent.transport && userAgent.transport.isConnected()) {
      // Already Connected
      console.log('Transport Already Connected...');
      onTransportConnected(configKey, userAgent);
      return;
    } else if (userAgent.transport.reconnectionAttempts > 0 || forceReconnect) {
      userAgent.transport.attemptingReconnection = true;
      userAgent.reconnect().catch(function (error) {
        userAgent.transport.attemptingReconnection = false;
        console.warn('Failed to reconnect', error);
        // Try Again
        reconnectTransport(configKey, userAgent);
      });
    }
  }, getRtcUsernameConfigs(configKey)?.registration.transportReconnectionTimeout);

  console.log(
    'Waiting to Re-connect...',
    'Attempt remaining',
    userAgent.transport.reconnectionAttempts,
  );
  if (userAgent.transport.reconnectionAttempts > 0) --userAgent.transport.reconnectionAttempts;
  const { engines, statuses } = getRtcStore();
  setRtcStore({
    engines: { ...engines, [configKey]: userAgent },
    statuses: { ...statuses, [configKey]: 'connecting' },
  });
}
