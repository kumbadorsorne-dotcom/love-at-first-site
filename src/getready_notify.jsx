// Get ready — Notify variant. Duplicate of prep room with a dropout notification popup.

const GETREADY_NOTIFY_TIPS = [
  { kicker: 'Posture', q: 'Sit up. You look 30% more interested.' },
  { kicker: 'Dental check', q: 'Teeth situation? No spinach, no rogue poppy seeds.' },
  { kicker: 'Hair audit', q: "Smooth the flyaways. You'll thank yourself in four minutes." },
  { kicker: 'Room tour', q: "What's behind you on camera? A pile of laundry says a lot." },
  { kicker: 'Eye contact', q: 'Look at the camera, not the screen. It changes everything.' },
  { kicker: 'Breathing', q: 'Three deep breaths. In through the nose, out through the mouth.' },
];

function GetReadyNotifyView({ tweaks }) {
  const ROTATION_TOTAL = 30;
  const [sec, setSec] = React.useState(30);
  React.useEffect(() => {
    const id = setInterval(() => setSec(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    if (sec <= 10 && sec > 0) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          const now = ctx.currentTime;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'square';
          o.frequency.value = sec <= 3 ? 440 : 220;
          g.gain.setValueAtTime(0.15, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          o.connect(g).connect(ctx.destination);
          o.start(now);
          o.stop(now + 0.15);
          setTimeout(() => ctx.close(), 300);
        }
      } catch(e) {}
    }
  }, [sec]);
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  const ready = sec === 0;
  const [bellRang, setBellRang] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupSec, setPopupSec] = React.useState(5);
  React.useEffect(() => {
    if (ready && !bellRang) {
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
  }, [ready]);
  React.useEffect(() => {
    if (!showPopup) return;
    const id = setInterval(() => {
      setPopupSec(s => {
        if (s <= 1) {
          clearInterval(id);
          window.__setView && window.__setView('round');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showPopup]);
  const pct = 1 - sec / ROTATION_TOTAL;

  const videoRef = React.useRef(null);
  const [mirrorErr, setMirrorErr] = React.useState(null);
  React.useEffect(() => {
    let stream;
    (async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMirrorErr('unavailable'); return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        setMirrorErr('blocked');
      }
    })();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const playBell = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      [880, 1320, 1760].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0, now + i * 0.015);
        g.gain.linearRampToValueAtTime(0.25 / (i + 1), now + i * 0.015 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        o.connect(g).connect(ctx.destination);
        o.start(now + i * 0.015);
        o.stop(now + 1.7);
      });
      setTimeout(() => ctx.close(), 2000);
    } catch(e) {}
  };

  const handleEnter = () => {
    if (!ready) return;
    playBell();
    setTimeout(() => { window.__setView && window.__setView('round'); }, 300);
  };

  const [tipIdx, setTipIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i+1) % GETREADY_NOTIFY_TIPS.length), 3500);
    return () => clearInterval(id);
  }, []);
  const tip = GETREADY_NOTIFY_TIPS[tipIdx];

  const nextPerson = (window.NAMES && window.NAMES[1]) || { name:'Mateo', age:31, city:'Oakland', occ:'Sound designer', seed: 2 };

  const yourInterests = ['Analog film','Vinyl','Hiking','Cooking','Sci-fi novels','Jazz','Dogs','Woodworking','Tennis','Photography','Yoga','Travel','Wine tasting','Pottery'];
  const theirInterests = ['Analog film','Field recording','Hiking','Baking','Sci-fi novels','Jazz','Cats','Running','Cycling','Photography','Yoga','Surfing','Meditation','Pottery'];
  const matched = theirInterests.filter(x => yourInterests.includes(x));

  // --- Dropout notification ---
  const [showDropout, setShowDropout] = React.useState(false);
  const [dropoutDismissed, setDropoutDismissed] = React.useState(false);
  const droppedPerson = { name: 'Nadia', age: 34, seed: 3 };

  // Show the dropout notification after 3 seconds
  React.useEffect(() => {
    const t = setTimeout(() => setShowDropout(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const dismissDropout = () => {
    setDropoutDismissed(true);
    setTimeout(() => setShowDropout(false), 300);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--ink)', color:'var(--cream)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: 3, background:'var(--rust)' }}/>

      <header style={{ padding:'16px 36px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #FFFFFF18' }}>
        <div style={{ display:'flex', gap: 14, alignItems:'baseline' }}>
          <span className="serif" style={{ fontSize: 24, fontStyle:'italic' }}>Love at First Site</span>
          <span className="mono caps" style={{ fontSize: 12, color:'#888888', letterSpacing:'0.12em' }}>Pod Ardor</span>
        </div>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--cream)', background:'#800120', padding:'4px 10px', letterSpacing:'0.16em', borderRadius: 10, fontWeight: 600 }}>Prep Room</span>
          <div style={{ display:'flex', gap: 6 }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ width: 22, height: 4, borderRadius: 10, background:'#FFFFFF' }}/>
            ))}
            <div style={{ width: 22, height: 4, borderRadius: 10, background:'#FFFFFF' }}/>
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 10px', background:'#FFFFFF', color:'#0A0A0A', borderRadius: 99, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)', animation:'pulse 1.2s infinite' }}/>
            Locked in
          </span>
        </div>
      </header>

      <main style={{
        padding:'18px 28px 18px',
        display:'grid',
        gridTemplateColumns:'1.25fr 1fr',
        gridTemplateRows:'auto 1fr',
        gap: 18,
        height:'calc(100vh - 80px)',
        boxSizing:'border-box',
        overflow:'auto'
      }}>

        {/* TOP-LEFT — Private mirror */}
        <div style={{ gridRow:'1 / span 2', display:'flex', flexDirection:'column', minHeight: 0 }}>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 6, color:'#FFFFFF' }}>
            Get ready to <span style={{ fontStyle:'italic', color:'var(--rust)' }}>chat.</span>
          </div>

          <div style={{ marginTop: 10, border:'1px solid #FFFFFF30', borderRadius: 10, padding: 10, background:'#111111', flex: 1, display:'flex', flexDirection:'column', minHeight: 0 }}>
            <div style={{ position:'relative', flex: 1, background:'#0A0A0A', borderRadius: 10, overflow:'hidden', border:'1px solid #FFFFFF20', minHeight: 0 }}>
              <video
                ref={videoRef}
                playsInline muted autoPlay
                style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)', display: mirrorErr ? 'none' : 'block' }}
              />
              {mirrorErr && (
                <div style={{ position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: 20, textAlign:'center' }}>
                  <div className="serif" style={{ fontSize: 24, fontStyle:'italic', color:'#FFFFFF', lineHeight: 1.1 }}>Mirror off.</div>
                  <div className="mono" style={{ fontSize: 12, color:'#FFFFFF80', letterSpacing:'0.08em', marginTop: 10, maxWidth: 320, lineHeight: 1.3 }}>
                    {mirrorErr === 'blocked'
                      ? 'Allow camera access to see yourself before the bell.'
                      : "Your browser can't show the mirror right now."}
                  </div>
                </div>
              )}
              {!mirrorErr && (
                <>
                  <div style={{ position:'absolute', inset:'10% 22%', border:'1px dashed #FFFFFF40', borderRadius: 10, pointerEvents:'none' }}/>
                  <div style={{ position:'absolute', top: 8, left: 10 }}>
                    <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)', background:'#0A0A0AC0', padding:'3px 6px', borderRadius: 10 }}>{'\u25CF'} REC — private</span>
                  </div>
                  <div style={{ position:'absolute', bottom: 8, right: 10 }}>
                    <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'#FFFFFFB0', background:'#0A0A0AC0', padding:'3px 6px', borderRadius: 10 }}>Frame: head + shoulders</span>
                  </div>
                </>
              )}
            </div>
            <div className="mono" style={{ fontSize: 12, color:'#FFFFFF80', marginTop: 8, letterSpacing:'0.08em' }}>
              Check your light. Sit up. Nobody sees this feed until the bell.
            </div>
          </div>
        </div>

        {/* TOP-RIGHT — Timer + CTA */}
        <div style={{ display:'flex', flexDirection:'column' }}>
          <div style={{ marginTop: 8, display:'flex', alignItems:'flex-end', gap: 14 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke={ready ? 'var(--rust)' : sec <= 10 ? '#6B1520' : '#FFFFFF60'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, animation: ready ? 'bellSwing 0.4s ease infinite' : 'none', transformOrigin:'top center', transition:'stroke .4s' }}>
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <div className="serif" style={{
              fontSize: 96, lineHeight: 1, letterSpacing:'-0.04em',
              fontFeatureSettings:'"tnum"',
              color: ready ? 'var(--rust)' : sec <= 10 ? '#6B1520' : '#FFFFFF',
              transition:'color .4s'
            }}>
              {String(mm).padStart(2,'0')}<span style={{ color:'var(--rust)' }}>:</span>{String(ss).padStart(2,'0')}
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFFB0', letterSpacing:'0.16em', paddingBottom: 8, marginLeft:'auto' }}>Time Until First Date</div>
          </div>

          <div style={{ marginTop: 10, height: 3, background:'#FFFFFF1C', borderRadius: 10, overflow:'hidden' }}>
            <div style={{ width: `${pct*100}%`, height:'100%', background:'var(--rust)', transition:'width 1s linear' }}/>
          </div>
          <div className="mono" style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color:'#FFFFFF80', letterSpacing:'0.12em', marginTop: 4 }}>
            <span>NOW</span><span>BELL</span>
          </div>
          <div style={{ marginTop: 10, padding:'12px 16px', background:'var(--rust)', borderRadius: 10 }}>
            <div className="serif" style={{ fontSize: 18, color:'var(--cream)', lineHeight: 1.3 }}>
              <span style={{ fontWeight: 600 }}>Stay put.</span> When the timer is up and the bell rings, you'll be added to the call with {nextPerson.name} immediately.
            </div>
          </div>
        </div>

        {/* BOTTOM-RIGHT — First up */}
        <div style={{ display:'flex', flexDirection:'column', gap: 12, minHeight: 0 }}>
          <div style={{ border:'1px solid #FFFFFF20', borderRadius: 10, padding:'12px 14px', background:'#0A0A0A', color:'#FFFFFF', display:'flex', flexDirection:'column', minHeight: 0, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexShrink: 0 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFFB0', letterSpacing:'0.16em' }}>03 {'\u00b7'} First up</div>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.16em' }}>1 of 6</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'56px 1fr', gap: 10, alignItems:'center', marginTop: 8 }}>
              <div style={{ width: 56, height: 56, position:'relative', borderRadius: 99, overflow:'hidden', border:'1px solid #FFFFFF30' }}>
                <div style={{ position:'absolute', inset: 0, filter:'blur(10px) saturate(1.05)' }}>
                  <Silhouette seed={nextPerson.seed || 2}/>
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.01em', color:'#FFFFFF' }}>
                  {nextPerson.name}<span style={{ color:'#FFFFFFB0', fontStyle:'italic', fontSize: 18 }}>, {nextPerson.age}</span>
                </div>
                <div className="mono" style={{ fontSize: 12, color:'#FFFFFFB0', marginTop: 4, lineHeight: 1.3, letterSpacing:'0.08em' }}>
                  {nextPerson.occ} {'\u00b7'} {nextPerson.city}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 10, paddingTop: 10, borderTop:'1px dotted #FFFFFF28', flex: 1, minHeight: 0, display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6, flexShrink: 0, position:'sticky', top: 0, background:'#0A0A0A', paddingBottom: 4, zIndex: 1 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>His interests</div>
                <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.12em' }}>{'\u2665'} {matched.length} shared Interests</div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 4, flex: 1, overflowY:'auto', scrollbarWidth:'thin' }}>
                {theirInterests.map((x, i) => {
                  const m = yourInterests.includes(x);
                  return (
                    <span key={i} style={{
                      padding:'2px 7px', fontSize: 12, fontFamily:'Lato, sans-serif',
                      background: m ? 'var(--rust)' : 'transparent',
                      color: m ? 'var(--cream)' : '#FFFFFFB0',
                      border: `1px solid ${m ? 'var(--rust)' : '#FFFFFF30'}`,
                      borderRadius: 10,
                      display:'inline-flex', alignItems:'center', gap: 3, lineHeight: 1.3
                    }}>
                      {m && <span style={{ fontSize: 12 }}>{'\u2665'}</span>}
                      {x}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Up next — remaining calls (7 down to 6 after dropout) */}
          <div style={{ border:'1px solid #FFFFFF20', borderRadius: 10, padding:'12px 20px', background:'#111111' }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFFB0', letterSpacing:'0.12em', marginBottom: 8 }}>Up next {'\u00b7'} dates 2-6</div>
            <div style={{ display:'flex', gap: 8, overflowX:'auto' }}>
              {[
                { name:'Priya',   age:28, seed:6 },
                { name:'Wren',    age:33, seed:5 },
                { name:'Desmond', age:30, seed:7 },
                { name:'Ilse',    age:27, seed:8 },
                { name:'Tom\u00e1s',   age:32, seed:9 },
                { name:'Harper',  age:29, seed:2 },
                { name:'Nadia',   age:34, seed:3 },
                { name:'Ezra',    age:31, seed:10 },
                { name:'Soren',   age:29, seed:11 },
              ].map((p, i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid #FFFFFF30', position:'relative' }}>
                    <div style={{ position:'absolute', inset: -4, filter:'blur(6px) saturate(1.05)' }}>
                      <Silhouette seed={p.seed}/>
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color:'#FFFFFF80', textAlign:'center', lineHeight: 1.1 }}>
                    {p.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rotating motivational tip */}
        <div style={{ gridColumn:'1 / -1', border:'1px solid #FFFFFF20', borderRadius: 10, padding:'12px 20px', background:'#0A0A0A', color:'#FFFFFF' }}>
          <span className="caps mono" style={{ fontSize: 12, letterSpacing:'0.12em', color:'#FFFFFFB0' }}>{tip.kicker}</span>
          <div className="serif" style={{ fontSize: 12, fontStyle:'italic', lineHeight: 1.15, marginTop: 3 }}>
            "{tip.q}"
          </div>
        </div>
      </main>

      <div className="mono caps" style={{ padding:'10px 28px', borderTop:'1px solid #FFFFFF18', display:'flex', justifyContent:'space-between', fontSize: 12, color:'#FFFFFF80', letterSpacing:'0.16em' }}>
        <span>Pod Ardor {'\u00b7'} Thu, Mar 14 {'\u00b7'} 14:32 PT</span>
        <span>The algorithm has done its part.</span>
      </div>

      {/* Dropout notification popup */}
      {showDropout && (
        <div style={{
          position:'fixed', top: 28, right: 28, zIndex: 9998, width: 360,
          background:'#333333', border:'2px solid #800120', borderRadius: 16,
          boxShadow:'0 24px 64px -16px #000000DD, 0 0 0 1px #FFFFFF08',
          animation: dropoutDismissed ? 'none' : 'fade .3s ease both',
          opacity: dropoutDismissed ? 0 : 1,
          transition: dropoutDismissed ? 'opacity .3s ease' : 'none',
          overflow:'hidden'
        }}>
          {/* Red accent strip */}
          <div style={{ height: 3, background:'linear-gradient(90deg, #FF3333, #FF333360)' }}/>

          <div style={{ padding:'20px 22px' }}>
            {/* Header row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background:'#FF333318',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 18, lineHeight: 1.1, color:'#FFFFFF' }}>
                    Someone left the pod
                  </div>
                </div>
              </div>
              <button onClick={dismissDropout} style={{
                background:'#FFFFFF0A', border:'none', color:'#FFFFFF50', fontSize: 12,
                cursor:'pointer', width: 24, height: 24, borderRadius: 8,
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>{'\u2715'}</button>
            </div>

            {/* Dropped person card */}
            <div style={{ marginTop: 16, padding:'12px 14px', background:'#0A0A0A', borderRadius: 10, display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 99, overflow:'hidden', border:'2px solid #FF333330', position:'relative', flexShrink: 0 }}>
                <div style={{ position:'absolute', inset: -4, filter:'blur(6px) grayscale(1) opacity(0.5)' }}>
                  <Silhouette seed={droppedPerson.seed}/>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 18, color:'#FFFFFF', lineHeight: 1 }}>
                  {droppedPerson.name}<span style={{ color:'#FFFFFF50', fontStyle:'italic', fontSize: 12 }}>, {droppedPerson.age}</span>
                </div>
                <div className="mono" style={{ fontSize: 12, color:'#FF4444', marginTop: 3 }}>Left the pod</div>
              </div>
              <div className="mono caps" style={{
                fontSize: 12, letterSpacing:'0.12em',
                padding:'4px 10px', background:'#FF333318', color:'#FF4444', borderRadius: 6
              }}>Dropped</div>
            </div>

            {/* Seat indicator */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display:'flex', gap: 3, alignItems:'center' }}>
                {[...Array(5)].map((_,i) => (
                  <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background:'#FFFFFF' }}/>
                ))}
                <div style={{ flex: 1, height: 5, borderRadius: 99, background:'#FF3333', opacity: 0.25 }}/>
              </div>
              <div className="mono" style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color:'#FFFFFF', letterSpacing:'0.08em', marginTop: 6 }}>
                <span>5 remaining</span>
                <span>1 dropped</span>
              </div>
            </div>

            {/* Info text */}
            <div style={{ marginTop: 14, padding:'12px 20px', background:'#FFFFFF06', borderRadius: 8, border:'1px solid #FFFFFF0A' }}>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', lineHeight: 1.5 }}>
                Your pod now has <span style={{ fontWeight: 700 }}>11 people</span> and <span style={{ fontWeight: 700 }}>5 dates.</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFFB0', marginTop: 2, lineHeight: 1.3 }}>
                Your date order has been adjusted automatically.
              </div>
            </div>

            {/* Dismiss */}
            <button onClick={dismissDropout} style={{
              marginTop: 16, width:'100%', padding:'11px', background:'#FFFFFF', color:'#0A0A0A',
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
              borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700,
              transition:'all .15s ease'
            }}
            onMouseEnter={e => { e.target.style.backgcircuit = '#FFFFFFDD'; }}
            onMouseLeave={e => { e.target.style.backgcircuit = '#FFFFFF'; }}
            >Got it</button>
          </div>
        </div>
      )}

      {/* Countdown popup */}
      {showPopup && (
        <div style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0ACC', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', animation:'fade .3s ease both'
        }}>
          <div style={{ textAlign:'center', maxWidth: 480 }}>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, color:'#FFFFFF', letterSpacing:'-0.02em' }}>
              Smile! It's time to talk to <span style={{ fontStyle:'italic', color:'var(--rust)' }}>{nextPerson.name}.</span>
            </div>
            <div className="serif" style={{ fontSize: 96, lineHeight: 1, color:'var(--rust)', marginTop: 24, fontFeatureSettings:'"tnum"' }}>
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

window.GetReadyNotifyView = GetReadyNotifyView;
