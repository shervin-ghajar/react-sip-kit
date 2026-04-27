import { RtcConfig } from '../../../../configs/types';
import { getRtcStore, getEngineInstance, setRtcStore } from '../../../../store';
import { onRegisterFailed } from '../../events/registration';
import { SipUserAgent } from '../../types';

/* -------------------------------------------------------------------------- */
export function register(configKey: RtcConfig['key'], userAgent = getEngineInstance(configKey) as SipUserAgent) {
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
  const { engines } = getRtcStore();
  setRtcStore({
    engines: { ...engines, [configKey]: userAgent },
  });
}
export function unregister(
  configKey: RtcConfig['key'],
  skipUnsubscribe?: boolean,
  userAgent = getEngineInstance(configKey) as SipUserAgent,
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
  const { engines } = getRtcStore();
  setRtcStore({
    engines: { ...engines, [configKey]: userAgent },
  });
}

export function refreshRegistration(configKey: RtcConfig['key']) {
  unregister(configKey);
  console.log('Unregister complete...');
  window.setTimeout(function () {
    console.log('Starting registration...');
    register(configKey);
  }, 1000);
}
