import { onRegisterFailed } from '../../events/registration';
import { getSipStoreUserAgent, setSipStore } from '../../store';

/* -------------------------------------------------------------------------- */
export function register(userAgent = getSipStoreUserAgent()) {
  if (!userAgent) return;
  if (userAgent?.registering) return;
  if (userAgent.isRegistered()) return;
  console.log('Sending Registration...');
  userAgent.registering = true;
  userAgent.registerer.register({
    requestDelegate: {
      onReject(sip) {
        onRegisterFailed(sip.message.reasonPhrase, sip.message.statusCode);
      },
    },
  });
  setSipStore({ userAgent });
}
export function unregister(skipUnsubscribe?: boolean, userAgent = getSipStoreUserAgent()) {
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
  setSipStore({ userAgent });
}

export function refreshRegistration() {
  unregister();
  console.log('Unregister complete...');
  window.setTimeout(function () {
    console.log('Starting registration...');
    register();
  }, 1000);
}
