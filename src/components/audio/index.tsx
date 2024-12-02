import { AudioHTMLAttributes } from 'react';

interface AudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
  lineNumber: string | number;
}
export const Audio = ({ lineNumber, ...rest }: AudioProps) => {
  return <audio {...rest} id={`line-${lineNumber}-remoteAudio`}></audio>;
};
