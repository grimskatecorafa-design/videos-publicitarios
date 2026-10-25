import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DISPLAY, SANS, clamp} from './ui';

export type Theme = {bg: string; fg: string; card: string; muted: string; accent: string; radius: number};

export const LIGHT: Theme = {bg: '#F4F2EE', fg: '#111111', card: '#FFFFFF', muted: '#777777', accent: '#FF4D00', radius: 4};
export const DARK: Theme = {bg: '#0B0B0C', fg: '#F5F5F5', card: '#17171A', muted: '#9A9A9A', accent: '#C6FF00', radius: 22};

const SHAPES = {
  tee: 'M30 15 L40 10 Q50 19 60 10 L70 15 L88 30 L78 42 L70 37 L70 90 L30 90 L30 37 L22 42 L12 30 Z',
  hoodie: 'M36 14 Q50 2 64 14 L72 18 L90 52 L80 58 L71 42 L71 92 L29 92 L29 42 L20 58 L10 52 L28 18 Z',
  cargo: 'M30 8 L70 8 L75 92 L56 92 L50 38 L44 92 L25 92 Z',
};

export const PRODUCTS = [
  {name: 'Playera Oversize "Void"', price: '$549', shape: SHAPES.tee, g: ['#2b2b2b', '#5a5a5a'], fill: '#111'},
  {name: 'Hoodie Heavyweight', price: '$1,190', shape: SHAPES.hoodie, g: ['#d9d3c7', '#efe9de'], fill: '#7b6f5d'},
  {name: 'Cargo Pants Utility', price: '$1,050', shape: SHAPES.cargo, g: ['#4d5a3a', '#76845d'], fill: '#2a3320'},
  {name: 'Playera Graphic "Static"', price: '$599', shape: SHAPES.tee, g: ['#e5e5e5', '#ffffff'], fill: '#e8e8e8'},
];
export const SIZES = ['S', 'M', 'L', 'XL'];

export const Garment: React.FC<{p: (typeof PRODUCTS)[number]; size: number; radius: number; zoom?: number}> = ({p, size, radius, zoom = 1}) => (
  <div style={{width: size, height: size, borderRadius: radius, overflow: 'hidden', background: `linear-gradient(160deg, ${p.g[0]}, ${p.g[1]})`, display: 'grid', placeItems: 'center'}}>
    <svg viewBox="0 0 100 100" width={size * 0.72} height={size * 0.72} style={{transform: `scale(${zoom})`, filter: 'drop-shadow(0 12px 18px rgba(0,0,0,.25))'}}>
      <path d={p.shape} fill={p.fill} stroke="rgba(255,255,255,.12)" strokeWidth="1" />
    </svg>
  </div>
);

// Geometría (coordenadas del área de contenido del navegador, 1800x936)
export const HEADER = 90;
export const GRID_TOP = 730; // dentro del documento
export const cardRect = (i: number, scrollY: number) => ({x: 60 + i * 440, y: HEADER + GRID_TOP - scrollY, w: 400, h: 540});
export const MAX_SCROLL = 2500 - (936 - HEADER);

type Props = {
  theme: Theme; marca: string; scrollY: number; hover?: number[]; selected?: number | null;
  cart?: number; cartAt?: number; drawer?: number;
};

