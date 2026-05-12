import { sessionMethods } from '.';
import { LineType } from '../../../../store/types';
import { IncomingResponse } from 'sip.js/lib/core';
import { JanusJS } from '../../lib/janus';

export enum SendMessageSessionEnum {
  'SOUND_TOGGLE' = 'SOUND_TOGGLE',
  'VIDEO_TOGGLE' = 'VIDEO_TOGGLE',
  'SCREEN_SHARE_TOGGLE' = 'SCREEN_SHARE_TOGGLE',
  'VIDEO_TOGGLE_ACK' = 'VIDEO_TOGGLE_ACK',
}
export type SendMessageSessionValueType = {
  [SendMessageSessionEnum.SOUND_TOGGLE]: boolean;
  [SendMessageSessionEnum.VIDEO_TOGGLE]: boolean;
  [SendMessageSessionEnum.SCREEN_SHARE_TOGGLE]: boolean;
  [SendMessageSessionEnum.VIDEO_TOGGLE_ACK]: null | undefined | '';
};

export type SendMessageRequestBody<
  T extends SendMessageSessionEnum = SendMessageSessionEnum.SOUND_TOGGLE,
> = { type: T; value: SendMessageSessionValueType[T] };

export interface SessionDescriptionHandlerOptions {
  constraints: {
    audio: AudioSessionConstraints | boolean;
    video: VideoSessionConstraints | boolean;
  };
}
export type AudioSessionConstraints = {
  deviceId: string | { exact: string };
  autoGainControl?: boolean;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
};
export type VideoSessionConstraints = {
  deviceId: string | { exact: string };
  autoGainControl?: boolean;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  frameRate?: string | null;
  height?: string | null;
  aspectRatio?: string | null;
};

export type SPDOptionsType = Record<
  'sessionDescriptionHandlerOptions',
  SessionDescriptionHandlerOptions
> &
  Partial<{ earlyMedia: boolean; extraHeaders: string[] }>;

export type SessionMethods = ReturnType<typeof sessionMethods>;
export type DialRequestDelegate = {
  onAccept?: (lineKey: LineType['lineKey'], response: DialResponse) => void;

  onProgress?: (lineKey: LineType['lineKey'], response: DialResponse) => void;

  onRedirect?: (lineKey: LineType['lineKey'], response: DialResponse) => void;

  onReject?: (lineKey: LineType['lineKey'], response: DialResponse) => void;

  onTrying?: (lineKey: LineType['lineKey'], response: DialResponse) => void;
};

export type DialResponse = IncomingResponse;


export type JanusPublisherStream = {
  type: 'audio' | 'video' | 'data';
  mindex: number;
  mid: string;
  codec: string;

  // optional fields depending on type
  fec?: boolean;
};

export type JanusPublisher = {
  id: number;                // feed id (IMPORTANT for subscribing)
  display?: string;          // username / label
  audio_codec?: string;
  video_codec?: string;
  streams: JanusPublisherStream[];
};


export interface JanusMessage extends JanusJS.Message {
  room: number
  videoroom: string
}


export type JanusId = number | string;

// Base envelope for VideoRoom plugin requests
export interface VideoRoomBaseRequest {
  janus: "message";
  transaction?: string;
  token?: string;
  session_id?: number;
  handle_id?: number;
  body: any;
}


export type JanusRoomSecurity = {
  pin?: string
  secret?: string
  admin_key?: string
  is_private?: boolean
}

export interface StartSessionOptions extends JanusRoomSecurity {
  autoCreate?: boolean
}

export type VideoRoomRequestType =
  | "create"
  | "destroy"
  | "exists"
  | "list"
  | "listparticipants"
  | "allowed"
  | "kick"
  | "join"
  | "joinandconfigure"
  | "configure"
  | "publish"
  | "unpublish"
  | "start"
  | "stop"
  | "switch"
  | "leave"
  | "subscribe"
  | "unsubscribe"
  | "rtp_forward"
  | "stop_rtp_forward"
  | "recording"
  | "start_recording"
  | "stop_recording"
  | "update";


