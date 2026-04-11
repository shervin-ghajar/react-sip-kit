import { SipConfigs } from '../../configs/types';
import { onRegisterFailed } from '../../events/registration';
import { getSipStore, getSipStoreUserAgent, setSipStore } from '../../store';

/* -------------------------------------------------------------------------- */
export function register(
  configKey: SipConfigs['key'],
  userAgent = getSipStoreUserAgent(configKey),
) {
  if (!userAgent) return;
  if (userAgent?.registering) return;
  if (userAgent.isRegistered()) return;
  console.log('Sending Registration...');
  userAgent.registering = true;
  userAgent.registerer.register({
    requestDelegate: {
      onReject(sip) {
        onRegisterFailed(configKey, sip.message.reasonPhrase, sip.message.statusCode);
      },
    },
  });
  const { userAgents } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [configKey]: userAgent },
  });
}
export function unregister(
  configKey: SipConfigs['key'],
  skipUnsubscribe?: boolean,
  userAgent = getSipStoreUserAgent(configKey),
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
    userAgents: { ...userAgents, [configKey]: userAgent },
  });
}

export function refreshRegistration(configKey: SipConfigs['key']) {
  unregister(configKey);
  console.log('Unregister complete...');
  window.setTimeout(function () {
    console.log('Starting registration...');
    register(configKey);
  }, 1000);
}
