// Intermission — 2 min verdict gap between calls.
// Tight, transactional variant of the refresh page:
//  - short 2:00 timer prepping for the next call
//  - recap of the person you just finished (Call 3) with your verdict + note
//  - teaser of the next person (Call 4) loading now, still blurred
//  - mini mirror + live preflight, no motivation popups (this break is too short to fuss)
//  - cumulative scoreboard of matches so far

const INTERMISSION_ROSTER = [
  { idx: 1, name:'June',    age:29, city:'Brooklyn', occ:'Archivist',      seed: 3 },
  { idx: 2, name:'Mateo',   age:31, city:'Oakland',  occ:'Sound designer', seed: 4 },
  { idx: 3, name:'Priya',   age:28, city:'Chicago',  occ:'Pastry chef',    seed: 6 },
  { idx: 4, name:'Wren',    age:33, city:'Austin',   occ:'Set builder',    seed: 5 },
  { idx: 5, name:'Desmond', age:30, city:'Atlanta',  occ:'Civil engineer', seed: 7 },
  { idx: 6, name:'Ilse',    age:27, city:'Portland', occ:'Translator',     seed: 8 },
  { idx: 7, name:'Tomás',   age:32, city:'Boston',   occ:'Oncologist',     seed: 9 },
  { idx: 8, name:'Harper',  age:29, city:'Denver',   occ:'Arborist',       seed: 2 },
];

// Intermission happens between Call N and Call N+1. We demo Call 3 → Call 4.
const JUST_FINISHED_IDX = 3;
const NEXT_CALL_IDX = 4;

