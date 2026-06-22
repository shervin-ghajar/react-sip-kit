import { HybridConfig } from '../../configs/types';
export declare class HybridEngineInitializer {
    private sip;
    private janus;
    constructor(config: HybridConfig, key: string);
    init(): Promise<void>;
    stop(): Promise<void>;
}
