import { BaseLineDataType } from "../../store/types";
import { SipLineType, SipUserAgent } from "../sip/types";
import { JanusInstance, JanusLineType } from "../janus/types";
import Janus from "../janus/lib/janus";
export interface HybridInstance {
    ua: SipUserAgent;
    janus: Janus;
    pluginHandle: JanusInstance;
}
export type HybridLineType = SipLineType & JanusLineType;
export interface HybridLineDataType extends BaseLineDataType {
}
