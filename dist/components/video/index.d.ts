import { HTMLAttributes, VideoHTMLAttributes } from 'react';
interface DefaultVideoProps {
    lineKey: string | number;
}
interface LocalVideoProps extends VideoHTMLAttributes<HTMLVideoElement>, DefaultVideoProps {
    type: 'local';
    id?: `line-${number}-${LocalVideoProps['type']}Video` | `line-${number}-remoteVideos`;
}
interface RemoteVidepProps extends HTMLAttributes<HTMLDivElement>, DefaultVideoProps {
    type: 'remote';
    id?: `line-${number}-${RemoteVidepProps['type']}Video` | `line-${number}-remoteVideos`;
}
type VideoProps = LocalVideoProps | RemoteVidepProps;
export declare const Video: ({ lineKey, ...rest }: VideoProps) => import("react/jsx-runtime").JSX.Element;
export {};
