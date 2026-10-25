# Videos publicitarios (Remotion)

Proyecto Remotion para videos promocionales de creación de páginas web y tiendas online.
Para cualquier tarea de video, usar las skills de `.claude/skills/` (empezar por `remotion-best-practices`).

## Composiciones (`src/Root.tsx`)
- `ScreencastWeb` — 1920x1080, screencast: landing → e-commerce → ajustes de tema → scroll final. Código en `src/screencast/`.
- `AnuncioWeb` — 1080x1920 (vertical), anuncio corto.

Los textos editables (marca, dominio, eslogan, contacto) están en `defaultProps` de cada composición.

## Reglas
- El código que aparece en pantalla es "dummy code" estético (`src/screencast/code.ts`): nunca código real, APIs ni credenciales.
- Fuentes disponibles localmente: Inter, Inter Display, JetBrains Mono.

## Comandos
- Vista previa: `npm run studio`
- Render: `npx remotion render src/index.ts ScreencastWeb out/screencast-web.mp4`
- En la nube de Claude Code, agregar `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
- Revisar frames sueltos antes de renderizar todo: `npx remotion still src/index.ts ScreencastWeb out/f.png --frame=300`
