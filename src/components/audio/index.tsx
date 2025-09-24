import { AudioHTMLAttributes, HTMLAttributes } from 'react';

interface DefaultAudioProps {
  lineKey: string | number;
}

interface LocalAudioProps extends AudioHTMLAttributes<HTMLAudioElement>, DefaultAudioProps {
  type: 'local';
  id?: `line-${number}-${LocalAudioProps['type']}Audio`;
}

interface RemoteAudioProps extends HTMLAttributes<HTMLDivElement>, DefaultAudioProps {
  type: 'remote';
  id?: `line-${number}-remoteAudios`;
}

type AudioProps = LocalAudioProps | RemoteAudioProps;

export const Audio = ({ lineKey, ...rest }: AudioProps) => {
  return rest.type === 'local' ? (
    <audio {...rest} id={`line-${lineKey}-localAudio`} />
  ) : (
    <div {...rest} id={`line-${lineKey}-remoteAudios`} />
  );
};
