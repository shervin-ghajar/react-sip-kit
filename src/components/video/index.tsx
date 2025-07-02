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

export const Video = ({ lineNumber, ...rest }: VideoProps) => {
  return rest.type === 'local' ? (
    <video
      {...rest}
      id={`line-${lineNumber}-${rest.type}Video`}
      muted={rest.type === 'local'}
    ></video>
  ) : (
    <div {...rest} id={`line-${lineNumber}-remoteVideos`}></div>
  );
};
