export declare enum SendMessageSessionEnum {
    'SOUND_TOGGLE' = "SOUND_TOGGLE",
    'VIDEO_TOGGLE' = "VIDEO_TOGGLE",
    'SCREEN_SHARE_TOGGLE' = "SCREEN_SHARE_TOGGLE",
    'VIDEO_TOGGLE_ACK' = "VIDEO_TOGGLE_ACK"
}
export type SendMessageSessionValueType = {
    [SendMessageSessionEnum.SOUND_TOGGLE]: boolean;
    [SendMessageSessionEnum.VIDEO_TOGGLE]: boolean;
    [SendMessageSessionEnum.SCREEN_SHARE_TOGGLE]: boolean;
    [SendMessageSessionEnum.VIDEO_TOGGLE_ACK]: null | undefined | '';
};
export type SendMessageRequestBody<T extends SendMessageSessionEnum = SendMessageSessionEnum.SOUND_TOGGLE> = {
    type: T;
    value: SendMessageSessionValueType[T];
};
