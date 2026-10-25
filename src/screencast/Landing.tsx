import {interpolate, useCurrentFrame} from 'remotion';
import {DISPLAY, SANS, clamp} from './ui';

// Landing minimalista. `hover` (0..1) controla el estado hover del CTA.
export const Landing: React.FC<{hover: number}> = ({hover}) => {
  const f = useCurrentFrame();
  const show = (i: number) => {
    const p = interpolate(f, [10 + i * 7, 30 + i * 7], [0, 1], clamp);
    return {opacity: p, transform: `translateY(${(1 - p) * 30}px)`};
  };
  const ink = '#141414';
  return (
    <div style={{position: 'absolute', inset: 0, background: '#F4F2EE', fontFamily: SANS, color: ink, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', left: 1150 + Math.sin(f / 40) * 40, top: -200, background: 'radial-gradient(circle, #ffd6c2 0%, rgba(244,242,238,0) 70%)'}} />
      <div style={{position: 'absolute', width: 600, height: 600, borderRadius: '50%', left: -150, top: 500 + Math.cos(f / 50) * 30, background: 'radial-gradient(circle, #d9e4ff 0%, rgba(244,242,238,0) 70%)'}} />
      <div style={{...show(0), position: 'absolute', left: 90, right: 90, top: 40, display: 'flex', alignItems: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, letterSpacing: -1}}>studio.</div>
        <div style={{display: 'flex', gap: 56, margin: '0 auto', fontSize: 22, color: '#555'}}>
          <span>Proyectos</span><span>Servicios</span><span>Nosotros</span><span>Contacto</span>
        </div>
        <div style={{border: `1.5px solid ${ink}`, borderRadius: 999, padding: '12px 28px', fontSize: 20, fontWeight: 600}}>Hablemos</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center'}}>
        <div style={{...show(1), display: 'inline-flex', gap: 10, alignItems: 'center', padding: '10px 22px', borderRadius: 999, background: 'white', fontSize: 20, color: '#444', boxShadow: '0 4px 20px rgba(0,0,0,.05)'}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: '#28c840'}} /> Disponible para proyectos 2026
        </div>
        <div style={{...show(2), fontFamily: DISPLAY, fontWeight: 300, fontSize: 168, letterSpacing: -7, lineHeight: 1, marginTop: 40}}>
          Less noise.
        </div>
        <div style={{...show(3), fontFamily: DISPLAY, fontWeight: 700, fontSize: 168, letterSpacing: -7, lineHeight: 1.05}}>
          More <span style={{fontFamily: '"DejaVu Serif", serif', fontStyle: 'italic', fontWeight: 400, letterSpacing: -4}}>design.</span>
        </div>
        <div style={{...show(4), fontSize: 28, color: '#666', marginTop: 34, lineHeight: 1.5}}>
          Sitios web que se sienten premium, cargan rápido y convierten.
        </div>
      </div>
      {/* CTA en coordenadas fijas: centro (900, 755) */}
      <div style={{...show(5), position: 'absolute', left: 0, right: 0, top: 715, display: 'flex', justifyContent: 'center', gap: 28}}>
        <div style={{
          background: interpolate(hover, [0, 1], [0, 1]) > 0.5 ? '#FF4D00' : ink, color: 'white',
          padding: '24px 54px', borderRadius: 999, fontSize: 26, fontWeight: 600,
          transform: `scale(${1 + hover * 0.06})`, boxShadow: `0 ${10 + hover * 20}px ${30 + hover * 30}px rgba(255,77,0,${hover * 0.35})`,
          transition: 'none',
        }}>Empezar proyecto  →</div>
        <div style={{padding: '24px 30px', fontSize: 26, fontWeight: 600, color: '#444'}}>Ver trabajos</div>
      </div>
      <div style={{...show(6), position: 'absolute', left: 90, right: 90, bottom: 50, display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#888', borderTop: '1px solid #ddd', paddingTop: 26}}>
        <span>+120 proyectos lanzados</span><span>Diseño · Desarrollo · E-commerce</span><span>CDMX — Remoto</span>
      </div>
    </div>
  );
};
