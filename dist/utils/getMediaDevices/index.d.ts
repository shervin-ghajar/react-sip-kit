import { SipConfigs } from '../../configs/types';
export declare const getMediaDevices: (configKey: SipConfigs["key"]) => Promise<{
    hasAudioDevice: boolean;
    audioInputDevices: MediaDeviceInfo[];
    hasSpeakerDevice: boolean;
    speakerDevices: MediaDeviceInfo[];
    hasVideoDevice: boolean;
    videoInputDevices: MediaDeviceInfo[];
}>;
