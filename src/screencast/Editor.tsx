import {useCurrentFrame} from 'remotion';
import {MONO, SANS} from './ui';

const C = {
  bg: '#0f1117', side: '#0b0d12', line: '#3b4261', text: '#c0caf5', comment: '#7a83b0',
  string: '#9ece6a', tag: '#f7768e', attr: '#7dcfff', kw: '#bb9af7', punct: '#89ddff',
};
const TOKEN = /(\/\/.*$|\{\/\*.*?(?:\*\/\}|$)|<!--.*?(?:-->|$))|("[^"]*"?)|(<\/?[A-Za-z][\w.]*|\/?>)|(\b[a-zA-Z]+(?==))|\b(const|export|default|function|return|import|from)\b|([{}()[\]=>.,;])/g;

const Line: React.FC<{text: string}> = ({text}) => {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const color = m[1] ? C.comment : m[2] ? C.string : m[3] ? C.tag : m[4] ? C.attr : m[5] ? C.kw : C.punct;
    out.push(<span key={m.index} style={{color, fontStyle: m[1] ? 'italic' : 'normal'}}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
};

export const typed = (code: string, frame: number, cps: number, delay = 0) =>
  code.slice(0, Math.max(0, Math.floor((frame - delay) * cps)));

type Props = {
  text: string;
  file: string;
  files?: string[];
  status?: string;
  caret?: {line: number; col: number};
  fontSize?: number;
  style?: React.CSSProperties;
  sidebar?: boolean;
};

export const Editor: React.FC<Props> = ({text, file, files = [], status = '', caret, fontSize = 25, style, sidebar = true}) => {
  const f = useCurrentFrame();
  const lines = text.split('\n');
  const cl = caret?.line ?? lines.length - 1;
  const cc = caret?.col ?? lines[lines.length - 1].length;
  const lh = Math.round(fontSize * 1.6);
  const visible = Math.floor(820 / lh);
  const scroll = Math.max(0, cl - visible + 3) * lh;
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{
      position: 'absolute', left: 60, top: 40, width: 1800, height: 1000, borderRadius: 18, overflow: 'hidden',
      background: C.bg, boxShadow: '0 50px 140px rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.08)',
      display: 'flex', flexDirection: 'column', ...style,
    }}>
      <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: C.side}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 15, height: 15, borderRadius: 8, background: c}} />)}
        <div style={{marginLeft: 'auto', marginRight: 'auto', fontFamily: SANS, fontSize: 17, color: '#6b7089'}}>studio-project — {file}</div>
      </div>
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>
        {sidebar && (
          <div style={{width: 300, background: C.side, padding: '24px 0', fontFamily: SANS, fontSize: 19, color: '#7a7f99'}}>
            <div style={{padding: '0 26px 16px', fontSize: 14, letterSpacing: 2, color: '#565a70'}}>EXPLORER</div>
            {files.map((name) => (
              <div key={name} style={{
                padding: '9px 26px', paddingLeft: 26 + (name.match(/^ +/)?.[0].length ?? 0) * 10,
                background: name.trim() === file ? 'rgba(122,162,247,.14)' : 'transparent',
                color: name.trim() === file ? '#c0caf5' : undefined,
                borderLeft: name.trim() === file ? '3px solid #7aa2f7' : '3px solid transparent',
              }}>{name.trim().includes('.') ? '📄 ' : '📁 '}{name.trim()}</div>
            ))}
          </div>
        )}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
          <div style={{height: 50, display: 'flex', background: C.side}}>
            <div style={{
              padding: '0 26px', display: 'flex', alignItems: 'center', background: C.bg, color: C.text,
              fontFamily: SANS, fontSize: 18, borderTop: '2px solid #7aa2f7',
            }}>{file}</div>
          </div>
          <div style={{flex: 1, overflow: 'hidden', position: 'relative', padding: '24px 0'}}>
            <div style={{transform: `translateY(${-scroll}px)`, fontFamily: MONO, fontSize, lineHeight: `${lh}px`, color: C.text}}>
              {lines.map((l, i) => (
                <div key={i} style={{display: 'flex', background: i === cl ? 'rgba(255,255,255,.04)' : 'transparent'}}>
                  <div style={{width: 80, textAlign: 'right', paddingRight: 28, color: i === cl ? '#a9b1d6' : C.line, flexShrink: 0}}>{i + 1}</div>
                  <div style={{position: 'relative', whiteSpace: 'pre'}}>
                    <Line text={l} />
                    {i === cl && blink && (
                      <span style={{position: 'absolute', left: `${cc}ch`, top: 4, width: 3, height: lh - 8, background: '#C6FF00'}} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{height: 36, background: '#7aa2f7', color: '#0b0d12', fontFamily: MONO, fontSize: 16, display: 'flex', alignItems: 'center', gap: 30, padding: '0 20px'}}>
        <span>⎇ main</span><span>TypeScript JSX</span><span style={{marginLeft: 'auto', fontWeight: 700}}>{status}</span>
      </div>
    </div>
  );
};
