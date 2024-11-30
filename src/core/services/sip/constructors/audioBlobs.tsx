import { hostingPrefix } from '../configs';
import { BuddyType } from '../store/types';

type AudioBlobsType = Record<
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
    blob?: string;
  }
>;

export class AudioBlobs implements AudioBlobsType {
  Alert: AudioBlobsType['Alert'];
  Ringtone: AudioBlobsType['Ringtone'];
  speech_orig: AudioBlobsType['speech_orig'];
  Busy_UK: AudioBlobsType['Busy_UK'];
  Busy_US: AudioBlobsType['Busy_US'];
  CallWaiting: AudioBlobsType['CallWaiting'];
  Congestion_UK: AudioBlobsType['Congestion_UK'];
  Congestion_US: AudioBlobsType['Congestion_US'];
  EarlyMedia_Australia: AudioBlobsType['EarlyMedia_Australia'];
  EarlyMedia_European: AudioBlobsType['EarlyMedia_European'];
  EarlyMedia_Japan: AudioBlobsType['EarlyMedia_Japan'];
  EarlyMedia_UK: AudioBlobsType['EarlyMedia_UK'];
  EarlyMedia_US: AudioBlobsType['EarlyMedia_US'];

  constructor() {
    this.Alert = { file: 'Alert.mp3', url: hostingPrefix + './src/assets/media/Alert.mp3' };
    this.Ringtone = {
      file: 'Ringtone_1.mp3',
      url: hostingPrefix + './src/assets/media/Ringtone_1.mp3',
    };
    this.speech_orig = {
      file: 'speech_orig.mp3',
      url: hostingPrefix + './src/assets/media/speech_orig.mp3',
    };
    this.Busy_UK = {
      file: 'Tone_Busy-UK.mp3',
      url: hostingPrefix + './src/assets/media/Tone_Busy-UK.mp3',
    };
    this.Busy_US = {
      file: 'Tone_Busy-US.mp3',
      url: hostingPrefix + './src/assets/media/Tone_Busy-US.mp3',
    };
    this.CallWaiting = {
      file: 'Tone_CallWaiting.mp3',
      url: hostingPrefix + './src/assets/media/Tone_CallWaiting.mp3',
    };
    this.Congestion_UK = {
      file: 'Tone_Congestion-UK.mp3',
      url: hostingPrefix + './src/assets/media/Tone_Congestion-UK.mp3',
    };
    this.Congestion_US = {
      file: 'Tone_Congestion-US.mp3',
      url: hostingPrefix + './src/assets/media/Tone_Congestion-US.mp3',
    };
    this.EarlyMedia_Australia = {
      file: 'Tone_EarlyMedia-Australia.mp3',
      url: hostingPrefix + './src/assets/media/Tone_EarlyMedia-Australia.mp3',
    };
    this.EarlyMedia_European = {
      file: 'Tone_EarlyMedia-European.mp3',
      url: hostingPrefix + './src/assets/media/Tone_EarlyMedia-European.mp3',
    };
    this.EarlyMedia_Japan = {
      file: 'Tone_EarlyMedia-Japan.mp3',
      url: hostingPrefix + './src/assets/media/Tone_EarlyMedia-Japan.mp3',
    };
    this.EarlyMedia_UK = {
      file: 'Tone_EarlyMedia-UK.mp3',
      url: hostingPrefix + './src/assets/media/Tone_EarlyMedia-UK.mp3',
    };
    this.EarlyMedia_US = {
      file: 'Tone_EarlyMedia-US.mp3',
      url: hostingPrefix + './src/assets/media/Tone_EarlyMedia-US.mp3',
    };
  }
}
