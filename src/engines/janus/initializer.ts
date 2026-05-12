import { JanusConfig, RtcConfig } from '../../configs/types';
import { getRtcStore, setRtcStore } from '../../store';
import Janus from './lib/janus.js';
import adapter from 'webrtc-adapter';

export class JanusEngineInitializer {
  private janus: any | null = null;
  private config: JanusConfig;
  private configKey: RtcConfig['key'];

  constructor(config: JanusConfig, key: string) {
    this.config = config;
    this.configKey = key;
  }

  async init() {
    const self = this;
    Janus.init({
      debug: 'all',
      dependencies: Janus.useDefaultDependencies({ adapter: adapter }),
      callback: function () {
        if (!Janus.isWebrtcSupported()) {
          alert('No WebRTC support... ');
          return;
        }
        self.janus = new Janus({
          server: self.config.account.janusServer,
          success: () => {
            if (!self.janus) return;

            console.log(self.configKey, 'Janus connected', self.janus.isConnected());
            const { engines, statuses } = getRtcStore();
            setRtcStore({
              engines: { ...engines, [self.configKey]: self.janus },
              statuses: {
                ...statuses,
                [self.configKey]: self.janus.isConnected() ? 'connected' : 'disconnected',
              },
            });
          },
          destroyed: () => {
            console.log(self.configKey, 'Janus destryed');
          },
          bundlePolicy: self.config.registration.bundlePolicy,
          iceServers: self.config.registration.peerConnectionConfiguration.iceServers,
          iceTransportPolicy:
            self.config.registration.peerConnectionConfiguration.iceTransportPolicy,
        });
        console.log(555, self.janus.isConnected(), self.janus);
        getRtcStore().setEngine(self.configKey, self.janus);
      },
    });
  }

  stop() {
    this.janus?.destroy({});
  }
}
