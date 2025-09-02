import { defaultSipConfigs } from '../../configs';
import { register } from '../../methods/registration';
import { getSipStoreConfigs, getSipStoreUserAgent, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';

/* -------------------------------------------------------------------------- */
export function onTransportConnected(userAgent = getSipStoreUserAgent()) {
  console.log('Connected to Web Socket!');
  if (!userAgent) return;
  // Reset the reconnectionAttempts
  userAgent.isReRegister = false;
  userAgent.transport.attemptingReconnection = false;

  userAgent.transport.reconnectionAttempts =
    defaultSipConfigs.registration.transportReconnectionAttempts;

  // Auto start register
  if (!userAgent.transport.attemptingReconnection && !userAgent.registering) {
    window.setTimeout(function () {
      register(userAgent);
    }, 500);
  } else {
    console.warn(
      'onTransportConnected: register() called, but attemptingReconnection is true or registering is true',
    );
  }
  setSipStore({ userAgent, status: 'connected' });
}

export function onTransportConnectError(error: Error, userAgent = getSipStoreUserAgent()) {
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

  reconnectTransport(userAgent);
  setSipStore({ userAgent, status: 'disconnected' });
}
export function onTransportDisconnected(userAgent: SipUserAgent) {
  console.log('Disconnected from Web Socket!');

  userAgent.isReRegister = false;

  setSipStore({ userAgent: userAgent });
}

export function reconnectTransport(userAgent = getSipStoreUserAgent()) {
  if (!userAgent) return;

  userAgent.registering = false; // if the transport was down, you will not be registered
  if (userAgent.transport && userAgent.transport.isConnected()) {
    // Asked to re-connect, but ws is connected
    onTransportConnected(userAgent);
    return;
  }
  console.log('Reconnect Transport...');

  setTimeout(function () {
    console.log('ReConnecting to WebSocket...');

    if (userAgent.transport && userAgent.transport.isConnected()) {
      // Already Connected
      console.log('Transport Already Connected...');
      onTransportConnected(userAgent);
      return;
    } else if (userAgent.transport.reconnectionAttempts > 0) {
      userAgent.transport.attemptingReconnection = true;
      userAgent.reconnect().catch(function (error) {
        userAgent.transport.attemptingReconnection = false;
        console.warn('Failed to reconnect', error);
        // Try Again
        reconnectTransport(userAgent);
      });
    }
  }, getSipStoreConfigs().registration.transportReconnectionTimeout);

  console.log(
    'Waiting to Re-connect...',
    'Attempt remaining',
    userAgent.transport.reconnectionAttempts,
  );
  userAgent.transport.reconnectionAttempts = userAgent.transport.reconnectionAttempts - 1;
  setSipStore({ userAgent, status: 'reconnecting' });
}
