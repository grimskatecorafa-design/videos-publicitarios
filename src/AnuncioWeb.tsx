import {z} from 'zod';
import {
  AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig,
} from 'remotion';

export const anuncioSchema = z.object({
  marca: z.string(),
  titular: z.string(),
  beneficios: z.array(z.string()),
  llamada: z.string(),
  contacto: z.string(),
  color: z.string(),
});
type Props = z.infer<typeof anuncioSchema>;

const font = 'Inter, Helvetica, Arial, sans-serif';

const Entrada: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14}});
  return (
    <div style={{opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>{children}</div>
  );
};

// Escena 1: el problema
const Titular: React.FC<{texto: string}> = ({texto}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: 90}}>
    <Entrada>
      <h1 style={{fontFamily: font, fontSize: 110, color: 'white', lineHeight: 1.1, margin: 0}}>
        {texto}
      </h1>
    </Entrada>
  </AbsoluteFill>
);

// Escena 2: una página web construyéndose en un navegador
const Navegador: React.FC<{color: string; marca: string}> = ({color, marca}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = spring({frame, fps, config: {damping: 15}});
  const bloque = (i: number) => interpolate(frame, [15 + i * 12, 30 + i * 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{
        width: 880, height: 1150, background: 'white', borderRadius: 36, overflow: 'hidden',
        boxShadow: '0 40px 120px rgba(0,0,0,.45)', transform: `scale(${0.6 + zoom * 0.4})`,
      }}>
        <div style={{height: 70, background: '#eee', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 30}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{width: 22, height: 22, borderRadius: 11, background: c}} />
          ))}
        </div>
        <div style={{padding: 50, display: 'flex', flexDirection: 'column', gap: 34}}>
          <div style={{opacity: bloque(0), fontFamily: font, fontWeight: 800, fontSize: 56, color}}>{marca}</div>
          <div style={{opacity: bloque(1), height: 360, borderRadius: 24, background: `linear-gradient(135deg, ${color}, #00cec9)`}} />
          <div style={{opacity: bloque(2), height: 34, width: '85%', borderRadius: 17, background: '#ddd'}} />
          <div style={{opacity: bloque(3), height: 34, width: '65%', borderRadius: 17, background: '#ddd'}} />
          <div style={{display: 'flex', gap: 30, opacity: bloque(4)}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{flex: 1, height: 200, borderRadius: 20, background: '#f1f0ff'}} />
            ))}
          </div>
          <div style={{
            opacity: bloque(5), alignSelf: 'flex-start', background: color, color: 'white',
            fontFamily: font, fontSize: 40, fontWeight: 700, padding: '22px 50px', borderRadius: 60,
          }}>Contáctanos</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Escena 3: beneficios
const Beneficios: React.FC<{items: string[]}> = ({items}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: 90, gap: 50}}>
    {items.map((b, i) => (
      <Entrada key={b} delay={i * 15}>
        <div style={{fontFamily: font, fontSize: 80, color: 'white', fontWeight: 700}}>✓ {b}</div>
      </Entrada>
    ))}
  </AbsoluteFill>
);

// Escena 4: llamada a la acción
const Cierre: React.FC<{llamada: string; contacto: string; color: string}> = ({llamada, contacto, color}) => {
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 6) * 0.03;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 60, textAlign: 'center'}}>
      <Entrada>
        <div style={{fontFamily: font, fontSize: 120, color: 'white', fontWeight: 800}}>{llamada}</div>
      </Entrada>
      <Entrada delay={12}>
        <div style={{
          transform: `scale(${pulso})`, background: 'white', color, fontFamily: font,
          fontSize: 64, fontWeight: 800, padding: '30px 70px', borderRadius: 80,
        }}>{contacto}</div>
      </Entrada>
    </AbsoluteFill>
  );
};

export const AnuncioWeb: React.FC<Props> = (p) => (
  <AbsoluteFill style={{background: `linear-gradient(160deg, #111 0%, ${p.color} 140%)`}}>
    <Sequence durationInFrames={90}><Titular texto={p.titular} /></Sequence>
    <Sequence from={90} durationInFrames={150}><Navegador color={p.color} marca={p.marca} /></Sequence>
    <Sequence from={240} durationInFrames={105}><Beneficios items={p.beneficios} /></Sequence>
    <Sequence from={345}><Cierre llamada={p.llamada} contacto={p.contacto} color={p.color} /></Sequence>
  </AbsoluteFill>
);
