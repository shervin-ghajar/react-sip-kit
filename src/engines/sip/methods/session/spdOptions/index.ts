import { defaultRtcConfig } from '../../../../../configs';
import { RtcConfig } from '../../../../../configs/types';
import { getRtcStore } from '../../../../../store';
import { SPDOptionsType } from '../types';

export const spdOptions = ({ configKey }: { configKey: RtcConfig['key'] }) => {
  const {
    media: {
      audioInputDeviceId,
      videoInputDeviceId,
      autoGainControl,
      maxFrameRate,
      noiseSuppression,
      videoAspectRatio,
      videoHeight,
      echoCancellation,
    },
    registration: { inviteExtraHeaders },
  } = getRtcStore().configs?.[configKey] ?? defaultRtcConfig;
  const getSupportedConstraints = () => navigator.mediaDevices.getSupportedConstraints();

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
      const currentAudioDevice = audioInputDeviceId;
      if (typeof option.sessionDescriptionHandlerOptions.constraints.audio !== 'object') return; // type checking assurance
      if (currentAudioDevice && currentAudioDevice != 'default') {
        option.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
          exact: currentAudioDevice,
        };
      }
      // Add additional Constraints
      if (supportedConstraints.autoGainControl) {
        option.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl = autoGainControl;
      }
      if (supportedConstraints.echoCancellation) {
        option.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
          echoCancellation;
      }
      if (supportedConstraints.noiseSuppression) {
        option.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
          noiseSuppression;
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

      if (extraHeaders) {
        option.extraHeaders = extraHeaders;
      } else {
        option.extraHeaders = [];
      }
      // Configure Audio
      options.answerAudioSpdOptions({ option });
      // Added to the SIP Headers
      if (inviteExtraHeaders && inviteExtraHeaders !== '' && inviteExtraHeaders !== '{}') {
        try {
          for (const [key, value] of Object.entries(JSON.parse(inviteExtraHeaders))) {
            if (value == '') {
              // This is a header, must be format: "Field: Value"
            } else {
              option?.extraHeaders?.push(key + ': ' + value);
            }
          }
        } catch (e) { }
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
      const currentVideoDevice = videoInputDeviceId;
      if (typeof option.sessionDescriptionHandlerOptions.constraints.video !== 'object') return; // type checking assurance
      if (currentVideoDevice && currentVideoDevice != 'default') {
        option.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
          exact: currentVideoDevice,
        };
      }
      // Add additional Constraints
      if (supportedConstraints.frameRate && !!maxFrameRate) {
        option.sessionDescriptionHandlerOptions.constraints.video.frameRate = String(maxFrameRate);
      }
      if (supportedConstraints.height && !!videoHeight) {
        option.sessionDescriptionHandlerOptions.constraints.video.height = String(videoHeight);
      }
      if (supportedConstraints.aspectRatio && !!videoAspectRatio) {
        option.sessionDescriptionHandlerOptions.constraints.video.aspectRatio =
          String(videoAspectRatio);
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
      if (inviteExtraHeaders && inviteExtraHeaders !== '' && inviteExtraHeaders !== '{}') {
        try {
          for (const [key, value] of Object.entries(JSON.parse(inviteExtraHeaders))) {
            if (value == '') {
              // This is a header, must be format: "Field: Value"
            } else {
              option.extraHeaders.push(key + ': ' + value);
            }
          }
        } catch (e) { }
      }

      return option;
    },
  };
  return options;
};
