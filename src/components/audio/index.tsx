import { AudioHTMLAttributes, HTMLAttributes } from 'react';

interface DefaultAudioProps {
  lineNumber: string | number;
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

export const Audio = ({ lineNumber, ...rest }: AudioProps) => {
  return rest.type === 'local' ? (
    <audio {...rest} id={`line-${lineNumber}-localAudio`} />
  ) : (
    <div {...rest} id={`line-${lineNumber}-remoteAudios`} />
  );
};
