// // Incoming INVITE
// function onInviteCancel(lineObj, response) {
//   // Remote Party Canceled while ringing...

//   // Check to see if this call has been completed elsewhere
//   // https://github.com/InnovateAsterisk/Browser-Phone/issues/405
//   var temp_cause = 0;
//   var reason = response.headers['Reason'];
//   if (reason !== undefined && reason.length > 0) {
//     for (var i = 0; i < reason.length; i++) {
//       var cause = reason[i].raw.toLowerCase().trim(); // Reason: Q.850 ;cause=16 ;text="Terminated"
//       var items = cause.split(';');
//       if (
//         items.length >= 2 &&
//         (items[0].trim() == 'sip' || items[0].trim() == 'q.850') &&
//         items[1].includes('cause') &&
//         cause.includes('call completed elsewhere')
//       ) {
//         temp_cause = parseInt(items[1].substring(items[1].indexOf('=') + 1).trim());
//         // No sample provided for "token"
//         break;
//       }
//     }
//   }

//   lineObj.SipSession.data.terminateby = 'them';
//   lineObj.SipSession.data.reasonCode = temp_cause;
//   if (temp_cause == 0) {
//     lineObj.SipSession.data.reasonText = 'Call Cancelled';
//     console.log('Call canceled by remote party before answer');
//   } else {
//     lineObj.SipSession.data.reasonText = 'Call completed elsewhere';
//     console.log('Call completed elsewhere before answer');
//   }

//   lineObj.SipSession.dispose().catch(function (error) {
//     console.log('Failed to dispose the cancel dialog', error);
//   });

//   teardownSession(lineObj);
// }
// // Both Incoming an outgoing INVITE
// function onInviteAccepted(lineObj, includeVideo, response) {
//   // Call in progress
//   var session = lineObj.SipSession;

//   if (session.data.earlyMedia) {
//     session.data.earlyMedia.pause();
//     session.data.earlyMedia.removeAttribute('src');
//     session.data.earlyMedia.load();
//     session.data.earlyMedia = null;
//   }

//   window.clearInterval(session.data.callTimer);
//   $('#line-' + lineObj.LineNumber + '-timer').show();
//   var startTime = moment.utc();
//   session.data.startTime = startTime;
//   session.data.callTimer = window.setInterval(function () {
//     var now = moment.utc();
//     var duration = moment.duration(now.diff(startTime));
//     var timeStr = formatShortDuration(duration.asSeconds());
//     $('#line-' + lineObj.LineNumber + '-timer').html(timeStr);
//     $('#line-' + lineObj.LineNumber + '-datetime').html(timeStr);
//   }, 1000);
//   session.isOnHold = false;
//   session.data.started = true;

//   if (includeVideo) {
//     // Preview our stream from peer connection
//     var localVideoStream = new MediaStream();
//     var pc = session.sessionDescriptionHandler.peerConnection;
//     pc.getSenders().forEach(function (sender) {
//       if (sender.track && sender.track.kind == 'video') {
//         localVideoStream.addTrack(sender.track);
//       }
//     });
//     var localVideo = $('#line-' + lineObj.LineNumber + '-localVideo').get(0);
//     localVideo.srcObject = localVideoStream;
//     localVideo.onloadedmetadata = function (e) {
//       localVideo.play();
//     };

//     // Apply Call Bandwidth Limits
//     if (MaxVideoBandwidth > -1) {
//       pc.getSenders().forEach(function (sender) {
//         if (sender.track && sender.track.kind == 'video') {
//           var parameters = sender.getParameters();
//           if (!parameters.encodings) parameters.encodings = [{}];
//           parameters.encodings[0].maxBitrate = MaxVideoBandwidth * 1000;

//           console.log('Applying limit for Bandwidth to: ', MaxVideoBandwidth + 'kb per second');

//           // Only going to try without re-negotiations
//           sender.setParameters(parameters).catch(function (e) {
//             console.warn('Cannot apply Bandwidth Limits', e);
//           });
//         }
//       });
//     }
//   }

//   // Start Call Recording
//   if (RecordAllCalls || CallRecordingPolicy == 'enabled') {
//     StartRecording(lineObj.LineNumber);
//   }

//   if (includeVideo) {
//     // Layout for Video Call
//     $('#line-' + lineObj.LineNumber + '-progress').hide();
//     $('#line-' + lineObj.LineNumber + '-VideoCall').show();
//     $('#line-' + lineObj.LineNumber + '-ActiveCall').show();

