// Mocha load - 1/5/15-minute load averages, bottom-center.
// Command-driven (Ubersicht only re-renders on command output).
export const refreshFrequency = 5000;

export const command = `/usr/sbin/sysctl -n vm.loadavg | /usr/bin/python3 -c 'import sys,re; m=re.search(r"\\{ ([\\d.]+) ([\\d.]+) ([\\d.]+)",sys.stdin.read()); print(f"{m.group(1)}|{m.group(2)}|{m.group(3)}" if m else "0|0|0")'`;

export const className = {
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '12px',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
};

const title = {
  color: '#cba6f7',
  fontWeight: 700,
  fontSize: '11px',
  letterSpacing: '2px',
  marginBottom: '6px',
  textAlign: 'center',
};

const row = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  lineHeight: 1.9,
  fontVariantNumeric: 'tabular-nums',
};

const CORES = 10;

export const render = ({ output }) => {
  const vals = String(output || '')
    .trim()
    .split('|')
    .map(Number);
  const labels = ['1m', '5m', '15m'];
  return (
    <div>
      <div style={title}>LOAD</div>
      {vals.map((v, i) => (
        <div style={row} key={labels[i]}>
          <span style={{ width: '24px' }}>{labels[i]}</span>
          <span style={{ color: '#cdd6f4', width: '36px' }}>
            {Number.isFinite(v) ? v.toFixed(1) : '?'}
          </span>
          <svg width="80" height="8">
            <rect
              x="0"
              y="0"
              width={Math.min(80, (v / CORES) * 80)}
              height="8"
              rx="4"
              fill={v > CORES ? '#f38ba8' : '#89b4fa'}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
