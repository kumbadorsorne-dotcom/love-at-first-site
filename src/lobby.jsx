// LOBBY — the hero screen. Pre-round: pod is forming.
// Editorial magazine layout. Left: masthead + pledge + pod-forming. Center: main dial.
// Right: intake manifest + teaser. Bottom: rotation card + queue marquee.

function useTicker(intervalMs = 1000) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT(x => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return t;
}

function fmt(s) {
  const m = Math.floor(s/60), ss = s%60;
  return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

// Synthesized bell chime — a small cluster of decaying sine tones
// with a bright metallic partial. Shared AudioContext, resumed on first gesture.
let __audioCtx = null;
function getAudio() {
  if (!__audioCtx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    __audioCtx = new C();
  }
  if (__audioCtx.state === 'suspended') __audioCtx.resume().catch(() => {});
  return __audioCtx;
}
// Unlock on first user gesture (browsers block autoplay audio).
if (typeof window !== 'undefined' && !window.__bellAudioUnlockBound) {
  window.__bellAudioUnlockBound = true;
  const unlock = () => { getAudio(); };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

function playBellChime() {
  const ctx = getAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Master output with a gentle bus compressor and low master gain.
  const master = ctx.createGain();
  master.gain.value = 0.35;
  master.connect(ctx.destination);

  // Each partial: frequency, decay time, relative gain, slight detune.
  // Tuned to feel like a small desk bell: a fundamental and two bright partials.
  const partials = [
    { f: 880,  d: 1.8,  g: 0.55 },  // fundamental — A5
    { f: 1320, d: 1.4,  g: 0.30 },  // fifth
    { f: 2640, d: 0.9,  g: 0.18 },  // upper shimmer
    { f: 3520, d: 0.6,  g: 0.10 },  // bright top
  ];

  const ring = (startOffset) => {
    partials.forEach(p => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now + startOffset);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now + startOffset);
      g.gain.exponentialRampToValueAtTime(p.g, now + startOffset + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + p.d);
      osc.connect(g).connect(master);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + p.d + 0.05);
    });
  };

  // Two strikes — a "ding-ding" pattern.
  ring(0.00);
  ring(0.28);
}

// Name pool for pod members
const NAMES = [
  { name:'June', age:29, city:'Brooklyn', occ:'Archivist' },
  { name:'Mateo', age:31, city:'Oakland', occ:'Sound designer' },
  { name:'Priya', age:28, city:'Chicago', occ:'Pastry chef' },
  { name:'Wren', age:33, city:'Austin', occ:'Set builder' },
  { name:'Ilse', age:27, city:'Portland', occ:'Translator' },
  { name:'Desmond', age:30, city:'Atlanta', occ:'Civil engineer' },
  { name:'Harper', age:29, city:'Denver', occ:'Arborist' },
  { name:'Tomás', age:32, city:'Boston', occ:'Oncologist' },
  { name:'Nadia', age:34, city:'Seattle', occ:'Ceramicist' },
  { name:'Ezra', age:31, city:'LA', occ:'Screenwriter' },
  { name:'Lena', age:28, city:'Brooklyn', occ:'Documentary editor' },
  { name:'Soren', age:29, city:'Seattle', occ:'Architect' },
];

function SmallCap({ children, style = {} }) {
  return <span className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)', ...style }}>{children}</span>;
}

function HairRule({ style = {} }) {
  return <div style={{ height: 1, background:'var(--line-strong)', ...style }}/>;
}

// ── Masthead ───────────────────────────────────────────────
function Clock({ label, tz }) {
  const [, setT] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setT(x => x+1), 30000); return () => clearInterval(id); }, []);
  const t = new Date().toLocaleTimeString('en-US', { timeZone: tz, hour:'2-digit', minute:'2-digit', hour12: false });
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
      <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>{label}</span>
      <span className="serif" style={{ fontSize: 18, lineHeight: 1, letterSpacing:'-0.01em', marginTop: 2, fontFeatureSettings:'"tnum"' }}>{t}</span>
    </div>
  );
}

function Masthead({ tier }) {
  return (
    <header style={{ padding:'10px 28px', borderBottom:'1px solid var(--line-strong)', position:'relative', zIndex: 2, display:'flex', alignItems:'center', justifyContent:'space-between', gap: 20 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap: 12 }}>
        <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.02em' }}>
          <span style={{ fontStyle:'italic' }}>Love</span> at First Sight
        </div>
        <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>
          Lobby
        </div>
      </div>
      <div style={{ display:'flex', gap: 14, alignItems:'center' }}>
        <SmallCap>
          <span style={{ width:6, height:6, borderRadius:99, background:'var(--rust)', display:'inline-block', marginRight:6, verticalAlign:'middle', animation:'pulse 1.4s infinite' }}/>
          Live {'\u00b7'} 2,418 in pods
        </SmallCap>
        <div style={{
          padding:'5px 12px',
          background: tier==='premium' ? '#800120' : '#FFFFFF',
          color: tier==='premium' ? '#FFFFFF' : '#800120',
          border: tier==='premium' ? 'none' : '1px solid #800120',
          fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em',
          textTransform:'uppercase', borderRadius: 10
        }}>
          {tier==='premium' ? "You're on Premium" : "You're on Basic"}
        </div>
      </div>
    </header>
  );
}

