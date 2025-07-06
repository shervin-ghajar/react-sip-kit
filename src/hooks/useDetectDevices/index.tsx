import { detectDevices } from '../../methods/initialization';
import { useSipStore } from '../../store';

export const useDetectDevices = () => {
  const {
    configs: {
      features: { enableVideo },
    },
    hasAudioDevice,
    audioInputDevices,
    hasSpeakerDevice,
    speakerDevices,
    hasVideoDevice,
    videoInputDevices,
  } = useSipStore((state) => ({ configs: state.configs, ...state.devicesInfo }));
  return detectDevices((deviceInfos) => {
    console.log({ deviceInfos });
    if (!deviceInfos) return;
    let tmpHasAudioDevice = hasAudioDevice;
    let tmpAudioInputDevices = audioInputDevices;
    let tmpHasSpeakerDevice = hasSpeakerDevice;
    let tmpSpeakerDevices = speakerDevices;
    let tmpHasVideoDevice = hasVideoDevice; // Safari and Firefox don't have these
    let tmpVideoInputDevices = videoInputDevices;
    for (let i = 0; i < deviceInfos.length; ++i) {
      if (deviceInfos[i].kind === 'audioinput') {
        tmpHasAudioDevice = true;
        tmpAudioInputDevices.push(deviceInfos[i]);
      } else if (deviceInfos[i].kind === 'audiooutput') {
        tmpHasSpeakerDevice = true;
        tmpSpeakerDevices.push(deviceInfos[i]);
      } else if (deviceInfos[i].kind === 'videoinput') {
        if (enableVideo) {
          tmpHasVideoDevice = true;
          tmpVideoInputDevices.push(deviceInfos[i]);
        }
      }
    }
    return {
      hasAudioDevice: tmpHasAudioDevice,
      audioInputDevices: tmpAudioInputDevices,
      hasSpeakerDevice: tmpHasSpeakerDevice,
      speakerDevices: tmpSpeakerDevices,
      hasVideoDevice: tmpHasVideoDevice,
      videoInputDevices: tmpVideoInputDevices,
    };
  });
};
