import { SipConnection } from '.';
import { Line } from './Line';

/* -------------------------------------------------------------------------- */
/*                                MAIN APP                                    */
/* -------------------------------------------------------------------------- */

function App({ configKey }: { configKey: string }) {
  const { lines, status } = SipConnection.getAccountBy({ configKey }).watch(); // watch (lines, status) changes
  const { dialByNumber } = SipConnection.getSessionMethodsBy({ configKey }); // Method to dial numbers

  // Renders all active SIP lines
  const renderLines = () => {
    return lines.map((line) => <Line key={line.lineKey} lineKey={line.lineKey} />);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Header */}
      <h2>
        Web Phone — {configKey} ({status})
      </h2>

      {/* Active calls container */}
      <div
        style={{
          backgroundColor: 'lightgray',
          border: '1px solid black',
          minHeight: 300,
          width: '80%',
        }}
      >
        <h4>Call / Chat Section</h4>
        {renderLines()}
      </div>

      {/* Call action buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          border: '1px solid lightGray',
          padding: 24,
        }}
      >
        <h4>Call Actions</h4>

        {/* Audio calls */}
        <button onClick={() => dialByNumber('audio', '1012')}>Call 1012</button>
        <button onClick={() => dialByNumber('audio', '1010')}>Call 1010</button>

        {/* Video calls */}
        <button onClick={() => dialByNumber('video', '1012')}>Video Call 1012</button>
        <button onClick={() => dialByNumber('video', '1010')}>Video Call 1010</button>

        {/* Conference rooms */}
        <button onClick={() => dialByNumber('audio', '700')}>Audio Conf Room 700</button>
        <button onClick={() => dialByNumber('video', '700')}>Video Conf Room 700</button>
      </div>
    </div>
  );
}

export default App;
