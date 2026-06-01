import { BaseLineDataType } from '../../store/types';
import Janus from '../janus/lib/janus';
import { JanusInstance, JanusLineType } from '../janus/types';
import { SipLineType, SipUserAgent } from '../sip/types';

export interface HybridInstance {
  ua: SipUserAgent; // SIP.js UA for signaling
  janus: Janus; // Janus.js instance for media
  pluginHandle: JanusInstance; // active Janus plugin handle
}

export type HybridLineType = SipLineType & JanusLineType;

export interface HybridLineDataType extends BaseLineDataType {}
