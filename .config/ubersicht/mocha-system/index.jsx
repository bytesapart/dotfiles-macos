// Mocha system strip - CPU / memory / uptime under the clock.
export const refreshFrequency = 5000;

export const command =
  'CORES=$(sysctl -n hw.ncpu); ' +
  'CPU=$(ps -A -o %cpu | awk -v c=$CORES \'{s+=$1} END {printf "%d", s/c}\'); ' +
  'PSZ=$(pagesize); ' +
  'FREE=$(vm_stat | awk \'/Pages free/ {gsub(/\\./, "", $3); print $3}\'); ' +
  'TOTAL_MB=$(($(sysctl -n hw.memsize) / 1048576)); ' +
  'USED_MB=$((TOTAL_MB - FREE * PSZ / 1048576)); ' +
  'PCT=$((USED_MB * 100 / TOTAL_MB)); ' +
  'UP=$(uptime | sed -E "s/.*up ([^,]+),.*/\\1/"); ' +
  'echo "$CPU|$PCT|$UP"';

export const className = {
  top: '252px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: '-apple-system, "SF Pro Text", sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '2px',
  color: '#a6adc8',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '8px 18px',
  userSelect: 'none',
};

const v = { color: '#cdd6f4', fontVariantNumeric: 'tabular-nums' };

export const render = ({ output }) => {
  const [cpu, mem, up] = String(output || '?|?|?').split('|');
  return (
    <div>
      CPU <span style={v}>{cpu}%</span>
      {'   ·   '}MEM <span style={v}>{mem}%</span>
      {'   ·   '}UP <span style={v}>{up.trim()}</span>
    </div>
  );
};
