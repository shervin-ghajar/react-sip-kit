export interface SipMediaStream extends MediaStream {
    trackId?: string;
    mid?: string;
}
export interface MediaStreamTrackType extends MediaStreamTrack {
    mid: RTCRtpTransceiver['mid'];
    IsMixedTrack: boolean;
}
export interface RTCRtpTransceiverType extends RTCRtpTransceiver {
    track: RTCRtpTransceiver['receiver']['track'] & {
        mid: RTCRtpTransceiver['mid'];
    };
}
