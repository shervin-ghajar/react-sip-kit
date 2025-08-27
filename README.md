Here’s a polished rewrite of your README that makes it clearer, more professional, and developer-friendly while keeping it concise and engaging:

---

# react-sip-kit

A modern **React SIP.js toolkit** for building web-based softphones and SIP clients.
Supports **audio/video calls**, **recording**, **screen sharing**, and **device management** — all with a clean, extensible architecture.

---

* **Author:** [Shervin Ghajar](https://github.com/shervin-ghajar)
* **License:** MIT
* **Repository:** [GitHub](https://github.com/shervin-ghajar/web-phone)
* **NPM:** [react-sip-kit](https://www.npmjs.com/package/react-sip-kit)

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

## 🚀 Getting Started

### Installation

```bash
npm install react-sip-kit
# or
yarn add react-sip-kit
```

---

## ⚡ Usage

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

### 2. Access SIP state and methods

```tsx
import { useSipProvider, useSessionMethods } from 'react-sip-kit';

const { lines, status } = useSipProvider();
const { dialByNumber } = useSessionMethods();

<button onClick={() => dialByNumber('audio', '1012')}>Call 1012</button>
```

---

### 3. Render media streams

Use the built-in `<Video />` and `<Audio />` components:

```tsx
import { Video, Audio } from 'react-sip-kit';

<Video type="local" lineNumber={line.lineNumber} />
<Video type="remote" lineNumber={line.lineNumber} />
<Audio type="local" lineNumber={line.lineNumber} />
<Audio type="remote" lineNumber={line.lineNumber} />
```

---

### 4. Call recording & screen sharing

```ts
recordSession(lineNumber);
toggleShareScreen(lineNumber);
```

---

## ⚙️ Configuration

All SIP and media settings can be customized via the `configs` prop.
See [types.ts](https://github.com/shervin-ghajar/web-phone/blob/main/src/configs/types.ts) for full options.

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
* Gracefully handle device permissions and selection.
* Reinitialize media streams with `initiateRemoteMediaStreams` or `initiateLocalMediaStreams` if `<video>`/`<audio>` is rendered after call start.
* Prefer TypeScript for better DX and safety.

---

## 🛠 Development

* Bundled with [Vite](https://vitejs.dev/)
* Linting via ESLint + React/TypeScript rules
* Modular architecture for easy extension

---

## 📖 Example

Check the [example app](https://github.com/shervin-ghajar/web-phone/blob/main/src/App.tsx) for:

* Multi-line handling
* Call actions
* Media rendering

---

**👉 Ready to build your own web phone?**
Install, configure, and start calling with **react-sip-kit**.

---

Would you like me to also create a **badges section** at the top (e.g., npm version, build status, license) to make it look more like a polished open-source project?
