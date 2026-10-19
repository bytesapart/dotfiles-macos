// Mocha forex - USD/INR and GBP/INR via Frankfurter (ECB rates, no key).
// Keeps the last quote on screen when offline.
export const refreshFrequency = 600000;

export const command =
  `/usr/bin/curl -sL --max-time 10 'https://api.frankfurter.app/latest?from=USD&to=INR,GBP' | ` +
  `/usr/bin/python3 -c 'import json,sys; d=json.load(sys.stdin); r=d["rates"]; ` +
  `u=float(r["INR"]); g=u/float(r["GBP"]); print(f"{u:.2f}|{g:.2f}")'`;

export const className = {
  bottom: '20px',
  right: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '12px',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
  minWidth: '190px',
};

const title = {
  color: '#cba6f7',
  fontWeight: 700,
  fontSize: '11px',
  letterSpacing: '2px',
  marginBottom: '6px',
};

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  lineHeight: 1.8,
  fontVariantNumeric: 'tabular-nums',
};

let last = null;

export const render = ({ output }) => {
  const [u, g] = String(output || '')
    .trim()
    .split('|');
  if (u && g) last = { u, g };
  return (
    <div>
      <div style={title}>FOREX · INR</div>
      {last ? (
        <div>
          <div style={row}>
            <span>USD → INR</span>
            <span style={{ color: '#cdd6f4' }}>₹{last.u}</span>
          </div>
          <div style={row}>
            <span>GBP → INR</span>
            <span style={{ color: '#cdd6f4' }}>₹{last.g}</span>
          </div>
        </div>
      ) : (
        <div>offline</div>
      )}
    </div>
  );
};
