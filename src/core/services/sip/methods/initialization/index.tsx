import { hostingPrefix } from '../../configs';
import { CallbackFunction } from '../../types';

/* -------------------------------------------------------------------------- */
// Detect Devices
export function detectDevices(callback: CallbackFunction<MediaDeviceInfo[]>) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (deviceInfos) {
      // deviceInfos will not have a populated lable unless to accept the permission
      // during getUserMedia. This normally happens at startup/setup
      // so from then on these devices will be with lables.
      // deviceInfos.map((deviceInfo) => {
      //   console.log({ audiooutput: deviceInfo.kind });
      // });
      const url = new URL('./src/assets/media/Alert.mp3');
      // const testAudio = new Audio(url);
      console.log({ url });
      // testAudio.play().catch((error) => {
      //   console.error('Error playing test audio:', error);
      // });
      callback(deviceInfos);
    })
    .catch(function (e) {
      console.error('Error enumerating devices', e);
    });
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
