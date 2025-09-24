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
// TODO remoteVideo should cover renderVIdeo props to itterate on each video track
export const Video = ({ lineKey, ...rest }: VideoProps) => {
  return rest.type === 'local' ? (
    <video {...rest} id={`line-${lineKey}-${rest.type}Video`} muted={rest.type === 'local'}></video>
  ) : (
    <div {...rest} id={`line-${lineKey}-remoteVideos`}></div>
  );
};
