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

### 1. Initialize a global `SipManager`

Instead of wrapping your app with a provider, you now create a single `SipManager` instance and add accounts dynamically.

```tsx
// main.ts
import App from './App';
import { SipManager } from 'react-sip-kit';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
------------------------------------------------------------
export const SipConnection = new SipManager(); // Initilizing SipManager
------------------------------------------------------------
const Providers = () => {
  const configs = [{
    account: {
      domain: 'sip.example.com',
      username: '1010',
      password: 'password',
      wssServer: 'sip.example.com',
      webSocketPort: '8089',
      serverPath: '/ws',
    },
    // ...(other configs)
  }]

  useEffect(() => {
    // Add new configs dynamically
    configs.forEach((config) => {
      SipConnection.add(config);
    });
  }, [configs]);

  return (
    <StrictMode>
      {configs.map((config) => (
        <App key={config.account.username} username={config.account.username} />
      ))}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
```

---

### 2. Access SIP state and methods (per account)

Each account is keyed by its **username**.
You can fetch **methods** and **watch state** like this:

```tsx
// App.tsx
import { SipConnection } from './main';

function App({ username }: { username: string }) {
  const { dialByNumber } = SipConnection.methods(username);
  const { watch } = SipConnection.get(username);
  const { lines, status } = watch();

  return (
    <>
      <h2>
        Web Phone {username} — {status}
      </h2>
      <button onClick={() => dialByNumber('audio', '1012')}>Call 1012</button>
      <button onClick={() => dialByNumber('video', '1012')}>Video Call 1012</button>
    </>
  );
}
```

---

### 3. Watch line/session data with `useWatchSessionData`

For fine-grained updates, subscribe to session fields:

```tsx
import { useWatchSessionData } from 'react-sip-kit';

function RecordingStatus({ lineNumber }: { lineNumber: number }) {
  const isRecording = useWatchSessionData({
    lineNumber,
    name: 'recordMedia.recording',
  });

  return <p>Recording: {isRecording ? 'Yes' : 'No'}</p>;
}
```

You can also watch multiple fields:

```tsx
const [localMediaStreamStatus, isRecording] = useWatchSessionData({
  lineNumber: 1,
  name: ['localMediaStreamStatus', 'recordMedia.recording'],
});
```

---

### 4. Render media streams

Media components (`<Video/>` & `<Audio/>`) are bound per line:

```tsx
import { VideoStream, AudioStream } from 'react-sip-kit';

<VideoStream type="local" lineNumber={1} />
<VideoStream type="remote" lineNumber={1} />
<AudioStream type="local" lineNumber={1} />
<AudioStream type="remote" lineNumber={1} />
```

---

## ⚙️ Configuration

Each account supports SIP and media options:

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

* Always pass the `username` when calling `SipConnection.methods(username)` or `SipConnection.get(username)`.
* Use `.watch()` for reactive state (`lines`, `status`).
* Use `useWatchSessionData` for **line-specific** updates (mute, hold, video state, recording, etc.).
* Render `<VideoStream>` and `<AudioStream>` **only for active calls**.
* Manage device permissions (mic/camera) upfront.
* If adding accounts dynamically, call `SipConnection.add(config)` for each.

---

## 🧑‍💻 Full Example

See the [`/example`](https://github.com/shervin-ghajar/react-sip-kit/tree/main/example) folder for:

* Multiple SIP accounts in one UI
* Audio & video calls
* Hold, mute, attended transfer
* Call recording & screen sharing
* Local & remote media rendering

---

## 📄 License

MIT License

---

## 👤 Author

**Shervin Ghajar**

* GitHub: [@shervin-ghajar](https://github.com/shervin-ghajar)
* NPM: [react-sip-kit](https://www.npmjs.com/package/react-sip-kit)
* Repository: [react-sip-kit](https://github.com/shervin-ghajar/react-sip-kit)