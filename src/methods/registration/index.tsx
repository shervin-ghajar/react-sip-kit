import { SipAccountConfig } from '../../configs/types';
import { onRegisterFailed } from '../../events/registration';
import { getSipStore, getSipStoreUserAgent, setSipStore } from '../../store';

/* -------------------------------------------------------------------------- */
export function register(
  username: SipAccountConfig['username'],
  userAgent = getSipStoreUserAgent(username),
) {
  if (!userAgent) return;
  if (userAgent?.registering) return;
  if (userAgent.isRegistered()) return;
  console.log('Sending Registration...');
  userAgent.registering = true;
  userAgent.registerer.register({
    requestDelegate: {
      onReject(sip) {
        onRegisterFailed(username, sip.message.reasonPhrase, sip.message.statusCode);
      },
    },
  });
  const { userAgents } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [username]: userAgent },
  });
}
export function unregister(
  username: SipAccountConfig['username'],
  skipUnsubscribe?: boolean,
  userAgent = getSipStoreUserAgent(username),
) {
  if (!userAgent?.isRegistered()) return;
  if (skipUnsubscribe == true) {
    console.log('Skipping Unsubscribe');
  } else {
    console.log('Unsubscribing...');
    try {
      //UnsubscribeAll(userAgent); //TODO
    } catch (e) {}
  }

  console.log('Unregister...');
  userAgent.registerer.unregister();

  userAgent.transport.attemptingReconnection = false;
  userAgent.registering = false;
  userAgent.isReRegister = false;
  const { userAgents } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [username]: userAgent },
  });
}

export function refreshRegistration(username: SipAccountConfig['username']) {
  unregister(username);
  console.log('Unregister complete...');
  window.setTimeout(function () {
    console.log('Starting registration...');
    register(username);
  }, 1000);
}
