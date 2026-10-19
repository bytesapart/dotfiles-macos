// Mocha focus - pomodoro countdown, right side under disk. Ticks every
// second while running; click toggles pause. Starts running so the desktop
// is alive even if clicks never arrive.
export const refreshFrequency = 1000;

export const command = '/bin/date +%s';

export const className = {
  top: '700px',
  right: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
  minWidth: '190px',
  cursor: 'pointer',
};

const title = {
  color: '#cba6f7',
  fontWeight: 700,
  fontSize: '11px',
  letterSpacing: '2px',
  marginBottom: '4px',
};

const clock = {
  color: '#cdd6f4',
  fontSize: '24px',
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
};

const trackBg = {
  height: '4px',
  borderRadius: '2px',
  background: 'rgba(69, 71, 90, 0.8)',
  marginTop: '8px',
};

const SESSION = 25 * 60;
let remaining = SESSION;
let running = true;
let last = Date.now();

export const render = () => {
  const now = Date.now();
  if (running) {
    remaining -= (now - last) / 1000;
    if (remaining <= 0) {
      remaining = SESSION;
      running = false;
    }
  }
  last = now;
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(Math.floor(remaining % 60)).padStart(2, '0');
  return (
    <div
      onClick={() => {
        running = !running;
        last = Date.now();
      }}
    >
      <div style={title}>{running ? 'FOCUS' : 'PAUSED'}</div>
      <div style={clock}>
        {mm}:{ss}
      </div>
      <div style={trackBg}>
        <div
          style={{
            height: '100%',
            width: `${(100 * (SESSION - remaining)) / SESSION}%`,
            borderRadius: '2px',
            background: running ? '#a6e3a1' : '#cba6f7',
          }}
        />
      </div>
    </div>
  );
};