//     $('#line-' + lineObj.LineNumber + '-btn-Conference').hide(); // Cannot conference a Video Call (Yet...)
//     $('#line-' + lineObj.LineNumber + '-btn-CancelConference').hide();
//     $('#line-' + lineObj.LineNumber + '-Conference').hide();

//     $('#line-' + lineObj.LineNumber + '-btn-Transfer').hide(); // Cannot transfer a Video Call (Yet...)
//     $('#line-' + lineObj.LineNumber + '-btn-CancelTransfer').hide();
//     $('#line-' + lineObj.LineNumber + '-Transfer').hide();

//     // Default to use Camera
//     $('#line-' + lineObj.LineNumber + '-src-camera').prop('disabled', true);
//     $('#line-' + lineObj.LineNumber + '-src-canvas').prop('disabled', false);
//     $('#line-' + lineObj.LineNumber + '-src-desktop').prop('disabled', false);
//     $('#line-' + lineObj.LineNumber + '-src-video').prop('disabled', false);
//   } else {
//     // Layout for Audio Call
//     $('#line-' + lineObj.LineNumber + '-progress').hide();
//     $('#line-' + lineObj.LineNumber + '-VideoCall').hide();
//     $('#line-' + lineObj.LineNumber + '-AudioCall').show();
//     // Call Control
//     $('#line-' + lineObj.LineNumber + '-btn-Mute').show();
//     $('#line-' + lineObj.LineNumber + '-btn-Unmute').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-start-recording').show();
//     $('#line-' + lineObj.LineNumber + '-btn-stop-recording').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-Hold').show();
//     $('#line-' + lineObj.LineNumber + '-btn-Unhold').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-Transfer').show();
//     $('#line-' + lineObj.LineNumber + '-btn-CancelTransfer').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-Conference').show();
//     $('#line-' + lineObj.LineNumber + '-btn-CancelConference').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-ShowDtmf').show();
//     $('#line-' + lineObj.LineNumber + '-btn-settings').show();
//     $('#line-' + lineObj.LineNumber + '-btn-ShowCallStats').show();
//     $('#line-' + lineObj.LineNumber + '-btn-HideCallStats').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-ShowTimeline').show();
//     $('#line-' + lineObj.LineNumber + '-btn-HideTimeline').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-present-src').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-expand').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-restore').hide();
//     $('#line-' + lineObj.LineNumber + '-btn-End').show();
//     // Show the Call
//     $('#line-' + lineObj.LineNumber + '-ActiveCall').show();
//   }

//   UpdateBuddyList();
//   updateLineScroll(lineObj.LineNumber);

//   // Start Audio Monitoring
//   lineObj.LocalSoundMeter = StartLocalAudioMediaMonitoring(lineObj.LineNumber, session);
//   lineObj.RemoteSoundMeter = StartRemoteAudioMediaMonitoring(lineObj.LineNumber, session);

//   $('#line-' + lineObj.LineNumber + '-msg').html(lang.call_in_progress);

//   if (includeVideo && StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber);

//   // Custom Web hook
//   if (typeof web_hook_on_modify !== 'undefined') web_hook_on_modify('accepted', session);
// }
// // Outgoing INVITE
// function onInviteTrying(lineObj, response) {
//   $('#line-' + lineObj.LineNumber + '-msg').html(lang.trying);

//   // Custom Web hook
//   if (typeof web_hook_on_modify !== 'undefined') web_hook_on_modify('trying', lineObj.SipSession);
// }
// function onInviteProgress(lineObj, response) {
//   console.log('Call Progress:', response.message.statusCode);

//   // Provisional 1xx
//   // response.message.reasonPhrase
//   if (response.message.statusCode == 180) {
//     $('#line-' + lineObj.LineNumber + '-msg').html(lang.ringing);

//     var soundFile = audioBlobs.EarlyMedia_European;
//     if (UserLocale().indexOf('us') > -1) soundFile = audioBlobs.EarlyMedia_US;
//     if (UserLocale().indexOf('gb') > -1) soundFile = audioBlobs.EarlyMedia_UK;
//     if (UserLocale().indexOf('au') > -1) soundFile = audioBlobs.EarlyMedia_Australia;
//     if (UserLocale().indexOf('jp') > -1) soundFile = audioBlobs.EarlyMedia_Japan;

