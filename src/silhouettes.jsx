// Editorial portrait silhouettes — flat shapes, no features.
// Each returns an inline SVG <g>; pair with a tinted backgcircuit.

const SIL_PALETTES = [
  ['#6B1520', '#F8E8F0'], // plum / light pink
  ['#6B1520', '#F5E0E0'], // maroon / blush
  ['#0A0A0A', '#F0F0F0'], // black / light gray
  ['#6B1520', '#FFFFFF'], // plum / white
  ['#6B1520', '#F8F0F0'], // maroon / rose white
  ['#333333', '#F5F5F5'], // dark gray / off white
  ['#6B1520', '#F0E0EA'], // plum / soft pink
  ['#0A0A0A', '#E8E8E8'], // black / silver
];

function Silhouette({ seed = 0, variant = 'a', style = {}, className = '' }) {
  const [fg, bg] = SIL_PALETTES[seed % SIL_PALETTES.length];
  const v = ['a','b','c','d','e','f','g','h'][seed % 8];
  // Different neck/shoulder profiles per variant
  const shapes = {
    a: <>
      <circle cx="100" cy="78" r="34" fill={fg}/>
      <path d="M40,200 C40,150 60,120 100,120 C140,120 160,150 160,200 Z" fill={fg}/>
    </>,
    b: <>
      <ellipse cx="100" cy="72" rx="32" ry="36" fill={fg}/>
      <path d="M30,200 C30,140 55,116 100,116 C145,116 170,140 170,200 Z" fill={fg}/>
      <rect x="72" y="108" width="56" height="18" fill={fg}/>
    </>,
    c: <>
      <circle cx="100" cy="74" r="30" fill={fg}/>
      <path d="M35,200 C35,145 65,118 100,118 C135,118 165,145 165,200 Z" fill={fg}/>
      <circle cx="75" cy="60" r="10" fill={bg} opacity=".25"/>
    </>,
    d: <>
      <path d="M70,80 Q70,44 100,44 Q130,44 130,80 Q130,112 100,112 Q70,112 70,80 Z" fill={fg}/>
      <path d="M30,200 C30,150 60,120 100,120 C140,120 170,150 170,200 Z" fill={fg}/>
      <path d="M70,66 Q100,36 130,66 L125,78 Q100,54 75,78 Z" fill={fg}/>
    </>,
    e: <>
      <ellipse cx="100" cy="78" rx="34" ry="34" fill={fg}/>
      <path d="M40,200 C40,148 60,120 100,120 C140,120 160,148 160,200 Z" fill={fg}/>
      <path d="M66,84 Q66,120 82,130 L78,112 Z" fill={fg}/>
      <path d="M134,84 Q134,120 118,130 L122,112 Z" fill={fg}/>
    </>,
    f: <>
      <circle cx="100" cy="76" r="32" fill={fg}/>
      <path d="M30,200 C30,144 62,118 100,118 C138,118 170,144 170,200 Z" fill={fg}/>
      <rect x="84" y="46" width="32" height="10" fill={bg} opacity=".4"/>
    </>,
    g: <>
      <path d="M72,52 L128,52 L132,84 Q132,112 100,112 Q68,112 68,84 Z" fill={fg}/>
      <path d="M35,200 C35,148 62,120 100,120 C138,120 165,148 165,200 Z" fill={fg}/>
    </>,
    h: <>
      <circle cx="100" cy="72" r="28" fill={fg}/>
      <path d="M72,98 Q72,126 100,126 Q128,126 128,98" stroke={fg} strokeWidth="4" fill="none"/>
      <path d="M34,200 C34,146 64,122 100,122 C136,122 166,146 166,200 Z" fill={fg}/>
    </>,
  };
  return (
    <svg viewBox="0 0 200 200" style={{ display:'block', width:'100%', height:'100%', ...style }} className={className}>
      <rect width="200" height="200" fill={bg}/>
      {/* subtle paper tone on bg */}
      <rect width="200" height="200" fill="url(#sil-grain)" opacity=".15"/>
      <defs>
        <filter id={`blur-${seed}`}><feGaussianBlur stdDeviation="0"/></filter>
      </defs>
      {shapes[v]}
    </svg>
  );
}

function BlurredSilhouette({ seed = 0, level = 10, className = '', style = {} }) {
  return (
    <div className={className} style={{ position:'relative', overflow:'hidden', ...style }}>
      <div style={{ position:'absolute', inset:0, filter:`blur(${level}px) saturate(1.1)`, transform:'scale(1.15)' }}>
        <Silhouette seed={seed}/>
      </div>
    </div>
  );
}

window.Silhouette = Silhouette;
window.BlurredSilhouette = BlurredSilhouette;
window.SIL_PALETTES = SIL_PALETTES;
