// Mocha crypto - BTC price + 24h change via Kraken public API.
// Keeps the last quote on screen when offline.
export const refreshFrequency = 60000;

export const command =
  `/usr/bin/curl -s --max-time 8 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD' | ` +
  `/usr/bin/python3 -c 'import json,sys; d=json.load(sys.stdin); q=d["result"]["XXBTZUSD"]; ` +
  `last=float(q["c"][0]); o=float(q["o"]); print(f"{last:.0f}|{(last-o)*100/o:.1f}")'`;

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
  marginBottom: '4px',
};

const price = {
  color: '#cdd6f4',
  fontSize: '20px',
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
};

let last = null;

export const render = ({ output }) => {
  const [p, ch] = String(output || '')
    .trim()
    .split('|');
  if (p && ch) last = { p, ch };
  const change = last ? parseFloat(last.ch) : 0;
  const color = change >= 0 ? '#a6e3a1' : '#f38ba8';
  return (
    <div>
      <div style={title}>BTC · USD</div>
      {last ? (
        <div>
          <div style={price}>${Number(last.p).toLocaleString('en-US')}</div>
          <div style={{ color, fontVariantNumeric: 'tabular-nums' }}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
          </div>
        </div>
      ) : (
        <div>offline</div>
      )}
    </div>
  );
};
