export interface GetDevicesType {
    hasAudioDevice: boolean;
    audioInputDevices: MediaDeviceInfo[];
    hasSpeakerDevice: boolean;
    speakerDevices: MediaDeviceInfo[];
    hasVideoDevice: boolean;
    videoInputDevices: MediaDeviceInfo[];
}
