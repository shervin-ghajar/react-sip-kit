import { SipAccountConfig } from '../../configs/types';
export declare const getMediaDevices: (username: SipAccountConfig["username"]) => Promise<{
    hasAudioDevice: boolean;
    audioInputDevices: MediaDeviceInfo[];
    hasSpeakerDevice: boolean;
    speakerDevices: MediaDeviceInfo[];
    hasVideoDevice: boolean;
    videoInputDevices: MediaDeviceInfo[];
}>;
