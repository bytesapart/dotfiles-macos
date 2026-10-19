// Mocha clock - big time, date underneath.
// NOTE: Ubersicht only re-renders when `command` produces output, so the
// time comes from `date` (refreshFrequency) instead of `new Date()` in
// render, which would paint once and freeze.
export const refreshFrequency = 1000;

export const command = "date '+%H|%M|%S|%A|%-d|%b'";

export const className = {
  top: '96px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: '-apple-system, "SF Pro Display", sans-serif',
  textAlign: 'center',
  userSelect: 'none',
  color: '#cdd6f4',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '14px',
  padding: '12px 26px',
};

const time = {
  color: '#cdd6f4',
  fontSize: '64px',
  fontWeight: 200,
  letterSpacing: '2px',
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

const date = {
  color: '#a6adc8',
  fontSize: '15px',
  fontWeight: 500,
  letterSpacing: '4px',
  textTransform: 'uppercase',
  marginTop: '10px',
};

const dot = { color: '#cba6f7' };

export const render = ({ output }) => {
  const [hh = '--', mm = '--', ss = '--', day = '', dateNum = '', mon = ''] =
    String(output || '').trim().split('|');
  return (
    <div>
      <div style={time}>
        {hh}
        <span style={dot}>:</span>
        {mm}
        <span style={dot}>:</span>
        {ss}
      </div>
      <div style={date}>
        {day} · {dateNum} {mon}
      </div>
    </div>
  );
};
