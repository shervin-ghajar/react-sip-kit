import {
  SubscribeBuddyAccept,
  SubscribeBuddyEvent,
  SubscribeBuddyExpires,
  SubscribeVoicemailExpires,
} from '../../configs';
import { getSipStore, setSipStore } from '../../store';
import { SipUserAgent } from '../../types';
import clone from 'clone';
import { Subscriber, SubscriptionState, URI, UserAgent } from 'sip.js';

export function SubscribeAll(userAgent?: SipUserAgent) {
  const { buddies } = getSipStore();
  let clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  // if (VoiceMailSubscribe) {
  //   // SubscribeVoicemail();
  // }
  // if (SubscribeToYourself) {
  //   // SelfSubscribe();
  // }

  // Start subscribe all
  if (clonedUserAgent.BlfSubs && clonedUserAgent.BlfSubs.length > 0) {
    // UnsubscribeAll();
  }
  clonedUserAgent.BlfSubs = [];
  if (buddies.length >= 1) {
    console.log('Starting Subscribe of all (' + buddies.length + ') Extension Buddies...');
    for (var b = 0; b < buddies.length; b++) {
      // SubscribeBuddy(buddies[b]);
    }
  }
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}

export function SelfSubscribe(userAgent?: SipUserAgent) {
  const { SipDomain, SipUsername, userAgent: storeUserAgent } = getSipStore();
  let clonedUserAgent = userAgent ?? clone(storeUserAgent);

  if (!clonedUserAgent?.isRegistered()) return;

  if (clonedUserAgent?.selfSub) {
    console.log('Unsubscribe from old self subscribe...');
    SelfUnsubscribe(clonedUserAgent);
  }

  const targetURI = UserAgent.makeURI('sip:' + SipUsername + '@' + SipDomain) as URI;

  const options = {
    expires: SubscribeBuddyExpires,
    extraHeaders: ['Accept: ' + SubscribeBuddyAccept],
  };

  clonedUserAgent.selfSub = new Subscriber(
    clonedUserAgent,
    targetURI,
    SubscribeBuddyEvent,
    options,
  );
  clonedUserAgent.selfSub.delegate = {
    onNotify: function (sip) {
      console.log('onNotify', { sip });
      //TODO #SH
      // ReceiveNotify(sip, true)
    },
  };
  console.log('SUBSCRIBE Self: ' + SipUsername + '@' + SipDomain);
  clonedUserAgent.selfSub.subscribe().catch(function (error) {
    console.warn('Error subscribing to yourself:', error);
  });
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}

