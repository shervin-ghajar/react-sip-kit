type AudioBlobsType = Record<'Alert' | 'Ringtone' | 'CallWaiting', {
    file: string;
    url: string;
    blob?: string | ArrayBuffer | null;
}>;
export declare class AudioBlobs {
    private static instance;
    private audioBlobs;
    private constructor();
    static getInstance(overwrite?: Partial<AudioBlobsType>): AudioBlobs;
    getAudios(): AudioBlobsType;
}
export {};
