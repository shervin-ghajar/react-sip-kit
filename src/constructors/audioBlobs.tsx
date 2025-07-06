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
        url: './src/assets/media/Ringtone_1.mp3',
      },
      speech_orig: overwrite?.['speech_orig'] ?? {
        file: 'speech_orig.mp3',
        url: './src/assets/media/speech_orig.mp3',
      },
      Busy_UK: overwrite?.['Busy_UK'] ?? {
        file: 'Tone_Busy-UK.mp3',
        url: './src/assets/media/Tone_Busy-UK.mp3',
      },
      Busy_US: overwrite?.['Busy_US'] ?? {
        file: 'Tone_Busy-US.mp3',
        url: './src/assets/media/Tone_Busy-US.mp3',
      },
      CallWaiting: overwrite?.['CallWaiting'] ?? {
        file: 'Tone_CallWaiting.mp3',
        url: './src/assets/media/Tone_CallWaiting.mp3',
      },
      Congestion_UK: overwrite?.['Congestion_UK'] ?? {
        file: 'Tone_Congestion-UK.mp3',
        url: './src/assets/media/Tone_Congestion-UK.mp3',
      },
      Congestion_US: overwrite?.['Congestion_US'] ?? {
        file: 'Tone_Congestion-US.mp3',
        url: './src/assets/media/Tone_Congestion-US.mp3',
      },
      EarlyMedia_Australia: overwrite?.['EarlyMedia_Australia'] ?? {
        file: 'Tone_EarlyMedia-Australia.mp3',
        url: './src/assets/media/Tone_EarlyMedia-Australia.mp3',
      },
      EarlyMedia_European: overwrite?.['EarlyMedia_European'] ?? {
        file: 'Tone_EarlyMedia-European.mp3',
        url: './src/assets/media/Tone_EarlyMedia-European.mp3',
      },
      EarlyMedia_Japan: overwrite?.['EarlyMedia_Japan'] ?? {
        file: 'Tone_EarlyMedia-Japan.mp3',
        url: './src/assets/media/Tone_EarlyMedia-Japan.mp3',
      },
      EarlyMedia_UK: overwrite?.['EarlyMedia_UK'] ?? {
        file: 'Tone_EarlyMedia-UK.mp3',
        url: './src/assets/media/Tone_EarlyMedia-UK.mp3',
      },
      EarlyMedia_US: overwrite?.['EarlyMedia_US'] ?? {
        file: 'Tone_EarlyMedia-US.mp3',
        url: './src/assets/media/Tone_EarlyMedia-US.mp3',
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
