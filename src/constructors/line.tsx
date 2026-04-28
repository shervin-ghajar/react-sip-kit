import { SipAccountConfig, SipConfigs } from '../configs/types';
import { LineType } from '../store/types';

export function createLine(
  configKey: SipConfigs['key'],
  username: SipAccountConfig['username'],
  lineKey: LineType['lineKey'],
  remoteNumber: string,
): LineType {
  return {
    configKey,
    lineKey,
    remoteNumber,
    username,
    sipSession: null,
    localSoundMeter: null,
    remoteSoundMeter: null,
    data: {
      configKey: '' as SipConfigs['key'],
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
      childsession: null,
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
      videoSourceDevice: null,
      audioSourceDevice: null,
      audioOutputDevice: null,
      confBridgeChannels: [],
      confBridgeEvents: [],
      recordMedia: {
        recording: false,
        startTime: null,
        recorder: null,
      },
    },
  };
}
