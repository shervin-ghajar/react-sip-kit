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
