import { SubscribeAll } from '../../methods/subscription';
import { getSipStore, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';
import clone from 'clone';

// Registration Events
// ===================
/**
 * Called when account is registered
 */
export function onRegistered(userAgent: SipUserAgent) {
  // This code fires on re-register after session timeout
  // to ensure that events are not fired multiple times
  // a isReRegister state is kept.
  // TODO: This check appears obsolete

  const clonedUserAgent = clone(userAgent);
  clonedUserAgent.registrationCompleted = true;
  if (!clonedUserAgent.isReRegister) {
    console.log('Registered!');

    // Start Subscribe Loop
    setTimeout(function () {
      SubscribeAll(clonedUserAgent);
    }, 500);

    clonedUserAgent.registering = false;
  } else {
    clonedUserAgent.registering = false;

    console.log('ReRegistered!');
  }
  clonedUserAgent.isReRegister = true;
  setSipStore({ userAgent: clonedUserAgent });
}
/**
 * Called if UserAgent can connect, but not register.
 * @param {string} response Incoming request message
 * @param {string} cause Cause message. Unused
 **/
export function onRegisterFailed(response: any, cause: any) {
  const userAgent = getSipStore().userAgent;
  const clonedUserAgent = clone(userAgent);

  if (clonedUserAgent) clonedUserAgent.registering = false;
  setSipStore({ userAgent: clonedUserAgent });
}
/**
 * Called when Unregister is requested
 */
export function onUnregistered(userAgent: SipUserAgent) {
  const clonedUserAgent = clone(userAgent);
  // We set this flag here so that the re-register attempts are fully completed.
  clonedUserAgent.isReRegister = false;
  setSipStore({ userAgent: clonedUserAgent });
}
