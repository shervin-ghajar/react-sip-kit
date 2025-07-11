import { HTMLAttributes, VideoHTMLAttributes } from 'react';
interface DefaultVideoProps {
    lineNumber: string | number;
}
interface LocalVideoProps extends VideoHTMLAttributes<HTMLVideoElement>, DefaultVideoProps {
    type: 'local';
}
interface RemoteVidepProps extends HTMLAttributes<HTMLDivElement>, DefaultVideoProps {
    type: 'remote';
}
type VideoProps = LocalVideoProps | RemoteVidepProps;
export declare const Video: ({ lineNumber, ...rest }: VideoProps) => import("react/jsx-runtime").JSX.Element;
export {};
