# react-sip-kit

A modern **React SIP.js toolkit** for building web softphones and SIP clients.  
Supports **audio/video calls**, **call recording**, **screen sharing**, and **device management**, all with a clean, extensible, TypeScript-first architecture.

---

## ✨ Features

- 📞 **Audio & Video Calls** — with device auto-detection  
- 🎥 **Video Support** — render local & remote streams easily  
- 🔴 **Call Recording** — audio/video capture  
- 🖥️ **Screen Sharing** — during video calls  
- 🎧 **Device Management** — choose input/output devices  
- 🔄 **Multi-Account & Multi-Line Support** — concurrent calls  
- ⚡ **TypeScript-first API** — safe and clean  
- 🛠️ **Configurable & Extensible**

---

## 📦 Installation

```bash
npm install react-sip-kit
# or
yarn add react-sip-kit
````

---

## 🚀 Quick Start

### 1️⃣ Create a SipManager Instance

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
      key: 'support-01', // Optional → If omitted, defaults to account.username
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
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
```

---

## 🔑 Resolving Accounts & Sessions

All lookups use one of the following keys:

| Key            | Purpose                                                       | Example                                             |
| -------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| `configKey`    | Refers to a specific SIP account instance                     | `{ configKey: 'support-01' }`                       |
| `lineKey`      | Refers to an **active call** / line                           | `{ lineKey: 1 }`                                    |
| `remoteNumber` | Refers to peer phone number — must be paired with `configKey` | `{ configKey: 'support-01', remoteNumber: '1001' }` |

---

### 2️⃣ Access Methods (Dial, Hold, Mute, etc.)

```tsx
// Using configKey
const { dialByNumber } = SipConnection.getSessionMethodsBy({ configKey: 'support-01' });
dialByNumber('audio', '1002');

// Using lineKey (after a call is active)
SipConnection.getSessionMethodsBy({ lineKey: 1 }).hold();
```

---

### 3️⃣ Read Account State (Reactive)

```tsx
const { watch, status } = SipConnection.getAccountBy({ configKey: 'support-01' });
const account = watch(); // contains lines, registration, media devices, etc.
```

---

### 4️⃣ Track Session State (`useWatchSessionData`)

```tsx
import { useWatchSessionData } from 'react-sip-kit';

const isRecording = useWatchSessionData({
  key: { lineKey: 1 },
  name: 'recordMedia.recording',
});

const [mediaStatus, isMuted] = useWatchSessionData({
  key: { configKey: 'support-01', remoteNumber: '1002' },
  name: ['localMediaStreamStatus', 'localMediaStreamStatus.muted'],
});
```

---

### 5️⃣ Resolver Helper Methods

```ts
SipConnection.getLineBy({ lineKey: 1 });
SipConnection.getLineBy({ configKey: 'support-01', remoteNumber: '1002' });

SipConnection.getSessionBy({ lineKey: 1 });
SipConnection.getUsernameBy({ configKey: 'support-01', remoteNumber: '1002' });
```

---

### 6️⃣ Render Media Streams

```tsx
import { VideoStream, AudioStream } from 'react-sip-kit';

<VideoStream type="local" lineKey={1} />
<VideoStream type="remote" lineKey={1} />
<AudioStream type="local" lineKey={1} />
<AudioStream type="remote" lineKey={1} />
```

---

### 🧠 Managing Config Keys & Dynamic Rendering

```tsx
const configs = SipConnection.useWatchConfigs();
// → [{ key: 'support-01', account: {...} }, { key: 'sales-02', ... }]
```

✅ **When to use `useWatchConfigs()`**

| Scenario                                               | Should you use it?      | Reason                                                                          |
| ------------------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------- |
| Static single account                                  | ❌ Not required          | `configKey` is constant                                                         |
| You manually track configs in your own state           | ❌ Optional              | You already control the list                                                    |
| **Rendering UI for *each* config account dynamically** | ✅ **Yes — recommended** | Ensures you always use the correct `configKey`, even if keys are auto-generated |
| **Configs can be added or removed at runtime**         | ✅ **Always**            | Prevents mismatched lookups or stale references                                 |

> **✔ Best Practice:**
> Always call `useWatchConfigs()` when rendering **lists of lines or accounts**, to ensure that each component receives the correct and *current* `configKey`.

---

Example (Rendering a phone UI for *every* config dynamically):

```tsx
const AccountsUI = () => {
  const configs = SipConnection.useWatchConfigs();

  return (
    <>
      {configs.map((config) => (
        <Lines key={config.key} configKey={config.key} />
      ))}
    </>
  );
};
```

---

## ⚙️ Configuration Schema

```ts
{
  key?: string; // optional → falls back to account.username
  account: {
    domain: 'your.sip.domain',
    username: 'user',
    password: 'secret',
    wssServer: 'your.sip.domain',
    webSocketPort: '8089',
    serverPath: '/ws',
  },
  features?: { enableVideo?: boolean },
  media?: {
    audioInputDeviceId?: string;
    audioOutputDeviceId?: string;
    videoInputDeviceId?: string;
  },
  registration?: { registerExpires?: number },
}
```

---

## ✅ Best Practices

| Task                   | Recommended Approach              |
| ---------------------- | --------------------------------- |
| Reference active call  | Use `lineKey` when available      |
| Reference account      | Use `configKey`                   |
| Lookup by phone number | Use `{ configKey, remoteNumber }` |
| Track config keys      | Use `useWatchConfigs()`           |
| Watch configs state    | `useWatchConfigs()`               |
| Watch account state    | `getAccountBy().watch()`          |
| Watch session props    | `useWatchSessionData()`           |

---

## 📂 Examples

Check [`/example`](https://github.com/shervin-ghajar/react-sip-kit/tree/main/example) for:

* Multi-account softphone
* Audio/video calls
* Hold / mute / attended transfer
* Call recording & screen sharing
* Stream rendering

---

## 📄 License

MIT

---

## 👤 Author

**Shervin Ghajar**

* GitHub: [https://github.com/shervin-ghajar](https://github.com/shervin-ghajar)
* NPM: [https://www.npmjs.com/package/react-sip-kit](https://www.npmjs.com/package/react-sip-kit)
* Repository: [https://github.com/shervin-ghajar/react-sip-kit](https://github.com/shervin-ghajar/react-sip-kit)