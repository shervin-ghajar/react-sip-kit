import {
  AutoGainControl,
  EchoCancellation,
  InviteExtraHeaders,
  NoiseSuppression,
} from '../../configs';
import { useSipStore } from '../../store';
import { getAudioSrcID } from '../../utils';
import { SPDOptionsType } from '../useSessionMethods/types';

export const useSpdOptions = () => {
  // TODO configurable
  const { audioInputDevices, videoInputDevices } = useSipStore((state) => state.devicesInfo);
  const getSupportedConstraints = () => navigator.mediaDevices.getSupportedConstraints();
  const audioDeviceConfirmation = (currentAudioDevice: string) => {
    let confirmedAudioDevice = false;
    for (let i = 0; i < audioInputDevices.length; ++i) {
      if (currentAudioDevice == audioInputDevices[i].deviceId) {
        confirmedAudioDevice = true;
        break;
      }
    }
    return confirmedAudioDevice;
  };
  const videoDeviceConfirmation = (currentVideoDevice: string) => {
    let confirmedVideoDevice = false;
    for (let i = 0; i < videoInputDevices.length; ++i) {
      if (currentVideoDevice == videoInputDevices[i].deviceId) {
        confirmedVideoDevice = true;
        break;
      }
    }
    return confirmedVideoDevice;
  };
  const options = {
    answerAudioSpdOptions: function ({ option: defaultOption }: { option?: SPDOptionsType } = {}) {
      console.log({ defaultOption });
      const option: SPDOptionsType = defaultOption ?? {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: { deviceId: { exact: 'default' } },
            video: false,
          },
        },
      };
      const supportedConstraints = getSupportedConstraints();
      const currentAudioDevice = getAudioSrcID();
      if (typeof option.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance
      if (currentAudioDevice != 'default') {
        let confirmedAudioDevice = audioDeviceConfirmation(currentAudioDevice);
        if (confirmedAudioDevice) {
          option.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
            exact: currentAudioDevice,
          };
        } else {
          console.warn(
            'The audio device you used before is no longer available, default settings applied.',
          );
          localStorage.setItem('AudioSrcId', 'default');
        }
      }
      // Add additional Constraints
      if (supportedConstraints.autoGainControl) {
        option.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl = AutoGainControl;
      }
      if (supportedConstraints.echoCancellation) {
        option.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
          EchoCancellation;
      }
      if (supportedConstraints.noiseSuppression) {
        option.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
          NoiseSuppression;
      }
      return option;
    },
    makeAudioSpdOptions: function ({ extraHeaders }: { extraHeaders?: string[] }) {
      let option: SPDOptionsType & {
        earlyMedia: boolean;
        extraHeaders?: string[];
      } = {
        earlyMedia: true,
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: { deviceId: 'default' },
            video: false,
          },
        },
      };

      // Configure Audio
      if (extraHeaders) {
        option.extraHeaders = extraHeaders;
      } else {
        option.extraHeaders = [];
      }
      options.answerAudioSpdOptions({ option });
      // Added to the SIP Headers
      if (InviteExtraHeaders && InviteExtraHeaders != '' && InviteExtraHeaders != '{}') {
        try {
          const inviteExtraHeaders = JSON.parse(InviteExtraHeaders);
          for (const [key, value] of Object.entries(inviteExtraHeaders)) {
            if (value == '') {
              // This is a header, must be format: "Field: Value"
            } else {
              option?.extraHeaders?.push(key + ': ' + value);
            }
          }
        } catch (e) {}
      }
      return option;
    },
  };
  return options;
};
