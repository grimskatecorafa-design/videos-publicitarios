import {z} from 'zod';
import {
  AbsoluteFill, Easing, Sequence, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {Editor, typed} from './Editor';
import {Landing} from './Landing';
import {DARK, LIGHT, MAX_SCROLL, Store, Theme, cardRect} from './Store';
import {LANDING_CODE, STORE_CODE} from './code';
import {Browser, Cursor, DISPLAY, SANS, Scene, StepChip, clamp, cursorAt} from './ui';

export const screencastSchema = z.object({
  marca: z.string(),
  dominio: z.string(),
  eslogan: z.string(),
  contacto: z.string(),
});
type Props = z.infer<typeof screencastSchema>;

const FILES = ['app', '  page.tsx', '  shop', '    page.tsx', 'ui', '  ProductCard.tsx', '  CartDrawer.tsx', 'theme.config.ts'];
const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};

// Hover suavizado: promedio de "cursor dentro del rect" en los últimos 8 frames
const hoverOf = (f: number, keys: Parameters<typeof cursorAt>[1], r: {x: number; y: number; w: number; h: number}, offY = 0) => {
  let s = 0;
  for (let k = 0; k < 8; k++) {
    const c = cursorAt(f - k, keys);
    if (c.x >= r.x && c.x <= r.x + r.w && c.y >= r.y + offY && c.y <= r.y + r.h + offY) s++;
  }
  return s / 8;
};

// ---------- Escena de código con typing ----------
const CodeScene: React.FC<{code: string; file: string; cps: number}> = ({code, file, cps}) => {
  const f = useCurrentFrame();
  const text = typed(code, f, cps, 14);
  const done = text.length >= code.length;
  return (
    <Scene>
      <Editor text={text} file={file} files={FILES} status={done ? '✓ Compiled in 412ms' : '● Compiling…'} />
    </Scene>
  );
};

// ---------- PASO 1b: preview landing ----------
const LandingPreview: React.FC<{dominio: string}> = () => {
  const f = useCurrentFrame();
  const keys: [number, number, number][] = [[0, 1300, 900], [45, 1300, 900], [80, 840, 760], [135, 840, 760]];
  const c = cursorAt(f, keys);
  const hover = hoverOf(f, keys, {x: 640, y: 715, w: 400, h: 80});
  return (
    <Scene push={0.02}>
      <Browser url="localhost:3000">
        <Landing hover={hover} />
        <Cursor x={c.x} y={c.y} clicks={[100]} />
      </Browser>
    </Scene>
  );
};

// ---------- PASO 2b: interacción en la tienda ----------
const SCROLL = 640;
const StoreInteraction: React.FC<{marca: string; dominio: string}> = ({marca, dominio}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scrollY = interpolate(f, [12, 50], [0, SCROLL], ease);
  const r1 = cardRect(1, SCROLL);
  const sizeL = {x: r1.x + 20 + 2 * 82 + 35, y: r1.y + 286 - 12};
  const add = {x: r1.x + 200, y: r1.y + 352 - 12};
  const keys: [number, number, number][] = [
    [0, 1000, 880], [55, 1000, 880],
    [90, 260, 430], [125, 260, 430],
    [160, 1140, 430], [190, 1140, 430],
    [220, 700, 430], [235, 700, 430],
    [258, sizeL.x, sizeL.y], [285, sizeL.x, sizeL.y],
    [305, add.x, add.y], [325, add.x, add.y],
    [365, 1520, 858], [420, 1520, 858],
  ];
  const c = cursorAt(f, keys);
  const hover = [0, 1, 2, 3].map((i) => hoverOf(f, keys, cardRect(i, scrollY), -12));
  const drawer = spring({frame: f - 330, fps, config: {damping: 18}});
  return (
    <Scene push={0.02}>
      <Browser url={dominio}>
        <Store theme={LIGHT} marca={marca} scrollY={scrollY} hover={hover} selected={f >= 268 ? 2 : null}
          cart={f >= 315 ? 1 : 0} cartAt={315} drawer={drawer} />
        <Cursor x={c.x} y={c.y} clicks={[264, 311]} />
      </Browser>
      <StepChip n="02" label="E-commerce: hover, tallas y carrito" />
    </Scene>
  );
};

// ---------- PASO 3a: ajustes de diseño en vivo ----------
const EDITS = [
  {key: 'background', from: '"#F4F2EE"', to: '"#0B0B0C"', at: 25},
  {key: 'foreground', from: '"#111111"', to: '"#F5F5F5"', at: 65},
  {key: 'accent', from: '"#FF4D00"', to: '"#C6FF00"', at: 105},
  {key: 'radius', from: '"4px"', to: '"22px"', at: 145},
];
const valueAt = (f: number, e: (typeof EDITS)[number]) => {
  if (f < e.at) return e.from;
  if (f < e.at + 9) return e.from.slice(0, Math.max(0, e.from.length - Math.floor((f - e.at) * (e.from.length / 8))));
  if (f < e.at + 12) return '';
  return e.to.slice(0, Math.floor((f - e.at - 12) * 0.9) + 1);
};
const mixTheme = (p: number[]): Theme => ({
  bg: interpolateColors(p[0], [0, 1], [LIGHT.bg, DARK.bg]),
  card: interpolateColors(p[0], [0, 1], [LIGHT.card, DARK.card]),
  muted: interpolateColors(p[1], [0, 1], [LIGHT.muted, DARK.muted]),
  fg: interpolateColors(p[1], [0, 1], [LIGHT.fg, DARK.fg]),
  accent: p[2] < 0.5 ? LIGHT.accent : DARK.accent,
  radius: interpolate(p[3], [0, 1], [LIGHT.radius, DARK.radius]),
});
export const progressOf = (f: number) => EDITS.map((e) => interpolate(f, [e.at + 22, e.at + 36], [0, 1], ease));

