import {
  AutoGainControl,
  EchoCancellation,
  InviteExtraHeaders,
  maxFrameRate,
  NoiseSuppression,
  videoAspectRatio,
  videoHeight,
} from '../../configs';
import { useSipStore } from '../../store';
import { getAudioSrcID, getVideoSrcID } from '../../utils';
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
      if (InviteExtraHeaders && InviteExtraHeaders !== '' && InviteExtraHeaders !== '{}') {
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
    answerVideoSpdOptions: function ({ option: defaultOption }: { option?: SPDOptionsType } = {}) {
      const option: SPDOptionsType = defaultOption ?? {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: { deviceId: 'default' },
            video: { deviceId: 'default' },
          },
        },
      };
      const supportedConstraints = getSupportedConstraints();

      // Configure Audio
      options.answerAudioSpdOptions({ option });

      // Configure Video
      const currentVideoDevice = getVideoSrcID();
      if (typeof option.sessionDescriptionHandlerOptions.constraints.video !== 'object') return; // type checking assurance
      if (currentVideoDevice != 'default') {
        let confirmedVideoDevice = videoDeviceConfirmation(currentVideoDevice);
        if (confirmedVideoDevice) {
          option.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
            exact: currentVideoDevice,
          };
        } else {
          console.warn(
            'The video device you used before is no longer available, default settings applied.',
          );
          localStorage.setItem('VideoSrcId', 'default'); // resets for later and subsequent calls
        }
      }
      // Add additional Constraints
      if (supportedConstraints.frameRate && !!maxFrameRate) {
        option.sessionDescriptionHandlerOptions.constraints.video.frameRate = maxFrameRate;
      }
      if (supportedConstraints.height && !!videoHeight) {
        option.sessionDescriptionHandlerOptions.constraints.video.height = videoHeight;
      }
      if (supportedConstraints.aspectRatio && !!videoAspectRatio) {
        option.sessionDescriptionHandlerOptions.constraints.video.aspectRatio = videoAspectRatio;
      }
      return option;
    },
    makeVideoSpdOptions: function ({ extraHeaders }: { extraHeaders?: string[] }) {
      const option: SPDOptionsType & {
        earlyMedia: boolean;
        extraHeaders?: string[];
      } = {
        earlyMedia: true,
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: { deviceId: 'default' },
            video: { deviceId: 'default' },
          },
        },
      };

      // Configure Audio & Video
      options.answerVideoSpdOptions({ option });

      // Extra Headers
      if (extraHeaders) {
        option.extraHeaders = extraHeaders;
      } else {
        option.extraHeaders = [];
      }
      if (InviteExtraHeaders && InviteExtraHeaders !== '' && InviteExtraHeaders !== '{}') {
        try {
          const inviteExtraHeaders = JSON.parse(InviteExtraHeaders);
          for (const [key, value] of Object.entries(inviteExtraHeaders)) {
            if (value == '') {
              // This is a header, must be format: "Field: Value"
            } else {
              option.extraHeaders.push(key + ': ' + value);
            }
          }
        } catch (e) {}
      }

      return option;
    },
  };
  return options;
};
