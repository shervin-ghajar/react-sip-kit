
# react-sip-kit

A modern **React SIP.js toolkit** for building web softphones and SIP clients.  
Supports **audio/video calls**, **call recording**, **screen sharing**, and **device management**, all with a clean, extensible, TypeScript-first architecture.

---

## ✨ Features

- 📞 **Audio & Video Calls** — automatic device detection  
- 🎥 **Video Support** — manage local & remote streams seamlessly  
- 🔴 **Call Recording** — audio/video recording built-in  
- 🖥️ **Screen Sharing** — during video calls  
- 🎧 **Device Management** — select audio/video input & output devices  
- 🔄 **Multi-account & Multi-line Support** — handle multiple SIP accounts and concurrent calls  
- ⚡ **TypeScript-first** — type-safe, modular APIs  
- 🛠️ **Configurable & Extensible** — tailored to your SIP setup  

---

## 📦 Installation

```bash
npm install react-sip-kit
# or
yarn add react-sip-kit
````

---

## 🚀 Getting Started

### 1️⃣ Initialize a `SipManager`

Create a single `SipManager` instance. Add accounts dynamically as needed.

```tsx
// main.tsx
import App from './App';
import { SipManager } from 'react-sip-kit';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

export const SipConnection = new SipManager();

const Providers = () => {
  const configs = [
    {
      account: {
        domain: 'sip.example.com',
        username: '1010',
        password: 'password',
        wssServer: 'sip.example.com',
        webSocketPort: '8089',
        serverPath: '/ws',
      },
    },
  ];

  useEffect(() => {
    configs.forEach((config) => SipConnection.add(config));
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

### 2️⃣ Access SIP state & methods

Fetch **methods** and **account state** via username, lineKey, or remoteNumber:

```tsx
// App.tsx
import { SipConnection } from './main';

function App({ username }: { username: string }) {
  const { dialByNumber } = SipConnection.getSessionMethodsBy({ username });
  const { watch, status, lines } = SipConnection.getAccountBy({ username });

  const account = watch();

  return (
    <>
      <h2>Web Phone {username} — {status}</h2>
      <button onClick={() => dialByNumber('audio', '1012')}>Call 1012</button>
      <button onClick={() => dialByNumber('video', '1012')}>Video Call 1012</button>
    </>
  );
}
```

You can also use **lineKey** or **remoteNumber** instead of username:

```ts
SipConnection.getSessionMethodsBy({ lineKey: 1 });
SipConnection.getAccountBy({ remoteNumber: '1001' });
```

---

### 3️⃣ Watch session data (`useWatchSessionData`)

Fine-grained updates for a line/session:

```tsx
import { useWatchSessionData } from 'react-sip-kit';

function RecordingStatus({ lineKey }: { lineKey: number }) {
  const isRecording = useWatchSessionData({
    key: { lineKey },
    name: 'recordMedia.recording',
  });

  return <p>Recording: {isRecording ? 'Yes' : 'No'}</p>;
}
```

Watch multiple fields:

```tsx
const [localMediaStatus, isRecording] = useWatchSessionData({
  key: { lineKey: 1 },
  name: ['localMediaStreamStatus', 'recordMedia.recording'],
});
```

Works with `remoteNumber` as well:

```tsx
const isMuted = useWatchSessionData({
  key: { remoteNumber: '1001' },
  name: 'localMediaStreamStatus.muted',
});
```
---

### 4️⃣ Helper Resolver Methods

`SipManager` provides convenient **resolver methods** for quickly looking up lines, sessions, or usernames by `lineKey` or `remoteNumber`. These help avoid manually mapping usernames or tracking lines.

```ts
import { SipConnection } from './main';

// Get a specific line
const line = SipConnection.getLineBy({ lineKey: 1 });
// or by remote number
const remoteLine = SipConnection.getLineBy({ remoteNumber: '1001' });

// Get an active SIP session
const session = SipConnection.getSessionBy({ lineKey: 1 });
// or by remote number
const remoteSession = SipConnection.getSessionBy({ remoteNumber: '1001' });

// Get the username for a line
const username = SipConnection.getUsernameBy({ lineKey: 1 });
// or by remote number
const remoteUsername = SipConnection.getUsernameBy({ remoteNumber: '1001' });
```

**Notes:**

* These methods are **lookup helpers only** — they do not return reactive data.
* Combine with `getAccountBy()` or `useWatchSessionData()` for reactive state.
* Useful when you have only a `lineKey` or `remoteNumber` but need the username or session quickly.

---

### 5️⃣ Render media streams

Media components are line-bound:

```tsx
import { VideoStream, AudioStream } from 'react-sip-kit';

<VideoStream type="local" lineKey={1} />
<VideoStream type="remote" lineKey={1} />
<AudioStream type="local" lineKey={1} />
<AudioStream type="remote" lineKey={1} />
```

---

## ⚙️ Configuration

Each SIP account supports account, media, and feature settings:

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

* Use `username`, `lineKey`, or `remoteNumber` to fetch methods/state.
* `.watch()` provides reactive account data (`lines`, `status`).
* `useWatchSessionData` tracks **line-specific updates** (mute, hold, video, recording, etc.).
* Render `<VideoStream>` & `<AudioStream>` only for active calls.
* Manage mic/camera permissions upfront.
* Add accounts dynamically with `SipConnection.add(config)`.

---

## 🧑‍💻 Examples

Check [`/example`](https://github.com/shervin-ghajar/react-sip-kit/tree/main/example) for:

* Multi-account setups
* Audio & video calls
* Hold, mute, attended transfer
* Call recording & screen sharing
* Local & remote media rendering

---

## 📄 License

MIT

---

## 👤 Author

**Shervin Ghajar**

* GitHub: [@shervin-ghajar](https://github.com/shervin-ghajar)
* NPM: [react-sip-kit](https://www.npmjs.com/package/react-sip-kit)
* Repository: [react-sip-kit](https://github.com/shervin-ghajar/react-sip-kit)