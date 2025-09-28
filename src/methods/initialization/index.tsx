import { SipConfigs, SipMediaConfig } from '../../configs/types';
import { getSipStore, useSipStore } from '../../store';
import isEqual from 'lodash.isequal';

// Detect Devices
export async function detectDevices(): Promise<MediaDeviceInfo[]> {
  return await navigator.mediaDevices.enumerateDevices();
}
/* -------------------------------------------------------------------------- */
export async function getMediaPermissions(media?: 'audio' | 'video') {
  const defaultPermissions = {
    audio: false, //  Microphone
    video: false, //  Camera
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      ...defaultPermissions,
      ...(media && { [media]: true }),
    });

    console.log('Media stream obtained:', { stream });
    return stream;
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      console.error('Permissions denied by the user.');
    } else if (error.name === 'NotFoundError') {
      console.error('No media devices found.');
    } else if (error.name === 'OverconstrainedError') {
      console.error('Constraints cannot be satisfied by available devices.');
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
/* -------------------------------------------------------------------------- */
export const initilizeMediaStreams = (configs: SipConfigs) => {
  const prevMediaConfig = getSipStore().configs?.[configs.key]?.media;
  if (prevMediaConfig && !isEqual(prevMediaConfig, configs.media)) {
    const configKey = configs.key;
    const lines = getSipStore().lines[configKey] ?? {};
    Object.values(lines).forEach((line) => {
      if (line.sipSession?.data.started) {
        line.sipSession?.initiateLocalMediaStreams({
          videoEnabled: line.sipSession.data.localMediaStreamStatus?.videoEnabled,
          configs,
        });
        line.sipSession?.initiateRemoteMediaStreams({
          videoEnabled: line.sipSession.data.localMediaStreamStatus?.videoEnabled,
          configs,
        });
      }
    });
  }
};
