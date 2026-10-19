// Mocha memgraph - memory-pressure history area chart, beside the CPU graph.
// History lives in module scope (persists across refreshes); the command
// supplies one fresh sample per tick (Ubersicht re-renders on output).
export const refreshFrequency = 2000;

export const command =
  'PSZ=$(/usr/bin/pagesize); ' +
  'TOTAL_MB=$(($(sysctl -n hw.memsize) / 1048576)); ' +
  'FREE=$(vm_stat | awk \'/Pages free/ {gsub(/\\./, "", $3); print $3}\'); ' +
  'INACT=$(vm_stat | awk \'/Pages inactive/ {gsub(/\\./, "", $3); print $3}\'); ' +
  'USED_MB=$((TOTAL_MB - (FREE + INACT) * PSZ / 1048576)); ' +
  'echo $((USED_MB * 100 / TOTAL_MB))';

export const className = {
  top: '200px',
  left: '272px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
};

const title = {
  color: '#89b4fa',
  fontWeight: 700,
  fontSize: '11px',
  letterSpacing: '2px',
  marginBottom: '4px',
};

const value = {
  color: '#cdd6f4',
  fontSize: '20px',
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
};

const N = 48;
const W = 200;
const H = 52;
let history = [];

export const render = ({ output }) => {
  const sample = Math.max(0, Math.min(100, parseInt(output, 10) || 0));
  history = [...history.slice(-(N - 1)), sample];
  const step = W / (N - 1);
  const pts = history
    .map((v, i) => `${(i * step).toFixed(1)},${(H - (v / 100) * H).toFixed(1)}`)
    .join(' ');
  const area = `0,${H} ${pts} ${W},${H}`;
  return (
    <div>
      <div style={title}>MEM</div>
      <div style={value}>{sample}%</div>
      <svg width={W} height={H}>
        <polygon points={area} fill="rgba(137, 180, 250, 0.25)" />
        <polyline
          points={pts}
          fill="none"
          stroke="#89b4fa"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
