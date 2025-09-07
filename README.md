# react-sip-kit

A modern **React SIP.js toolkit** for building web-based softphones and SIP clients.
Supports **audio/video calls**, **recording**, **screen sharing**, and **device management** — all with a clean, extensible architecture.

---

## ✨ Features

* 📞 **Audio & Video Calls** — with automatic device detection
* 🎥 **Video Support** — manage local & remote streams seamlessly
* 🔴 **Call Recording** — audio and video recording out of the box
* 🖥️ **Screen Sharing** — during video calls
* 🎧 **Device Management** — select audio/video input & output devices
* 🔄 **Multi-account & Multi-line Support** — handle multiple SIP accounts and concurrent calls
* ⚡ **TypeScript-first** — fast, modular, type-safe APIs
* 🛠️ **Configurable & Extensible** — tailor to your SIP setup

---

## 📦 Installation

```bash
npm install react-sip-kit
# or
yarn add react-sip-kit
```

---

## 🚀 Basic Usage

### 1. Wrap your app with `SipProvider`

```tsx
import App from './App';
import { SipProvider } from 'react-sip-kit';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const configs = [
  {
    account: {
      domain: 'sip.example.com',
      username: '1001',
      password: '1001',
      wssServer: 'sip.example.com',
      webSocketPort: '8089',
      serverPath: '/ws',
    },
  },
  {
    account: {
      domain: 'sip.another.com',
      username: '2001',
      password: '2001',
      wssServer: 'sip.another.com',
      webSocketPort: '8089',
      serverPath: '/ws',
    },
  },
];

const Providers = () => (
  <StrictMode>
    <SipProvider configs={configs}>
      {configs.map((config) => (
        <App key={config.account.username} username={config.account.username} />
      ))}
    </SipProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(<Providers />);
```

---

### 2. Access SIP state and methods (per account)

```tsx
import { useSipProvider, sessionMethods } from 'react-sip-kit';

function DialPad({ username }: { username: string }) {
  const { status } = useSipProvider({ username });
  const { dialByNumber } = sessionMethods({ username });

  return (
    <>
      <p>Status ({username}): {status}</p>
      <button onClick={() => dialByNumber('audio', '1012')}>Call 1012</button>
      <button onClick={() => dialByNumber('video', '1012')}>Video Call 1012</button>
    </>
  );
}
```

---

### 3. Watch line data with `useWatchSessionData`

Each hook call is scoped to a specific `username`:

```tsx
import { useWatchSessionData } from 'react-sip-kit';

function RecordingStatus({ username, lineNumber }: { username: string; lineNumber: number }) {
  const [isRecording] = useWatchSessionData({
    username,
    lineNumber,
    name: 'recordMedia.recording',
  });

  return <p>Recording: {isRecording ? 'Yes' : 'No'}</p>;
}
```

You can also watch multiple fields:

```tsx
const [recording, media] = useWatchSessionData({
  username,
  lineNumber: 1,
  name: ['recordMedia.recording', 'recordMedia'],
});
```

---

### 4. Render media streams

Media components are also per-line:

```tsx
import { Video, Audio } from 'react-sip-kit';

<Video username="1001" type="local" lineNumber={1} />
<Video username="1001" type="remote" lineNumber={1} />
<Audio username="1001" type="local" lineNumber={1} />
<Audio username="1001" type="remote" lineNumber={1} />
```

---

## ⚙️ Configuration

Each account config supports SIP and media options:

```ts
{
  account: {
    domain: 'your.sip.domain',
    username: 'user',
    password: 'secret',
    wssServer: 'your.sip.domain',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
  features: { enableVideo: true },
  media: {
    audioInputDeviceId: 'default',
    audioOutputDeviceId: 'default',
    videoInputDeviceId: 'default',
  },
  registration: { registerExpires: 3600 },
}
```

---

## 💡 Best Practices

* Always pass `username` into hooks and components (`useSipProvider`, `useWatchSessionData`, `sessionMethods`, `<Video/>`, `<Audio/>`).
* Use `useSipProvider` for high-level state (connection status, list of lines).
* Use `useWatchSessionData` for real-time session updates (hold, mute, recording).
* Render `<Video>` and `<Audio>` only for active calls.
* Handle device permissions (microphone, camera) early.
* Reinitialize media streams if components mount after a call starts.

---

## 🧑‍💻 Full Example

Check the [`/example`](https://github.com/shervin-ghajar/react-sip-kit/tree/main/example) folder for a demo showing:

* Multiple SIP accounts in one UI
* Audio & video calls
* Hold, mute, transfer
* Call recording & screen sharing
* Local/remote media stream rendering

---

## 📄 License

MIT License

---

## 👤 Author

**Shervin Ghajar**

* GitHub: [@shervin-ghajar](https://github.com/shervin-ghajar)
* NPM: [react-sip-kit](https://www.npmjs.com/package/react-sip-kit)
* Repository: [react-sip-kit](https://github.com/shervin-ghajar/react-sip-kit)