import { onRegisterFailed } from '../../events/registration';
import { getSipStore, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';
import { UnsubscribeAll } from '../subscription';
import clone from 'clone';

/* -------------------------------------------------------------------------- */
export function Register(userAgent?: SipUserAgent) {
  const clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (clonedUserAgent == null) return;
  if (clonedUserAgent.registering == true) return;
  if (clonedUserAgent.isRegistered()) return;
  console.log('Sending Registration...');
  clonedUserAgent.registering = true;
  clonedUserAgent.registerer.register({
    requestDelegate: {
      onReject(sip) {
        onRegisterFailed(sip.message.reasonPhrase, sip.message.statusCode);
      },
    },
  });
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
export function Unregister(skipUnsubscribe?: boolean, userAgent?: SipUserAgent) {
  const clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);

  if (clonedUserAgent == null || !clonedUserAgent.isRegistered()) return;
  if (skipUnsubscribe == true) {
    console.log('Skipping Unsubscribe');
  } else {
    console.log('Unsubscribing...');
    try {
      UnsubscribeAll(clonedUserAgent); //TODO
    } catch (e) {}
  }

  console.log('Unregister...');
  clonedUserAgent.registerer.unregister();

  clonedUserAgent.transport.attemptingReconnection = false;
  clonedUserAgent.registering = false;
  clonedUserAgent.isReRegister = false;
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