export const Store: React.FC<Props> = ({theme: t, marca, scrollY, hover = [0, 0, 0, 0], selected = null, cart = 0, cartAt = -100, drawer = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bump = 1 + 0.5 * Math.max(0, 1 - spring({frame: f - cartAt, fps, config: {damping: 8}})) * (f >= cartAt ? 1 : 0);
  const onAccent = t.bg;
  return (
    <div style={{position: 'absolute', inset: 0, background: t.bg, color: t.fg, fontFamily: SANS, overflow: 'hidden'}}>
      {/* Documento con scroll */}
      <div style={{position: 'absolute', left: 0, top: HEADER - scrollY, width: 1800, height: 2500}}>
        {/* Hero */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 0, height: 600, borderRadius: t.radius * 1.5, overflow: 'hidden', background: 'linear-gradient(120deg, #111 0%, #2a2a2a 55%, #444 100%)'}}>
          <div style={{position: 'absolute', right: 80, top: 40, opacity: 0.9}}><Garment p={PRODUCTS[1]} size={520} radius={t.radius * 1.5} /></div>
          <div style={{position: 'absolute', left: 80, top: 90, color: 'white'}}>
            <div style={{fontSize: 22, letterSpacing: 6, color: t.accent, fontWeight: 700}}>FW26 — DROP 03</div>
            <div style={{fontFamily: DISPLAY, fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 0.95, marginTop: 20}}>NO RULES<br />JUST FITS.</div>
            <div style={{display: 'inline-block', marginTop: 46, background: t.accent, color: '#000', padding: '22px 48px', borderRadius: t.radius * 3, fontSize: 24, fontWeight: 800}}>Comprar ahora</div>
          </div>
        </div>
        {/* ProductGrid */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 650, display: 'flex', alignItems: 'baseline'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 52, fontWeight: 800, letterSpacing: -2}}>New Arrivals</div>
          <div style={{marginLeft: 'auto', fontSize: 22, color: t.muted}}>Ver todo →</div>
        </div>
        {PRODUCTS.map((p, i) => {
          const h = hover[i];
          return (
            <div key={i} style={{
              position: 'absolute', left: 60 + i * 440, top: GRID_TOP, width: 400, height: 540,
              transform: `translateY(${-h * 12}px)`, borderRadius: t.radius, background: t.card,
              boxShadow: `0 ${8 + h * 30}px ${20 + h * 50}px rgba(0,0,0,${0.06 + h * 0.18})`, overflow: 'hidden',
            }}>
              <div style={{position: 'relative'}}>
                <Garment p={p} size={400} radius={0} zoom={1 + h * 0.06} />
                <div style={{position: 'absolute', left: 18, top: 18, background: t.accent, color: '#000', fontSize: 15, fontWeight: 800, letterSpacing: 1.5, padding: '8px 14px', borderRadius: t.radius}}>NEW ARRIVAL</div>
                {/* Quick add */}
                <div style={{position: 'absolute', left: 0, right: 0, top: 400 - 140, height: 140, padding: '0 20px', opacity: h, transform: `translateY(${(1 - h) * 30}px)`, background: 'linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,0))'}}>
                  <div style={{display: 'flex', gap: 12, marginTop: 0}}>
                    {SIZES.map((s, k) => (
                      <div key={s} style={{
                        width: 70, height: 52, borderRadius: t.radius, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 20,
                        background: selected === k && i === 1 ? t.accent : 'rgba(255,255,255,.92)', color: '#000',
                        transform: `scale(${selected === k && i === 1 ? 1.08 : 1})`,
                      }}>{s}</div>
                    ))}
                  </div>
                  <div style={{marginTop: 14, height: 52, borderRadius: t.radius, background: '#000', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 20}}>+ Agregar al carrito</div>
                </div>
              </div>
              <div style={{padding: '22px 22px', background: t.card, height: 140}}>
                <div style={{fontSize: 23, fontWeight: 600}}>{p.name}</div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: 12}}>
                  <div style={{fontSize: 24, fontWeight: 800}}>{p.price} <span style={{fontSize: 16, color: t.muted, fontWeight: 500}}>MXN</span></div>
                  <div style={{marginLeft: 'auto', display: 'flex', gap: 8}}>
                    {[p.g[0], '#c2b8a3', '#1c1c1c'].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c, border: `1px solid ${t.muted}`}} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Lookbook */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 1420, display: 'flex', gap: 40}}>
          {[{t: 'LOOKBOOK 01', s: 'Urban Noise', g: 'linear-gradient(135deg,#1e1e1e,#4a4a4a)'}, {t: 'ESSENTIALS', s: 'Básicos que pegan con todo', g: 'linear-gradient(135deg,#6c6455,#b8ad98)'}].map((x, i) => (
            <div key={i} style={{flex: 1, height: 520, borderRadius: t.radius * 1.5, background: x.g, position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', right: 30, bottom: 20, opacity: 0.85}}><Garment p={PRODUCTS[i === 0 ? 0 : 2]} size={380} radius={t.radius} /></div>
              <div style={{position: 'absolute', left: 50, top: 50, color: 'white'}}>
                <div style={{fontFamily: DISPLAY, fontSize: 72, fontWeight: 900, letterSpacing: -3}}>{x.t}</div>
                <div style={{fontSize: 24, opacity: 0.8, marginTop: 6}}>{x.s}</div>
                <div style={{marginTop: 30, display: 'inline-block', border: '2px solid white', padding: '14px 30px', borderRadius: t.radius * 3, fontWeight: 700, fontSize: 20}}>Explorar</div>
              </div>
            </div>
          ))}
        </div>
        {/* Newsletter + footer */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 2010, height: 260, borderRadius: t.radius * 1.5, background: t.card, display: 'flex', alignItems: 'center', padding: '0 70px'}}>
          <div>
            <div style={{fontFamily: DISPLAY, fontSize: 56, fontWeight: 800, letterSpacing: -2}}>Únete al club {marca}</div>
            <div style={{fontSize: 24, color: t.muted, marginTop: 10}}>Acceso anticipado a drops y 10% en tu primera compra.</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', gap: 14}}>
            <div style={{width: 420, height: 70, borderRadius: t.radius * 2, border: `1.5px solid ${t.muted}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 22, color: t.muted}}>tu@email.com</div>
            <div style={{height: 70, padding: '0 36px', borderRadius: t.radius * 2, background: t.accent, color: '#000', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 22}}>Suscribirme</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 2330, display: 'flex', fontSize: 20, color: t.muted}}>
          <span style={{fontFamily: DISPLAY, fontWeight: 900, color: t.fg, fontSize: 30}}>{marca}</span>
          <span style={{marginLeft: 'auto', display: 'flex', gap: 50}}><span>Envíos</span><span>Devoluciones</span><span>Guía de tallas</span><span>Instagram</span></span>
        </div>
      </div>

      {/* Header fijo */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: HEADER, background: t.bg, display: 'flex', alignItems: 'center', padding: '0 60px', borderBottom: `1px solid ${t.fg}14`, zIndex: 5}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 34, letterSpacing: 1}}>{marca}</div>
        <div style={{display: 'flex', gap: 46, marginLeft: 90, fontSize: 21, fontWeight: 500}}>
          <span>Nuevo</span><span>Hombre</span><span>Mujer</span><span>Accesorios</span><span style={{color: t.accent === '#C6FF00' ? t.accent : '#FF4D00'}}>Sale</span>
        </div>
        <div style={{marginLeft: 'auto', display: 'flex', gap: 34, alignItems: 'center', fontSize: 22}}>
          <span>Buscar</span><span>Cuenta</span>
          <span style={{position: 'relative', fontWeight: 700}}>
            Carrito
            <span style={{
              position: 'absolute', right: -30, top: -14, width: 28, height: 28, borderRadius: 14, background: t.accent, color: '#000',
              fontSize: 16, fontWeight: 800, display: 'grid', placeItems: 'center', transform: `scale(${bump})`,
            }}>{cart}</span>
          </span>
        </div>
      </div>

      {/* CartDrawer */}
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${drawer * 0.45})`, zIndex: 8, pointerEvents: 'none'}} />
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 560, height: 936, zIndex: 9, background: t.card,
        transform: `translateX(${(1 - drawer) * 580}px)`, padding: 40, boxShadow: '-30px 0 80px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 38, fontWeight: 800}}>Tu carrito ({cart})</div>
          <div style={{marginLeft: 'auto', fontSize: 30, color: t.muted}}>✕</div>
        </div>
        <div style={{marginTop: 18, fontSize: 18, color: t.muted}}>🚚 ¡Tu pedido tiene envío gratis!</div>
        <div style={{height: 6, borderRadius: 3, background: `${t.fg}22`, marginTop: 12}}>
          <div style={{height: 6, borderRadius: 3, width: `${interpolate(drawer, [0.6, 1], [0, 100], clamp)}%`, background: t.accent === '#FF4D00' ? '#28c840' : t.accent}} />
        </div>
        <div style={{display: 'flex', gap: 24, marginTop: 40, alignItems: 'center'}}>
          <Garment p={PRODUCTS[1]} size={140} radius={t.radius} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 24, fontWeight: 700}}>{PRODUCTS[1].name}</div>
            <div style={{fontSize: 19, color: t.muted, marginTop: 6}}>Color: Arena · Talla: <b style={{color: t.fg}}>L</b></div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 16}}>
              <div style={{display: 'flex', border: `1.5px solid ${t.fg}33`, borderRadius: t.radius * 2, fontSize: 20}}>
                <span style={{padding: '6px 16px'}}>−</span><span style={{padding: '6px 10px', fontWeight: 700}}>1</span><span style={{padding: '6px 16px'}}>+</span>
              </div>
              <div style={{marginLeft: 'auto', fontSize: 24, fontWeight: 800}}>$1,190</div>
            </div>
          </div>
        </div>
        <div style={{marginTop: 'auto', borderTop: `1px solid ${t.fg}1f`, paddingTop: 28}}>
          <div style={{display: 'flex', fontSize: 24}}><span>Subtotal</span><b style={{marginLeft: 'auto'}}>$1,190 MXN</b></div>
          <div style={{fontSize: 17, color: t.muted, marginTop: 8}}>Impuestos incluidos. Envío calculado al pagar.</div>
          <div style={{marginTop: 24, height: 76, borderRadius: t.radius * 2, background: t.fg, color: onAccent, display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800}}>Finalizar compra →</div>
        </div>
      </div>
    </div>
  );
};
