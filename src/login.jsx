// Login / Sign-up — editorial split layout.

// Floating hearts animation with some profile pictures
function NetworkGraph() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let raf, start = performance.now();
    const loop = (t) => { setTick((t - start) / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const heartPath = "M0,-6 C-2,-10 -8,-10 -8,-5 C-8,-1 -4,3 0,7 C4,3 8,-1 8,-5 C8,-10 2,-10 0,-6Z";

  const hearts = React.useMemo(() => [
    { id: 0, x: 50, y: 48, s: 5.0,  phase: 0,    filled: true, profile: true },
    { id: 1, x: 14, y: 18, s: 2.5,  phase: 0.8,  filled: false },
    { id: 2, x: 84, y: 22, s: 3.0,  phase: 1.5,  filled: true, profile: true },
    { id: 3, x: 26, y: 40, s: 2.8,  phase: 2.3,  filled: true },
    { id: 4, x: 78, y: 54, s: 2.5,  phase: 3.1,  filled: true, profile: true },
    { id: 5, x: 40, y: 72, s: 2.0,  phase: 4.0,  filled: false },
    { id: 6, x: 66, y: 82, s: 2.2,  phase: 4.9,  filled: true },
    { id: 7, x: 18, y: 80, s: 1.8,  phase: 5.7,  filled: false },
    { id: 8, x: 90, y: 74, s: 1.6,  phase: 6.3,  filled: true, profile: true },
    { id: 9, x: 10, y: 58, s: 1.4,  phase: 7.0,  filled: false },
    { id: 10, x: 58, y: 16, s: 1.8, phase: 1.9,  filled: true },
    { id: 11, x: 36, y: 30, s: 1.5, phase: 3.6,  filled: true, profile: true },
  ], []);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
      <defs>
        <clipPath id="heartClip">
          <path d={heartPath} transform="scale(1.1)"/>
        </clipPath>
      </defs>
      {hearts.map((h) => {
        const pulse = 1 + Math.sin(tick * 0.9 + h.phase) * 0.08;
        const cx = h.x + Math.sin(tick * 0.3 + h.phase) * 1.8;
        const cy = h.y + Math.cos(tick * 0.25 + h.phase * 0.7) * 1.8;
        const rot = Math.sin(tick * 0.2 + h.phase) * 12;
        const scale = h.s * pulse;
        const opacity = h.id === 0 ? 0.7 : (0.35 + Math.sin(tick * 0.5 + h.phase) * 0.15);

        return (
          <g key={h.id} transform={`translate(${cx},${cy}) rotate(${rot}) scale(${scale / 10})`} opacity={opacity}>
            {h.id === 0 && (
              <path d={heartPath} fill="#6B1520" fillOpacity={0.15 + Math.sin(tick * 0.7) * 0.05}
                transform={`scale(${1.3 + Math.sin(tick * 0.8) * 0.1})`}/>
            )}
            <path
              d={heartPath}
              fill={h.filled ? '#6B1520' : 'none'}
              stroke="#6B1520"
              strokeWidth={h.filled ? 0 : 0.6}
              fillOpacity={h.filled ? 1 : 0}
              strokeOpacity={h.filled ? 0 : 0.7}
            />
            {false && h.profile && (
              <g clipPath="url(#heartClip)"></g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function LiveCount() {
  const [n, setN] = React.useState(2418);
  React.useEffect(() => {
    const id = setInterval(() => {
      setN(x => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(2200, Math.min(2700, x + delta));
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap: 10, padding:'8px 14px', border:'1px solid #FFFFFF30', borderRadius: 10, background:'#0A0A0A' }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background:'#800120', animation:'pulse 1.2s infinite' }}/>
      <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'#FFFFFF' }}>Live now</span>
      <span className="serif" style={{ fontSize: 24, lineHeight: 1, fontFeatureSettings:'"tnum"', color:'#FFFFFF' }}>
        {n.toLocaleString()}
      </span>
      <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'#888888' }}>in pods</span>
    </div>
  );
}

function LoginView() {
  const [mode, setMode] = React.useState('signup');
  const [firstName, setFirstName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');

  return (
    <div style={{ height:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden' }}>
      {/* Left — editorial with animated hearts on black bg */}
      <div style={{ position:'relative', padding:'36px 40px 28px', borderRight:'1px solid #FFFFFF15', background:'#1A1A1A', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden' }}>
        {/* Animated hearts */}
        <div style={{ position:'absolute', inset: 0, opacity: 0.6, pointerEvents:'none' }}>
          <NetworkGraph/>
        </div>
        <div style={{ position:'absolute', inset: 0, background:'linear-gradient(120deg, #1A1A1A 0%, transparent 45%, transparent 55%, #1A1A1A 100%)', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex: 1, display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center', flex: 1 }}>
          <div className="serif" style={{ fontSize: 48, lineHeight: 0.95, letterSpacing:'-0.03em', marginTop: 10, color:'#FFFFFF' }}>
            <span style={{ fontStyle:'italic', color:'#800120' }}>Love</span><br/>at First Site
          </div>
          <div className="serif" style={{ fontSize: 18, fontStyle:'italic', color:'#CCCCCC', marginTop: 16, lineHeight: 1.3, maxWidth: 440 }}>
            Six first dates. Five minutes each.<br/>No swiping. Just real conversation.
          </div>
          <div style={{ marginTop: 16 }}>
            <LiveCount/>
          </div>
        </div>

        <div style={{ position:'relative', zIndex: 1 }}>
          <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'#888888', marginBottom: 10 }}>How It Works</div>
          {[
            { title:'Set up your profile', desc:'Share a bit about yourself and what you\'re looking for.' },
            { title:'Enter the lobby', desc:'We place you into a small, curated group.' },
            { title:'Go on six 5-minute dates', desc:'Back-to-back video conversations. No interruptions.' },
            { title:'Make your calls', desc:'After each date, choose yes or no.' },
            { title:'See what\'s mutual', desc:'If you both said yes, it\'s a match. Start chatting.' },
          ].map((t, i) => (
            <div key={i} style={{ borderBottom:'1px dotted #FFFFFF20', padding:'10px 0', display:'flex', gap: 14, alignItems:'flex-start', color:'#FFFFFF', fontFamily:'Lato, sans-serif' }}>
              <span className="mono" style={{ fontSize: 12, color:'#800120', minWidth: 22, paddingTop: 2 }}>{String(i+1).padStart(2,'0')}</span>
              <div>
                <div style={{ fontSize: 18, lineHeight: 1.1, fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.3, color:'#AAAAAA', marginTop: 3 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ padding:'28px 40px 20px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ maxWidth: 420, width:'100%' }}>
          <div style={{ display:'flex', gap: 4, padding: 4, border:'1px solid var(--line-strong)', borderRadius: 10, width:'fit-content', marginBottom: 16 }}>
            {['signup','signin'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding:'6px 16px', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:'Lato, sans-serif',
                background: mode === m ? '#0A0A0A' : 'transparent', color: mode === m ? '#FFFFFF' : 'var(--ink-2)',
                borderRadius: 99
              }}>{m === 'signin' ? 'Sign in' : 'New here'}</button>
            ))}
          </div>

          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em' }}>
            {mode === 'signin'
              ? <>Welcome <span style={{ fontStyle:'italic', color:'#800120' }}>back.</span></>
              : <>It's time to <span style={{ fontStyle:'italic', color:'#800120' }}>date.</span></>}
          </div>
          <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 12, lineHeight: 1.5 }}>
            {mode === 'signin' ? 'The Pods are waiting for you.' : 'Let\'s get you started.'}
          </div>

          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 10 }}>
            {mode === 'signup' && (
              <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="Your first name"/>
            )}
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com"/>
            <Field label="Password" value={pw} onChange={setPw} placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'} type="password"/>
            {mode === 'signup' && (
              <Field label="Confirm Password" value={pw2} onChange={setPw2} placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'} type="password"/>
            )}
            {mode === 'signup' && (
              <label style={{ display:'flex', alignItems:'flex-start', gap: 10, marginTop: 4 }}>
                <input type="checkbox" defaultChecked style={{ marginTop: 3, accentColor:'#800120' }}/>
                <span style={{ fontSize: 12, lineHeight: 1.3, color:'var(--ink-2)', fontFamily:'Lato, sans-serif' }}>
                  I agree to the <span style={{ color:'#800120', fontWeight: 600 }}>Terms and Conditions</span>.
                </span>
              </label>
            )}
            <button onClick={() => window.__setView && window.__setView(mode === 'signin' ? 'dashboard' : 'quiz')} style={{
              marginTop: 6, padding:'12px 18px', background:'#800120', color:'#FFFFFF',
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
              borderRadius: 10, cursor:'pointer'
            }}>
              {mode === 'signin' ? 'Start Dating \u2192' : 'Start Dating \u2192'}
            </button>

            <div style={{ display:'flex', alignItems:'center', gap: 10, margin:'8px 0 2px' }}>
              <div style={{ flex:1, height:1, background:'var(--line-strong)' }}/>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em' }}>or</span>
              <div style={{ flex:1, height:1, background:'var(--line-strong)' }}/>
            </div>
            <button style={{ padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-2)' }}>
              Continue with Apple
            </button>
            <button style={{ padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-2)' }}>
              Continue with Google
            </button>
          </div>

          <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 14, fontStyle:'italic', lineHeight: 1.5 }}>
            By continuing you confirm you are at least 18. Camera, microphone, and decorum rules apply during dates.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  const isPw = type === 'password';
  const ref = React.useRef(null);
  const timerRef = React.useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
    if (isPw && ref.current) {
      ref.current.classList.remove('pw-peek');
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (ref.current) ref.current.classList.add('pw-peek');
      }, 500);
    }
  };

  return (
    <label style={{ display:'block' }}>
      <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)', marginBottom: 6 }}>{label}</div>
      <input
        ref={ref}
        type={isPw ? 'text' : type}
        className={isPw && value ? 'pw-peek' : ''}
        value={value} onChange={handleChange} placeholder={placeholder}
        style={{
          width:'100%', padding:'9px 12px', border:'1px solid var(--line-strong)', borderRadius: 10,
          background:'var(--cream)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12,
          outline:'none'
        }}
      />
    </label>
  );
}

window.LoginView = LoginView;
window.Field = Field;
