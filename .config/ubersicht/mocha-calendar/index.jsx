// Mocha calendar - month grid, top-right. Click opens Calendar.app.
// Command-driven (Ubersicht only re-renders on command output).
import { run } from 'uebersicht';

export const refreshFrequency = 60000;

export const command = "cal";

export const className = {
  top: '104px',
  right: '20px',
  fontFamily: '"SF Mono", Menlo, monospace',
  userSelect: 'none',
  color: '#cdd6f4',
  background: 'rgba(17, 17, 27, 0.55)',
  border: '2px solid rgba(205, 214, 244, 0.75)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '12px',
  lineHeight: 1.7,
  whiteSpace: 'pre',
  cursor: 'pointer',
};

const today = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  color: '#11111b',
  fontWeight: 800,
  background: '#cba6f7',
  borderRadius: '50%',
  boxShadow: '0 0 12px rgba(203, 166, 247, 0.65)',
};

export const render = ({ output }) => {
  const now = new Date();
  const day = String(now.getDate());
  const lines = String(output || '').split('\n');
  return (
    <div onClick={() => run("open -a 'Calendar'")}>
      {lines.map((line, i) => {
        if (i === 0) {
          return (
            <div key={i} style={{ color: '#cba6f7', fontWeight: 700 }}>
              {line.trim()}
            </div>
          );
        }
        // Days are 3-char-wide cells; highlight today's cell only.
        const cells = line.match(/.{1,3}/g) || [];
        return (
          <div key={i}>
            {cells.map((cell, j) =>
              cell.trim() === day ? (
                <span key={j} style={today}>
                  {cell}
                </span>
              ) : (
                <span key={j}>{cell}</span>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};
