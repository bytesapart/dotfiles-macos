// Mocha disk - root volume usage with bar, right column under TOP.
// Command-driven (Ubersicht only re-renders on command output).
export const refreshFrequency = 60000;

export const command = `/bin/df -g / | awk 'NR==2 {gsub(/%/, "", $5); print $5"|"$3"|"$2}'`;

export const className = {
  top: '584px',
  right: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '12px',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '1px solid rgba(69, 71, 90, 0.8)',
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

const trackBg = {
  height: '6px',
  borderRadius: '3px',
  background: 'rgba(69, 71, 90, 0.8)',
  marginTop: '8px',
};

export const render = ({ output }) => {
  const [pct = '0', used = '?', total = '?'] = String(output || '')
    .trim()
    .split('|');
  const color =
    +pct >= 90 ? '#f38ba8' : +pct >= 75 ? '#fab387' : '#a6e3a1';
  return (
    <div>
      <div style={title}>DISK</div>
      <div style={{ color: '#cdd6f4', fontVariantNumeric: 'tabular-nums' }}>
        {used} / {total} GB
      </div>
      <div style={trackBg}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, +pct)}%`,
            borderRadius: '3px',
            background: color,
          }}
        />
      </div>
    </div>
  );
};
