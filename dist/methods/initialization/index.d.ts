import { CallbackFunction } from '../../types';
export declare function detectDevices(callback: CallbackFunction<MediaDeviceInfo[]>): void;
export declare function getMediaPermissions(media?: 'audio' | 'video'): Promise<MediaStream>;
