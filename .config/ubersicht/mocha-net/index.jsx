// Mocha net - live up/down throughput with mini history bars.
// Previous counters persist in module scope; each tick diffs against them.
export const refreshFrequency = 2000;

export const command =
  'IF=$(route -n get default 2>/dev/null | awk \'/interface/ {print $2}\'); ' +
  'netstat -ibI "$IF" | awk \'NR==2 {print $7"|"$10}\'';

export const className = {
  top: '392px',
  left: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '12px',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
  minWidth: '196px',
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

const N = 24;
const BW = 6;
let prev = null;
let downHist = [];
let upHist = [];

function fmt(bps) {
  if (bps >= 1048576) return `${(bps / 1048576).toFixed(1)} MB/s`;
  if (bps >= 1024) return `${(bps / 1024).toFixed(0)} KB/s`;
  return `${bps.toFixed(0)} B/s`;
}

function bars(hist, max, color) {
  const W = N * (BW + 2);
  const H = 26;
  return (
    <svg width={W} height={H}>
      {hist.map((v, i) => {
        const h = Math.max(2, (v / max) * H);
        return (
          <rect
            key={i}
            x={i * (BW + 2)}
            y={H - h}
            width={BW}
            height={h}
            rx="1.5"
            fill={color}
            opacity={0.35 + (0.65 * i) / N}
          />
        );
      })}
    </svg>
  );
}

export const render = ({ output }) => {
  const [inBytes, outBytes] = String(output || '')
    .trim()
    .split('|')
    .map(Number);
  const now = Date.now();
  let down = 0;
  let up = 0;
  if (prev && Number.isFinite(inBytes) && Number.isFinite(outBytes)) {
    const dt = Math.max(1, now - prev.t) / 1000;
    down = Math.max(0, (inBytes - prev.in) / dt);
    up = Math.max(0, (outBytes - prev.out) / dt);
  }
  prev = { in: inBytes, out: outBytes, t: now };
  downHist = [...downHist.slice(-(N - 1)), down];
  upHist = [...upHist.slice(-(N - 1)), up];
  const max = Math.max(1024, ...downHist, ...upHist);
  return (
    <div>
      <div style={title}>NET</div>
      <div style={row}>
        <span>↓ down</span>
        <span style={{ color: '#cdd6f4' }}>{fmt(down)}</span>
      </div>
      {bars(downHist, max, '#89b4fa')}
      <div style={row}>
        <span>↑ up</span>
        <span style={{ color: '#cdd6f4' }}>{fmt(up)}</span>
      </div>
      {bars(upHist, max, '#a6e3a1')}
    </div>
  );
};
