// Mocha wifi - SSID and local IP, left column under battery.
// Command-driven (Ubersicht only re-renders on command output).
export const refreshFrequency = 15000;

export const command =
  `IF=$(route -n get default 2>/dev/null | awk '/interface/ {print $2}'); ` +
  `RAW=$(/usr/sbin/networksetup -getairportnetwork "$IF" 2>/dev/null); ` +
  `case "$RAW" in *"not associated"*|*"Error"*) SSID="wired ($IF)";; *) SSID=$(echo "$RAW" | sed 's/^Current Wi-Fi Network: //');; esac; ` +
  `IP=$(/usr/sbin/ipconfig getifaddr "$IF" 2>/dev/null); ` +
  `echo "\${SSID:-offline}|\${IP:-—}"`;

export const className = {
  top: '664px',
  left: '20px',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '12px',
  userSelect: 'none',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '1px solid rgba(69, 71, 90, 0.8)',
  borderRadius: '10px',
  padding: '10px 14px',
  minWidth: '196px',
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
  lineHeight: 1.8,
  fontVariantNumeric: 'tabular-nums',
};

export const render = ({ output }) => {
  const [ssid = 'offline', ip = '—'] = String(output || '')
    .trim()
    .split('|');
  return (
    <div>
      <div style={title}>WIFI</div>
      <div style={row}>
        <span>network</span>
        <span style={{ color: '#cdd6f4' }}>{ssid.slice(0, 20)}</span>
      </div>
      <div style={row}>
        <span>address</span>
        <span style={{ color: '#cdd6f4' }}>{ip}</span>
      </div>
    </div>
  );
};