//     // Play Early Media
//     console.log('Audio:', soundFile.url);
//     if (lineObj.SipSession.data.earlyMedia) {
//       // There is already early media playing
//       // onProgress can be called multiple times
//       // Don't add it again
//       console.log('Early Media already playing');
//     } else {
//       var earlyMedia = new Audio(soundFile.blob);
//       earlyMedia.preload = 'auto';
//       earlyMedia.loop = true;
//       earlyMedia.oncanplaythrough = function (e) {
//         if (typeof earlyMedia.sinkId !== 'undefined' && getAudioOutputID() != 'default') {
//           earlyMedia
//             .setSinkId(getAudioOutputID())
//             .then(function () {
//               console.log('Set sinkId to:', getAudioOutputID());
//             })
//             .catch(function (e) {
//               console.warn('Failed not apply setSinkId.', e);
//             });
//         }
//         earlyMedia
//           .play()
//           .then(function () {
//             // Audio Is Playing
//           })
//           .catch(function (e) {
//             console.warn('Unable to play audio file.', e);
//           });
//       };
//       lineObj.SipSession.data.earlyMedia = earlyMedia;
//     }
//   } else if (response.message.statusCode === 183) {
//     $('#line-' + lineObj.LineNumber + '-msg').html(response.message.reasonPhrase + '...');

//     // Add UI to allow DTMF
//     $('#line-' + lineObj.LineNumber + '-early-dtmf').show();
//   } else {
//     // 181 = Call is Being Forwarded
//     // 182 = Call is queued (Busy server!)
//     // 199 = Call is Terminated (Early Dialog)

//     $('#line-' + lineObj.LineNumber + '-msg').html(response.message.reasonPhrase + '...');
//   }

//   // Custom Web hook
//   if (typeof web_hook_on_modify !== 'undefined') web_hook_on_modify('progress', lineObj.SipSession);
// }
// function onInviteRejected(lineObj, response) {
//   console.log('INVITE Rejected:', response.message.reasonPhrase);

//   lineObj.SipSession.data.terminateby = 'them';
//   lineObj.SipSession.data.reasonCode = response.message.statusCode;
//   lineObj.SipSession.data.reasonText = response.message.reasonPhrase;

//   teardownSession(lineObj);
// }
// function onInviteRedirected(response) {
//   console.log('onInviteRedirected', response);
//   // Follow???
// }

// // General Session delegates
// function onSessionReceivedBye(lineObj, response) {
//   // They Ended the call
//   $('#line-' + lineObj.LineNumber + '-msg').html(lang.call_ended);
//   console.log('Call ended, bye!');

//   lineObj.SipSession.data.terminateby = 'them';
//   lineObj.SipSession.data.reasonCode = 16;
//   lineObj.SipSession.data.reasonText = 'Normal Call clearing';

//   response.accept(); // Send OK

//   teardownSession(lineObj);
// }
// function onSessionReinvited(lineObj, response) {
//   // This may be used to include video streams
//   var sdp = response.body;

//   // All the possible streams will get
//   // Note, this will probably happen after the streams are added
//   lineObj.SipSession.data.videoChannelNames = [];
//   var videoSections = sdp.split('m=video');
//   if (videoSections.length >= 1) {
//     for (var m = 0; m < videoSections.length; m++) {
//       if (videoSections[m].indexOf('a=mid:') > -1 && videoSections[m].indexOf('a=label:') > -1) {
//         // We have a label for the media
//         var lines = videoSections[m].split('\r\n');
//         var channel = '';
//         var mid = '';
//         for (var i = 0; i < lines.length; i++) {
//           if (lines[i].indexOf('a=label:') == 0) {
//             channel = lines[i].replace('a=label:', '');
//           }
//           if (lines[i].indexOf('a=mid:') == 0) {
//             mid = lines[i].replace('a=mid:', '');
//           }
//         }
//         lineObj.SipSession.data.videoChannelNames.push({ mid: mid, channel: channel });
//       }
//     }
//     console.log('videoChannelNames:', lineObj.SipSession.data.videoChannelNames);
//     RedrawStage(lineObj.LineNumber, false);
//   }
// }
// function onSessionReceivedMessage(lineObj, response) {
//   var messageType =
//     response.request.headers['Content-Type'].length >= 1
//       ? response.request.headers['Content-Type'][0].parsed
//       : 'Unknown';
//   if (messageType.indexOf('application/x-asterisk-confbridge-event') > -1) {
//     // Conference Events JSON
//     var msgJson = JSON.parse(response.request.body);

