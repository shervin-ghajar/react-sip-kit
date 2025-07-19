import { defaultSipConfigs } from '../../configs';
import { register } from '../../methods/registration';
import { getSipStoreConfigs, getSipStoreUserAgent, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';
import clone from 'clone';

/* -------------------------------------------------------------------------- */
export function onTransportConnected(userAgent?: SipUserAgent) {
  console.log('Connected to Web Socket!');
  const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
  if (!clonedUserAgent) return;
  // Reset the reconnectionAttempts
  clonedUserAgent.isReRegister = false;
  clonedUserAgent.transport.attemptingReconnection = false;

  clonedUserAgent.transport.reconnectionAttempts =
    defaultSipConfigs.registration.transportReconnectionAttempts;

  // Auto start register
  if (!clonedUserAgent.transport.attemptingReconnection && !clonedUserAgent.registering) {
    window.setTimeout(function () {
      register(clonedUserAgent);
    }, 500);
  } else {
    console.warn(
      'onTransportConnected: register() called, but attemptingReconnection is true or registering is true',
    );
  }
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}

export function onTransportConnectError(error: Error, userAgent?: SipUserAgent) {
  console.warn('WebSocket Connection Failed:', error);
  const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
  if (!clonedUserAgent) return;
  // We set this flag here so that the re-register attempts are fully completed.
  clonedUserAgent.isReRegister = false;

  // If there is an issue with the WS connection
  // We unregister, so that we register again once its up
  console.log('Unregister...');
  try {
    clonedUserAgent.registerer.unregister();
  } catch (e) {
    // I know!!!
  }

  reconnectTransport(clonedUserAgent);
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
export function onTransportDisconnected(userAgent: SipUserAgent) {
  console.log('Disconnected from Web Socket!');
  const clonedUserAgent = clone(userAgent);

  clonedUserAgent.isReRegister = false;

  setSipStore({ userAgent: clonedUserAgent });
}

export function reconnectTransport(userAgent?: SipUserAgent) {
  const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
  if (!clonedUserAgent) return;

  clonedUserAgent.registering = false; // if the transport was down, you will not be registered
  if (clonedUserAgent.transport && clonedUserAgent.transport.isConnected()) {
    // Asked to re-connect, but ws is connected
    onTransportConnected(clonedUserAgent);
    return;
  }
  console.log('Reconnect Transport...');

  setTimeout(function () {
    console.log('ReConnecting to WebSocket...');

    if (clonedUserAgent.transport && clonedUserAgent.transport.isConnected()) {
      // Already Connected
      console.log('Transport Already Connected...');
      onTransportConnected(clonedUserAgent);
      return;
    } else if (clonedUserAgent.transport.reconnectionAttempts > 0) {
      clonedUserAgent.transport.attemptingReconnection = true;
      clonedUserAgent.reconnect().catch(function (error) {
        clonedUserAgent.transport.attemptingReconnection = false;
        console.warn('Failed to reconnect', error);
        // Try Again
        reconnectTransport(clonedUserAgent);
      });
    }
  }, getSipStoreConfigs().registration.transportReconnectionTimeout);

  console.log(
    'Waiting to Re-connect...',
    'Attempt remaining',
    clonedUserAgent.transport.reconnectionAttempts,
  );
  clonedUserAgent.transport.reconnectionAttempts =
    clonedUserAgent.transport.reconnectionAttempts - 1;
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
