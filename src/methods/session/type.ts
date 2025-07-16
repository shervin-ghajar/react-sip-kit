export enum SendMessageSessionEnum {
  'MIC_TOGGLE' = 'MIC_TOGGLE',
  'CAMERA_TOGGLE' = 'CAMERA_TOGGLE',
  'SCREEN_SHARE_TOGGLE' = 'SCREEN_SHARE_TOGGLE',
}
export type SendMessageSessionBodyType = {
  [SendMessageSessionEnum.MIC_TOGGLE]: { muted: boolean };
  [SendMessageSessionEnum.CAMERA_TOGGLE]: { cameraOn: boolean };
  [SendMessageSessionEnum.SCREEN_SHARE_TOGGLE]: { sharing: boolean };
};

export type SendMessageRequestContent<T extends SendMessageSessionEnum> = {
  type: T;
  body: SendMessageSessionBodyType[T];
};
