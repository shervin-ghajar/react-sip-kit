import { SipConfigs } from '../../configs/types';
import { detectDevices } from '../../methods/initialization';
import { getSipUsernameConfigs } from '../../store';

export const getMediaDevices = async (configKey: SipConfigs['key']) => {
  return detectDevices().then((deviceInfos) => {
    let hasAudioDevice = false;
    let audioInputDevices: MediaDeviceInfo[] = [];
    let hasSpeakerDevice = false;
    let speakerDevices: MediaDeviceInfo[] = [];
    let hasVideoDevice = false;
    let videoInputDevices: MediaDeviceInfo[] = [];
    if (deviceInfos)
      for (let i = 0; i < deviceInfos.length; ++i) {
        if (deviceInfos[i].kind === 'audioinput') {
          hasAudioDevice = true;
          audioInputDevices.push(deviceInfos[i]);
        } else if (deviceInfos[i].kind === 'audiooutput') {
          hasSpeakerDevice = true;
          speakerDevices.push(deviceInfos[i]);
        } else if (deviceInfos[i].kind === 'videoinput') {
          const enableVideo = getSipUsernameConfigs(configKey)?.features?.enableVideo;
          if (enableVideo) {
            hasVideoDevice = true;
            videoInputDevices.push(deviceInfos[i]);
          }
        }
      }
    return {
      hasAudioDevice,
      audioInputDevices,
      hasSpeakerDevice,
      speakerDevices,
      hasVideoDevice,
      videoInputDevices,
    };
  });
};
