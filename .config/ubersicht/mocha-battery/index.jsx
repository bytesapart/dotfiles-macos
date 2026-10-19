// Mocha battery - charge, source and time remaining, left column.
// Command-driven (Ubersicht only re-renders on command output).
export const refreshFrequency = 30000;

export const command = `/usr/bin/pmset -g batt | /usr/bin/python3 -c 'import sys,re; s=sys.stdin.read(); m=re.search(r"(\\d+)%",s); p=m.group(1) if m else "?"; ac="AC Power" in s; nc="not charging" in s; r=re.search(r"(\\d+:\\d+) remaining",s); print(f"{p}|{2 if ac and nc else (1 if ac else 0)}|{r.group(1) if r else chr(45)}")'`;

export const className = {
  top: '548px',
  left: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
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
  marginBottom: '4px',
};

const value = {
  color: '#cdd6f4',
  fontSize: '20px',
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
};

const sub = { fontSize: '12px', marginTop: '2px' };

export const render = ({ output }) => {
  const [pct = '?', ac = '0', remain = '-'] = String(output || '')
    .trim()
    .split('|');
  const state = ac === '2' ? 'capped' : ac === '1' ? 'charging' : 'on battery';
  return (
    <div>
      <div style={title}>BATTERY</div>
      <div style={value}>
        {ac === '0' ? '' : '⚡︎ '}{pct}%
      </div>
      <div style={sub}>
        {state}
        {remain !== '-' ? ` · ${remain} left` : ''}
      </div>
    </div>
  );
};
