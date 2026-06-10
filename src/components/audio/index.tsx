import { useDeep } from '../../hooks/useDeep';
import { useRtcStore } from '../../store';
import { HTMLAttributes, useEffect, useMemo, useRef } from 'react';

interface AudioProps extends HTMLAttributes<HTMLDivElement> {
  lineKey: string;
  type: 'local' | 'remote';
}

export function Audio({ lineKey, type, ...rest }: AudioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const remoteElementMap = useRef<Map<string, HTMLMediaElement>>(new Map());

  const audioDatas = useRtcStore(
    useDeep((state) => {
      const line = state.getLineDataByLineKey(lineKey);
      if (!line) return undefined;

      return type === 'local'
        ? line.localMediaStreamData.audio
        : line.remoteMediaStreamData.audio instanceof Map
          ? [...line.remoteMediaStreamData.audio.values()]
          : line.remoteMediaStreamData.audio;
    }),
  );

  // Retrieve selected output device (desktop fallback)
  const audioOutputDeviceId = useRtcStore(
    useDeep((state) => {
      const line = state.getLineDataByLineKey(lineKey);
      if (!line) return null;
      return type === 'remote' ? line.audioOutputDeviceId : null;
    }),
  );

  // Retrieve loudspeaker vs. earpiece flag reactively
  const speakerEnabled = useRtcStore(
    useDeep((state) => {
      const line = state.getLineDataByLineKey(lineKey);
      if (!line) return false;
      return type === 'remote' ? (line.speakerEnabled ?? false) : false;
    }),
  );

  const supportsSetSinkId = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return typeof (HTMLMediaElement.prototype as any).setSinkId === 'function';
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sinkId = audioOutputDeviceId || 'default';

    const applySinkId = (el: HTMLMediaElement) => {
      if (type !== 'remote' || !supportsSetSinkId || !(el instanceof HTMLAudioElement)) return;

      (el as any).setSinkId(sinkId).catch((err: any) => {
        console.error('[Audio] setSinkId failed', err);
      });
    };

    const createMediaEl = (trackId: string, track: MediaStreamTrack) => {
      // remote + speakerEnabled = 'audio' (loudspeaker)
      // remote + earpiece = 'video' (earpiece routing trick)
      const tag = type === 'remote' ? (speakerEnabled ? 'audio' : 'video') : 'audio';

      const el = document.createElement(tag) as HTMLMediaElement;

      el.id = `line-${lineKey}-${type}-${trackId}`;
      el.autoplay = true;
      el.muted = type === 'local';
      el.srcObject = new MediaStream([track]);

      // Hide the dummy video element if it's used for mobile routing
      if (tag === 'video') {
        const video = el as HTMLVideoElement;
        video.style.display = 'none';
        video.style.position = 'absolute';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.opacity = '0';
      }

      el.play().catch(() => {
        console.warn(`[Audio] Autoplay prevented for track ${trackId}`);
      });

      applySinkId(el);

      return el;
    };

    // Safely pause and stop streams before teardown to prevent audio context leaks
    remoteElementMap.current.forEach((el) => {
      el.pause();
      el.srcObject = null;
    });

    container.innerHTML = '';
    if (type === 'remote') {
      remoteElementMap.current.clear();
    }

    if (!audioDatas) return;

    if (Array.isArray(audioDatas)) {
      audioDatas.forEach((d) => {
        if (!d?.track) return;

        const el = createMediaEl(d.track.id, d.track);

        if (type === 'remote') {
          remoteElementMap.current.set(d.track.id, el);
        }

        container.appendChild(el);
      });
    } else if (audioDatas.track) {
      const el = createMediaEl(`${type}-single`, audioDatas.track);

      if (type === 'remote') {
        remoteElementMap.current.set(audioDatas.track.id, el);
      }

      container.appendChild(el);
    }

    return () => {
      remoteElementMap.current.forEach((el) => {
        el.pause();
        el.srcObject = null;
      });
      container.innerHTML = '';
      if (type === 'remote') {
        remoteElementMap.current.clear();
      }
    };
  }, [audioDatas, audioOutputDeviceId, lineKey, type, supportsSetSinkId, speakerEnabled]);

  useEffect(() => {
    if (type !== 'remote' || !supportsSetSinkId) return;

    const sinkId = audioOutputDeviceId || 'default';

    remoteElementMap.current.forEach((el) => {
      if (el instanceof HTMLAudioElement) {
        (el as any).setSinkId(sinkId).catch((err: any) => {
          console.error('[Audio] Failed to setSinkId reactively', err);
        });
      }
    });
  }, [audioOutputDeviceId, type, supportsSetSinkId]);

  return <div {...rest} ref={containerRef} data-audio-container={`${lineKey}-${type}`} />;
}
