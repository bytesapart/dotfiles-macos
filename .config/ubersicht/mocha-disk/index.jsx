// Mocha disk - root volume usage with bar, right column under TOP.
// Command-driven (Ubersicht only re-renders on command output).
export const refreshFrequency = 60000;

// NOTE: `df /` reports the sealed system snapshot (~12 GB), not the real
// disk. Use the APFS container totals, which match Finder/Settings.
export const command = `/usr/sbin/diskutil info / | /usr/bin/python3 -c 'import sys,re; s=sys.stdin.read(); t=re.search(r"Container Total Space:.*\\((\\d+) Bytes",s); f=re.search(r"Container Free Space:.*\\((\\d+) Bytes",s); t=int(t.group(1)) if t else 0; f=int(f.group(1)) if f else 0; u=t-f; print(f"{u*100//t if t else 0}|{u//1073741824}|{t//1073741824}")'`;

export const className = {
  top: '584px',
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
