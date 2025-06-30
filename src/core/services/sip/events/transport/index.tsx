import { TransportReconnectionAttempts, TransportReconnectionTimeout } from '../../configs';
import { Register } from '../../methods/registration';
import { getSipStore, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';
import clone from 'clone';

/* -------------------------------------------------------------------------- */
export function onTransportConnected(userAgent?: SipUserAgent) {
  console.log('Connected to Web Socket!');
  const clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (!clonedUserAgent) return;
  // Reset the ReconnectionAttempts
  clonedUserAgent.isReRegister = false;
  clonedUserAgent.transport.attemptingReconnection = false;
  clonedUserAgent.transport.ReconnectionAttempts = TransportReconnectionAttempts;

  // Auto start register
  if (
    clonedUserAgent.transport.attemptingReconnection == false &&
    clonedUserAgent.registering == false
  ) {
    window.setTimeout(function () {
      Register(clonedUserAgent);
    }, 500);
  } else {
    console.warn(
      'onTransportConnected: Register() called, but attemptingReconnection is true or registering is true',
    );
  }
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}

export function onTransportConnectError(error: any, userAgent?: SipUserAgent) {
  console.warn('WebSocket Connection Failed:', error);
  const clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
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

  ReconnectTransport(clonedUserAgent);
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
export function onTransportDisconnected(userAgent: SipUserAgent) {
  console.log('Disconnected from Web Socket!');
  const clonedUserAgent = clone(userAgent);

  clonedUserAgent.isReRegister = false;

  setSipStore({ userAgent: clonedUserAgent });
}

export function ReconnectTransport(userAgent?: SipUserAgent) {
  const clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
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
      onTransportConnected(clonedUserAgent);
      return;
    } else {
      clonedUserAgent.transport.attemptingReconnection = true;
      clonedUserAgent.reconnect().catch(function (error) {
        clonedUserAgent.transport.attemptingReconnection = false;
        console.warn('Failed to reconnect', error);

        // Try Again
        ReconnectTransport(clonedUserAgent);
      });
    }
  }, TransportReconnectionTimeout * 1000);

  console.log(
    'Waiting to Re-connect...',
    TransportReconnectionTimeout,
    'Attempt remaining',
    clonedUserAgent.transport.ReconnectionAttempts,
  );
  clonedUserAgent.transport.ReconnectionAttempts =
    clonedUserAgent.transport.ReconnectionAttempts - 1;
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
