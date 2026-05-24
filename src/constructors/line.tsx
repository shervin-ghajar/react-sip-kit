import { SipAccountConfig, RtcConfig } from '../configs/types';
import { LineType } from '../store/types';
import { generateUUID } from '../utils';

export function createLine<T extends LineType>(
  configKey: RtcConfig['key'],
  username: SipAccountConfig['username'],
  remoteNumber: string,
): T {
  return {
    configKey,
    lineKey: generateUUID(),
    remoteNumber,
    username,
    session: null,
    data: {
      configKey: '' as RtcConfig['key'],
      lineKey: '' as LineType['lineKey'],
      callDirection: 'outbound',
      callType: 'audio',
      terminateBy: '',
      remoteNumber: '',
      username: '' as SipAccountConfig['username'],
      earlyReject: false,
      reasonCode: 0,
      reasonText: '',
      teardownComplete: false,
      childSession: null,
      startTime: '',
      started: false,
      hold: [],
      isHold: false,
      videoChannelNames: [],

      localMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      remoteMediaStreamStatus: {
        screenShareEnabled: false,
        soundEnabled: true,
        videoEnabled: false,
      },
      videoAckReceived: false,
      transfer: [],
      audioSourceTrack: null,
      videoSourceTrack: null,
      screenSourceTrack: null,
      videoInputDeviceId: null,
      audioInputDeviceId: null,
      audioOutputDeviceId: null,
      confBridgeChannels: [],
      confBridgeEvents: [],
      recordMedia: { recording: false, startTime: null, recorder: null },
    },
  } as any;
}
