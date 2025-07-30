import { HTMLAttributes, VideoHTMLAttributes } from 'react';

interface DefaultVideoProps {
  lineNumber: string | number;
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