const ThemeTweaks: React.FC<{marca: string; dominio: string}> = ({marca, dominio}) => {
  const f = useCurrentFrame();
  const active = [...EDITS].reverse().find((e) => f >= e.at) ?? EDITS[0];
  const lines = [
    '// Fine-tuning design tokens ✦',
    'export const theme = {',
    ...EDITS.map((e) => `  ${e.key}: ${valueAt(f, e)},`),
    '  font: "Inter Display",',
    '  motion: "smooth",',
    '};',
  ];
  const ai = EDITS.indexOf(active);
  const caretLine = 2 + ai;
  const caret = {line: caretLine, col: lines[caretLine].length - 1};
  return (
    <Scene push={0.015}>
      <Editor text={lines.join('\n')} file="theme.config.ts" caret={caret} sidebar={false} fontSize={27}
        status="⚡ Hot Reload" style={{width: 860}} />
      <Browser url={dominio} style={{left: 960, width: 900}}>
        <div style={{width: 1800, height: 1872, transform: 'scale(.5)', transformOrigin: '0 0', position: 'relative'}}>
          <Store theme={mixTheme(progressOf(f))} marca={marca} scrollY={0} />
        </div>
      </Browser>
      <StepChip n="03" label="Toques finales en tiempo real" />
    </Scene>
  );
};

// ---------- PASO 3b: scroll final ----------
const FinalScroll: React.FC<{marca: string; dominio: string}> = ({marca, dominio}) => {
  const f = useCurrentFrame();
  const scrollY = interpolate(f, [40, 90, 145, 190, 225, 265], [0, SCROLL, SCROLL, 1400, 1400, MAX_SCROLL], ease);
  return (
    <Scene push={0.03}>
      <Browser url={dominio}>
        <Store theme={DARK} marca={marca} scrollY={scrollY} />
      </Browser>
    </Scene>
  );
};

// ---------- Cierre ----------
const Outro: React.FC<Props> = ({marca, eslogan, contacto}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f - 5, fps, config: {damping: 14}});
  const b = spring({frame: f - 18, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: '#0B0B0C', justifyContent: 'center', alignItems: 'center', fontFamily: SANS, color: 'white', textAlign: 'center'}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 40}px)`, fontFamily: DISPLAY, fontSize: 120, fontWeight: 900, letterSpacing: -4}}>{eslogan}</div>
      <div style={{opacity: b, marginTop: 40, fontSize: 40, color: '#9a9a9a'}}>Landing pages · Tiendas online · Diseño a medida</div>
      <div style={{opacity: b, marginTop: 60, background: '#C6FF00', color: '#000', padding: '26px 60px', borderRadius: 999, fontSize: 40, fontWeight: 800}}>{contacto}</div>
      <div style={{opacity: b, position: 'absolute', bottom: 60, fontSize: 24, color: '#555', letterSpacing: 6}}>{marca}</div>
    </AbsoluteFill>
  );
};

export const TIMELINE = {landingCode: 210, landingPreview: 135, storeCode: 225, store: 420, tweaks: 210, scroll: 285, outro: 105};
export const SCREENCAST_FRAMES = Object.values(TIMELINE).reduce((a, b) => a + b, 0);

export const Screencast: React.FC<Props> = (p) => {
  let t = 0;
  const at = (d: number) => {
    const from = t;
    t += d;
    return {from, durationInFrames: d};
  };
  return (
    <AbsoluteFill style={{background: '#050507'}}>
      <Sequence {...at(TIMELINE.landingCode)}>
        <CodeScene code={LANDING_CODE} file="page.tsx" cps={4.2} />
        <StepChip n="01" label="Landing Page minimalista" />
      </Sequence>
      <Sequence {...at(TIMELINE.landingPreview)}><LandingPreview dominio={p.dominio} /></Sequence>
      <Sequence {...at(TIMELINE.storeCode)}>
        <CodeScene code={STORE_CODE} file="page.tsx" cps={4.6} />
        <StepChip n="02" label="Transformación a E-commerce" />
      </Sequence>
      <Sequence {...at(TIMELINE.store)}><StoreInteraction marca={p.marca} dominio={p.dominio} /></Sequence>
      <Sequence {...at(TIMELINE.tweaks)}><ThemeTweaks marca={p.marca} dominio={p.dominio} /></Sequence>
      <Sequence {...at(TIMELINE.scroll)}><FinalScroll marca={p.marca} dominio={p.dominio} /></Sequence>
      <Sequence {...at(TIMELINE.outro)}><Outro {...p} /></Sequence>
    </AbsoluteFill>
  );
};
