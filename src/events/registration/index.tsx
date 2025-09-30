import { SipConfigs } from '../../configs/types';
import { getSipStore, getSipStoreUserAgent, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';

// Registration Events
// ===================
/**
 * Called when account is registered
 */
export function onRegistered(configKey: SipConfigs['key'], userAgent: SipUserAgent) {
  // This code fires on re-register after session timeout
  // to ensure that events are not fired multiple times
  // a isReRegister state is kept.
  // TODO: This check appears obsolete

  userAgent.registrationCompleted = true;
  if (!userAgent.isReRegister) {
    console.log('Registered!');

    // Start Subscribe Loop
    // setTimeout(function () {
    //   SubscribeAll(userAgent);
    // }, 500); //TODO subscription disabled for now

    userAgent.registering = false;
  } else {
    userAgent.registering = false;

    console.log('ReRegistered!');
  }
  userAgent.isReRegister = true;
  const { userAgents, statuses } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [configKey]: userAgent },
    statuses: { ...statuses, [configKey]: 'connected' },
  });
}
/**
 * Called if UserAgent can connect, but not register.
 * @param {string} response Incoming request message
 * @param {string} cause Cause message. Unused
 **/
export function onRegisterFailed(configKey: SipConfigs['key'], response: any, cause: any) {
  const userAgent = getSipStoreUserAgent(configKey);
  if (!userAgent) return;

  userAgent.registering = false;
  const { userAgents, statuses } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [configKey]: userAgent },
    statuses: { ...statuses, [configKey]: 'disconnected' },
  });
}
/**
 * Called when Unregister is requested
 */
export function onUnregistered(configKey: SipConfigs['key'], userAgent: SipUserAgent) {
  // We set this flag here so that the re-register attempts are fully completed.
  userAgent.isReRegister = false;
  const { userAgents, statuses } = getSipStore();
  setSipStore({
    userAgents: { ...userAgents, [configKey]: userAgent },
    statuses: { ...statuses, [configKey]: 'disconnected' },
  });
}
