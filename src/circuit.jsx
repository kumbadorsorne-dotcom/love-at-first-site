// Live call (Date 3 of 8) — compressed to fit above the fold at 1440×900.

const CIRCUIT_TIPS = [
  { kicker: 'Posture', q: 'Sit up. You look 30% more interested.' },
  { kicker: 'Dental check', q: 'Teeth situation? No spinach, no rogue poppy seeds.' },
  { kicker: 'Hair audit', q: "Smooth the flyaways. You'll thank yourself in four minutes." },
  { kicker: 'Room tour', q: "What's behind you on camera? A pile of laundry says a lot." },
];

function RoundView({ tweaks }) {
  const [timeLeft, setTimeLeft] = React.useState(300);
  const [roundBellRang, setRoundBellRang] = React.useState(false);
  const [notes, setNote] = useNotes();
  const callIdx = 3;
  const note = notes[callIdx] || '';
  const [icebreaker, setIcebreaker] = React.useState({
    kicker: 'Icebreaker · Date 3',
    q: "What's a lie you told as a child that still haunts you?"
  });
  const [justPicked, setJustPicked] = React.useState(false);
  const [tipIdx, setTipIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i+1) % CIRCUIT_TIPS.length), 3500);
    return () => clearInterval(id);
  }, []);

  // Buzz at 10 seconds, bell at 0
  React.useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          const now = ctx.currentTime;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'square';
          o.frequency.value = timeLeft <= 3 ? 440 : 220;
          g.gain.setValueAtTime(0.15, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          o.connect(g).connect(ctx.destination);
          o.start(now); o.stop(now + 0.15);
          setTimeout(() => ctx.close(), 300);
        }
      } catch(e) {}
    }
    if (timeLeft === 0 && !roundBellRang) {
      setRoundBellRang(true);
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
      setTimeout(() => { window.__setView && window.__setView('verdict'); }, 2000);
    }
  }, [timeLeft]);

  // animated drift for blurred next-up
  const [drift, setDrift] = React.useState(0);
  React.useEffect(() => {
    let raf; let start = performance.now();
    const loop = (t) => {
      setDrift(Math.sin((t - start)/600) * 12);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const layout = tweaks.callLayout;
  const blur = tweaks.teaserBlur;

  const fmtT = (s) => {
    const m = Math.floor(s/60), ss = s%60;
    return `${m}:${String(ss).padStart(2,'0')}`;
  };
  const pct = timeLeft / 300;

  const yourInterests = ['Analog film','Vinyl','Hiking','Cooking','Sci-fi novels','Jazz','Dogs','Woodworking','Tennis'];
  const theirInterests = ['Analog film','Field recording','Hiking','Baking','Sci-fi novels','Jazz','Cats','Running','Cycling'];
  const matched = theirInterests.filter(x => yourInterests.includes(x));

  const suggestedPrompts = [
    { kicker: 'Jazz', q: "Who's the first jazz musician you ever loved?" },
    { kicker: 'Analog film', q: "What's the last roll of film you shot and never developed?" },
    { kicker: 'Hiking', q: "What's a trail that's stayed with you long after you finished it?" },
    { kicker: 'Sci-fi novels', q: "Last sci-fi book you couldn't put down — and what hooked you?" },
  ];

  return (
    <div style={{ height:'100vh', padding:'14px 24px 12px', display:'flex', flexDirection:'column', gap: 10, overflow:'hidden', background:'var(--ink)', color:'var(--cream)' }}>
      {/* Top strip — unified header, Call # prominent */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap: 14, alignItems:'baseline' }}>
          <span className="serif" style={{ fontSize: 24, fontStyle:'italic' }}>Love at First Site</span>
          <span className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Pod Ardor</span>
        </div>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--cream)', background:'var(--rust)', padding:'4px 10px', letterSpacing:'0.16em', borderRadius: 10, fontWeight: 600 }}>Date 3 / 6 {'\u00b7'} Live</span>
          <div style={{ display:'flex', gap: 6 }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{
                width: 22, height: 4, borderRadius: 10,
                background: i < 2 ? '#800120' : i === 2 ? '#800120' : '#FFFFFF'
              }}/>
            ))}
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 10px', background:'#FFFFFF', color:'#0A0A0A', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)', animation:'pulse 1.2s infinite' }}/>
            Locked in
          </span>
        </div>
      </div>

      {/* Stage */}
      <div style={{ flex: 1, display:'grid', gridTemplateColumns: layout==='stage' ? '1fr' : layout==='pip' ? '1fr' : '1fr 320px', gap: 14, minHeight: 0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap: 10, minHeight: 0 }}>
          {/* video card */}
          <div style={{ position:'relative', background:'#1A1A1A', border:'1px solid #FFFFFF1A', borderRadius: 10, overflow:'hidden', flex: 1, minHeight: 0 }}>
            <div style={{ position:'absolute', inset: -20, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Silhouette seed={4} style={{ width:'120%', height:'120%' }}/>
            </div>
            <div style={{ position:'absolute', left: 18, bottom: 18, color:'var(--cream)', textShadow:'0 2px 10px #0008' }}>
              <div className="mono caps" style={{ fontSize: 12, opacity:.8, letterSpacing:'0.12em' }}>Now speaking</div>
              <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 3, letterSpacing:'-0.02em' }}>
                Mateo, <span style={{ fontStyle:'italic' }}>31</span>
              </div>
              <div className="mono" style={{ fontSize: 12, marginTop: 3, opacity:.85 }}>Sound designer · Oakland</div>
            </div>
            <div style={{ position:'absolute', top: 14, right: 14, width: 88, height: 88 }}>
              <svg viewBox="0 0 88 88" width="88" height="88">
                <circle cx="44" cy="44" r="38" fill="#0A0A0A80" stroke="#FFFFFF22" strokeWidth="1"/>
                <circle cx="44" cy="44" r="38" fill="none" stroke="var(--rust)" strokeWidth="3"
                  strokeDasharray={2*Math.PI*38} strokeDashoffset={2*Math.PI*38*(1-pct)}
                  transform="rotate(-90 44 44)" style={{ transition:'stroke-dashoffset 1s linear' }}/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--cream)' }}>
                <div className="mono caps" style={{ fontSize: 12, opacity:.7 }}>ends in</div>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1, color: timeLeft <= 10 ? '#FF3333' : 'var(--cream)' }}>{fmtT(timeLeft)}</div>
              </div>
            </div>
            <div style={{ position:'absolute', right: 14, bottom: 14, width: 108, height: 108, border:'2px solid var(--cream)', borderRadius: 10, overflow:'hidden' }}>
              <Silhouette seed={1}/>
              <div style={{ position:'absolute', bottom: 4, left: 6, color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase' }}>You</div>
            </div>
            <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom: 14, padding:'8px 18px', background:'#1A1A1A', border:`1px solid ${justPicked ? 'var(--rust)' : 'var(--ink)'}`, borderRadius: 99, maxWidth: 520, textAlign:'center', boxShadow: justPicked ? '0 0 0 3px #6B152033' : 'none', transition:'all .35s' }}>
              <div className="mono caps" style={{ fontSize: 12, color: justPicked ? 'var(--rust)' : 'var(--ink-3)' }}>{icebreaker.kicker}</div>
              <div className="serif" style={{ fontSize: 18, fontStyle:'italic', lineHeight: 1.1, marginTop: 1 }}>
                "{icebreaker.q}"
              </div>
            </div>
          </div>

          {/* Interests strip — single row */}
          <div style={{ border:'1px solid #FFFFFF1A', borderRadius: 10, background:'#FFFFFF', padding:'8px 14px', display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ display:'flex', flexDirection:'column', gap: 1, flexShrink: 0 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>Mateo's interests</div>
              <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em' }}>{'\u2665'} {matched.length} shared Interests</div>
            </div>
            <div style={{ width: 1, alignSelf:'stretch', background:'var(--line-strong)' }}/>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 5, flex: 1 }}>
              {theirInterests.map((x, i) => {
                const m = yourInterests.includes(x);
                return (
                  <span key={i} style={{
                    padding:'3px 9px', fontSize: 12, fontFamily:'Lato, sans-serif',
                    background: m ? 'var(--rust)' : 'transparent',
                    color: m ? 'var(--cream)' : 'var(--ink-2)',
                    border: `1px solid ${m ? 'var(--rust)' : 'var(--line-strong)'}`,
                    borderRadius: 10,
                    display:'inline-flex', alignItems:'center', gap: 4
                  }}>
                    {m && <span style={{ fontSize: 12 }}>{'\u2665'}</span>}
                    {x}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        {layout !== 'stage' && layout !== 'pip' && (
          <div style={{ display:'flex', flexDirection:'column', gap: 10, minHeight: 0 }}>

            {/* Next up — animated blur */}
            <div style={{ padding:'12px 20px', border:'1px solid #FFFFFF1A', background:'#0A0A0A', color:'#FFFFFF', borderRadius: 10 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>Next up · Date 4</div>
              <div style={{ marginTop: 8, display:'grid', gridTemplateColumns:'64px 1fr', gap: 10, alignItems:'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 99, overflow:'hidden', position:'relative', background:'#222222' }}>
                  <div style={{
                    position:'absolute', inset: -16,
                    filter: blur==='ink' ? 'blur(8px) grayscale(1) contrast(1.3)' : blur==='veil' ? 'blur(24px) brightness(1.1)' : blur==='mosaic' ? 'blur(2px) contrast(1.1)' : 'blur(14px) saturate(1.1)',
                    transform: `translate(${drift * 2.5}px, ${Math.sin(drift * 0.15) * 18}px) scale(1.3) rotate(${drift * 0.8}deg)`,
                    transition: 'transform 0.15s ease-out'
                  }}>
                    <Silhouette seed={5}/>
                  </div>
                </div>
                <div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap: 3, padding:'1px 6px', background:'#800120', color:'#FFFFFF', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom: 4 }}>
                    <span style={{ width: 4, height: 4, borderRadius: 99, background:'#FFFFFF', animation:'pulse 1.2s infinite' }}/>
                    Live
                  </div>
                  <div className="serif" style={{ fontSize: 18, lineHeight: 1, color:'#800120' }}>Wren, <span style={{ fontStyle:'italic' }}>33</span></div>
                  <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', marginTop: 3 }}>Set builder · Austin</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ padding:'12px 20px', border:'1px solid #FFFFFF1A', borderRadius: 10, background:'#0A0A0A', color:'#FFFFFF' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>Your notes on Mateo</div>
                <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>Private {'\u00b7'} autosaves</div>
              </div>
              <textarea
                value={note}
                onChange={e => setNote(callIdx, e.target.value)}
                placeholder="Jot a line or two — what he said about jazz, the dog's name, the weird thing about menus."
                style={{
                  width:'100%', height: 140, resize:'none',
                  padding:'8px 10px', border:'1px solid #FFFFFF20', borderRadius: 10,
                  background:'#1A1A1A', fontFamily:'Lato, sans-serif',
                  fontSize: 14, fontStyle:'italic', color:'#FFFFFF', lineHeight: 1.3
                }}/>
            </div>

            {/* Suggested prompts */}
            <div style={{ padding:'12px 20px', border:'1px solid #FFFFFF1A', borderRadius: 10, background:'#1A1A1A', color:'#FFFFFF', flex: 1, display:'flex', flexDirection:'column', minHeight: 0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 12 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>Shared Interest Icebreakers</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap: 5, flex: 1, minHeight: 0, overflow:'auto' }}>
                {suggestedPrompts.map((p, i) => {
                  const active = icebreaker.q === p.q;
                  return (
                    <button key={i} onClick={() => {
                      setIcebreaker({ kicker: `Icebreaker · ${p.kicker}`, q: p.q });
                      setJustPicked(true);
                      setTimeout(() => setJustPicked(false), 1200);
                    }} style={{
                      textAlign:'left', padding:'6px 12px',
                      background: active ? '#800120' : '#222222',
                      border: `1px solid ${active ? '#800120' : '#FFFFFF20'}`,
                      borderRadius: 10, cursor:'pointer',
                      display:'flex', flexDirection:'column', gap: 2,
                      transition:'all .2s'
                    }}>
                      <span className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span>{p.kicker.startsWith('Shared') ? '\u2665 ' + p.kicker : p.kicker}</span>
                        {active && <span style={{ color:'#FFFFFF' }}>{'\u2713'} on screen</span>}
                      </span>
                      <span className="serif" style={{ fontSize: 12, fontStyle:'italic', lineHeight: 1.1, color:'#FFFFFF' }}>
                        "{p.q}"
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Report button */}
            <button style={{
              padding:'12px 20px', background:'#1A1A1A', color:'#FFFFFF',
              border:'1px solid #FFFFFF1A', borderRadius: 10,
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
              cursor:'pointer', width:'100%', textAlign:'center'
            }}>Report misconduct</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.RoundView = RoundView;
