import { HTMLAttributes, useEffect, useRef } from "react";
import { useDeep } from "../../hooks/useDeep";
import { useRtcStore } from "../../store";

interface DefaultVideoProps {
  lineKey: string;
}

interface VideoProp extends HTMLAttributes<HTMLDivElement>, DefaultVideoProps {
  type: "local" | "remote";
}

export const Video = ({ lineKey, type, ...rest }: VideoProp) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // keeps DOM video elements by trackId
  const videoElementMap = useRef<Map<string, HTMLVideoElement>>(new Map());

  const videos = useRtcStore(
    useDeep((state) => {
      const lineData = state.getLineDataByLineKey(lineKey);
      if (!lineData) return;

      return type === "local"
        ? lineData.localMediaStreamData.video
        : lineData.remoteMediaStreamData.video instanceof Map
          ? [...lineData.remoteMediaStreamData.video.values()]
          : lineData.remoteMediaStreamData.video;
    })
  );

  useEffect(() => {
    if (!containerRef.current || !videos) return;

    const container = containerRef.current;

    const tracks =
      videos instanceof Array
        ? videos.map((v) => v.track).filter(Boolean)
        : videos.track
          ? [videos.track]
          : [];

    const activeTrackIds = new Set(tracks.map((t) => t.id));

    // add new tracks
    tracks.forEach((track) => {
      if (videoElementMap.current.has(track.id)) return;

      const video = document.createElement("video");
      video.id = `line-${lineKey}-${type}-${track.id}`;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = type === "local";
      video.style.width = "100%"
      video.style.height = "100%"
      video.className = type === "remote" ? "remote-video" : "local-video";

      video.srcObject = new MediaStream([track]);

      video
        .play()
        .catch(() =>
          console.warn(`Autoplay prevented for track ${track.id}`)
        );

      videoElementMap.current.set(track.id, video);
      container.appendChild(video);
    });

    // remove stale tracks
    videoElementMap.current.forEach((video, trackId) => {
      if (!activeTrackIds.has(trackId)) {
        video.remove();
        videoElementMap.current.delete(trackId);
      }
    });
  }, [videos, lineKey, type]);

  // full cleanup on unmount
  useEffect(() => {
    return () => {
      videoElementMap.current.forEach((video) => video.remove());
      videoElementMap.current.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...rest}
      id={`line-${lineKey}-${type}-videos`}
      data-video-container={`${lineKey}-${type}-videos`}
    />
  );
};