//     var session = lineObj.SipSession;
//     if (!session.data.ConfbridgeChannels) session.data.ConfbridgeChannels = [];
//     if (!session.data.ConfbridgeEvents) session.data.ConfbridgeEvents = [];

//     if (msgJson.type == 'ConfbridgeStart') {
//       console.log('ConfbridgeStart!');
//     } else if (msgJson.type == 'ConfbridgeWelcome') {
//       console.log('Welcome to the Asterisk Conference');
//       console.log('Bridge ID:', msgJson.bridge.id);
//       console.log('Bridge Name:', msgJson.bridge.name);
//       console.log('Created at:', msgJson.bridge.creationtime);
//       console.log('Video Mode:', msgJson.bridge.video_mode);

//       session.data.ConfbridgeChannels = msgJson.channels; // Write over this
//       session.data.ConfbridgeChannels.forEach(function (chan) {
//         // The mute and unmute status doesn't appear to be a realtime state, only what the
//         // startmuted= setting of the default profile is.
//         console.log(
//           chan.caller.name,
//           'Is in the conference. Muted:',
//           chan.muted,
//           'Admin:',
//           chan.admin,
//         );
//       });
//     } else if (msgJson.type == 'ConfbridgeJoin') {
//       msgJson.channels.forEach(function (chan) {
//         var found = false;
//         session.data.ConfbridgeChannels.forEach(function (existingChan) {
//           if (existingChan.id == chan.id) found = true;
//         });
//         if (!found) {
//           session.data.ConfbridgeChannels.push(chan);
//           session.data.ConfbridgeEvents.push({
//             event: chan.caller.name + ' (' + chan.caller.number + ') joined the conference',
//             eventTime: utcDateNow(),
//           });
//           console.log(chan.caller.name, 'Joined the conference. Muted: ', chan.muted);
//         }
//       });
//     } else if (msgJson.type == 'ConfbridgeLeave') {
//       msgJson.channels.forEach(function (chan) {
//         session.data.ConfbridgeChannels.forEach(function (existingChan, i) {
//           if (existingChan.id == chan.id) {
//             session.data.ConfbridgeChannels.splice(i, 1);
//             console.log(chan.caller.name, 'Left the conference');
//             session.data.ConfbridgeEvents.push({
//               event: chan.caller.name + ' (' + chan.caller.number + ') left the conference',
//               eventTime: utcDateNow(),
//             });
//           }
//         });
//       });
//     } else if (msgJson.type == 'ConfbridgeTalking') {
//       var videoContainer = $('#line-' + lineObj.LineNumber + '-remote-videos');
//       if (videoContainer) {
//         msgJson.channels.forEach(function (chan) {
//           videoContainer.find('video').each(function () {
//             if (this.srcObject.channel && this.srcObject.channel == chan.id) {
//               if (chan.talking_status == 'on') {
//                 console.log(chan.caller.name, 'is talking.');
//                 this.srcObject.isTalking = true;
//                 $(this).css('border', '1px solid red');
//               } else {
//                 console.log(chan.caller.name, 'stopped talking.');
//                 this.srcObject.isTalking = false;
//                 $(this).css('border', '1px solid transparent');
//               }
//             }
//           });
//         });
//       }
//     } else if (msgJson.type == 'ConfbridgeMute') {
//       msgJson.channels.forEach(function (chan) {
//         session.data.ConfbridgeChannels.forEach(function (existingChan) {
//           if (existingChan.id == chan.id) {
//             console.log(existingChan.caller.name, 'is now muted');
//             existingChan.muted = true;
//           }
//         });
//       });
//       RedrawStage(lineObj.LineNumber, false);
//     } else if (msgJson.type == 'ConfbridgeUnmute') {
//       msgJson.channels.forEach(function (chan) {
//         session.data.ConfbridgeChannels.forEach(function (existingChan) {
//           if (existingChan.id == chan.id) {
//             console.log(existingChan.caller.name, 'is now unmuted');
//             existingChan.muted = false;
//           }
//         });
//       });
//       RedrawStage(lineObj.LineNumber, false);
//     } else if (msgJson.type == 'ConfbridgeEnd') {
//       console.log('The Asterisk Conference has ended, bye!');
//     } else {
//       console.warn('Unknown Asterisk Conference Event:', msgJson.type, msgJson);
//     }
//     RefreshLineActivity(lineObj.LineNumber);
//     response.accept();
//   } else if (messageType.indexOf('application/x-myphone-confbridge-chat') > -1) {
//     console.log('x-myphone-confbridge-chat', response);

