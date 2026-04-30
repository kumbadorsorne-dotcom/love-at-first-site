// Verdict gap — 2 minutes. BINARY yes/no only. Three UI styles (tap/swipe/dial).
// Redesigned to fit above the fold at 1440×900.

const VERDICT_TIPS = [
  { kicker: 'Posture', q: 'Sit up. You look 30% more interested.' },
  { kicker: 'Dental check', q: 'Teeth situation? No spinach, no rogue poppy seeds.' },
  { kicker: 'Hair audit', q: "Smooth the flyaways. You'll thank yourself in four minutes." },
  { kicker: 'Room tour', q: "What's behind you on camera? A pile of laundry says a lot." },
];

function VerdictView({ tweaks }) {
  const [choice, setChoice] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [notes, setNote] = useNotes();
  const [, setVerdict] = useVerdicts();
  const callIdx = 3;
  const note = notes[callIdx] || '';
  const [tipIdx, setTipIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i+1) % VERDICT_TIPS.length), 3500);
    return () => clearInterval(id);
  }, []);
  const tip = VERDICT_TIPS[tipIdx];

  const [nextCallTime, setNextCallTime] = React.useState(null);
  const pick = (v) => {
    setChoice(v);
    setVerdict(callIdx, v);
    setNextCallTime(timeLeft);
  };

  const [bellRang, setBellRang] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupSec, setPopupSec] = React.useState(5);

  // Hint received notification
  const [showHint, setShowHint] = React.useState(false);
  const [hintDismissed, setHintDismissed] = React.useState(false);
  const [hintSent, setHintSent] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 4000);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => t>0 ? t-1 : 0), 1000);
    return () => clearInterval(id);
  }, []);

  // Buzz at 10 seconds
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
    // Bell at 0
    if (timeLeft === 0 && !bellRang) {
      setBellRang(true);
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
      setShowPopup(true);
    }
  }, [timeLeft]);

  // Popup countdown
  React.useEffect(() => {
    if (!showPopup) return;
    const id = setInterval(() => {
      setPopupSec(s => {
        if (s <= 1) { clearInterval(id); window.__setView && window.__setView('round'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showPopup]);

  const kind = tweaks.verdictUI;
  const pct = timeLeft / 60;
  const fmtT = (s) => {
    const m = Math.floor(s/60), ss = s%60;
    return `${m}:${String(ss).padStart(2,'0')}`;
  };

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', padding:'18px 32px 14px', gap: 12, overflow:'hidden', background:'var(--ink)', color:'var(--cream)' }}>
      {/* Top strip — unified header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap: 14, alignItems:'baseline' }}>
          <span className="serif" style={{ fontSize: 24, fontStyle:'italic' }}>Love at First Site</span>
          <span className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Pod Ardor</span>
        </div>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--cream)', background:'var(--rust)', padding:'4px 10px', letterSpacing:'0.16em', borderRadius: 10, fontWeight: 600 }}>Date 3 / 6 {'\u00b7'} Verdict</span>
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

      {/* Main row — portrait | decision | sidebar */}
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr 240px', gap: 16, flex: 1, alignItems:'stretch' }}>
        {/* Portrait card + interests */}
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          <div style={{ border:'1px solid #FFFFFF20', background:'#0A0A0A', borderRadius: 10, overflow:'hidden' }}>
            <div style={{ position:'relative', aspectRatio:'1/1' }}>
              <Silhouette seed={4}/>
              {/* Hint received overlay */}
              {showHint && !hintDismissed && (
                <div style={{
                  position:'absolute', inset: 0,
                  background:'linear-gradient(180deg, #80012000 0%, #800120E0 60%, #800120 100%)',
                  display:'flex', flexDirection:'column', justifyContent:'flex-end',
                  animation:'fade .5s ease both', padding: 18
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" fill="none"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <path d="M15 9c0 0-0.5-1-1.5 0"/>
                    </svg>
                    <span className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>A hint</span>
                  </div>
                  <div className="serif" style={{ fontSize: 24, color:'#FFFFFF', lineHeight: 1.1 }}>
                    Mateo is <span style={{ fontStyle:'italic' }}>interested.</span>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color:'#FFFFFFB0', marginTop: 6, lineHeight: 1.3 }}>
                    Your decision is still private until the reveal.
                  </div>
                  <button onClick={() => setHintDismissed(true)} style={{
                    marginTop: 12, padding:'8px 20px', background:'#FFFFFF', color:'#800120',
                    fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                    borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700, alignSelf:'flex-start'
                  }}>Dismiss</button>
                </div>
              )}
            </div>
            <div style={{ padding:'12px 14px' }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Date 3</div>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, marginTop: 4, color:'#FFFFFF' }}>Mateo, <span style={{ fontStyle:'italic' }}>31</span></div>
              <div className="mono" style={{ fontSize: 12, marginTop: 4, color:'#888888' }}>Sound designer {'\u00b7'} Oakland</div>
            </div>
          </div>
          {/* Interests */}
          <div style={{ padding:'12px 20px', border:'1px solid #FFFFFF20', borderRadius: 10, background:'#0A0A0A', flex: 1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>{'\u2665'} 4 shared interests</div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
              {['Analog film','Field recording','Hiking','Baking','Sci-fi novels','Jazz','Cats','Running','Cycling'].map((x, i) => {
                const matched = ['Analog film','Hiking','Sci-fi novels','Jazz'].includes(x);
                return (
                  <span key={i} style={{
                    padding:'2px 7px', fontSize: 12, fontFamily:'Lato, sans-serif',
                    background: matched ? 'var(--rust)' : 'transparent',
                    color: matched ? '#FFFFFF' : '#888888',
                    border: `1px solid ${matched ? 'var(--rust)' : '#FFFFFF30'}`,
                    borderRadius: 10, display:'inline-flex', alignItems:'center', gap: 3
                  }}>{matched && <span>{'\u2665'}</span>}{x}</span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Decision column — fixed top, notes fill rest */}
        <div style={{ display:'flex', flexDirection:'column', minHeight: 0 }}>
          <div style={{ height: 320, flexShrink: 0, overflow:'hidden' }}>
          {!choice ? (
            <>
              <div className="mono caps" style={{ fontSize: 12, color:'#888888' }}>Your decision</div>
              <div style={{ display:'flex', alignItems:'center', gap: 14, marginTop: 4 }}>
                <div className="serif" style={{ fontSize: 32, lineHeight: 1, letterSpacing:'-0.02em' }}>
                  Would you see <span style={{ fontStyle:'italic' }}>Mateo</span> again?
                </div>
                <div style={{ width: 80, height: 80, flexShrink: 0, position:'relative' }}>
                  <svg viewBox="0 0 80 80" width="80" height="80">
                    <circle cx="40" cy="40" r="36" fill="#1A1A1A" stroke="#FFFFFF22" strokeWidth="1"/>
                    <circle cx="40" cy="40" r="36" fill="none" stroke="var(--rust)" strokeWidth="2.5"
                      strokeDasharray={2*Math.PI*36} strokeDashoffset={2*Math.PI*36*(1-pct)}
                      transform="rotate(-90 40 40)" style={{ transition:'stroke-dashoffset 1s linear' }}/>
                  </svg>
                  <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div className="serif" style={{ fontSize: 24, lineHeight: 1, color: timeLeft <= 10 ? '#FF3333' : '#FFFFFF' }}>{fmtT(timeLeft)}</div>
                  </div>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 8, lineHeight: 1.5, whiteSpace:'nowrap' }}>
                Choose if you would like to see Mateo again. Your answer stays private until all your dates are complete.
              </div>

              <div style={{ marginTop: 14 }}>
                {kind === 'tap' && (
                  <div style={{ display:'flex', gap: 12 }}>
                    <button onClick={() => pick('yes')} style={{
                      flex: 1, padding: '16px', background:'transparent', color:'#FFFFFF',
                      border:'1px solid var(--rust)', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 24, cursor:'pointer'
                    }}>Yes {'\u00b7'} tell them</button>
                    <button onClick={() => pick('no')} style={{
                      flex: 1, padding: '16px', background:'transparent', color:'var(--ink)',
                      border:'1px solid var(--ink)', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 24, fontStyle:'italic', cursor:'pointer'
                    }}>No {'\u00b7'} move along</button>
                  </div>
                )}

                {kind === 'swipe' && (
                  <div style={{ position:'relative', height: 92, border:'1px solid var(--line-strong)', borderRadius: 10, background:'#FFFFFF', padding: 6, display:'flex', alignItems:'center' }}>
                    <div style={{ position:'absolute', left: 26, color:'#FFFFFF', fontSize: 18 }} className="serif">{'\u2190'} drag left for <i>yes</i></div>
                    <div style={{ position:'absolute', right: 26, color:'#888888', fontSize: 18 }} className="serif">drag right for <i>no</i> {'\u2192'}</div>
                    <div
                      onMouseDown={(e) => {
                        const start = e.clientX;
                        const onMove = (ev) => {
                          const dx = ev.clientX - start;
                          if (Math.abs(dx) > 120) pick(dx > 0 ? 'no' : 'yes');
                        };
                        const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                        document.addEventListener('mousemove', onMove);
                        document.addEventListener('mouseup', onUp);
                      }}
                      style={{
                        position:'absolute', left:'50%', transform:'translateX(-50%)',
                        top: 6, width: 80, height: 80, borderRadius: 99,
                        background:'#FFFFFF', color:'var(--ink)',
                        border: '1px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'Lato, sans-serif', fontSize: 24, fontStyle:'italic', cursor:'grab'
                      }}>{'\u25c9'}</div>
                  </div>
                )}

                {kind === 'dial' && (
                  <>
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap: 28, padding:'6px 0' }}>
                    <button onClick={() => pick('yes')}
                      className="serif"
                      style={{
                        width: 120, height: 120, borderRadius: 99,
                        background:'#FFFFFF', color:'#800120',
                        border:'1px solid #800120', fontSize: 48, cursor:'pointer', transition:'all .3s'
                      }}>Yes</button>
                    <span className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.16em' }}>or</span>
                    <button onClick={() => pick('no')}
                      className="serif"
                      style={{
                        width: 120, height: 120, borderRadius: 99,
                        background:'#FFFFFF', color:'var(--ink)',
                        border:'1px solid var(--ink)', fontSize: 48, fontStyle:'italic', cursor:'pointer', transition:'all .3s'
                      }}>No</button>
                  </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="fadein">
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.16em' }}>{'\u2665'} Verdict locked in</div>
              <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 4, letterSpacing:'-0.02em' }}>
                {choice === 'yes' ? <><span style={{ fontStyle:'italic', color:'#800120' }}>Yes</span> on Mateo.</> : <><span style={{ fontStyle:'italic' }}>No</span> on Mateo.</>}
              </div>

              {/* Send a hint — premium only */}
              {choice === 'yes' && (
                <div style={{ marginTop: 14 }}>
                  <button
                    onClick={() => { if (tweaks.tier === 'premium' && !hintSent) setHintSent(true); }}
                    style={{
                      padding:'10px 18px', borderRadius: 10, display:'inline-flex', alignItems:'center', gap: 10,
                      background: hintSent ? '#800120' : 'transparent',
                      color: '#FFFFFF',
                      border: hintSent ? '1px solid #800120' : tweaks.tier === 'premium' ? '1px solid #800120' : '1px solid #FFFFFF40',
                      cursor: tweaks.tier === 'premium' && !hintSent ? 'pointer' : 'default',
                      fontFamily:'Lato, sans-serif', fontSize: 14, transition:'all .2s',
                      opacity: 1
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" fill="none"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <path d="M15 9c0 0-0.5-1-1.5 0"/>
                    </svg>
                    <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em' }}>{hintSent ? 'Hint sent!' : 'Send a hint'}</span>
                    {!hintSent && tweaks.tier !== 'premium' && (
                      <span className="mono" style={{ fontSize: 12, color:'#FFFFFF80', marginLeft: 4 }}>Only for Premium</span>
                    )}
                  </button>
                </div>
              )}
              <div style={{ marginTop: 20, padding:'18px 22px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'#FFFFFF' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, position:'relative', flexShrink: 0 }}>
                    <svg viewBox="0 0 52 52" width="52" height="52">
                      <circle cx="26" cy="26" r="22" fill="var(--paper-2)" stroke="var(--line-strong)" strokeWidth="1"/>
                      <circle cx="26" cy="26" r="22" fill="none" stroke="var(--rust)" strokeWidth="2.5"
                        strokeDasharray={2*Math.PI*22} strokeDashoffset={2*Math.PI*22*(1-pct)}
                        transform="rotate(-90 26 26)" style={{ transition:'stroke-dashoffset 1s linear' }}/>
                    </svg>
                    <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <div className="serif" style={{ fontSize: 18, lineHeight: 1, color: timeLeft <= 10 ? '#FF3333' : '#0A0A0A' }}>{fmtT(timeLeft)}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Next date starts in</div>
                    <div className="serif" style={{ fontSize: 24, lineHeight: 1, marginTop: 4, color:'#800120' }}>Date 4 {'\u00b7'} <span style={{ fontStyle:'italic' }}>Wren, 33</span></div>
                    <div className="mono" style={{ fontSize: 12, color:'#888888', marginTop: 3 }}>Set builder {'\u00b7'} Austin</div>
                  </div>
                </div>
                <button onClick={() => { setChoice(null); setNextCallTime(null); }} style={{
                  marginTop: 12, padding:'8px 16px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                  border:'none', borderRadius: 10, color:'#FFFFFF', background:'#333333', cursor:'pointer', width:'100%'
                }}>Change your mind</button>
              </div>
            </div>
          )}
          </div>

          {/* Notes from Circuit Date 3 — editable */}
          <div style={{ marginTop: 14, padding:'12px 16px', background:'#0A0A0A', color:'#FFFFFF', border:'1px solid #FFFFFF20', borderRadius: 10, display:'flex', flexDirection:'column', flex: 1, minHeight: 0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6, flexShrink: 0 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.16em' }}>Your notes {'\u00b7'} from the call</div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(callIdx, e.target.value)}
              placeholder="Jot a line or two — what he said about jazz, the dog's name, the weird thing about menus."
              style={{
                flex: 1, width:'100%', resize:'none',
                padding:'8px 10px', border:'1px solid var(--line-strong)', borderRadius: 10,
                background:'#1A1A1A', fontFamily:'Lato, sans-serif',
                fontSize: 18, fontStyle:'italic', color:'#FFFFFF', lineHeight: 1.3
              }}/>
            <div className="mono" style={{ fontSize: 12, color:'#888888', paddingTop: 6, fontStyle:'italic', flexShrink: 0 }}>
              Editable until next bell.
            </div>
          </div>
        </div>

        {/* Right sidebar — mirror, preflight, tip */}
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {/* Mirror */}
          <div style={{ border:'1px solid #FFFFFF20', borderRadius: 10, overflow:'hidden', background:'#0A0A0A', aspectRatio:'3/4', position:'relative' }}>
            <Silhouette seed={1}/>
            <div style={{ position:'absolute', bottom: 8, left: 10, color:'var(--cream)', textShadow:'0 1px 6px #0008' }}>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', opacity: 0.8 }}>Your mirror</div>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ padding:'12px 20px', border:'1px solid #FFFFFF20', borderRadius: 10, background:'#0A0A0A', color:'#FFFFFF' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Checklist</div>
            </div>
            {[
              { label:'Wi-Fi', info:'94 Mbps', ok: true },
              { label:'Battery', info:'78%', ok: true },
              { label:'Camera', info:'FaceTime HD', ok: true },
              { label:'Microphone', info:'Built-in Mic', ok: true },
            ].map(c => (
              <div key={c.label} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', alignItems:'center', padding:'4px 0', borderBottom:'1px dotted #FFFFFF15', gap: 8 }}>
                <span className="mono" style={{ fontSize: 12, color:'#FFFFFF' }}>{c.label}</span>
                <span className="mono" style={{ fontSize: 12, color:'#888888', textAlign:'center' }}>{c.info}</span>
                <span className="mono" style={{ fontSize: 12, color:'#FFFFFF', textAlign:'right' }}>{'\u2713'} Good</span>
              </div>
            ))}
          </div>

        </div>

        {/* Coming up — spans all three columns */}
        <div style={{ gridColumn:'1 / -1', border:'1px solid #FFFFFF20', borderRadius: 10, background:'#0A0A0A', color:'#FFFFFF', padding:'12px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
          <div className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Coming up · dates 4 – 6</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 10 }}>
          {[
            { idx:4, name:'Wren',    age:33, seed:5, next:true },
            { idx:5, name:'Desmond', age:30, seed:7 },
            { idx:6, name:'Ilse',    age:27, seed:8 },
            { idx:7, name:'Tomás',   age:32, seed:9 },
            { idx:8, name:'Harper',  age:29, seed:2 },
          ].map(p => (
            <div key={p.idx} style={{ display:'grid', gridTemplateColumns:'44px 1fr', gap: 10, alignItems:'center' }}>
              <div style={{ position:'relative', width: 44, height: 44, overflow:'hidden', borderRadius: 99, border:`1px solid ${p.next ? 'var(--rust)' : 'var(--line-strong)'}`, background:'#F5F5F5' }}>
                <div style={{ position:'absolute', inset:-6, filter:'blur(10px) saturate(1.05)' }}>
                  <Silhouette seed={p.seed}/>
                </div>
                <div style={{ position:'absolute', inset: 0, background:'linear-gradient(180deg, transparent 45%, #FFFFFFCC)' }}/>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color: p.next ? '#FFFFFF' : 'var(--ink-3)', letterSpacing:'0.12em' }}>
                  Date {p.idx}{p.next ? ' · next' : ''}
                </div>
                <div className="serif" style={{ fontSize: 18, lineHeight: 1.1, marginTop: 1, color:'#FFFFFF' }}>
                  {p.name}<span style={{ fontStyle:'italic', fontSize: 12 }}>, {p.age}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>

      {/* Smile popup at 0 seconds */}
      {showPopup && (
        <div style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0ACC', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', animation:'fade .3s ease both'
        }}>
          <div style={{ textAlign:'center', maxWidth: 480 }}>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, color:'#FFFFFF', letterSpacing:'-0.02em' }}>
              Smile! It's time to talk to <span style={{ fontStyle:'italic', color:'#800120' }}>Wren.</span>
            </div>
            <div className="serif" style={{ fontSize: 96, lineHeight: 1, color:'#800120', marginTop: 24, fontFeatureSettings:'"tnum"' }}>
              {popupSec}
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF80', letterSpacing:'0.16em', marginTop: 8 }}>
              seconds
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

window.VerdictView = VerdictView;
