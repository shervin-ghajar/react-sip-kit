import { hostingPrefix } from '../../configs';
import { CallbackFunction } from '../../types';

export const audioBlobs: Partial<
  Record<
    | 'Alert'
    | 'Ringtone'
    | 'speech_orig'
    | 'Busy_UK'
    | 'Busy_US'
    | 'CallWaiting'
    | 'Congestion_UK'
    | 'Congestion_US'
    | 'EarlyMedia_Australia'
    | 'EarlyMedia_European'
    | 'EarlyMedia_Japan'
    | 'EarlyMedia_UK'
    | 'EarlyMedia_US',
    {
      file: string;
      url: string;
      blob?: string | ArrayBuffer | null;
    }
  >
> = {};

export function preloadAudioFiles() {
  audioBlobs.Alert = { file: 'Alert.mp3', url: hostingPrefix + 'media/Alert.mp3' };
  audioBlobs.Ringtone = { file: 'Ringtone_1.mp3', url: hostingPrefix + 'media/Ringtone_1.mp3' };
  audioBlobs.speech_orig = {
    file: 'speech_orig.mp3',
    url: hostingPrefix + 'media/speech_orig.mp3',
  };
  audioBlobs.Busy_UK = { file: 'Tone_Busy-UK.mp3', url: hostingPrefix + 'media/Tone_Busy-UK.mp3' };
  audioBlobs.Busy_US = { file: 'Tone_Busy-US.mp3', url: hostingPrefix + 'media/Tone_Busy-US.mp3' };
  audioBlobs.CallWaiting = {
    file: 'Tone_CallWaiting.mp3',
    url: hostingPrefix + 'media/Tone_CallWaiting.mp3',
  };
  audioBlobs.Congestion_UK = {
    file: 'Tone_Congestion-UK.mp3',
    url: hostingPrefix + 'media/Tone_Congestion-UK.mp3',
  };
  audioBlobs.Congestion_US = {
    file: 'Tone_Congestion-US.mp3',
    url: hostingPrefix + 'media/Tone_Congestion-US.mp3',
  };
  audioBlobs.EarlyMedia_Australia = {
    file: 'Tone_EarlyMedia-Australia.mp3',
    url: hostingPrefix + 'media/Tone_EarlyMedia-Australia.mp3',
  };
  audioBlobs.EarlyMedia_European = {
    file: 'Tone_EarlyMedia-European.mp3',
    url: hostingPrefix + 'media/Tone_EarlyMedia-European.mp3',
  };
  audioBlobs.EarlyMedia_Japan = {
    file: 'Tone_EarlyMedia-Japan.mp3',
    url: hostingPrefix + 'media/Tone_EarlyMedia-Japan.mp3',
  };
  audioBlobs.EarlyMedia_UK = {
    file: 'Tone_EarlyMedia-UK.mp3',
    url: hostingPrefix + 'media/Tone_EarlyMedia-UK.mp3',
  };
  audioBlobs.EarlyMedia_US = {
    file: 'Tone_EarlyMedia-US.mp3',
    url: hostingPrefix + 'media/Tone_EarlyMedia-US.mp3',
  };
  Object.values(audioBlobs).forEach((item) => {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', item.url, true);
    oReq.responseType = 'blob';
    oReq.onload = function (oEvent) {
      var reader = new FileReader();
      reader.readAsDataURL(oReq.response);
      reader.onload = function () {
        item.blob = reader.result;
      };
    };
    oReq.send();
  });
  // console.log(audioBlobs);
}
/* -------------------------------------------------------------------------- */
// Detect Devices
export function detectDevices(callback: CallbackFunction<MediaDeviceInfo[]>) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (deviceInfos) {
      // deviceInfos will not have a populated lable unless to accept the permission
      // during getUserMedia. This normally happens at startup/setup
      // so from then on these devices will be with lables.

      callback(deviceInfos);
    })
    .catch(function (e) {
      console.error('Error enumerating devices', e);
    });
}
