import { HybridConfig } from '../../configs/types';
import { JanusEngineInitializer } from '../janus/initializer';
import { SipEngineInitializer } from '../sip/initializer';

export class HybridEngineInitializer {
  private sip: SipEngineInitializer;
  private janus: JanusEngineInitializer;

  constructor(config: HybridConfig, key: string) {
    this.sip = new SipEngineInitializer(config as any, key, 'signaling-only');
    this.janus = new JanusEngineInitializer(config as any, key);
  }

  async init() {
    // 1. init SIP UA (signaling)
    await this.sip.init();

    // 2. init Janus (media)
    await this.janus.init();

    // 3. tweak SIP media behavior (see section 2)
  }

  async stop() {
    await Promise.all([this.janus.stop(), this.sip.stop()]);
  }
}
