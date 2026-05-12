import { useDeep } from '../../hooks/useDeep';
import { useRtcStore } from '../../store';
import { HTMLAttributes, useEffect, useRef } from 'react';

// Global registry for remote audio elements

interface AudioProps extends HTMLAttributes<HTMLDivElement> {
  lineKey: string;
  type: 'local' | 'remote';
}

export function Audio({ lineKey, type, ...rest }: AudioProps) {
  const remoteAudioElementMap = useRef<HTMLAudioElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Store selectors
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Imperative construction of <audio> tags inside containerRef
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear old <audio> children
    container.innerHTML = '';

    if (!audioDatas) return;

    const supportsSetSinkId =
      typeof (HTMLMediaElement.prototype as any).setSinkId === 'function';

    const sinkId = audioOutputDeviceId || 'default';

    // Helper: create & wire audio element
    const createAudioEl = (trackId: string, track: MediaStreamTrack) => {
      const audioEl = document.createElement('audio');
      audioEl.id = `line-${lineKey}-${type}-${trackId}`;
      audioEl.autoplay = true;
      audioEl.muted = type === 'local';
      audioEl.srcObject = new MediaStream([track]);

      // Register remote audio elements
      if (type === 'remote') {
        remoteAudioElementMap.current.push(audioEl);
      }

      // Autoplay attempt
      audioEl.play().catch(() => {
        console.warn(`Autoplay prevented for track ${trackId}`);
      });

      return audioEl;
    };

    // MULTI REMOTE TRACKS (Janus)
    if (Array.isArray(audioDatas)) {
      audioDatas.forEach((d) => {
        if (!d.track) return;

        const el = createAudioEl(d.track.id, d.track);

        // Apply sinkId immediately
        if (type === 'remote' && supportsSetSinkId) {
          el.setSinkId(sinkId).catch((err) => {
            console.error('[Audio] setSinkId failed', err);
          });
        }

        container.appendChild(el);
      });
    }

    // SINGLE TRACK (local or SIP remote)
    else if (audioDatas.track) {
      const el = createAudioEl(`${type}-single`, audioDatas.track);

      if (type === 'remote' && supportsSetSinkId) {
        el.setSinkId(sinkId).catch((err) => {
          console.error('[Audio] setSinkId failed', err);
        });
      }

      container.appendChild(el);
    }

    // Cleanup: remove children + unregister
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (type === 'remote') {
        remoteAudioElementMap.current = [];
      }
    };
  }, [audioDatas, lineKey, type]);

  // ---------------------------------------------------------------------------
  // Reactively apply sinkId to already‑mounted remote audio elements
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (type !== 'remote') return;

    const supports =
      typeof (HTMLMediaElement.prototype as any).setSinkId === 'function';
    if (!supports) return;

    const sinkId = audioOutputDeviceId || 'default';

    const audioEls = remoteAudioElementMap.current;
    if (!audioEls) return;

    audioEls.forEach((el) => {
      el.setSinkId(sinkId).catch((err) => {
        console.error('[Audio] Failed to setSinkId (reactive)', err);
      });
    });
  }, [audioOutputDeviceId, lineKey, type]);

  // ---------------------------------------------------------------------------

  return (
    <div
      {...rest}
      ref={containerRef}
      data-audio-container={`${lineKey}-${type}`}
    />
  );
}
