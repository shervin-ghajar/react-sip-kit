import { detectDevices } from '../../methods/initialization';
import { useSipStore } from '../../store';

export interface GetDevicesType {
  hasAudioDevice: boolean;
  audioInputDevices: MediaDeviceInfo[];
  hasSpeakerDevice: boolean;
  speakerDevices: MediaDeviceInfo[];
  hasVideoDevice: boolean;
  videoInputDevices: MediaDeviceInfo[];
}
export const useGetMediaDevices = () => {
  const enableVideo = useSipStore((state) => state.configs.features.enableVideo);
  const getDevices = async () => {
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
  return { getDevices };
};