export function SubscribeVoicemail(userAgent?: SipUserAgent) {
  const { SipDomain, SipUsername, userAgent: storeUserAgent } = getSipStore();
  let clonedUserAgent = userAgent ?? clone(storeUserAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  if (clonedUserAgent?.voicemailSub) {
    console.log('Unsubscribe from old voicemail Messages...');
    UnsubscribeVoicemail();
  }

  var vmOptions = { expires: SubscribeVoicemailExpires };
  var targetURI = UserAgent.makeURI('sip:' + SipUsername + '@' + SipDomain) as URI;
  clonedUserAgent.voicemailSub = new Subscriber(
    clonedUserAgent,
    targetURI,
    'message-summary',
    vmOptions,
  );
  clonedUserAgent.voicemailSub.delegate = {
    onNotify: function (sip) {
      //TODO #SH
      // VoicemailNotify(sip);
    },
  };
  console.log('SUBSCRIBE VOICEMAIL: ' + SipUsername + '@' + SipDomain);
  clonedUserAgent.voicemailSub.subscribe().catch(function (error) {
    console.warn('Error subscribing to voicemail notifications:', error);
  });
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
// TODO #SH buddyObj type
export function SubscribeBuddy(buddyObj: any, userAgent?: SipUserAgent) {
  const { SipDomain, userAgent: storeUserAgent } = getSipStore();
  let clonedUserAgent = userAgent ?? clone(storeUserAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  if (
    (buddyObj.type == 'extension' || buddyObj.type == 'xmpp') &&
    buddyObj.EnableSubscribe == true &&
    buddyObj.SubscribeUser != ''
  ) {
    var targetURI = UserAgent.makeURI('sip:' + buddyObj.SubscribeUser + '@' + SipDomain) as URI;

    var options = {
      expires: SubscribeBuddyExpires,
      extraHeaders: ['Accept: ' + SubscribeBuddyAccept],
    };
    var blfSubscribe = new Subscriber(clonedUserAgent, targetURI, SubscribeBuddyEvent, options);
    blfSubscribe.data = {};
    //TODO #SH
    if (blfSubscribe.data) (blfSubscribe.data as Record<string, any>).buddyId = buddyObj.identity;
    blfSubscribe.delegate = {
      onNotify: function (sip) {
        console.log('onNotify', { sip });
        //TODO #SH
        // ReceiveNotify(sip, false);
      },
    };
    console.log('SUBSCRIBE: ' + buddyObj.SubscribeUser + '@' + SipDomain);
    blfSubscribe.subscribe().catch(function (error) {
      console.warn('Error subscribing to Buddy notifications:', error);
    });

    if (!clonedUserAgent.BlfSubs) clonedUserAgent.BlfSubs = [];
    clonedUserAgent.BlfSubs.push(blfSubscribe);
    if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
  }
}

export function UnsubscribeAll(userAgent?: SipUserAgent) {
  let clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  console.log('Unsubscribe from voicemail Messages...');
  UnsubscribeVoicemail(clonedUserAgent);

  if (clonedUserAgent?.BlfSubs && clonedUserAgent?.BlfSubs.length > 0) {
    console.log('Unsubscribing ' + clonedUserAgent?.BlfSubs.length + ' subscriptions...');
    for (var blf = 0; blf < clonedUserAgent?.BlfSubs.length; blf++) {
      UnsubscribeBlf(clonedUserAgent?.BlfSubs[blf]);
    }
    clonedUserAgent.BlfSubs = [];
    //TODO #SH
    // for (var b = 0; b < buddies.length; b++) {
    //   var buddyObj = buddies[b];
    //   if (buddyObj.type == 'extension' || buddyObj.type == 'xmpp') {
    //     $('#contact-' + buddyObj.identity + '-devstate').prop('class', 'dotOffline');
    //     $('#contact-' + buddyObj.identity + '-devstate-main').prop('class', 'dotOffline');
    //     $('#contact-' + buddyObj.identity + '-presence').html(lang.state_unknown);
    //     $('#contact-' + buddyObj.identity + '-presence-main').html(lang.state_unknown);
    //   }
    // }
    if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
  }
}
//TODO #SH blfSubscribe type
export function UnsubscribeBlf(blfSubscribe: Subscriber | null, userAgent?: SipUserAgent) {
  let clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  if (blfSubscribe?.state == SubscriptionState.Subscribed) {
    console.log('Unsubscribe to BLF Messages...', (blfSubscribe?.data as any)?.buddyId);
    blfSubscribe?.unsubscribe().catch(function (error) {
      console.warn('Error removing BLF notifications:', error);
    });
  } else {
    console.log(
      'Incorrect buddy subscribe state',
      (blfSubscribe?.data as any).buddyId,
      blfSubscribe?.state,
    );
  }
  blfSubscribe?.dispose().catch(function (error) {
    console.warn('Error disposing BLF notifications:', error);
  });
  blfSubscribe = null;
  if (!userAgent)
    setSipStore({
      userAgent: clonedUserAgent,
    });
}
export function UnsubscribeVoicemail(userAgent?: SipUserAgent) {
  let clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  if (clonedUserAgent?.voicemailSub) {
    console.log('Unsubscribe to voicemail Messages...', clonedUserAgent?.voicemailSub.state);
    if (clonedUserAgent?.voicemailSub.state == SubscriptionState.Subscribed) {
      clonedUserAgent?.voicemailSub.unsubscribe().catch(function (error) {
        console.warn('Error removing voicemail notifications:', error);
      });
    }
    clonedUserAgent?.voicemailSub.dispose().catch(function (error) {
      console.warn('Error disposing voicemail notifications:', error);
    });
  } else {
    console.log('Not subscribed to MWI');
  }
  clonedUserAgent.voicemailSub = null;
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}
export function SelfUnsubscribe(userAgent?: SipUserAgent) {
  let clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  if (!clonedUserAgent?.isRegistered()) return;

  if (clonedUserAgent?.selfSub) {
    console.log('Unsubscribe from yourself...', clonedUserAgent?.selfSub.state);
    if (clonedUserAgent?.selfSub.state == SubscriptionState.Subscribed) {
      clonedUserAgent?.selfSub.unsubscribe().catch(function (error) {
        console.warn('Error self subscription:', error);
      });
    }
    clonedUserAgent?.selfSub.dispose().catch(function (error) {
      console.warn('Error disposing self subscription:', error);
    });
  } else {
    console.log('Not subscribed to Yourself');
  }
  clonedUserAgent.selfSub = null;
  if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
}

// TODO #SH buddyObj type
export function UnsubscribeBuddy(buddyObj: any, userAgent?: SipUserAgent) {
  let clonedUserAgent = userAgent ?? clone(getSipStore().userAgent);
  console.log('Unsubscribe: ', buddyObj.identity);
  if (buddyObj.type == 'extension' || buddyObj.type == 'xmpp') {
    if (clonedUserAgent && clonedUserAgent.BlfSubs && clonedUserAgent.BlfSubs.length > 0) {
      for (var blf = 0; blf < clonedUserAgent.BlfSubs.length; blf++) {
        var blfSubscribe = clonedUserAgent.BlfSubs[blf];
        if (blfSubscribe.data.buddyId == buddyObj.identity) {
          console.log('Subscription found, removing: ', buddyObj.identity);
          UnsubscribeBlf(clonedUserAgent.BlfSubs[blf], clonedUserAgent);
          clonedUserAgent.BlfSubs.splice(blf, 1);
          break;
        }
      }
    }
    if (!userAgent) setSipStore({ userAgent: clonedUserAgent });
  }
}