//     response.accept();
//   } else {
//     console.warn('Unknown message type');
//     response.reject();
//   }
// }

// function onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, includeVideo) {
//   if (sdh) {
//     if (sdh.peerConnection) {
//       // console.log(sdh);
//       sdh.peerConnection.ontrack = function (event) {
//         // console.log(event);
//         onTrackAddedEvent(lineObj, includeVideo);
//       };
//       // sdh.peerConnectionDelegate = {
//       //     ontrack: function(event){
//       //         console.log(event);
//       //         onTrackAddedEvent(lineObj, includeVideo);
//       //     }
//       // }
//     } else {
//       console.warn('onSessionDescriptionHandler fired without a peerConnection');
//     }
//   } else {
//     console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
//   }
// }
// function onTrackAddedEvent(lineObj, includeVideo) {
//   // Gets remote tracks
//   var session = lineObj.SipSession;
//   // TODO: look at detecting video, so that UI switches to audio/video automatically.

//   var pc = session.sessionDescriptionHandler.peerConnection;

//   var remoteAudioStream = new MediaStream();
//   var remoteVideoStream = new MediaStream();

//   pc.getTransceivers().forEach(function (transceiver) {
//     // Add Media
//     var receiver = transceiver.receiver;
//     if (receiver.track) {
//       if (receiver.track.kind == 'audio') {
//         console.log('Adding Remote Audio Track');
//         remoteAudioStream.addTrack(receiver.track);
//       }
//       if (includeVideo && receiver.track.kind == 'video') {
//         if (transceiver.mid) {
//           receiver.track.mid = transceiver.mid;
//           console.log(
//             'Adding Remote Video Track - ',
//             receiver.track.readyState,
//             'MID:',
//             receiver.track.mid,
//           );
//           remoteVideoStream.addTrack(receiver.track);
//         }
//       }
//     }
//   });

//   // Attach Audio
//   if (remoteAudioStream.getAudioTracks().length >= 1) {
//     var remoteAudio = $('#line-' + lineObj.LineNumber + '-remoteAudio').get(0);
//     remoteAudio.srcObject = remoteAudioStream;
//     remoteAudio.onloadedmetadata = function (e) {
//       if (typeof remoteAudio.sinkId !== 'undefined') {
//         remoteAudio
//           .setSinkId(getAudioOutputID())
//           .then(function () {
//             console.log('sinkId applied: ' + getAudioOutputID());
//           })
//           .catch(function (e) {
//             console.warn('Error using setSinkId: ', e);
//           });
//       }
//       remoteAudio.play();
//     };
//   }

//   if (includeVideo) {
//     // Single Or Multiple View
//     $('#line-' + lineObj.LineNumber + '-remote-videos').empty();
//     if (remoteVideoStream.getVideoTracks().length >= 1) {
//       var remoteVideoStreamTracks = remoteVideoStream.getVideoTracks();
//       remoteVideoStreamTracks.forEach(function (remoteVideoStreamTrack) {
//         var thisRemoteVideoStream = new MediaStream();
//         thisRemoteVideoStream.trackID = remoteVideoStreamTrack.id;
//         thisRemoteVideoStream.mid = remoteVideoStreamTrack.mid;
//         remoteVideoStreamTrack.onended = function () {
//           console.log('Video Track Ended: ', this.mid);
//           RedrawStage(lineObj.LineNumber, true);
//         };
//         thisRemoteVideoStream.addTrack(remoteVideoStreamTrack);

//         var wrapper = $('<span />', {
//           class: 'VideoWrapper',
//         });
//         wrapper.css('width', '1px');
//         wrapper.css('heigh', '1px');
//         wrapper.hide();

//         var callerID = $('<div />', {
//           class: 'callerID',
//         });
//         wrapper.append(callerID);

//         var Actions = $('<div />', {
//           class: 'Actions',
//         });
//         wrapper.append(Actions);

//         var videoEl = $('<video />', {
//           id: remoteVideoStreamTrack.id,
//           mid: remoteVideoStreamTrack.mid,
//           muted: true,
//           autoplay: true,
//           playsinline: true,
//           controls: false,
//         });
//         videoEl.hide();

