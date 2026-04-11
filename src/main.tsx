import App, { ConfigForm } from './App.tsx';
import { SipManager } from './manager.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* -------------------------------------------------------------------------- */
export const SipConnection = new SipManager({ enableBroadcast: true });
/* -------------------------------------------------------------------------- */

const Providers = () => {
  const configs = SipConnection.useWatchConfigs();
  console.log({ configs });
  return (
    <StrictMode>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <ConfigForm />
        {configs.map((config) => {
          return <App key={config.key} configKey={config.key} />;
        })}
      </div>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Providers />);
