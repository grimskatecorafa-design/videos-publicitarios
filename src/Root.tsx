import {Composition} from 'remotion';
import {AnuncioWeb, anuncioSchema} from './AnuncioWeb';
import {SCREENCAST_FRAMES, Screencast, screencastSchema} from './screencast/Screencast';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ScreencastWeb"
      component={Screencast}
      durationInFrames={SCREENCAST_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      schema={screencastSchema}
      defaultProps={{
        marca: 'STREET/LAB',
        dominio: 'pnjjz7-ig.myshopify.com',
        eslogan: 'Tu tienda, lista para vender.',
        contacto: 'Escríbenos por DM',
      }}
    />
    <Composition
      id="AnuncioWeb"
      component={AnuncioWeb}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      schema={anuncioSchema}
      defaultProps={{
        marca: 'TuMarca Web',
        titular: '¿Tu negocio aún no tiene página web?',
        beneficios: ['Diseño moderno', 'Lista en 7 días', 'Optimizada para móvil'],
        llamada: 'Escríbenos hoy',
        contacto: 'www.tumarca.com',
        color: '#6C5CE7',
      }}
    />
  </>
);
