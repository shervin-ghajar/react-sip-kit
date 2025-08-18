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
export declare const Audio: ({ lineNumber, ...rest }: AudioProps) => import("react/jsx-runtime").JSX.Element;
export {};
