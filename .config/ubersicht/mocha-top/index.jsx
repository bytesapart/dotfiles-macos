// Mocha top - hottest processes, right side under the calendar.
// Command-driven (Ubersicht only re-renders on command output).
export const refreshFrequency = 3000;

export const command =
  "ps -Ao %cpu,args -r | head -7 | tail -6 | /usr/bin/python3 -c 'import sys,os; " +
  "[print(f\"{os.path.basename(l.split(None,1)[1].split()[0])}|{float(l.split()[0]):.1f}\") " +
  "for l in sys.stdin if l.split()]'";

export const className = {
  top: '360px',
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

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  lineHeight: 1.7,
  fontVariantNumeric: 'tabular-nums',
};

const pct = { color: '#cdd6f4' };

export const render = ({ output }) => {
  const rows = String(output || '')
    .trim()
    .split('\n')
    .filter(Boolean);
  return (
    <div>
      <div style={title}>TOP</div>
      {rows.map((line) => {
        const [name, cpu] = line.split('|');
        return (
          <div style={row} key={name + cpu}>
            <span>{String(name).slice(0, 20)}</span>
            <span style={pct}>{cpu}%</span>
          </div>
        );
      })}
    </div>
  );
};
