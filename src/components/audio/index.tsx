import { AudioHTMLAttributes } from 'react';

interface AudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
  lineNumber: string | number;
  type?: 'transfer' | 'conference';
}
export const Audio = ({ lineNumber, type, ...rest }: AudioProps) => {
  return <audio {...rest} id={`line-${lineNumber}${type ? `-${type}` : ''}-remoteAudio`}></audio>;
};
