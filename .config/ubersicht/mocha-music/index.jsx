// Mocha music - now-playing card with live progress, bottom-left.
// Renders nothing when no media is loaded.
import { run } from 'uebersicht';

export const refreshFrequency = 2000;

export const command =
  "/opt/homebrew/bin/nowplaying-cli get title artist playbackRate duration elapsed 2>/dev/null | /usr/bin/python3 -c 'import sys; " +
  "l=[x.strip() for x in sys.stdin.read().split(chr(10))]; " +
  "l+=(5-len(l))*[chr(39)+chr(39)]; " +
  "t=l[0].replace(chr(124),chr(47)); a=l[1].replace(chr(124),chr(47)); " +
  "print(f\"{t}|{a}|{l[2]}|{l[3]}|{l[4]}\")'";

export const className = {
  bottom: '20px',
  left: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '12px',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '250px',
  cursor: 'pointer',
};

const track = {
  color: '#cdd6f4',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const artist = {
  fontSize: '11px',
  marginTop: '2px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const trackBg = {
  height: '4px',
  borderRadius: '2px',
  background: 'rgba(69, 71, 90, 0.8)',
  marginTop: '8px',
};

export const render = ({ output }) => {
  const [title = '', artistName = '', rate = '0', dur = '', el = ''] = String(
    output || ''
  )
    .trim()
    .split('|');
  if (!title) return <div />;
  const playing = rate === '1';
  const pct =
    parseFloat(dur) > 0 ? Math.min(100, (parseFloat(el) / parseFloat(dur)) * 100) : 0;
  return (
    <div onClick={() => run('nowplaying-cli toggle')}>
      <div style={track}>
        {playing ? '▶︎ ' : '⏸︎ '}
        {title.slice(0, 32)}
      </div>
      <div style={artist}>{artistName.slice(0, 32)}</div>
      <div style={trackBg}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '2px',
            background: '#cba6f7',
          }}
        />
      </div>
    </div>
  );
};
