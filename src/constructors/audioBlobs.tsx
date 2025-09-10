type AudioBlobsType = Record<
  'Alert' | 'Ringtone' | 'CallWaiting',
  {
    file: string;
    url: string;
    blob?: string | ArrayBuffer | null;
  }
>;

export class AudioBlobs {
  private static instance: AudioBlobs;
  private audioBlobs: AudioBlobsType;

  private constructor(overwrite?: Partial<AudioBlobsType>) {
    this.audioBlobs = {
      Alert: overwrite?.['Alert'] ?? {
        file: 'Alert.mp3',
        url: './src/assets/media/Alert.mp3',
      },
      Ringtone: overwrite?.['Ringtone'] ?? {
        file: 'Ringtone_1.mp3',
        url: './src/assets/media/Ringtone.mp3',
      },
      CallWaiting: overwrite?.['CallWaiting'] ?? {
        file: 'Tone_CallWaiting.mp3',
        url: './src/assets/media/CallWaiting.mp3',
      },
    };
  }

  public static getInstance(overwrite?: Partial<AudioBlobsType>): AudioBlobs {
    if (!AudioBlobs.instance) {
      AudioBlobs.instance = new AudioBlobs(overwrite);
    }
    return AudioBlobs.instance;
  }

  getAudios() {
    return this.audioBlobs;
  }
}
