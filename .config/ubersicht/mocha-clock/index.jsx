// Mocha clock - big time, date underneath. Pure JS clock, no shell needed.
export const refreshFrequency = 1000;

export const className = {
  top: '104px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: '-apple-system, "SF Pro Display", sans-serif',
  textAlign: 'center',
  userSelect: 'none',
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

export const render = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        {days[now.getDay()]} · {now.getDate()} {months[now.getMonth()]}
      </div>
    </div>
  );
};
