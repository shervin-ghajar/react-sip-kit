import { useDeep } from '../../hooks/useDeep';
import { useRtcStore } from '../../store';
import { HTMLAttributes, useEffect, useMemo, useRef } from 'react';

interface AudioProps extends HTMLAttributes<HTMLDivElement> {
  lineKey: string;
  type: 'local' | 'remote';
}

export function Audio({ lineKey, type, ...rest }: AudioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const remoteAudioElementMap = useRef<Map<string, HTMLAudioElement>>(new Map());

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

  const audioOutputDeviceId = useRtcStore(
    useDeep((state) => {
      const line = state.getLineDataByLineKey(lineKey);
      if (!line) return null;
      return type === 'remote' ? line.audioOutputDeviceId : null;
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

    const applySinkId = (el: HTMLAudioElement) => {
      if (type !== 'remote' || !supportsSetSinkId) return;
      el.setSinkId(sinkId).catch((err) => {
        console.error('[Audio] setSinkId failed', err);
      });
    };

    const createAudioEl = (trackId: string, track: MediaStreamTrack) => {
      const audioEl = document.createElement('audio');
      audioEl.id = `line-${lineKey}-${type}-${trackId}`;
      audioEl.autoplay = true;
      audioEl.muted = type === 'local';
      audioEl.srcObject = new MediaStream([track]);

      audioEl.play().catch(() => {
        console.warn(`[Audio] Autoplay prevented for track ${trackId}`);
      });

      applySinkId(audioEl);

      return audioEl;
    };

    // Clear previous DOM and registry before rebuilding
    container.innerHTML = '';
    if (type === 'remote') {
      remoteAudioElementMap.current.clear();
    }

    if (!audioDatas) return;

    if (Array.isArray(audioDatas)) {
      audioDatas.forEach((d) => {
        if (!d?.track) return;
        const el = createAudioEl(d.track.id, d.track);

        if (type === 'remote') {
          remoteAudioElementMap.current.set(d.track.id, el);
        }

        container.appendChild(el);
      });
    } else if (audioDatas.track) {
      const el = createAudioEl(`${type}-single`, audioDatas.track);

      if (type === 'remote') {
        remoteAudioElementMap.current.set(audioDatas.track.id, el);
      }

      container.appendChild(el);
    }

    return () => {
      container.innerHTML = '';
      if (type === 'remote') {
        remoteAudioElementMap.current.clear();
      }
    };
  }, [audioDatas, audioOutputDeviceId, lineKey, type, supportsSetSinkId]);

  // Apply sinkId reactively to already-mounted remote audio elements
  useEffect(() => {
    if (type !== 'remote' || !supportsSetSinkId) return;

    const sinkId = audioOutputDeviceId || 'default';

    remoteAudioElementMap.current.forEach((audioEl) => {
      audioEl.setSinkId(sinkId).catch((err) => {
        console.error('[Audio] Failed to setSinkId reactively', err);
      });
    });
  }, [audioOutputDeviceId, type, supportsSetSinkId]);

  return <div {...rest} ref={containerRef} data-audio-container={`${lineKey}-${type}`} />;
}