//         var videoObj = videoEl.get(0);
//         videoObj.srcObject = thisRemoteVideoStream;
//         videoObj.onloadedmetadata = function (e) {
//           // videoObj.play();
//           videoEl.show();
//           videoEl.parent().show();
//           console.log('Playing Video Stream MID:', thisRemoteVideoStream.mid);
//           RedrawStage(lineObj.LineNumber, true);
//         };
//         wrapper.append(videoEl);

//         $('#line-' + lineObj.LineNumber + '-remote-videos').append(wrapper);

//         console.log('Added Video Element MID:', thisRemoteVideoStream.mid);
//       });
//     } else {
//       console.log('No Video Streams');
//       RedrawStage(lineObj.LineNumber, true);
//     }
//   }

//   // Custom Web hook
//   if (typeof web_hook_on_modify !== 'undefined') web_hook_on_modify('trackAdded', session);
// }

// // General end of Session
// function teardownSession(lineObj) {
//   if (lineObj == null || lineObj.SipSession == null) return;

//   var session = lineObj.SipSession;
//   if (session.data.teardownComplete == true) return;
//   session.data.teardownComplete = true; // Run this code only once

//   // Call UI
//   if (session.data.earlyReject != true) {
//     HidePopup();
//   }

//   // End any child calls
//   if (session.data.childsession) {
//     session.data.childsession
//       .dispose()
//       .then(function () {
//         session.data.childsession = null;
//       })
//       .catch(function (error) {
//         session.data.childsession = null;
//         // Suppress message
//       });
//   }

//   // Mixed Tracks
//   if (session.data.AudioSourceTrack && session.data.AudioSourceTrack.kind == 'audio') {
//     session.data.AudioSourceTrack.stop();
//     session.data.AudioSourceTrack = null;
//   }
//   // Stop any Early Media
//   if (session.data.earlyMedia) {
//     session.data.earlyMedia.pause();
//     session.data.earlyMedia.removeAttribute('src');
//     session.data.earlyMedia.load();
//     session.data.earlyMedia = null;
//   }
//   // Stop any ringing calls
//   if (session.data.ringerObj) {
//     session.data.ringerObj.pause();
//     session.data.ringerObj.removeAttribute('src');
//     session.data.ringerObj.load();
//     session.data.ringerObj = null;
//   }

//   // Stop Recording if we are
//   StopRecording(lineObj.LineNumber, true);

//   // Audio Meters
//   if (lineObj.LocalSoundMeter != null) {
//     lineObj.LocalSoundMeter.stop();
//     lineObj.LocalSoundMeter = null;
//   }
//   if (lineObj.RemoteSoundMeter != null) {
//     lineObj.RemoteSoundMeter.stop();
//     lineObj.RemoteSoundMeter = null;
//   }

//   // Make sure you have released the microphone
//   if (
//     session &&
//     session.sessionDescriptionHandler &&
//     session.sessionDescriptionHandler.peerConnection
//   ) {
//     var pc = session.sessionDescriptionHandler.peerConnection;
//     pc.getSenders().forEach(function (RTCRtpSender) {
//       if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
//         RTCRtpSender.track.stop();
//       }
//     });
//   }

//   // End timers
//   window.clearInterval(session.data.videoResampleInterval);
//   window.clearInterval(session.data.callTimer);

//   // Add to stream
//   AddCallMessage(lineObj.BuddyObj.identity, session);

//   // Check if this call was missed
//   if (session.data.calldirection == 'inbound') {
//     if (session.data.earlyReject) {
//       // Call was rejected without even ringing
//       IncreaseMissedBadge(session.data.buddyId);
//     } else if (session.data.terminateby == 'them' && session.data.startTime == null) {
//       // Call Terminated by them during ringing
//       if (session.data.reasonCode == 0) {
//         // Call was canceled, and not answered elsewhere
//         IncreaseMissedBadge(session.data.buddyId);
//       }
//     }
//   }

//   // Close up the UI
//   window.setTimeout(function () {
//     RemoveLine(lineObj);
//   }, 1000);

//   UpdateBuddyList();
//   if (session.data.earlyReject != true) {
//     UpdateUI();
//   }

//   // Custom Web hook
//   if (typeof web_hook_on_terminate !== 'undefined') web_hook_on_terminate(session);
// }
