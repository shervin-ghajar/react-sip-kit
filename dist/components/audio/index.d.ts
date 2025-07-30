import { AudioHTMLAttributes } from 'react';
interface AudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
    lineNumber: string | number;
    type?: 'transfer' | 'conference';
    id?: `line-${number}${AudioId}-remoteAudio`;
}
type AudioId<T extends AudioProps['type'] = AudioProps['type']> = T extends undefined ? '' : `-${T}`;
export declare const Audio: ({ lineNumber, type, ...rest }: AudioProps) => import("react/jsx-runtime").JSX.Element;
export {};
