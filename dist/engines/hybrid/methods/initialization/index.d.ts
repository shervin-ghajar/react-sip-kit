import { RtcConfig } from '../../../../configs/types';
export declare function detectDevices(): Promise<MediaDeviceInfo[]>;
export declare function getMediaPermissions(media?: 'audio' | 'video'): Promise<MediaStream>;
export declare const initilizeMediaStreams: (configs: RtcConfig) => void;