export interface VRCreateRequest<T extends JanusId = number> {
  request: "create"
  /**
   * If set, rooms can be created via API only
   * if this key is provided in the request.
   */
  admin_key?: string;

  /**
   * Whether admin_key is required for RTP forwarding requests.
   * Default: false
   */
  lock_rtp_forward?: boolean;

  /**
   * Whether events should be sent to Janus event handlers.
   * Default: true
   */
  events?: boolean;

  /**
   * If true, room IDs and participant IDs can be strings (UUIDs).
   * Default: false (numeric IDs)
   */
  string_ids?: boolean;

  /** Unique room ID (required for creation) */
  room: T;

  /** A human-readable description of the room */
  description?: string;

  /** Whether the room is private (default=true) */
  is_private?: boolean;

  /** Admin secret for room modification (destroying, editing) */
  secret?: string;

  /** PIN required for users to join the room */
  pin?: string;

  /** Whether subscriptions must provide valid private_id (default=false) */
  require_pvtid?: boolean;

  /** Require signed tokens to access the room (default=false) */
  signed_tokens?: boolean;

  /** Max number of concurrent publishers */
  publishers?: number;

  /** Max allowed video bitrate for publishers (e.g., 128000) */
  bitrate?: number;

  /** Whether the bitrate cap is strict (default=false) */
  bitrate_cap?: boolean;

  /** Send FIR to publishers every N seconds (0=disabled) */
  fir_freq?: number;

  /** Allowed audio codecs (comma-separated in Janus) */
  audiocodec?: AudioCodec[];

  /** Allowed video codecs (comma-separated in Janus) */
  videocodec?: VideoCodec[];

  /** VP9 preferred profile (e.g. "2") */
  vp9_profile?: string;

  /** H.264 preferred profile-level-id (hex string) */
  h264_profile?: string;

  /** Whether Opus in-band FEC must be negotiated (default=true) */
  opus_fec?: boolean;

  /** Whether Opus DTX must be negotiated (default=false) */
  opus_dtx?: boolean;

  /** Negotiate SSRC audio-level extension (default=true) */
  audiolevel_ext?: boolean;

  /** Emit audio-level event to others (default=false) */
  audiolevel_event?: boolean;

  /** Number of packets with audio-level info (default=100) */
  audio_active_packets?: number;

  /** Average audio level threshold (default=25) */
  audio_level_average?: number;

  /** Negotiate video-orientation RTP extension (default=true) */
  videoorient_ext?: boolean;

  /** Negotiate playout-delay RTP extension (default=true) */
  playoutdelay_ext?: boolean;

  /** Negotiate transport-wide CC RTP extension (default=true) */
  transport_wide_cc_ext?: boolean;

  /** Whether this room should be recorded (default=false) */
  record?: boolean;

  /** Directory where recordings should be stored */
  rec_dir?: string;

  /** Whether recording can only be changed if secret is provided */
  lock_record?: boolean;

  /** Notify all participants when a new participant joins (default=false) */
  notify_joining?: boolean;

  /** Require end‑to‑end encryption for all participants (default=false) */
  require_e2ee?: boolean;

  /** Create a dummy publisher for structured subscriptions */
  dummy_publisher?: boolean;

  /**
   * List of dummy streams offered if dummy_publisher=true.
   * If absent → all codecs enabled in the room.
   */
  dummy_streams?: DummyStream[];

  /** Advertise dummy publisher as E2EE-capable (default=require_e2ee) */
  dummy_e2ee?: boolean;

  /** Number of worker threads to assist relaying (default=0) */
  threads?: number;

  /** Whether the room should be saved in the config file, default=false */
  permenant?: boolean
}

export type AudioCodec =
  | "opus"
  | "g722"
  | "pcmu"
  | "pcma"
  | "isac32"
  | "isac16";

export type VideoCodec =
  | "vp8"
  | "vp9"
  | "h264"
  | "av1"
  | "h265";

export interface DummyStream {
  /** Codec name (vp8, h264, opus, etc.) */
  codec: AudioCodec | VideoCodec;

  /** Optional FMTP attributes (e.g., "profile-id=2") */
  fm?: string;
}
