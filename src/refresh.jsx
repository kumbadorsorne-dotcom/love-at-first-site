// Midway refresh — 5 min break.
// Compact above-the-fold layout.

const REFRESH_POPUPS = [
  { kicker: 'Dental check', q: 'Teeth situation? No spinach, no rogue poppy seeds.' },
  { kicker: 'Hair audit', q: 'Smooth the flyaways. You\u2019ll thank yourself in four minutes.' },
  { kicker: 'Room tour', q: 'What\u2019s behind you on camera? A pile of laundry says a lot.' },
  { kicker: 'Posture', q: 'Sit up. You look 30% more interested.' },
];

const REFRESH_ROSTER = [
  { idx: 1, name:'June',    age:29, city:'Brooklyn', occ:'Archivist',      seed: 3 },
  { idx: 2, name:'Mateo',   age:31, city:'Oakland',  occ:'Sound designer', seed: 4 },
  { idx: 3, name:'Priya',   age:28, city:'Chicago',  occ:'Pastry chef',    seed: 6 },
  { idx: 4, name:'Wren',    age:33, city:'Austin',   occ:'Set builder',    seed: 5 },
  { idx: 5, name:'Desmond', age:30, city:'Atlanta',  occ:'Civil engineer', seed: 7 },
  { idx: 6, name:'Ilse',    age:27, city:'Portland', occ:'Translator',     seed: 8 },
  { idx: 7, name:'Tomás',   age:32, city:'Boston',   occ:'Oncologist',     seed: 9 },
  { idx: 8, name:'Harper',  age:29, city:'Denver',   occ:'Arborist',       seed: 2 },
];

