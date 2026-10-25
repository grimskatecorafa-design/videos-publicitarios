import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

export const SANS = 'Inter, sans-serif';
export const DISPLAY = '"Inter Display", Inter, sans-serif';
export const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrada de escena: fade desde negro con un leve "push" de cámara
export const Scene: React.FC<{children: React.ReactNode; push?: number}> = ({children, push = 0.03}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12], [0, 1], clamp);
  const s = interpolate(f, [0, 240], [1, 1 + push], clamp);
  return (
    <AbsoluteFill style={{background: '#050507'}}>
      <AbsoluteFill style={{opacity: o, transform: `scale(${s})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Etiqueta flotante del paso actual
export const StepChip: React.FC<{n: string; label: string}> = ({n, label}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [8, 22, 75, 90], [0, 1, 1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{
      position: 'absolute', left: 80, bottom: 70, opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
      display: 'flex', alignItems: 'center', gap: 18, padding: '16px 28px 16px 16px', borderRadius: 999,
      background: 'rgba(15,15,20,.85)', border: '1px solid rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
      fontFamily: SANS, color: 'white', fontSize: 26, fontWeight: 600, zIndex: 50,
    }}>
      <span style={{background: '#C6FF00', color: '#000', borderRadius: 999, padding: '6px 14px', fontSize: 22, fontWeight: 800}}>{n}</span>
      {label}
    </div>
  );
};

// ---------- Cursor ----------
type Key = [frame: number, x: number, y: number];

export const cursorAt = (f: number, keys: Key[]) => {
  if (f <= keys[0][0]) return {x: keys[0][1], y: keys[0][2]};
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, x0, y0] = keys[i];
    const [f1, x1, y1] = keys[i + 1];
    if (f <= f1) {
      const t = Easing.inOut(Easing.cubic)((f - f0) / (f1 - f0));
      const dist = Math.hypot(x1 - x0, y1 - y0);
      const arc = Math.sin(Math.PI * t) * Math.min(40, dist * 0.08); // trayectoria curva, más natural
      return {x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t - arc};
    }
  }
  const last = keys[keys.length - 1];
  return {x: last[1], y: last[2]};
};

export const Cursor: React.FC<{x: number; y: number; clicks?: number[]}> = ({x, y, clicks = []}) => {
  const f = useCurrentFrame();
  const c = clicks.find((cf) => f >= cf && f < cf + 18);
  const t = c === undefined ? 1 : (f - c) / 18;
  const press = c === undefined ? 1 : interpolate(f - c, [0, 4, 10], [1, 0.82, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 100, pointerEvents: 'none'}}>
      {c !== undefined && (
        <div style={{
          position: 'absolute', left: -40 * t, top: -40 * t, width: 80 * t, height: 80 * t, borderRadius: '50%',
          border: '3px solid rgba(198,255,0,.9)', opacity: 1 - t,
        }} />
      )}
      <svg width="34" height="40" viewBox="0 0 34 40" style={{transform: `scale(${press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.4))'}}>
        <path d="M2 2 L2 32 L10 25 L16 38 L22 35 L16 23 L27 23 Z" fill="white" stroke="black" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------- Ventana de navegador ----------
export const Browser: React.FC<{url: string; children: React.ReactNode; style?: React.CSSProperties}> = ({url, children, style}) => (
  <div style={{
    position: 'absolute', left: 60, top: 40, width: 1800, height: 1000, borderRadius: 18, overflow: 'hidden',
    background: '#1b1b20', boxShadow: '0 50px 140px rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.08)', ...style,
  }}>
    <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: '#1b1b20'}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 15, height: 15, borderRadius: 8, background: c}} />)}
      <div style={{
        marginLeft: 30, flex: 1, maxWidth: 900, height: 38, borderRadius: 10, background: '#2a2a31', color: '#c9c9d1',
        fontFamily: SANS, fontSize: 19, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
      }}>
        <span style={{color: '#28c840'}}>🔒</span>{url}
      </div>
      <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 16, color: '#28c840'}}>● Live Preview</div>
    </div>
    <div style={{position: 'relative', width: 1800, height: 936, overflow: 'hidden'}}>{children}</div>
  </div>
);
