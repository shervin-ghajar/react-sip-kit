import { JanusConfig } from '../../configs/types';
export declare class JanusEngineInitializer {
    private janus;
    private config;
    private configKey;
    constructor(config: JanusConfig, key: string);
    init(): Promise<void>;
    stop(): void;
}