function RefreshView({ tweaks }) {
  const [timeLeft, setTimeLeft] = React.useState(254);
  const [notes] = useNotes();
  const [verdicts] = useVerdicts();
  const [popupIdx, setPopupIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => t > 0 ? t-1 : 300), 1000);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    const id = setInterval(() => setPopupIdx(i => (i+1) % REFRESH_POPUPS.length), 3500);
    return () => clearInterval(id);
  }, []);
  const fmtT = (s) => {
    const m = Math.floor(s/60), ss = s%60;
    return `${m}:${String(ss).padStart(2,'0')}`;
  };
  const pct = timeLeft/300;

  const completed = REFRESH_ROSTER.slice(0, 4);
  const mutuals = completed.filter(c => verdicts[c.idx] === 'yes');
  const mutualSet = new Set(mutuals.map(m => m.idx));
  const remaining = REFRESH_ROSTER.slice(4);
  const popup = REFRESH_POPUPS[popupIdx];

  const checklist = [
    { label: 'Wi-Fi', ok: true },
    { label: 'Battery · plug in', ok: false },
    { label: 'Camera', ok: true },
    { label: 'Mic', ok: true },
  ];

  return (
    <div style={{ height:'100vh', padding:'16px 36px 20px', display:'flex', flexDirection:'column', boxSizing:'border-box', overflow:'hidden' }}>
      {/* Top bar — one row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--line-strong)', paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ display:'flex', gap: 14, alignItems:'baseline' }}>
          <span className="serif" style={{ fontSize: 24, fontStyle:'italic' }}>Love at First Site</span>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Pod Ardor</span>
        </div>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--cream)', background:'var(--rust)', padding:'4px 10px', letterSpacing:'0.18em', borderRadius: 2, fontWeight: 600 }}>Call 5 / 8 {'\u00b7'} Intermission</span>
          <div style={{ display:'flex', gap: 6 }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ width: 22, height: 4, borderRadius: 2, background: i < 4 ? 'var(--ink-3)' : i === 4 ? 'var(--rust)' : 'var(--line-strong)' }}/>
            ))}
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 10px', background:'var(--ink)', color:'var(--cream)', borderRadius: 2, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.14em', textTransform:'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)', animation:'pulse 1.2s infinite' }}/>
            Locked in
          </span>
        </div>
      </div>

      {/* Headline + timer — compact */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: 20, alignItems:'center', marginBottom: 14 }}>
        <div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 0.95, letterSpacing:'-0.03em' }}>
            Halfway. <span style={{ fontStyle:'italic', color:'var(--rust)' }}>Drink water.</span>
          </div>
          <div className="serif" style={{ fontSize: 12, fontStyle:'italic', color:'var(--ink-2)', marginTop: 4, lineHeight: 1.3 }}>
            Four opinions in twenty-eight minutes. Stretch. Four more to go.
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{ position:'relative', width: 60, height: 60 }}>
            <svg viewBox="0 0 60 60" width="60" height="60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="var(--line-strong)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="26" fill="none" stroke="var(--rust)" strokeWidth="2.5"
                strokeDasharray={2*Math.PI*26} strokeDashoffset={2*Math.PI*26*(1-pct)}
                transform="rotate(-90 30 30)"/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Lato, sans-serif', fontSize: 14 }}>{fmtT(timeLeft)}</div>
          </div>
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)' }}>Call 5 bell</div>
            <div className="serif" style={{ fontSize: 14, fontStyle:'italic' }}>Auto-resume</div>
          </div>
        </div>
      </div>

      {/* Body — two rows that fit */}
      <div style={{ flex: 1, display:'grid', gridTemplateColumns:'1.5fr 1fr', gap: 18, minHeight: 0 }}>

        {/* LEFT: revealed faces + who's left */}
        <div style={{ display:'flex', flexDirection:'column', gap: 12, minHeight: 0 }}>

          {/* Revealed so far — horizontal row, 4 compact cards */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>Revealed early · people you've met</span>
              <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>{mutuals.length} mutual · {completed.length} done</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
              {completed.map(p => {
                const note = (notes[p.idx] || '').trim();
                const isMutual = mutualSet.has(p.idx);
                return (
                  <div key={p.idx} style={{ border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', padding: 8 }}>
                    <div style={{ position:'relative', width:'100%', aspectRatio:'4/5', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)' }}>
                      <Silhouette seed={p.seed}/>
                    </div>
                    <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 6 }}>
                      Call {p.idx}
                    </div>
                    <div className="serif" style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }}>
                      {p.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 12 }}>, {p.age}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2, letterSpacing:'0.06em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.occ} · {p.city}</div>
                    <div className="serif" style={{ fontSize: 12, fontStyle:'italic', color: note ? 'var(--ink)' : 'var(--ink-3)', lineHeight: 1.25, marginTop: 6, paddingTop: 6, borderTop:'1px dotted var(--line-strong)', display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {note ? `"${note}"` : '— no note —'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Who's left — blurred, compact */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em' }}>Still blurred · who's left</span>
              <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>{remaining.length} to go</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
              {remaining.map(p => (
                <div key={p.idx} style={{ border:'1px solid var(--line-strong)', borderRadius: 2, padding: 6, background:'var(--cream)', display:'grid', gridTemplateColumns:'40px 1fr', gap: 8, alignItems:'center' }}>
                  <div style={{ position:'relative', width: 40, height: 48, overflow:'hidden', borderRadius: 99, background:'var(--paper-3)' }}>
                    <div style={{ position:'absolute', inset:-6, filter:'blur(9px) saturate(1.05)' }}>
                      <Silhouette seed={p.seed}/>
                    </div>
                  </div>
                  <div>
                    <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.14em' }}>Call {p.idx}</div>
                    <div className="serif" style={{ fontSize: 12, lineHeight: 1, marginTop: 1 }}>
                      {p.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 12 }}>, {p.age}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotating popup — moved under "who's left" */}
          <div style={{ padding:'10px 12px', background:'var(--ink)', color:'var(--cream)', borderRadius: 2, border:'1px solid var(--ink)' }}>
            <span className="caps mono" style={{ fontSize: 12, letterSpacing:'0.14em', color:'var(--paper-3)' }}>{popup.kicker}</span>
            <div className="serif" style={{ fontSize: 12, fontStyle:'italic', lineHeight: 1.25, marginTop: 3 }}>
              "{popup.q}"
            </div>
          </div>
        </div>

        {/* RIGHT: mirror · checklist */}
        <div style={{ display:'flex', flexDirection:'column', gap: 10, minHeight: 0 }}>
          <div style={{ position:'relative', flex: 1, minHeight: 0, border:'1px solid var(--line-strong)', background:'var(--paper-2)', borderRadius: 2, overflow:'hidden' }}>
            <Silhouette seed={1}/>
            <div style={{ position:'absolute', top: 8, left: 8, padding:'3px 7px', background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 2 }}>Mirror</div>
            <div style={{ position:'absolute', bottom: 8, left: 8, right: 8, display:'flex', gap: 4, justifyContent:'center', flexWrap:'wrap' }}>
              {['lighting','audio','framing'].map(x => (
                <div key={x} style={{ padding:'2px 7px', background:'#FFFFFFE0', borderRadius: 2, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink)' }}>{x} ✓</div>
              ))}
            </div>
          </div>

          {/* Checklist — chip row */}
          <div style={{ padding:'8px 10px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)' }}>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em', marginBottom: 5 }}>Checklist, again</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 5 }}>
              {checklist.map((it, i) => (
                <div key={i} style={{ padding:'4px 4px', border:`1px solid ${it.ok ? 'var(--line-strong)' : 'var(--rust)'}`, background: it.ok ? 'transparent' : '#6B152010', borderRadius: 2, textAlign:'center' }}>
                  <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color: it.ok ? 'var(--ink)' : 'var(--rust)' }}>
                    {it.ok ? '✓' : '!'} {it.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.RefreshView = RefreshView;