// ── Center dial ──────────────────────────────────────────────
function FormingDial({ progress, needed, have }) {
  const size = 480;
  const cx = size/2, cy = size/2;
  const R = 200;
  const dash = 2*Math.PI*R;
  const pct = progress;
  const seats = 12;
  const seatR = 18;
  // Match seeds to the manifest: position i uses seed i+3
  const seeds = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return (
    <div style={{ position:'relative', width: size, height: size, margin:'0 auto' }}>
      <svg width={size} height={size} style={{ position:'absolute', inset:0 }}>
        <circle cx={cx} cy={cy} r={R+30} fill="none" stroke="var(--line)" strokeDasharray="1 4"/>
        <circle cx={cx} cy={cy} r={R-30} fill="none" stroke="var(--line)" strokeDasharray="1 4"/>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line-strong)"/>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--rust)" strokeWidth="2"
          strokeDasharray={dash} strokeDashoffset={dash*(1-pct)}
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition:'stroke-dashoffset .6s ease' }}/>
        {[...Array(72)].map((_,i) => {
          const a = (i*5)*Math.PI/180;
          const x1 = cx + Math.cos(a)*(R+6);
          const y1 = cy + Math.sin(a)*(R+6);
          const x2 = cx + Math.cos(a)*(R+ (i%6===0?14:9));
          const y2 = cy + Math.sin(a)*(R+ (i%6===0?14:9));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-strong)" strokeWidth={i%6===0?1:0.5}/>;
        })}
        {/* 9 seat markers — empty state */}
        {[...Array(seats)].map((_,i) => {
          const a = (i*(360/seats) - 90)*Math.PI/180;
          const rr = R-54;
          const x = cx + Math.cos(a)*rr;
          const y = cy + Math.sin(a)*rr;
          const filled = i < have;
          const you = i === 0;
          if (filled) return null;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={seatR} fill="var(--paper-2)" stroke="var(--line-strong)" style={{ transition:'all .4s' }}/>
            </g>
          );
        })}
      </svg>

      {/* Filled seats as HTML overlays with silhouettes */}
      {[...Array(seats)].map((_,i) => {
        const a = (i*(360/seats) - 90)*Math.PI/180;
        const rr = R-54;
        const x = cx + Math.cos(a)*rr;
        const y = cy + Math.sin(a)*rr;
        const filled = i < have;
        const you = i === 0;
        if (!filled) return null;
        return (
          <div key={i} style={{
            position:'absolute',
            left: x - seatR, top: y - seatR,
            width: seatR*2, height: seatR*2,
            borderRadius: 99, overflow:'hidden',
            border: you ? '2px solid #800120' : '2px solid var(--rust)',
            background: you ? 'var(--ink)' : 'var(--paper-2)',
            transition:'all .4s'
          }}>
            {you ? (
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="mono caps" style={{ fontSize: 12, color:'var(--paper)', letterSpacing:'0.12em' }}>YOU</span>
              </div>
            ) : (
              <div style={{ position:'absolute', inset: -6, filter:'blur(4px) saturate(1.1)' }}>
                <Silhouette seed={seeds[i]}/>
              </div>
            )}
          </div>
        );
      })}

      {/* center readout */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
        {have >= needed ? (
          <>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>
              <span style={{ display:'inline-block', width: 5, height: 5, borderRadius: 99, background:'var(--rust)', marginRight: 5, animation:'pulse 0.8s infinite', verticalAlign:'middle' }}/>
              Pod complete
            </div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.03em', marginTop: 4, fontStyle:'italic' }}>
              9<span style={{ color:'var(--ink-3)' }}>/9</span>
            </div>
          </>
        ) : (
          <div className="serif" style={{ fontSize: 96, lineHeight: 1, letterSpacing:'-0.03em' }}>
            {have}<span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>/{needed}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Left column: pledge + filter report ─────────────────────
function PledgeCard() {
  return (
    <div style={{ border:'1px solid var(--line-strong)', padding:'18px 20px', background:'var(--cream)', borderRadius: 10 }}>
      <SmallCap>
</SmallCap>
      <div className="serif" style={{ fontSize: 24, lineHeight: 1.1, marginTop: 10, fontStyle:'italic' }}>
        

      </div>
      <div style={{ marginTop: 14, display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ fontFamily:'Lato, sans-serif', fontStyle:'italic', fontSize: 24, borderBottom:'1px solid var(--ink)', paddingBottom: 2, paddingRight: 20 }}>
          

        </div>
        <SmallCap style={{ color:'var(--rust)' }}>
</SmallCap>
      </div>
    </div>
  );
}

function FilterLedger({ tier }) {
  const filters = [
    { label: 'Smoking',      choice: 'Never' },
    { label: 'Wants kids',   choice: 'Yes' },
    { label: 'Age range',    choice: '27 – 35' },
    { label: 'Religion',     choice: 'None' },
    { label: 'Distance',     choice: 'Within 25mi' },
    { label: 'Pets',         choice: 'Dog-friendly' },
    { label: 'Zodiac',       choice: 'Fire' },
    { label: 'Diet',         choice: 'Omnivore' },
    { label: 'Politics',     choice: 'Left' },
  ];
  return (
    <div style={{ padding:'18px 20px', border:'1px solid var(--line-strong)', borderRadius: 10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
        <SmallCap>Your filters</SmallCap>
        <SmallCap style={{ color: tier === 'premium' ? 'var(--rust)' : 'var(--ink-3)' }}>
          {tier === 'premium' ? '◆ Premium · enforced' : '○ Free tier'}
        </SmallCap>
      </div>
      <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.08em', marginBottom: 12, fontStyle:'italic' }}>
        {tier === 'premium'
          ? 'Hard dealbreakers honored. Soft preferences prioritized for 10 min.'
          : "You're on the free tier — we pair you at random."}
      </div>
      {tier === 'free' ? (
        <>
          <div className="serif" style={{ fontSize: 18, fontStyle:'italic', lineHeight: 1.3, color:'var(--ink-2)' }}>
            Pod filled at random —<br/>
            <span style={{ color:'var(--ink)' }}>accept the universe's choices.</span>
          </div>
          <div style={{
            marginTop: 14, padding:'12px 20px', background:'var(--ink)', color:'var(--cream)', borderRadius: 10,
            display:'flex', justifyContent:'space-between', alignItems:'center', gap: 10
          }}>
            <div>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFFB0', letterSpacing:'0.12em' }}>Next time</div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1.1, marginTop: 2 }}>
                Upgrade to Premium for a <span style={{ fontStyle:'italic', color:'var(--rust)' }}>pod that matches your dealbreakers.</span>
              </div>
            </div>
            <button style={{ flexShrink: 0, padding:'6px 12px', background:'var(--rust)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10 }}>$20/mo →</button>
          </div>
        </>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap: 0 }}>
          {filters.map((f,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'7px 0', borderBottom: i===filters.length-1 ? 'none' : '1px dotted var(--line-strong)' }}>
              <span className="serif" style={{ fontSize: 18 }}>{f.label}</span>
              <span className="mono" style={{ fontSize: 12, color:'var(--ink-2)' }}>{f.choice}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetHistoryCard() {
  return (
    <div style={{ padding:'16px 20px', background:'var(--paper-2)', borderRadius: 10 }}>
      <SmallCap>06 · Met History Filter</SmallCap>
      <div style={{ display:'flex', alignItems:'baseline', gap: 10, marginTop: 8 }}>
        <div className="serif" style={{ fontSize: 48, lineHeight: 1 }}>47</div>
        <div className="mono" style={{ fontSize: 12, color:'var(--ink-2)', lineHeight: 1.3 }}>
          people excluded from this<br/>pod. You've seen them before.
        </div>
      </div>
    </div>
  );
}

function PreflightCard() {
  const items = [
    { label: 'Wi-Fi', value: 'Strong · 94 Mbps', ok: true },
    { label: 'Battery', value: '78% · plug in', ok: false },
    { label: 'Camera', value: 'Facing you', ok: true },
    { label: 'Microphone', value: 'Quiet room', ok: true },
  ];
  return (
    <div style={{ padding:'16px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
        <SmallCap>11 · Checklist</SmallCap>
        <SmallCap style={{ color:'var(--rust)' }}>One thing to fix</SmallCap>
      </div>
      <div className="serif" style={{ fontSize: 18, fontStyle:'italic', lineHeight: 1.15, color:'var(--ink-2)', marginBottom: 10 }}>
        Forty minutes is a long time to hold a video call. Charge your laptop, confirm your wifi, and go.
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom: i===items.length-1 ? 'none' : '1px dotted var(--line-strong)' }}>
            <span className="mono" style={{ fontSize: 12 }}>{it.label}</span>
            <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color: it.ok ? 'var(--ink-3)' : 'var(--rust)' }}>
              {it.ok ? '✓ ' : '! '}{it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Right column: intake + teaser ──────────────────────────
function IntakeManifest({ candidates }) {
  const scrollRef = React.useRef(null);
  const lastJoinedRef = React.useRef(0);
  const joinedCount = candidates.filter(c => c.joined).length;
  React.useEffect(() => {
    if (joinedCount > lastJoinedRef.current && scrollRef.current) {
      const row = scrollRef.current.querySelectorAll('[data-manifest-row]')[Math.max(0, joinedCount - 1)];
      if (row) {
        scrollRef.current.scrollTo({ top: row.offsetTop - 8, behavior: 'smooth' });
      }
    }
    lastJoinedRef.current = joinedCount;
  }, [joinedCount]);
  return (
    <div style={{ padding:'12px 20px', border:'1px solid #FFFFFF20', borderRadius: 10, background:'#0A0A0A', color:'#FFFFFF', height:'100%', display:'flex', flexDirection:'column', minHeight: 0 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
        <SmallCap>02 · Pod Manifest</SmallCap>
        <SmallCap style={{ color:'#FFFFFF' }}>In progress</SmallCap>
      </div>
      <div ref={scrollRef} style={{ display:'flex', flexDirection:'column', gap: 2, flex: 1, minHeight: 0, overflowY:'auto', scrollbarWidth:'thin' }}>
        {candidates.map((c, i) => (
          <div key={i} data-manifest-row style={{
            display:'grid', gridTemplateColumns:'28px 40px 1fr auto', alignItems:'center', gap: 10,
            padding:'8px 0', borderBottom: i===candidates.length-1 ? 'none' :'1px dotted var(--line-strong)',
            opacity: c.joined ? 1 : 0.55,
            flexShrink: 0
          }}>
            <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>{String(i+1).padStart(2,'0')}</span>
            <div style={{ width: 36, height: 36, overflow:'hidden', borderRadius: 99, border:'1px solid var(--line-strong)', position:'relative' }}>
              {c.joined ? (
                <div style={{ position:'absolute', inset: -4, filter:'blur(7px) saturate(1.05)' }}>
                  <Silhouette seed={i+3}/>
                </div>
              ) : <div style={{ width:'100%', height:'100%', background:'var(--paper-3)', backgroundImage:'repeating-linear-gradient(45deg, transparent 0 4px, var(--line) 4px 5px)' }}/>}
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span className="serif" style={{ fontSize: 18, lineHeight: 1.1 }}>
                {c.joined ? <>{c.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 12 }}> · {c.age}</span></> : <span style={{ fontStyle:'italic', color:'var(--ink-3)' }}>Searching…</span>}
              </span>
              <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>
                {c.joined ? `${c.occ} · ${c.city}` : 'candidate #' + (i+1)}
              </span>
            </div>
            <span className="mono caps" style={{ fontSize: 12, color: c.joined ? 'var(--rust)' : 'var(--ink-3)', letterSpacing:'0.12em' }}>
              {c.joined ? (c.you ? 'You' : 'Joined') : '···'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bell({ ringing, dark }) {
  const stroke = dark ? 'var(--cream)' : 'var(--ink)';
  const accent = 'var(--rust)';

  // Play a synthesized bell chime when ringing turns on.
  const wasRinging = React.useRef(false);
  React.useEffect(() => {
    if (ringing && !wasRinging.current) {
      playBellChime();
    }
    wasRinging.current = ringing;
  }, [ringing]);
  return (
    <div style={{ position:'relative', width: 56, height: 56, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {ringing && (
        <>
          <span style={{ position:'absolute', inset:-4, border:`1px solid ${accent}`, borderRadius: 10, opacity: 0.6, animation:'bellRipple 1.2s infinite' }}/>
          <span style={{ position:'absolute', inset:-10, border:`1px solid ${accent}`, borderRadius: 10, opacity: 0.3, animation:'bellRipple 1.2s infinite 0.4s' }}/>
        </>
      )}
      <svg viewBox="0 0 48 48" width="44" height="44" style={{ transformOrigin:'24px 10px', animation: ringing ? 'bellSwing 0.6s infinite' : 'none' }}>
        {/* Bell body */}
        <path d="M24 8 C15 8 13 16 13 22 C13 28 10 32 8 34 L40 34 C38 32 35 28 35 22 C35 16 33 8 24 8 Z"
              fill={ringing ? accent : 'none'} stroke={ringing ? accent : stroke} strokeWidth="1.6" strokeLinejoin="round"/>
        {/* Top loop */}
        <circle cx="24" cy="6" r="2" fill="none" stroke={ringing ? accent : stroke} strokeWidth="1.6"/>
        {/* Clapper */}
        <circle cx="24" cy="38" r="3" fill={ringing ? accent : stroke}/>
      </svg>
    </div>
  );
}

function TeaserCard({ teaserBlur, nextPerson, podFull }) {
  const filters = {
    editorial: 'blur(18px) saturate(1.05)',
    mosaic: 'blur(0) contrast(1.1)',
    ink: 'blur(8px) grayscale(1) contrast(1.4)',
    veil: 'blur(24px) brightness(1.1)',
  };
  return (
    <div style={{ padding:'16px 18px', background: podFull ? 'var(--ink)' : 'var(--paper-2)', color: podFull ? 'var(--cream)' : 'var(--ink)', borderRadius: 10, position:'relative', overflow:'hidden', border: podFull ? '1px solid var(--rust)' : 'none', boxShadow: podFull ? '0 0 0 3px #6B152022' : 'none', transition:'all .4s' }}>
      {podFull && (
        <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 3, background:'var(--rust)' }}/>
      )}
      {/* Bell icon — rings when pod is full */}
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap: 10, marginBottom: 10 }}>
        <Bell ringing={podFull} dark={podFull}/>
        <button
          onClick={() => playBellChime()}
          title="Preview the bell sound"
          style={{
            padding:'4px 9px',
            background:'transparent',
            border:`1px solid ${podFull ? '#FFFFFF40' : 'var(--line-strong)'}`,
            borderRadius: 10,
            color: podFull ? '#FFFFFFB0' : 'var(--ink-3)',
            fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.16em', textTransform:'uppercase'
          }}>
          ♪ Hear the bell
        </button>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <SmallCap style={{ color: podFull ? '#FFFFFFB0' : 'var(--ink-3)' }}>09 · {podFull ? 'Your First Date →' : 'Next Up (Preview)'}</SmallCap>
        {podFull && <SmallCap style={{ color:'var(--rust)' }}><span style={{ display:'inline-block', width: 5, height: 5, borderRadius: 99, background:'var(--rust)', marginRight: 5, animation:'pulse 0.8s infinite', verticalAlign:'middle' }}/>Date 1 of 6</SmallCap>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'90px 1fr', gap: 14, marginTop: 10, alignItems:'center' }}>
        <div style={{ width: 90, height: 100, position:'relative', borderRadius: 10, overflow:'hidden', border:'1px solid var(--line-strong)' }}>
          {teaserBlur === 'mosaic' ? (
            <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gridTemplateRows:'repeat(11, 1fr)', filter: podFull ? 'none' : 'blur(0)' }}>
              {[...Array(110)].map((_,i) => {
                const a = ((i*37) % 100)/100;
                return <div key={i} style={{ background:`rgba(184,65,12,${0.3+a*0.5})` }}/>;
              })}
            </div>
          ) : (
            <div style={{ position:'absolute', inset: teaserBlur==='editorial'?-10:0, filter: podFull ? 'none' : filters[teaserBlur], transition:'filter .5s' }}>
              <Silhouette seed={nextPerson.seed}/>
            </div>
          )}
          {teaserBlur === 'veil' && !podFull && (
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, var(--paper-2))' }}/>
          )}
        </div>
        <div>
          <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.01em', color: podFull ? 'var(--cream)' : 'var(--ink)' }}>
            {nextPerson.name}<span style={{ color: podFull ? '#FFFFFFB0' : 'var(--ink-3)', fontStyle:'italic', fontSize: 24 }}>, {nextPerson.age}</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: podFull ? '#FFFFFFB0' : 'var(--ink-2)', marginTop: 6, lineHeight: 1.3 }}>
            {nextPerson.occ}<br/>{nextPerson.city}
          </div>
          <div style={{ marginTop: 10, display:'flex', gap: 5, flexWrap:'wrap' }}>
            {['Non-smoker','Wants kids','Libra'].map(t => (
              <span key={t} className="mono" style={{ fontSize: 12, padding:'2px 7px', border:`1px solid ${podFull ? '#FFFFFF40' : 'var(--line-strong)'}`, borderRadius: 10, color: podFull ? '#FFFFFFB0' : 'var(--ink-2)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mono" style={{ fontSize: 12, color: podFull ? 'var(--rust)' : 'var(--ink-3)', marginTop: 12, fontStyle:'italic' }}>
        {podFull ? 'The face reveals at the bell. Sit up straight.' : 'The face unblurs at the bell.'}
      </div>
    </div>
  );
}

function LockedInFuzzyCard({ tier, podFull }) {
  const ROTATION_TOTAL = 600; // 10 min — same timer continues after pod fills
  // Single shared clock across pre-full / pod-full / getready
  const [sec, setSec] = React.useState(() => {
    try {
      const stored = localStorage.getItem('lfs.chatSec');
      if (stored !== null) {
        const n = parseInt(stored, 10);
        if (!isNaN(n) && n >= 0 && n <= ROTATION_TOTAL) return n;
      }
    } catch(e) {}
    return ROTATION_TOTAL;
  });

  React.useEffect(() => {
    const id = setInterval(() => {
      setSec(s => {
        const next = s > 0 ? s - 1 : ROTATION_TOTAL;
        try { localStorage.setItem('lfs.chatSec', String(next)); } catch(e) {}
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = Math.floor(sec / 60);
  const ss = sec % 60;

  // ── POD FULL: black variant — same countdown, just darker treatment ──
  if (podFull) {
    return (
      <div style={{
        padding:'18px 22px', border:'1px solid var(--ink)', borderRadius: 10,
        background:'var(--ink)', color:'var(--cream)', position:'relative', overflow:'hidden',
        boxShadow:'0 0 0 3px #6B152022', transition:'all .5s'
      }}>
        <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 3, background:'var(--rust)' }}/>
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap: 22, alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 9, height: 9, borderRadius: 99, background:'var(--rust)', animation:'pulse 0.8s infinite', boxShadow:'0 0 0 4px #6B152030' }}/>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>
              Locked in
            </div>
          </div>
          <div style={{ paddingLeft: 22, borderLeft:'1px dotted #FFFFFF30' }}>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', fontFeatureSettings:'"tnum"', color:'var(--rust)' }}>
              {String(mm).padStart(2,'0')}<span style={{ color:'#FFFFFF' }}>:</span>{String(ss).padStart(2,'0')}
            </div>
            <div className="mono" style={{ fontSize: 12, color:'#FFFFFFB0', letterSpacing:'0.12em', lineHeight: 1.3, marginTop: 6 }}>
              of 10:00 minutes until your first chat
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap: 8 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4 }}>
              <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', padding:'4px 8px', border:'1px solid #FFFFFF40', borderRadius: 10, color:'#FFFFFFB0' }}>Wi-Fi ✓</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4 }}>
              <svg width="14" height="12" viewBox="0 0 24 22" fill="none" aria-hidden>
                <path d="M12 1L23 21H1L12 1Z" stroke="var(--rust)" strokeWidth="2" strokeLinejoin="round" fill="#6B152030"/>
                <rect x="11" y="8" width="2" height="6" fill="var(--rust)"/>
                <rect x="11" y="16" width="2" height="2" fill="var(--rust)"/>
              </svg>
              <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', padding:'4px 8px', border:'1px solid var(--rust)', borderRadius: 10, color:'var(--rust)', background:'#6B152020' }}>Mic ⚠</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4 }}>
              <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', padding:'4px 8px', border:'1px solid #FFFFFF40', borderRadius: 10, color:'#FFFFFFB0' }}>Cam ✓</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PRE-FULL: rotation countdown + status chips ──
  const MicChip = ({ label, ok = true, warn = false, title, body, cta }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        tabIndex={0}
        style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap: 4, cursor:'help' }}
      >
        {warn && (
          <svg width="14" height="12" viewBox="0 0 24 22" fill="none" aria-hidden>
            <path d="M12 1L23 21H1L12 1Z" stroke="var(--rust)" strokeWidth="2" strokeLinejoin="round" fill="#6B152018"/>
            <rect x="11" y="8" width="2" height="6" fill="var(--rust)"/>
            <rect x="11" y="16" width="2" height="2" fill="var(--rust)"/>
          </svg>
        )}
        <span className="mono caps" style={{
          fontSize: 12, letterSpacing:'0.12em',
          padding:'4px 8px',
          border: `1px solid ${warn ? 'var(--rust)' : 'var(--line-strong)'}`,
          borderRadius: 10,
          color: warn ? 'var(--rust)' : 'var(--ink-3)',
          background: warn ? '#6B152010' : 'transparent'
        }}>
          {label} {warn ? '⚠' : ok ? '✓' : ''}
        </span>
        {open && (title || body) && (
          <div role="tooltip" style={{
            position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)',
            width: 200, padding:'12px 20px',
            background:'var(--ink)', color:'var(--cream)',
            border:'1px solid var(--ink)', borderRadius: 10,
            boxShadow:'0 10px 24px -12px #00000080',
            zIndex: 60, pointerEvents: cta ? 'auto' : 'none',
            textAlign:'left'
          }}>
            <div className="mono caps" style={{ fontSize: 12, color: warn ? 'var(--rust)' : '#FFFFFFB0', letterSpacing:'0.16em', marginBottom: 4 }}>
              {title}
            </div>
            <div className="serif" style={{ fontSize: 12, fontStyle:'italic', lineHeight: 1.3 }}>
              {body}
            </div>
            {cta && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="mono caps"
                style={{
                  marginTop: 8, padding:'6px 12px',
                  fontSize: 12, letterSpacing:'0.16em',
                  background:'var(--rust)', color:'var(--cream)',
                  border:'1px solid var(--rust)', borderRadius: 10, cursor:'pointer'
                }}
              >
                {cta} →
              </button>
            )}
            <div style={{
              position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
              width: 0, height: 0,
              borderLeft:'6px solid transparent',
              borderRight:'6px solid transparent',
              borderTop:'6px solid var(--ink)'
            }}/>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding:'12px 20px', border:'1px solid var(--ink)', borderRadius: 10, background:'var(--cream)', transition:'all .5s' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: 20, alignItems:'center' }}>
        <div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', fontFeatureSettings:'"tnum"', color:'var(--ink)' }}>
            {String(mm).padStart(2,'0')}<span style={{ color:'var(--rust)' }}>:</span>{String(ss).padStart(2,'0')}
          </div>
          <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', lineHeight: 1.3, marginTop: 6 }}>
            of 10:00 minutes until your first chat
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap: 8 }}>
          <MicChip label="Wi-Fi" ok title="Wi-Fi · strong" body="94 Mbps · stable. Good for the full circuit."/>
          <MicChip label="78%" ok title="Battery · 78%" body="Should last ≈45 min. Plug in if you're cutting it close." cta="Plug in"/>
          <MicChip label="Mic" warn title="Microphone is off" body="Toggle your mic on before the bell rings." cta="Toggle on"/>
          <MicChip label="Cam" ok title="Camera · framed" body="Head-to-shoulders. Eye-level. Looking good."/>
        </div>
      </div>
    </div>
  );
}

function FuzzyMatchCard({ tier }) {
  const TOTAL = 600; // 10 min in seconds
  const [sec, setSec] = React.useState(TOTAL);
  React.useEffect(() => {
    const id = setInterval(() => setSec(s => s > 0 ? s - 1 : TOTAL), 1000);
    return () => clearInterval(id);
  }, []);
  const pct = 1 - sec / TOTAL;
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  const expired = sec <= 0;
  const isPremium = tier === 'premium';

  return (
    <div style={{ padding:'12px 16px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <SmallCap>04 · Fuzzy-match window</SmallCap>
        <SmallCap style={{ color:'var(--rust)' }}>
          <span style={{ display:'inline-block', width: 6, height: 6, borderRadius: 99, background:'var(--rust)', marginRight: 6, verticalAlign:'middle', animation:'pulse 1.2s infinite' }}/>
          {expired ? 'Fallback active' : 'Scanning'}
        </SmallCap>
      </div>

      {/* Compact countdown row */}
      <div style={{ display:'flex', alignItems:'baseline', gap: 10, marginTop: 4 }}>
        <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', fontFeatureSettings:'"tnum"', color: expired ? 'var(--ink-3)' : 'var(--ink)' }}>
          {String(mm).padStart(2,'0')}<span style={{ color:'var(--rust)' }}>:</span>{String(ss).padStart(2,'0')}
        </div>
        <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', lineHeight: 1.3 }}>
          of 10:00 to perfect pod
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 8, height: 3, background:'var(--paper-3)', borderRadius: 10, overflow:'hidden', position:'relative' }}>
        <div style={{ width: `${pct*100}%`, height:'100%', background:'var(--rust)', transition:'width 1s linear' }}/>
      </div>
      <div className="mono" style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 3 }}>
        <span>00:00 · initial scan</span><span>10:00 · fallback</span>
      </div>
    </div>
  );
}

function Phase({ active, n, label, body, done, last }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'26px 1fr auto', alignItems:'flex-start', gap: 10, padding:'8px 0', borderBottom: last ? 'none' : '1px dotted var(--line-strong)' }}>
      <span className="mono" style={{ fontSize: 12, color: active ? 'var(--rust)' : 'var(--ink-3)', letterSpacing:'0.12em' }}>{n}</span>
      <div>
        <div className="serif" style={{ fontSize: 14, lineHeight: 1.1, color: active ? 'var(--ink)' : 'var(--ink-3)' }}>{label}</div>
        <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2, lineHeight: 1.35 }}>{body}</div>
      </div>
      <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color: done ? 'var(--ink-3)' : active ? 'var(--rust)' : 'var(--ink-3)', marginTop: 3 }}>
        {done ? '✓ done' : active ? '● live' : '○ waiting'}
      </span>
    </div>
  );
}

// ── Combined Manifest + Rotation card ──────────
function ManifestRotationCard({ candidates }) {
  const joinedCount = candidates ? candidates.filter(c => c.joined).length : 0;
  const scrollRef = React.useRef(null);
  const lastJoinedRef = React.useRef(0);
  React.useEffect(() => {
    if (joinedCount > lastJoinedRef.current && scrollRef.current) {
      const rows = scrollRef.current.querySelectorAll('[data-person-row]');
      const lastRow = rows[Math.max(0, joinedCount - 1)];
      if (lastRow) lastRow.scrollIntoView({ behavior:'smooth', block:'center' });
    }
    lastJoinedRef.current = joinedCount;
  }, [joinedCount]);

  return (
    <div style={{ position:'relative', padding:'12px 20px', border:'1px solid #FFFFFF20', borderRadius: 10, background:'#0A0A0A', color:'#FFFFFF', height:'100%', display:'flex', flexDirection:'column', minHeight: 0 }}>
      {candidates && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
            <SmallCap>{joinedCount} / 12 joined</SmallCap>
          </div>
          {/* Overlay badge: marks the right column as YOUR DATES */}
          <span className="mono caps" style={{
            position:'absolute', top: 10, right: '25%', transform:'translateX(50%)',
            zIndex: 5,
            fontSize: 12, letterSpacing:'0.16em',
            color:'var(--cream)', background:'var(--rust)',
            padding:'4px 12px', borderRadius: 99, fontWeight: 700,
            boxShadow:'0 4px 14px #00000080, 0 0 0 3px #80012033'
          }}>
            Your dates
          </span>
          <div ref={scrollRef} style={{ display:'flex', flexDirection:'column', gap: 6, flex: 1, minHeight: 0, overflowY:'auto', scrollbarWidth:'thin' }}>
            <div style={{ position:'relative', display:'flex', flexDirection:'column', gap: 6 }}>
              {/* Single column outline wrapping all matches on the right */}
              <div style={{ position:'absolute', top: 0, bottom: 0, right: 0, left:'54%', border:'1px solid var(--rust)', borderRadius: 10, pointerEvents:'none', zIndex: 1 }}/>
            {(() => {
              const pairs = [];
              for (let i = 0; i < candidates.length; i += 2) {
                pairs.push([candidates[i], candidates[i+1] || null]);
              }
              return pairs.map((pair, pi) => {
                const [a, b] = pair;
                const bothJoined = a?.joined && b?.joined;
                const eitherJoined = a?.joined || b?.joined;
                return (
                  <div key={pi} style={{
                    padding:'10px 12px', borderRadius: 10,
                    background: a?.you ? '#80012018' : '#0A0A0A',
                    border: bothJoined ? '1px solid #FFFFFF20' : '1px solid #FFFFFF0A',
                    opacity: eitherJoined ? 1 : 0.5
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
                      <span className="mono caps" style={{ fontSize: 12, color: a?.you ? '#800120' : '#FFFFFF', letterSpacing:'0.12em', fontWeight: 700 }}>Date {pi + 1}</span>
                      <span className="mono" style={{ fontSize: 10, color: bothJoined ? '#800120' : '#888888', letterSpacing:'0.08em' }}>
                        {bothJoined ? '\u2665 ' + ['first','second','third','fourth','fifth','sixth'][pi] + ' date' : '5:00 min'}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                      {/* Person A */}
                      <div style={{ display:'flex', alignItems:'center', gap: 8, flex: 1 }}>
                        <div style={{ width: 32, height: 32, overflow:'hidden', borderRadius: 99, border: a?.you ? '2px solid #800120' : '1px solid #FFFFFF20', position:'relative', flexShrink: 0 }}>
                          {a?.joined ? (
                            <div style={{ position:'absolute', inset: -4, filter: a?.you ? 'none' : 'blur(7px) saturate(1.05)' }}>
                              <Silhouette seed={a?.you ? 1 : pi*2+3}/>
                            </div>
                          ) : <div style={{ width:'100%', height:'100%', background:'#1A1A1A' }}/>}
                        </div>
                        <div>
                          <div className="serif" style={{ fontSize: 14, lineHeight: 1, color:'#FFFFFF' }}>
                            {a?.you ? 'You' : a?.joined ? a.name : '...'}
                          </div>
                          {a?.joined && !a?.you && <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 1 }}>{a.city}</div>}
                        </div>
                      </div>

                      <div className="mono caps" style={{ fontSize: 24, color:'#800120', letterSpacing:'0.08em' }}>&amp;</div>

                      {/* Person B */}
                      <div style={{ display:'flex', alignItems:'center', gap: 8, flex: 1, justifyContent:'flex-end' }}>
                        <div style={{ textAlign:'right' }}>
                          <div className="serif" style={{ fontSize: 14, lineHeight: 1, color:'#FFFFFF' }}>
                            {b?.joined ? b.name : '...'}
                          </div>
                          {b?.joined && <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 1 }}>{b.city}</div>}
                        </div>
                        <div style={{ width: 32, height: 32, overflow:'hidden', borderRadius: 99, border:'1px solid #FFFFFF20', position:'relative', flexShrink: 0 }}>
                          {b?.joined ? (
                            <div style={{ position:'absolute', inset: -4, filter:'blur(7px) saturate(1.05)' }}>
                              <Silhouette seed={pi*2+4}/>
                            </div>
                          ) : <div style={{ width:'100%', height:'100%', background:'#1A1A1A' }}/>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
            </div>
            {/* Reveal */}
            <div style={{ padding:'8px 12px', background:'#1A1A1A', borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
              <span className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>{'\u2609'} Reveal</span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

// ── Live queue marquee ──────────────────────────────────────
function QueueMarquee() {
  const items = [
    "'We accept the love we think we deserve.' — Chbosky",
    'Sit up straight. Smile with your eyes. Breathe.',
    'The algorithm has opinions, but so do you.',
    "'To love at all is to be vulnerable.' — C.S. Lewis",
    'Ask a real question. Give a real answer.',
    'You are allowed to want what you want.',
    "'Love is a verb.' — bell hooks",
    'No one has ever regretted being curious about a stranger.',
    "'The best love is the kind that awakens the soul.' — Sparks",
    'Laugh if something is funny. Be quiet if it isn\u2019t.',
    'It takes five seconds to be kind. Spend them.',
    "'We are most alive when we\u2019re in love.' — Hafiz",
    'You don\u2019t have to be charming. Just be present.',
  ];
  const loop = [...items, ...items];
  return (
    <div style={{ borderTop:'1px solid var(--line-strong)', borderBottom:'1px solid var(--line-strong)', padding:'10px 0', overflow:'hidden', background:'var(--paper-2)' }}>
      <div className="marq-track">
        {loop.map((x, i) => (
          <span key={i} className="mono caps" style={{ fontSize: 12, color:'var(--ink-2)', letterSpacing:'0.16em', display:'inline-flex', alignItems:'center', gap:14 }}>
            <span style={{ color:'var(--rust)' }}>✦</span> {x}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Bell countdown (top strip) ──────────────────────────────
function BellStrip({ secondsLeft, tier, fuzzyAt }) {
  const pct = Math.min(1, Math.max(0, 1 - secondsLeft / fuzzyAt));
  return (
    <div style={{ position:'relative', padding:'12px 36px', background:'var(--ink)', color:'var(--paper)', display:'flex', alignItems:'center', gap: 20, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em' }}>
      {/* Highlighted pod name */}
      <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'6px 12px', background:'var(--rust)', borderRadius: 10 }}>
        <span className="caps" style={{ fontSize: 12, opacity: 0.8, letterSpacing:'0.16em' }}>You're in pod</span>
        <span className="serif" style={{ fontStyle:'italic', fontSize: 24, lineHeight: 1, color:'var(--cream)' }}>Ardor</span>
      </div>
      <span style={{ color:'var(--paper)', opacity:.35 }}>|</span>
      <span className="caps">Bell in <span style={{ color:'var(--rust)', fontSize: 12 }}>{fmt(secondsLeft)}</span></span>
      <span style={{ color:'var(--paper)', opacity:.35 }}>|</span>
      <span className="caps" style={{ opacity:.7 }}>{tier==='premium' ? 'Premium filters armed' : 'Free tier · random pod'}</span>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap: 10 }}>
        <span className="caps" style={{ opacity:.5, fontSize: 12 }}>Fuzzy-match window</span>
        <div style={{ width: 120, height: 4, background:'#ffffff18', borderRadius: 10, overflow:'hidden' }}>
          <div style={{ width: `${80+pct*15}%`, height:'100%', background:'var(--rust)' }}/>
        </div>
      </div>
    </div>
  );
}

// ── Whole lobby composition ─────────────────────────────────
function LobbyView({ tweaks }) {
  const tick = useTicker(1000);
  // simulate pod filling over ~48s, hold at 9 for 8s, reset
  const [have, setHave] = React.useState(3);
  const [fullFor, setFullFor] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setHave(h => {
        if (h >= 9) {
          setFullFor(f => f + 1);
          return h;
        }
        return h + 1;
      });
    }, 4200);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    if (fullFor >= 2) { setHave(3); setFullFor(0); }
  }, [fullFor]);
  const podFull = have >= 12;
  const secondsLeft = Math.max(30, 190 - tick);
  const bellCountdown = Math.max(0, 12 - fullFor * 4);
  const [flutterHearts, setFlutterHearts] = React.useState([]);
  const prevHave = React.useRef(have);
  React.useEffect(() => {
    if (have > prevHave.current) {
      const newHearts = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        size: 14 + Math.random() * 18,
        drift: (Math.random() - 0.5) * 60,
        dur: 1.5 + Math.random() * 1.5,
      }));
      setFlutterHearts(prev => [...prev, ...newHearts]);
      setTimeout(() => setFlutterHearts(prev => prev.filter(h => !newHearts.includes(h))), 4000);
    }
    prevHave.current = have;
  }, [have]);

  const [bellPlayed, setBellPlayed] = React.useState(false);
  const [showCountdown, setShowCountdown] = React.useState(false);
  const [countdownSec, setCountdownSec] = React.useState(5);
  React.useEffect(() => {
    if (podFull && !bellPlayed) {
      setBellPlayed(true);
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          const now = ctx.currentTime;
          [880, 1320, 1760].forEach((f, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0, now + i * 0.015);
            g.gain.linearRampToValueAtTime(0.3 / (i + 1), now + i * 0.015 + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
            o.connect(g).connect(ctx.destination);
            o.start(now + i * 0.015); o.stop(now + 2.1);
          });
          setTimeout(() => ctx.close(), 2500);
        }
      } catch(e) {}
      setTimeout(() => setShowCountdown(true), 3000);
    }
  }, [podFull]);
  React.useEffect(() => {
    if (!showCountdown) return;
    const id = setInterval(() => {
      setCountdownSec(s => {
        if (s <= 1) {
          clearInterval(id);
          window.__setView && window.__setView('prep-notify');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showCountdown]);

  const candidates = React.useMemo(() => {
    return NAMES.slice(0,12).map((n,i) => ({
      ...n,
      joined: i < have,
      you: i === 0,
    }));
  }, [have]);

  const nextPerson = NAMES[1];

  return (
    <div style={{ position:'relative', zIndex: 0, height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--ink)', color:'var(--cream)' }}>
      <Masthead tier={tweaks.tier}/>

      {/* Bell notification + pod title — same row */}
      <div style={{ margin:'0 28px 12px', display:'flex', alignItems:'center', gap: 18 }}>
        <div style={{ width: 340, flexShrink: 0 }}>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, letterSpacing:'-0.02em' }}>
            You're in pod: <span style={{ fontStyle:'italic', color:'var(--rust)' }}>Ardor</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 6, letterSpacing:'0.08em' }}>
            Assembling a pod of twelve people and six dates.
          </div>
        </div>
        <div style={{
          flex: 1, padding:'12px 20px', borderRadius: 10, display:'flex', alignItems:'center', gap: 14,
          background: have >= 12 ? 'var(--rust)' : '#800120',
          border: have >= 12 ? '1px solid var(--rust)' : '1px solid #800120',
          transition:'all .4s'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke={have >= 12 ? 'var(--cream)' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, animation: have >= 12 ? 'bellSwing 0.4s ease infinite' : 'none', transformOrigin:'top center' }}>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <div>
            <div className="serif" style={{ fontSize: 18, lineHeight: 1.1, color: have >= 12 ? 'var(--cream)' : '#FFFFFF' }}>
              {have >= 12
                ? 'The bell has rung. Entering prep room...'
                : "Turn your volume up! When the 12th person joins, the bell rings and you'll be moved to the prep room."}
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, minHeight: 0, padding:'0 28px 18px', display:'grid', gridTemplateColumns:'340px 1fr', gap: 18, alignItems:'start', overflow:'hidden' }}>
        {/* LEFT */}
        <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: 0, overflow:'hidden' }}>
            <ManifestRotationCard candidates={candidates}/>
          </div>
        </div>

        {/* CENTER */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'stretch', gap: 12, height:'100%', minHeight: 0 }}>
          <div style={{ flex: 1, border:'1px solid #FFFFFF20', borderRadius: 10, padding:'14px 20px 16px', background:'#0A0A0A', position:'relative', display:'flex', flexDirection:'column', minHeight: 0, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
              <SmallCap>The Round</SmallCap>
              <SmallCap>Pod Ardor</SmallCap>
            </div>
            <div style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight: 0, gap: 6, overflow:'hidden' }}>
              <FormingDial progress={have/12} needed={12} have={have}/>
              {have < 12 && (
                <div className="mono" style={{ fontSize: 12, color:'#CCCCCC', lineHeight: 1.3, textAlign:'center' }}>
                  {12 - have} {12 - have === 1 ? 'person' : 'people'} left to join the pod.
                </div>
              )}
            </div>
            <HairRule style={{ margin:'10px 0' }}/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 0, textAlign:'center' }}>
              <Stat kicker="Dates" value="6" sub="in total"/>
              <Stat kicker="Per call" value="5:00" sub="minutes"/>
              <Stat kicker="Verdict" value="1:00" sub="minute"/>
            </div>
          </div>

        </div>

      </main>

      {/* Flutter hearts */}
      {flutterHearts.map(h => (
        <div key={h.id} style={{
          position:'fixed', left: `${h.x}%`, bottom: -30, zIndex: 9990, pointerEvents:'none',
          fontSize: h.size, color:'#800120',
          animation: `heartFloat ${h.dur}s ease-out forwards`,
          animationDelay: `${h.delay}s`,
          transform: `translateX(${h.drift}px)`
        }}>{'\u2665'}</div>
      ))}

      {/* Countdown popup */}
      {showCountdown && (
        <div style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(6px)',
          display:'flex', alignItems:'center', justifyContent:'center', animation:'fade .3s ease both'
        }}>
          <div style={{
            background:'#111111', border:'1px solid var(--ink)', borderRadius: 10,
            padding:'48px 56px', textAlign:'center', boxShadow:'0 40px 80px -30px #0A0A0A80',
            maxWidth: 520
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="var(--rust)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation:'bellSwing 0.4s ease infinite', transformOrigin:'top center', margin:'0 auto 16px' }}>
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em' }}>
              All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>9 players</span> are here.
            </div>
            <div className="serif" style={{ fontSize: 18, fontStyle:'italic', color:'#CCCCCC', marginTop: 12, lineHeight: 1.3 }}>
              You are now moving to the prep room.
            </div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, color:'var(--rust)', marginTop: 20, fontFeatureSettings:'"tnum"' }}>
              {countdownSec}
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.16em', marginTop: 8 }}>
              seconds
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ kicker, value, sub }) {
  return (
    <div style={{ borderRight:'1px solid var(--line)', padding:'4px 6px' }}>
      <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>{kicker}</div>
      <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
      {sub && <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function RulesCtaCard() {
  return (
    <button style={{
      padding:'14px 20px', border:'1px solid var(--ink)', borderRadius: 10, background:'#1A1A1A',
      display:'flex', justifyContent:'space-between', alignItems:'center',
      fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
      color:'var(--ink)'
    }}>
      <span>View full rules & penalties</span>
      <span style={{ fontFamily:'Lato, sans-serif', fontSize: 18, fontStyle:'italic' }}>→</span>
    </button>
  );
}

function SafetyCard() {
  const strikesUsed = 0;
  const strikesMax = 3;
  const flags = [
    { label:'Reclining / lying down', note:'Immediate pause · strike' },
    { label:'Face not visible', note:'Pause after 10s' },
    { label:'Screen recording detected', note:'Call ends · permanent ban' },
    { label:'Indecorum', note:'Auto-report to human' },
    { label:'Backgcircuit audio leak', note:'Mic muted, warning' },
  ];
  return (
    <div style={{ padding:'18px 20px', border:'1px solid var(--ink)', borderRadius: 10, background:'#1A1A1A' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <SmallCap>08 · Decorum Engine</SmallCap>
        <SmallCap style={{ color:'var(--rust)' }}>Live</SmallCap>
      </div>

      <div className="serif" style={{ fontSize: 24, lineHeight: 1.1, marginTop: 10, letterSpacing:'-0.01em' }}>
        AI vision is <span style={{ fontStyle:'italic' }}>watching the room.</span>
      </div>

      {/* Strike meter */}
      <div style={{ marginTop: 14, padding:'12px 14px', background:'#1A1A1A', borderRadius: 10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <span className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.16em' }}>Your strike count</span>
          <span className="mono" style={{ fontSize: 12, color:'#888888' }}>{strikesUsed} of {strikesMax}</span>
        </div>
        <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
          {[...Array(strikesMax)].map((_, i) => {
            const used = i < strikesUsed;
            return (
              <div key={i} style={{
                flex: 1, padding:'8px 6px', borderRadius: 10,
                border: used ? '1px solid var(--rust)' : '1px dashed var(--line-strong)',
                background: used ? 'var(--rust)' : 'transparent',
                color: used ? 'var(--cream)' : 'var(--ink-3)',
                textAlign:'center'
              }}>
                <div className="serif" style={{ fontSize: 18, lineHeight: 1, fontStyle:'italic' }}>{i+1}</div>
                <div className="mono" style={{ fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', marginTop: 2 }}>
                  {i===0?'Warning':i===1?'14-day ban':'Deleted'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlighted flags */}
      <div style={{ marginTop: 14 }}>
        <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.16em', marginBottom: 8 }}>Flags · auto-triggered</div>
        <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
          {flags.map((f, i) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'auto 1fr auto', gap: 10, alignItems:'center',
              padding:'8px 10px', border:'1px solid #FFFFFF20', borderLeft:'3px solid var(--rust)', borderRadius: 10, background:'#1A1A1A'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)' }}/>
              <span className="serif" style={{ fontSize: 14, lineHeight: 1.1 }}>{f.label}</span>
              <span className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>{f.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to full rules */}
      <button style={{
        marginTop: 14, width:'100%', padding:'11px 14px',
        border:'1px solid var(--ink)', borderRadius: 10,
        fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
        color:'var(--ink)', background:'transparent',
        display:'flex', justifyContent:'space-between', alignItems:'center'
      }}>
        <span>View full rules & penalties</span>
        <span style={{ fontFamily:'Lato, sans-serif', fontSize: 18, fontStyle:'italic' }}>→</span>
      </button>
    </div>
  );
}

function PromptPreview() {
  return (
    <div style={{ padding:'16px 18px', background:'var(--ink)', color:'var(--paper)', borderRadius: 10, position:'relative', overflow:'hidden' }}>
      <SmallCap style={{ color:'#FFFFFF80' }}>10 · Icebreaker · Date 1</SmallCap>
      <div className="serif" style={{ fontSize: 24, lineHeight: 1.1, marginTop: 10, fontStyle:'italic' }}>
        "What's a skill you quietly think you have — and would refuse to prove on camera?"
      </div>
      <div className="mono" style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
        Appears bottom-center when the bell rings. Unique per call.
      </div>
    </div>
  );
}

const btnSubtle = {
  padding:'9px 14px', fontSize: 12, fontFamily:'Lato, sans-serif',
  letterSpacing:'0.08em', color:'#CCCCCC', border:'1px solid #FFFFFF20',
  borderRadius: 10, background:'transparent', textTransform:'uppercase'
};
const btnSolid = {
  padding:'9px 16px', fontSize: 12, fontFamily:'Lato, sans-serif',
  letterSpacing:'0.08em', color:'var(--cream)', border:'1px solid var(--ink)',
  borderRadius: 10, background:'var(--ink)', textTransform:'uppercase'
};

function Footer() {
  return (
    <footer style={{ padding:'24px 36px 60px', borderTop:'1px solid var(--line-strong)', marginTop: 20, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 32, alignItems:'start' }}>
      <div>
        <div className="serif" style={{ fontSize: 24, fontStyle:'italic' }}>Love at First Site</div>
        <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 6, lineHeight: 1.5 }}>
          A synchronous dating circuit run on weeknights.<br/>
          Ten people. Nine dates. One revelation.
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
        <SmallCap>House Rules</SmallCap>
        <a className="u mono" style={{ fontSize: 12, marginTop: 6 }}>The 5-2-8 Rotation</a>
        <a className="u mono" style={{ fontSize: 12 }}>Three-Strike System</a>
        <a className="u mono" style={{ fontSize: 12 }}>Why Profiles Lock</a>
        <a className="u mono" style={{ fontSize: 12 }}>The Fuzzy-Match Reprieve</a>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
        <SmallCap>Correspondence</SmallCap>
        <div className="mono" style={{ fontSize: 12, marginTop: 6, color:'#CCCCCC' }}>hello@lovedatfirstsight.co</div>
        <div className="mono" style={{ fontSize: 12, color:'#CCCCCC' }}>Edit profile: submit the Manual Contact Form.</div>
      </div>
    </footer>
  );
}

window.LobbyView = LobbyView;
window.SafetyCard = SafetyCard;
