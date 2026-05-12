import { RtcConfig } from '../../../../configs/types';
import { getRtcStore } from '../../../../store';
import isEqual from 'lodash.isequal';
import { SipInviterType, SipLineType, SipSessionType } from '../../types';

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
export const initilizeMediaStreams = (configs: RtcConfig) => {
  if(configs.engine==='janus') return
  const prevMediaConfig = getRtcStore().configs?.[configs.key]?.media;
  if (prevMediaConfig && !isEqual(prevMediaConfig, configs.media)) {
    const configKey = configs.key;
    const lines = getRtcStore().lines[configKey] ?? {};
    Object.values(lines).forEach((l) => {
      const line=l as unknown as SipLineType
      if (line?.data.started) {
        (line.session)?.initiateLocalMediaStreams({
          videoEnabled: line.data.localMediaStreamData.video.enabled,
          configs,
        });
        (line.session)?.initiateRemoteMediaStreams({
          videoEnabled: line.data.localMediaStreamData.video.enabled,
          configs,
        });
      }
    });
  }
};