function IntermissionChecklist() {
  const items = [
    { label: 'Wi-Fi',      value: 'Strong · 94 Mbps', ok: true },
    { label: 'Battery',    value: '58% · plug in',    ok: false },
    { label: 'Camera',     value: 'Facing you',       ok: true },
    { label: 'Microphone', value: 'Quiet room',       ok: true },
  ];
  return (
    <div style={{ padding:'14px 18px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
        <span className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Checklist</span>
        <span className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)' }}>Before Call {NEXT_CALL_IDX}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0', borderBottom: i===items.length-1 ? 'none' : '1px dotted var(--line-strong)' }}>
            <span className="mono" style={{ fontSize: 12 }}>{it.label}</span>
            <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.14em', color: it.ok ? 'var(--ink-3)' : 'var(--rust)' }}>
              {it.ok ? '✓ ' : '! '}{it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniMirror() {
  return (
    <div style={{ position:'relative', aspectRatio:'4/5', border:'1px solid var(--line-strong)', background:'var(--paper-2)', borderRadius: 2, overflow:'hidden' }}>
      <Silhouette seed={1}/>
      <div style={{ position:'absolute', top: 10, left: 10, padding:'4px 8px', background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 2 }}>Mirror</div>
      <div style={{ position:'absolute', bottom: 10, left: 10, right: 10, display:'flex', gap: 4, justifyContent:'center', flexWrap:'wrap' }}>
        {['lighting','audio','framing'].map(x => (
          <div key={x} style={{ padding:'3px 8px', background:'#FFFFFFE0', borderRadius: 2, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink)' }}>{x} ✓</div>
        ))}
      </div>
    </div>
  );
}

function IntermissionView({ tweaks }) {
  const TOTAL = 120; // 2 min
  const [timeLeft, setTimeLeft] = React.useState(94);
  const [notes] = useNotes();
  const [verdicts] = useVerdicts();
  React.useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : TOTAL), 1000);
    return () => clearInterval(id);
  }, []);
  const fmtT = (s) => {
    const m = Math.floor(s/60), ss = s%60;
    return `${m}:${String(ss).padStart(2,'0')}`;
  };
  const pct = timeLeft / TOTAL;
  const urgent = timeLeft <= 20;

  // Person you just finished
  const justFinished = INTERMISSION_ROSTER.find(p => p.idx === JUST_FINISHED_IDX);
  const yourVerdict = verdicts[JUST_FINISHED_IDX]; // 'yes' | 'no' | undefined
  const justNote = (notes[JUST_FINISHED_IDX] || '').trim();

  // Running scoreboard: yeses so far
  const doneSoFar = INTERMISSION_ROSTER.filter(p => p.idx <= JUST_FINISHED_IDX);
  const yesesSoFar = doneSoFar.filter(p => verdicts[p.idx] === 'yes').length;

  // Next person — still blurred
  const nextPerson = INTERMISSION_ROSTER.find(p => p.idx === NEXT_CALL_IDX);

  // Upcoming queue
  const remaining = INTERMISSION_ROSTER.filter(p => p.idx > JUST_FINISHED_IDX);

  return (
    <div style={{ minHeight:'100vh', padding:'32px 48px 60px' }}>
      {/* Top bar */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: 40, alignItems:'end', borderBottom:'1px solid var(--line-strong)', paddingBottom: 20, marginBottom: 24 }}>
        <div>
          <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)' }}>Verdict gap · between Call {JUST_FINISHED_IDX} and Call {NEXT_CALL_IDX} · Pod Ardor</div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 0.95, letterSpacing:'-0.03em', marginTop: 8 }}>
            Two minutes to <span style={{ fontStyle:'italic', color:'var(--rust)' }}>reset.</span>
          </div>
          <div className="serif" style={{ fontSize: 18, fontStyle:'italic', color:'var(--ink-2)', marginTop: 10, lineHeight: 1.35, maxWidth: 600 }}>
            Call {JUST_FINISHED_IDX} just ended. Log your verdict, jot your note, and look up — Call {NEXT_CALL_IDX} starts at the bell.
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
          <div style={{ position:'relative', width: 110, height: 110 }}>
            <svg viewBox="0 0 110 110" width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="none" stroke="var(--line-strong)" strokeWidth="1"/>
              <circle cx="55" cy="55" r="48" fill="none" stroke={urgent ? 'var(--rust)' : 'var(--ink)'} strokeWidth="3"
                strokeDasharray={2*Math.PI*48} strokeDashoffset={2*Math.PI*48*(1-pct)}
                transform="rotate(-90 55 55)"
                style={{ transition:'stroke-dashoffset 1s linear' }}/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'Lato, sans-serif', fontSize: 32, lineHeight: 1, fontFeatureSettings:'"tnum"', color: urgent ? 'var(--rust)' : 'var(--ink)' }}>{fmtT(timeLeft)}</span>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em', marginTop: 4 }}>of 2:00</span>
            </div>
          </div>
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)' }}>Bell for Call {NEXT_CALL_IDX}</div>
            <div className="serif" style={{ fontSize: 24, fontStyle:'italic' }}>Resuming automatically</div>
            <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, fontStyle:'italic' }}>
              Leaving now = strike 1 of 3.
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: 3 columns — last call · next call · status */}
      <div style={{ display:'grid', gridTemplateColumns:'1.15fr 1fr 0.85fr', gap: 28, alignItems:'start' }}>

        {/* JUST FINISHED — still anonymous (no reveal until end) */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
            <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>Just finished · Call {JUST_FINISHED_IDX}</span>
            <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Face sealed until reveal</span>
          </div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginBottom: 14, letterSpacing:'-0.02em' }}>
            Log your <span style={{ fontStyle:'italic', color:'var(--rust)' }}>verdict.</span>
          </div>

          <div style={{
            border: yourVerdict === 'yes' ? '2px solid var(--rust)' : '1px solid var(--line-strong)',
            borderRadius: 2, background:'var(--cream)', padding: 16,
            display:'grid', gridTemplateColumns:'140px 1fr', gap: 16, alignItems:'start'
          }}>
            <div style={{ position:'relative', width:'100%', aspectRatio:'4/5', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)', background:'var(--paper-3)' }}>
              <div style={{ position:'absolute', inset:-10, filter:'blur(14px) saturate(1.05)' }}>
                <Silhouette seed={justFinished.seed}/>
              </div>
              <div style={{ position:'absolute', inset: 0, background:'linear-gradient(180deg, transparent 50%, #FFFFFFCC)' }}/>
              <div style={{ position:'absolute', top: 6, left: 6, padding:'2px 6px', background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2 }}>
                Call {JUST_FINISHED_IDX} · done
              </div>
            </div>
            <div>
              <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.14em' }}>
                {yourVerdict === 'yes' ? '♥ You said yes' : yourVerdict === 'no' ? '✕ You said no' : '— awaiting verdict'}
              </div>
              <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6, letterSpacing:'-0.01em' }}>
                {justFinished.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 24 }}>, {justFinished.age}</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 6, letterSpacing:'0.08em' }}>{justFinished.occ} · {justFinished.city}</div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, fontStyle:'italic' }}>
                You can still flip your verdict before the bell.
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop:'1px dotted var(--line-strong)' }}>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em', marginBottom: 6 }}>Your note</div>
                {justNote ? (
                  <div className="serif" style={{ fontSize: 18, fontStyle:'italic', color:'var(--ink)', lineHeight: 1.35 }}>
                    "{justNote}"
                  </div>
                ) : (
                  <div className="serif" style={{ fontSize: 14, fontStyle:'italic', color:'var(--ink-3)', lineHeight: 1.4 }}>
                    Nothing written. You'll try to remember them at the reveal. Good luck.
                  </div>
                )}
              </div>

              {/* Flip verdict strip */}
              <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
                <button style={verdictBtn(yourVerdict === 'yes')}>♥ Yes</button>
                <button style={verdictBtn(yourVerdict === 'no')}>✕ No</button>
                <button onClick={() => window.__setView && window.__setView('notes')} style={{ flex: 1, padding:'8px 10px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', background:'transparent', border:'1px dashed var(--line-strong)', borderRadius: 2, color:'var(--ink-2)' }}>Edit note →</button>
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div style={{ marginTop: 16, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 10 }}>
            <Stat kicker="Calls done" value={`${JUST_FINISHED_IDX} / 8`}/>
            <Stat kicker="Your yeses" value={`${yesesSoFar} of ${JUST_FINISHED_IDX}`}/>
            <Stat kicker="Strikes" value="0 / 3"/>
          </div>
        </div>

        {/* NEXT UP — loading now */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
            <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>
              <span style={{ display:'inline-block', width: 6, height: 6, borderRadius: 99, background:'var(--rust)', marginRight: 6, verticalAlign:'middle', animation:'pulse 1.2s infinite' }}/>
              Next up · Call {NEXT_CALL_IDX}
            </span>
            <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Connecting…</span>
          </div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginBottom: 14, letterSpacing:'-0.02em' }}>
            The room <span style={{ fontStyle:'italic' }}>is warming up.</span>
          </div>

          <div style={{ border:'2px solid var(--ink)', borderRadius: 2, padding: 16, background:'var(--cream)', position:'relative' }}>
            <div style={{ display:'grid', gridTemplateColumns:'130px 1fr', gap: 14, alignItems:'start' }}>
              <div style={{ position:'relative', width:'100%', aspectRatio:'4/5', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)', background:'var(--paper-3)' }}>
                <div style={{ position:'absolute', inset:-10, filter:'blur(16px) saturate(1.05)' }}>
                  <Silhouette seed={nextPerson.seed}/>
                </div>
                <div style={{ position:'absolute', inset: 0, background:'linear-gradient(180deg, transparent 40%, #FFFFFFDD)' }}/>
                {/* scanning line */}
                <div style={{ position:'absolute', left: 0, right: 0, height: 2, background:'var(--rust)', opacity: 0.5, top:'50%', animation:'intermissionScan 2.4s linear infinite' }}/>
                <div style={{ position:'absolute', bottom: 8, left: 0, right: 0, textAlign:'center', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--rust)' }}>
                  Unblurs at the bell
                </div>
              </div>

              <div>
                <div className="serif" style={{ fontSize: 32, lineHeight: 1, letterSpacing:'-0.01em' }}>
                  {nextPerson.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 24 }}>, {nextPerson.age}</span>
                </div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 6, letterSpacing:'0.08em' }}>{nextPerson.occ} · {nextPerson.city}</div>

                <div style={{ marginTop: 12, display:'flex', gap: 5, flexWrap:'wrap' }}>
                  {['Non-smoker','Wants kids','Virgo','No pets'].map(t => (
                    <span key={t} className="mono" style={{ fontSize: 12, padding:'2px 7px', border:'1px solid var(--line-strong)', borderRadius: 2, color:'var(--ink-2)' }}>{t}</span>
                  ))}
                </div>

                <div style={{ marginTop: 14, paddingTop: 12, borderTop:'1px dotted var(--line-strong)' }}>
                  <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em', marginBottom: 6 }}>Their icebreaker prompt</div>
                  <div className="serif" style={{ fontSize: 18, fontStyle:'italic', lineHeight: 1.3 }}>
                    "What's the most honest thing you'll say on camera today?"
                  </div>
                </div>
              </div>
            </div>

            {/* Loading strip */}
            <div style={{ marginTop: 14, padding:'10px 12px', background:'var(--paper-2)', borderRadius: 2, display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em' }}>Handshake with {nextPerson.name.toLowerCase()}'s client</div>
                <div style={{ marginTop: 6, height: 3, background:'var(--paper-3)', borderRadius: 2, overflow:'hidden' }}>
                  <div style={{ width: `${Math.min(100, (1-pct)*100)}%`, height:'100%', background:'var(--rust)', transition:'width 1s linear' }}/>
                </div>
              </div>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>
                {pct > 0.5 ? 'Negotiating' : pct > 0.2 ? 'Syncing audio' : 'Almost ready'}
              </span>
            </div>
          </div>

          {/* Upcoming queue */}
          <div style={{ marginTop: 16 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em', marginBottom: 8 }}>After this · still blurred</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 6 }}>
              {remaining.filter(p => p.idx !== NEXT_CALL_IDX).map(p => (
                <div key={p.idx}>
                  <div style={{ position:'relative', width:'100%', aspectRatio:'3/4', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)', background:'var(--paper-3)' }}>
                    <div style={{ position:'absolute', inset:-8, filter:'blur(12px) saturate(1.05)' }}>
                      <Silhouette seed={p.seed}/>
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4, textTransform:'uppercase' }}>Call {p.idx}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS COL — mirror + preflight */}
        <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
          <MiniMirror/>
          <IntermissionChecklist/>

          {/* Quick breathing prompt — single, fixed (no popup churn) */}
          <div style={{ padding:'14px 16px', background:'var(--ink)', color:'var(--cream)', borderRadius: 2 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFFA0', letterSpacing:'0.16em' }}>Quick reset</div>
            <div className="serif" style={{ fontSize: 18, fontStyle:'italic', lineHeight: 1.3, marginTop: 6 }}>
              Breathe in for four, out for six. <span style={{ color:'var(--rust)' }}>Twice.</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color:'#FFFFFFA0', marginTop: 8, fontStyle:'italic' }}>
              Don't start the next call with the last one's face still on yours.
            </div>
          </div>

          {/* Abandon warning */}
          <div style={{ padding:'12px 14px', border:'1px dashed var(--rust)', borderRadius: 2, background:'var(--cream)' }}>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>Reminder</div>
            <div className="serif" style={{ fontSize: 14, lineHeight: 1.35, marginTop: 4 }}>
              Closing this tab now counts as <span style={{ fontStyle:'italic', color:'var(--rust)' }}>pod abandonment</span> — strike 1 of 3.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ kicker, value }) {
  return (
    <div style={{ padding:'10px 12px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)' }}>
      <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{kicker}</div>
      <div className="serif" style={{ fontSize: 24, lineHeight: 1.1, marginTop: 4, letterSpacing:'-0.01em' }}>{value}</div>
    </div>
  );
}

function verdictBtn(active) {
  return {
    flex: 1,
    padding:'8px 10px',
    fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.14em', textTransform:'uppercase',
    background: active ? 'var(--rust)' : 'transparent',
    color: active ? 'var(--cream)' : 'var(--ink)',
    border: `1px solid ${active ? 'var(--rust)' : 'var(--line-strong)'}`,
    borderRadius: 2,
  };
}

window.IntermissionView = IntermissionView;
window.INTERMISSION_ROSTER = INTERMISSION_ROSTER;
