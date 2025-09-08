import { defaultSipConfigs } from '../../configs';
import { SipAccountConfig } from '../../configs/types';
import { register } from '../../methods/registration';
import { getSipUsernameConfigs, getSipStoreUserAgent, setSipStore, getSipStore } from '../../store';
import { SipUserAgent } from '../../types';

/* -------------------------------------------------------------------------- */
export function onTransportConnected(
  username: SipAccountConfig['username'],
  userAgent = getSipStoreUserAgent(username),
) {
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
      register(username, userAgent);
    }, 500);
  } else {
    console.warn(
      'onTransportConnected: register() called, but attemptingReconnection is true or registering is true',
    );
  }
  const { userAgents, statuses } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [username]: userAgent },
    statuses: { ...statuses, [username]: 'connecting' },
  });
}

export function onTransportConnectError(
  error: Error,
  username: SipAccountConfig['username'],
  userAgent = getSipStoreUserAgent(username),
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

  reconnectTransport(username, userAgent);
  const { userAgents, statuses } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [username]: userAgent },
    statuses: { ...statuses, [username]: 'disconnected' },
  });
}
export function onTransportDisconnected(
  username: SipAccountConfig['username'],
  userAgent: SipUserAgent,
) {
  console.log('Disconnected from Web Socket!');

  userAgent.isReRegister = false;

  const { userAgents } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [username]: userAgent },
  });
}

export function reconnectTransport(
  username: SipAccountConfig['username'],
  userAgent = getSipStoreUserAgent(username),
) {
  if (!userAgent) return;

  userAgent.registering = false; // if the transport was down, you will not be registered
  if (userAgent.transport && userAgent.transport.isConnected()) {
    // Asked to re-connect, but ws is connected
    onTransportConnected(username, userAgent);
    return;
  }
  console.log('Reconnect Transport...');

  setTimeout(function () {
    console.log('ReConnecting to WebSocket...');

    if (userAgent.transport && userAgent.transport.isConnected()) {
      // Already Connected
      console.log('Transport Already Connected...');
      onTransportConnected(username, userAgent);
      return;
    } else if (userAgent.transport.reconnectionAttempts > 0) {
      userAgent.transport.attemptingReconnection = true;
      userAgent.reconnect().catch(function (error) {
        userAgent.transport.attemptingReconnection = false;
        console.warn('Failed to reconnect', error);
        // Try Again
        reconnectTransport(username, userAgent);
      });
    }
  }, getSipUsernameConfigs(username)?.registration.transportReconnectionTimeout);

  console.log(
    'Waiting to Re-connect...',
    'Attempt remaining',
    userAgent.transport.reconnectionAttempts,
  );
  userAgent.transport.reconnectionAttempts = userAgent.transport.reconnectionAttempts - 1;
  const { userAgents, statuses } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [username]: userAgent },
    statuses: { ...statuses, [username]: 'connecting' },
  });
}
