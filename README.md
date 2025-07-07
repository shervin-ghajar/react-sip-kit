# react-sip-kit

A modern, modular, and type-safe SIP (Session Initiation Protocol) provider for React applications.  
Built for real-time web telephony, this library offers a clean, scalable, and fully configurable SIP core, decoupled from UI and legacy global state.

---

## Features

- 📞 **SIP Core**: Register, make, receive, and manage SIP calls (audio & video)
- 🔄 **Transfer & Conference**: Supports call transfer and conferencing
- 🎥 **Video Call Support**: Video call features with device selection
- 🔔 **Ringtone & Notifications**: Customizable audio output for ringtones and notifications
- 👥 **Buddy/Contact Management**: Manage contacts (buddies) and pass contact data across sessions
- ⚙️ **Fully Configurable**: All settings (account, features, media, UI, etc.) are passed as props—no global state or localStorage dependencies
- 🧩 **Type-Safe & Modular**: Strong TypeScript types, modular config, and easy to extend
- 🧪 **Testable**: Stateless SIP core, easy to mock and test

---

## Installation

```bash
npm install react-sip-kit
# or
yarn add react-sip-kit
```

---

## Usage

```tsx
import { SipProvider } from 'react-sip-kit';

<SipProvider
  configs={{
    account: {
      username: 'user',
      password: 'password',
      domain: 'sip.example.com',
      wssServer: 'wss.example.com',
      webSocketPort: 7443,
      serverPath: '/ws',
    },
    features: {
      enableVideo: true,
      enableRingtone: true,
    },
    // Add or override other config sections as needed
  }}
>
  {/* Your app components */}
</SipProvider>;
```

---

## Configuration

All configuration is passed via the `configs` prop.  
See [`src/configs/types.ts`](src/configs/types.ts) for the full config structure.

**Example config:**

```ts
{
  account: { ... },
  features: { ... },
  media: { ... },
  // ...other sections
}
```

You can import and extend the default config:

```ts
import { defaultSipConfigs } from 'react-sip-kit/configs';
```

---

## API

- **`<SipProvider configs={...}>`**  
  Provides SIP context and manages SIP sessions for your app.

- **Context hooks**  
  Use React context or custom hooks to access SIP state, session methods, and events.

---

## License

MIT

---

## Author

**Shervin Ghajar**  
[GitHub](https://github.com/shervin-ghajar)  
Email: ssghajar.work@gmail.com

---
