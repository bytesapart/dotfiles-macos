// Mocha graph - live CPU history area chart, left side under spaces.
// History lives in module scope (persists across refreshes); the command
// supplies one fresh sample per tick (Ubersicht re-renders on output).
export const refreshFrequency = 2000;

export const command =
  'CORES=$(sysctl -n hw.ncpu); ps -A -o %cpu | awk -v c=$CORES \'{s+=$1} END {printf "%.0f", s/c}\'';

export const className = {
  top: '200px',
  left: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '1px solid rgba(69, 71, 90, 0.8)',
  borderRadius: '10px',
  padding: '10px 14px',
};

const title = {
  color: '#cba6f7',
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
      <div style={title}>CPU</div>
      <div style={value}>{sample}%</div>
      <svg width={W} height={H}>
        <polygon points={area} fill="rgba(203, 166, 247, 0.25)" />
        <polyline
          points={pts}
          fill="none"
          stroke="#cba6f7"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
