// Mocha spaces - yabai space overview, top-left. Click a pill to focus it.
// Command-driven (Ubersicht only re-renders on command output).
import { run } from 'uebersicht';

export const refreshFrequency = 2000;

export const command =
  '/opt/homebrew/bin/yabai -m query --spaces | /usr/bin/jq -r \'.[] | "\\(.index)|\\(if ."has-focus" then 1 else 0 end)|\\(.windows | length)"\'';

export const className = {
  top: '104px',
  left: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  userSelect: 'none',
};

const pill = (focused) => ({
  display: 'inline-block',
  minWidth: '34px',
  textAlign: 'center',
  padding: '6px 8px',
  marginRight: '6px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  color: focused ? '#11111b' : '#a6adc8',
  background: focused ? '#cba6f7' : 'rgba(17, 17, 27, 0.55)',
  border: focused
    ? '1px solid #cba6f7'
    : '1px solid rgba(69, 71, 90, 0.8)',
});

const sub = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 500,
  opacity: 0.75,
};

export const render = ({ output }) => {
  const rows = String(output || '')
    .trim()
    .split('\n')
    .filter(Boolean);
  return (
    <div>
      {rows.map((row) => {
        const [index, focused, wins] = row.split('|');
        const isFocused = focused === '1';
        return (
          <span
            key={index}
            style={pill(isFocused)}
            onClick={() => run(`yabai -m space --focus ${index}`)}
          >
            {index}
            <span style={sub}>{wins}w</span>
          </span>
        );
      })}
    </div>
  );
};
