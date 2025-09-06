export interface GetDevicesType {
    hasAudioDevice: boolean;
    audioInputDevices: MediaDeviceInfo[];
    hasSpeakerDevice: boolean;
    speakerDevices: MediaDeviceInfo[];
    hasVideoDevice: boolean;
    videoInputDevices: MediaDeviceInfo[];
}
export declare const useGetMediaDevices: () => {
    getDevices: () => Promise<{
        hasAudioDevice: boolean;
        audioInputDevices: MediaDeviceInfo[];
        hasSpeakerDevice: boolean;
        speakerDevices: MediaDeviceInfo[];
        hasVideoDevice: boolean;
        videoInputDevices: MediaDeviceInfo[];
    }>;
};
