# react-sip-kit

A modern **React SIP.js toolkit** for building web-based softphones and SIP clients.
Supports **audio/video calls**, **recording**, **screen sharing**, and **device management** — all with a clean, extensible architecture.

---

## ✨ Features

* 📞 **Audio & Video Calls** — with automatic device detection
* 🎥 **Video support** — manage local & remote streams seamlessly
* 🔴 **Call Recording** — audio and video recording out of the box
* 🖥️ **Screen Sharing** — during video calls
* 🎧 **Device Management** — select audio/video input & output devices
* 🔄 **Multi-line Support** — handle multiple concurrent calls
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
import { SipProvider } from 'react-sip-kit';

<SipProvider
  configs={{
    account: {
      domain: 'your.sip.domain',
      username: 'your-username',
      password: 'your-password',
      wssServer: 'your.sip.domain',
      webSocketPort: '8089',
      serverPath: '/ws',
    },
  }}
>
  <App />
</SipProvider>
```

---

### 2. Make calls with hooks

```tsx
import { useSipProvider, useSessionMethods } from 'react-sip-kit';

function DialPad() {
  const { status } = useSipProvider();
  const { dialByNumber } = useSessionMethods();

  return (
    <>
      <p>Status: {status}</p>
      <button onClick={() => dialByNumber('audio', '1012')}>Call 1012</button>
      <button onClick={() => dialByNumber('video', '1012')}>Video Call 1012</button>
    </>
  );
}
```

---

### 3. Render media streams

```tsx
import { VideoStream, AudioStream } from 'react-sip-kit';

<VideoStream type="local" lineNumber={1} />
<VideoStream type="remote" lineNumber={1} />
<AudioStream type="local" lineNumber={1} />
<AudioStream type="remote" lineNumber={1} />
```

---

## ⚙️ Configuration

All SIP and media settings can be customized via the `configs` prop.
See [types.ts](https://github.com/shervin-ghajar/react-sip-kit/blob/main/src/configs/types.ts) for the full options.

```ts
{
  account: { ... },
  features: { enableVideo: true },
  media: { audioInputDeviceId: 'default' },
  registration: { registerExpires: 3600 },
}
```

---

## 💡 Best Practices

* Use hooks (`useSipProvider`, `useSessionMethods`) for SIP state & actions.
* Render media components only for active calls.
* Handle device permissions and selection gracefully.
* Reinitialize streams with `initiateRemoteMediaStreams` or `initiateLocalMediaStreams` if `<video>`/`<audio>` is rendered after the call starts.
* Prefer TypeScript for better DX and safety.

---

## 🧑‍💻 Full Example

A full working demo (with call controls, transfer, hold, recording, etc.) is available in the
[`/example`](https://github.com/shervin-ghajar/react-sip-kit/tree/main/example) folder of this repo.

This example demonstrates:

* Multi-line SIP handling
* Answering/rejecting calls
* Call transfer, hold, mute
* Recording and screen sharing
* Local/remote audio & video streams

---

## 📄 License

MIT License

---

## 👤 Author

**Shervin Ghajar**

* GitHub: [@shervin-ghajar](https://github.com/shervin-ghajar)
* NPM: [react-sip-kit](https://www.npmjs.com/package/react-sip-kit)
* Repository: [react-sip-kit](https://github.com/shervin-ghajar/react-sip-kit)

