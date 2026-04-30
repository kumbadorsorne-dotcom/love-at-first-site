// Bio / Profile setup — 15 locked variables, photo, socials.

const DEALBREAKERS = [
  { key:'smoking', label:'Smoking', options:['Never','Socially','Regularly'], hard: true },
  { key:'drinking', label:'Drinking', options:['Never','Socially','Often'] },
  { key:'kids', label:'Wants kids', options:['Yes','No','Maybe','Already have'], hard: true },
  { key:'religion', label:'Religion', options:['None','Spiritual','Practicing'] },
  { key:'politics', label:'Politics', options:['Left','Moderate','Right','Apolitical'] },
  { key:'zodiac', label:'Zodiac', options:['Fire','Earth','Air','Water'] },
  { key:'pets', label:'Pets', options:['Dog','Cat','Both','None','Allergic'] },
  { key:'workout', label:'Workout habits', options:['Daily','Weekly','Rarely','Never'] },
  { key:'education', label:'Education', options:['High school','Bachelor','Graduate','PhD'] },
  { key:'diet', label:'Diet', options:['Omnivore','Vegetarian','Vegan','Pescatarian'] },
  { key:'love_style', label:'Love style', options:['Verbal','Touch','Gifts','Time','Service'] },
  { key:'family', label:'Family plans', options:['Soon','Eventually','Uncertain','No'] },
  { key:'travel', label:'Travel', options:['Constantly','Yearly','Rarely','Homebody'] },
  { key:'sleep', label:'Sleep', options:['Early bird','Night owl','Flexible'] },
  { key:'conflict', label:'Conflict style', options:['Direct','Cool-off','Avoider','Negotiator'] },
];

const COMPLIMENTS = ['Looking great!', 'Photo verified', 'Ready to mingle', 'Camera ready', 'Stunning profile', 'Looking sharp'];

// Shared photo upload slot — click to upload images, shows 1:1 preview overlay with drag-to-reposition
function PhotoUploadSlot({ children, style, onUpload, onRemove }) {
  const inputRef = React.useRef(null);
  const [preview, setPreview] = React.useState(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [hovering, setHovering] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [savedOffset, setSavedOffset] = React.useState({ x: 0, y: 0 });
  const dragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const imgRef = React.useRef(null);
  const boxRef = React.useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setOffset({ x: 0, y: 0 });
    setSavedOffset({ x: 0, y: 0 });
    setPreview(url);
    if (onUpload) onUpload(url);
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    e.target.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onPointerUp = () => {
    dragging.current = false;
    setSavedOffset({ ...offset });
  };

  const [cropPct, setCropPct] = React.useState(0); // percentage offset for thumbnail
  const savePosition = () => {
    setSavedOffset({ ...offset });
    // Calculate percentage offset relative to image height for thumbnail
    if (imgRef.current && boxRef.current) {
      const imgH = imgRef.current.offsetHeight;
      if (imgH > 0) setCropPct((offset.y / imgH) * 100);
    }
    setPreview(null);
  };

  return (
    <>
      <div onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
        style={{ ...style, cursor:'pointer', position:'relative', overflow:'hidden' }}>
        {imgSrc ? (
          <img src={imgSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset: 0, objectPosition: `center ${50 + cropPct}%` }}/>
        ) : children}
        {imgSrc && hovering && (
          <button onClick={(e) => { e.stopPropagation(); setImgSrc(null); setSavedOffset({ x: 0, y: 0 }); setOffset({ x: 0, y: 0 }); if (onRemove) onRemove(); }}
            style={{ position:'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 99, background:'#0A0A0ACC', color:'#FFFFFF', border:'none', fontSize: 12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 2 }}>{'\u2715'}</button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }}/>
      </div>
      {preview && ReactDOM.createPortal(
        <div onClick={() => setPreview(null)} style={{
          position:'fixed', inset: 0, zIndex: 99999, background:'#0A0A0AE0', backdropFilter:'blur(8px)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 16, padding: 40, animation:'fade .2s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{ position:'relative', width:'min(550px, 85vw)', maxHeight:'calc(100vh - 80px)', borderRadius: 10, background:'#1A1A1A', boxShadow:'0 24px 64px -16px #000000CC', overflow:'hidden', userSelect:'none', display:'flex', flexDirection:'column' }}>
            {/* Full image — visible behind the overlay, constrained height */}
            <div ref={boxRef} style={{ position:'relative', width:'100%', overflow:'hidden', cursor:'grab', flex: 1, minHeight: 0, maxHeight:'calc(100vh - 140px)' }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
            >
              <img ref={imgRef} src={preview} alt="" draggable={false} style={{ width:'100%', display:'block', pointerEvents:'none', transform: `translateY(${offset.y}px)` }}/>
              {/* Dark overlay with transparent square cutout */}
              <div style={{ position:'absolute', inset: 0, pointerEvents:'none' }}>
                {/* Top dark band */}
                <div style={{ position:'absolute', top: 0, left: 0, right: 0, height: `calc(50% - min(275px, 42.5vw) + ${offset.y}px)`, background:'#0A0A0A99', transition:'height 0.05s' }}/>
                {/* Bottom dark band */}
                <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, height: `calc(50% - min(275px, 42.5vw) - ${offset.y}px)`, background:'#0A0A0A99', transition:'height 0.05s' }}/>
                {/* Crop frame border */}
                <div style={{ position:'absolute', top:'50%', left:'50%', width:'min(550px, 85vw)', height:'min(550px, 85vw)', transform: 'translate(-50%, -50%)', border:'2px dashed #FFFFFF60', borderRadius: 10, pointerEvents:'none' }}/>
              </div>
            </div>
            {/* Bottom bar — always visible */}
            <div style={{ padding:'12px 20px', background:'#1A1A1A', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFF80', letterSpacing:'0.08em' }}>Drag photo to reposition</div>
              <div style={{ display:'flex', gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); setPreview(null); setOffset(savedOffset); }} style={{
                  padding:'8px 20px', background:'transparent', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'1px solid #FFFFFF30', cursor:'pointer'
                }}>Cancel</button>
                <button onClick={(e) => { e.stopPropagation(); savePosition(); }} style={{
                  padding:'8px 20px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700
                }}>Apply</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
window.PhotoUploadSlot = PhotoUploadSlot;

function FaceCompliment() {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % COMPLIMENTS.length), 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position:'absolute', top: 10, right: 10, padding:'3px 7px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10 }}>
      {COMPLIMENTS[idx]}
    </div>
  );
}

function BioView({ compact = false, tweaks = {} }) {
  const tier = tweaks.tier || 'free';
  const [values, setValues] = React.useState(() => ({
    smoking: 'Never', drinking: 'Socially', kids: 'Yes', religion: 'None',
    politics: 'Left', zodiac: 'Air', pets: 'Dog', workout: 'Weekly',
    education: 'Graduate', diet: 'Omnivore', love_style: 'Touch',
    family: 'Eventually', travel: 'Yearly', sleep: 'Night owl', conflict: 'Direct',
  }));
  const [hards, setHards] = React.useState(() => ({ smoking: true, kids: true }));
  const hardCount = Object.values(hards).filter(Boolean).length;
  const MAX_HARD = 3;
  const toggleHard = (k) => setHards(o => {
    if (o[k]) return { ...o, [k]: false };
    if (hardCount >= MAX_HARD) return o;
    return { ...o, [k]: true };
  });
  const [bio, setBio] = React.useState(() => {
    try { const saved = localStorage.getItem('lfs.quiz'); if (saved) { const d = JSON.parse(saved); if (d.bio) return d.bio; } } catch {}
    return 'I restore old radios and get too emotional at dog parks. Looking for someone who reads menus cover to cover.';
  });
  const [handle, setHandle] = React.useState({ ig: '@marielune', phone: '+1 (415) 555-0140' });
  const [location, setLocation] = React.useState('Brooklyn, NY');
  const [radius, setRadius] = React.useState(50);
  const [accurate, setAccurate] = React.useState(() => {
    try { return localStorage.getItem('lfs.accurate') === '1'; } catch { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('lfs.accurate', accurate ? '1' : '0'); } catch {}
  }, [accurate]);

  const set = (k, v) => setValues(o => ({ ...o, [k]: v }));
  const [modal, setModal] = React.useState(null); // 'about' | 'variables' | null
  const [matchProfile, setMatchProfile] = React.useState(null);
  const [rulesOpen, setRulesOpen] = React.useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = React.useState(false);
  // Read quiz data from localStorage (synced from quiz page)
  const [av, setAv] = React.useState(() => {
    try {
      const saved = localStorage.getItem('lfs.quiz');
      if (saved) { const d = JSON.parse(saved); return { ...d, abBio: d.bio || bio, abLocation: d.location || location }; }
    } catch {}
    return { birthday:'1997-03-14', abBio: bio, abLocation: location, height:"5'8\"", gender:'Woman', interested:'Men', edu:'Graduate', job:'Translator', ethnicity:'Mixed', faith:'Spiritual', politics2:'Liberal', children:'I want children', petsList:['Dog','Cat'], drinking2:'Socially', smoking2:'Socially', cannabis:'No', diet2:'Omnivore', workout2:'Weekly', sleep2:'Night owl', love2:'Touch', conflict2:'Direct', travel2:'Yearly', socialBattery:'Ambivert', phone: handle.phone, ig: handle.ig, fb:'', twitter:'' };
  });
  const setAv_ = (k, v) => setAv(o => {
    const updated = { ...o, [k]: v };
    // Sync back to localStorage so quiz picks it up
    try { localStorage.setItem('lfs.quiz', JSON.stringify(updated)); } catch {}
    window.__quizData = updated;
    return updated;
  });
  const lobbyCtaRef = React.useRef(null);
  React.useEffect(() => {
    const el = lobbyCtaRef.current;
    if (!el) return;
    const spawn = () => {
      const heart = document.createElement('span');
      heart.textContent = '\u2665';
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 16;
      const dur = 3 + Math.random() * 3;
      const delay = Math.random() * 0.5;
      Object.assign(heart.style, {
        position:'absolute', bottom:'0', left: left + '%',
        fontSize: size + 'px', color:'#800120',
        opacity:'0', pointerEvents:'none', zIndex:'0',
        animation: 'heartFloat ' + dur + 's ' + delay + 's ease-out forwards'
      });
      el.appendChild(heart);
      setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, (dur + delay) * 1000 + 200);
    };
    const id = setInterval(spawn, 600);
    return () => clearInterval(id);
  }, []);
  const [chatOpen, setChatOpen] = React.useState(null);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ height: compact ? 'auto' : '100vh', padding: compact ? '20px 28px 24px' : '24px 48px 24px', maxWidth: 1280, margin:'0 auto', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20, flexShrink: 0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap: 12 }}>
          <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.02em' }}>
            <span style={{ fontStyle:'italic' }}>Love</span> at First Site
          </div>
          <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>Profile</div>
        </div>
        <button onClick={() => window.__setView && window.__setView('dashboard')} style={{ padding:'12px 20px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', background:'#FFFFFF', color:'var(--ink)', borderRadius: 10, border:'1px solid var(--line-strong)', cursor:'pointer' }}>Back to Dashboard</button>
      </div>

      {/* Main content */}
      <div style={{ display:'grid', gridTemplateColumns: compact ? '240px 1fr' : '380px 1fr', gap: compact ? 28 : 44, flex: 1, minHeight: 0 }}>
        {/* LEFT: Photo + thumbnails */}
        <div style={{ display:'flex', flexDirection:'column' }}>
          <PhotoUploadSlot style={{ flex: 1, aspectRatio:'1/1', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Silhouette seed={2}/>
            <div style={{ position:'absolute', left: 12, bottom: 12, padding:'6px 14px', background:'#FFFFFF', border:'1px solid var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, pointerEvents:'none' }}>
              Upload photo
            </div>
            <FaceCompliment/>
          </PhotoUploadSlot>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
            {[11,12,13,14].map((seed, i) => (
              <PhotoUploadSlot key={i} style={{ aspectRatio:'1/1', borderRadius: 10, border:'1px solid var(--line-strong)', background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Silhouette seed={seed}/>
                <div style={{ position:'absolute', bottom: 3, right: 4, fontFamily:'Lato, sans-serif', fontSize: 12, color:'var(--cream)', textShadow:'0 1px 2px #0008', pointerEvents:'none' }}>{i+2}</div>
              </PhotoUploadSlot>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 6, fontStyle:'italic' }}>5 photos max. Click to upload.</div>
        </div>

        {/* RIGHT: Profile info */}
        <div style={{ display:'flex', flexDirection:'column', gap: 18, overflow:'auto' }}>
          {/* Name + member badge */}
          <div>
            <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--ink-3)' }}>Member since Mar 2024</div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 6 }}>
              Marie<span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>, 29</span>
            </div>
            <div className="mono" style={{ fontSize: 14, color:'var(--ink-3)', marginTop: 4 }}>Brooklyn, NY</div>
          </div>

          {/* One-liner bio */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
              <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>One-liner</div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>{bio.length} / 240</div>
            </div>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} maxLength={240}
              style={{ width:'100%', padding:'14px 18px', border:'1px solid var(--line-strong)', borderRadius: 10,
                background:'#FFFFFF', color:'var(--ink)', fontFamily:'Lato, sans-serif',
                fontSize: 18, fontStyle:'italic', lineHeight: 1.3, resize:'none', outline:'none' }}/>
          </div>

          {/* Edit buttons */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            <button onClick={() => setModal('about')} style={{
              textAlign:'left', padding:'18px 20px', background:'#FFFFFF', border:'1px solid var(--ink)', borderRadius: 10, cursor:'pointer', fontFamily:'inherit'
            }}>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)' }}>edit</div>
              <div className="serif" style={{ fontSize: 24, letterSpacing:'-0.01em', marginTop: 4 }}>About me <span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>{'\u2192'}</span></div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, lineHeight: 1.5, fontStyle:'italic' }}>Your profile answers at a glance.</div>
            </button>
            <button onClick={() => setModal('variables')} style={{
              textAlign:'left', padding:'18px 20px', background:'#FFFFFF', border:'1px solid var(--ink)', borderRadius: 10, cursor:'pointer', fontFamily:'inherit'
            }}>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)' }}>edit</div>
              <div className="serif" style={{ fontSize: 24, letterSpacing:'-0.01em', marginTop: 4 }}>Preferences <span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>{'\u2192'}</span></div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, lineHeight: 1.5, fontStyle:'italic' }}>What you're looking for in a match.</div>
            </button>
          </div>
        </div>
      </div>

      {/* Compact-mode footer */}
      {matchProfile && <FullProfilePopup p={matchProfile} onClose={() => setMatchProfile(null)}/>}
      {chatOpen && (
        <div onClick={() => setChatOpen(null)} style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 10,
            display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80'
          }}>
            <BioChatWindow person={chatOpen} onClose={() => setChatOpen(null)}/>
          </div>
        </div>
      )}
      {rulesOpen && <HouseRulesModal onClose={() => setRulesOpen(false)} onAck={() => {
        setRulesOpen(false);
        window.__setView && window.__setView('lobby');
      }}/>}
      {!compact && <LogoutButton/>}

      {/* Modal: About me — mirrors quiz layout, editable */}
      {modal === 'about' && (() => {
        const P = ({ label, field, options, multi }) => (
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>{label}</div>
            <div style={{ display:'flex', gap: 5, flexWrap:'wrap' }}>
              {options.map(s => { const on = multi ? (av[field] || []).includes(s) : av[field] === s; return (
                <button key={s} onClick={() => { if (multi) { const cur = av[field] || []; setAv_(field, on ? cur.filter(x => x !== s) : [...cur, s]); } else { setAv_(field, on ? '' : s); } }} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, display:'inline-flex', alignItems:'center', gap: 4, cursor:'pointer' }}>{on && <span>{'\u2665'}</span>}{s}</button>
              ); })}
            </div>
          </div>
        );
        const I = ({ label, field, placeholder }) => (
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>{label}</div>
            <input value={av[field] || ''} onChange={e => setAv_(field, e.target.value)} placeholder={placeholder || ''}
              style={{ width:'100%', padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontFamily:'Lato', fontSize: 18, fontStyle:'italic', color:'var(--ink)', outline:'none' }}/>
          </div>
        );
        const S = ({ label, field, options }) => (
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>{label}</div>
            <select value={av[field] || ''} onChange={e => setAv_(field, e.target.value)}
              style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: av[field] ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
              <option value="" disabled>Select</option>
              {options.map(s => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        );
        return (
        <div onClick={() => setModal(null)} style={{ position:'fixed', inset: 0, background:'#0A0A0AA8', zIndex: 50, display:'flex', alignItems:'center', justifyContent:'center', padding: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 10, width:'min(980px, 100%)', height:'min(92vh, 900px)', display:'flex', flexDirection:'column', padding:'28px 32px', boxShadow:'0 18px 60px #0A0A0A40' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: 12, marginBottom: 18, flexShrink: 0 }}>
              <div>
                <div className="serif" style={{ fontSize: 48, letterSpacing:'-0.02em' }}>Tell us about <span style={{ fontStyle:'italic', color:'#800120' }}>yourself.</span></div>
              </div>
              <button onClick={() => setModal(null)} className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', padding:'6px 12px', background:'var(--ink)', color:'var(--cream)', cursor:'pointer', borderRadius: 10, border:'none' }}>Done</button>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY:'auto', paddingRight: 4 }}>

              {/* The Basics */}
              <div style={{ marginBottom: 24 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700 }}>The Basics</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <div>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Birthday</div>
                    <input type="date" value={av.birthday || '1997-03-14'} onChange={e => setAv_('birthday', e.target.value)}
                      style={{ width:'100%', padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontFamily:'Lato', fontSize: 12 }}/>
                    <div className="mono" style={{ fontSize: 12, color:'#800120', marginTop: 4 }}>
                      Age: {(() => { const b = new Date(av.birthday || '1997-03-14'); const now = new Date(); return Math.floor((now - b) / 31557600000); })()}
                      {' \u00b7 '}
                      {(() => { const d = new Date(av.birthday || '1997-03-14'); const m = d.getMonth() + 1; const day = d.getDate(); const signs = [['Capricorn',120],['Aquarius',219],['Pisces',320],['Aries',420],['Taurus',521],['Gemini',621],['Cancer',722],['Leo',823],['Virgo',923],['Libra',1023],['Scorpio',1122],['Sagittarius',1222],['Capricorn',1232]]; const v = m * 100 + day; for (let i = 0; i < signs.length - 1; i++) { if (v <= signs[i][1]) return signs[i][0]; } return 'Capricorn'; })()}
                    </div>
                  </div>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 15 }}>
                      <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>One-liner</div>
                      <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>{(av.abBio || '').length} / 240</div>
                    </div>
                    <textarea value={av.abBio || ''} onChange={e => setAv_('abBio', e.target.value)} rows={2} maxLength={240}
                      placeholder="Write something about yourself..."
                      style={{ width:'100%', padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontFamily:'Lato', fontSize: 18, fontStyle:'italic', color:'var(--ink)', lineHeight: 1.3, resize:'none', outline:'none' }}/>
                  </div>
                  <I label="City" field="location" placeholder="Brooklyn, NY"/>
                  <S label="Height" field="height" options={["4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\""]}/>
                </div>
              </div>

              {/* Backgcircuit */}
              <div style={{ marginBottom: 24 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Background</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <P label="Gender" field="gender" options={['Woman','Man','Non-binary','Trans','Other']}/>
                  <S label="Ethnicity" field="ethnicity" options={['Black/African Descent','East Asian','Hispanic/Latino','Middle Eastern','Native American','Pacific Islander','South Asian','White/Caucasian','Mixed','Other']}/>
                  <S label="Religion" field="faith" options={['Agnostic','Atheist','Buddhist','Catholic','Christian','Hindu','Jewish','Muslim','Sikh','Spiritual','Other']}/>
                  <S label="Politics" field="politics2" options={['Liberal','Moderate','Conservative','Apolitical','Other']}/>
                </div>
              </div>

              {/* Career */}
              <div style={{ marginBottom: 24 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Career</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <S label="Education" field="edu" options={['High school','In college','Bachelor','Trade school','In grad school','Masters','PhD']}/>
                  <I label="Job title" field="job" placeholder="e.g. Translator"/>
                </div>
              </div>

              {/* Lifestyle */}
              <div style={{ marginBottom: 24 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Lifestyle</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <S label="Children" field="children" options={['I want children','I don\'t want children','I have children and want more','I have children and don\'t want more','Not sure yet']}/>
                  <P label="Pets" field="petsList" options={['Dog','Cat','Bird','Fish','Reptile']} multi/>
                </div>
              </div>

              {/* Habits */}
              <div style={{ marginBottom: 24 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Habits</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <P label="Drinking" field="drinking2" options={['Socially','Often','Never']}/>
                  <P label="Smoking" field="smoking2" options={['Socially','Regularly','Trying to quit','Never']}/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px', marginTop: 20 }}>
                  <P label="Cannabis" field="cannabis" options={['Yes','Occasionally','Socially','Never']}/>
                  <S label="Diet" field="diet2" options={['Omnivore','Vegetarian','Vegan','Pescatarian','Keto','Halal','Kosher','Other']}/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px', marginTop: 20 }}>
                  <P label="Workout" field="workout2" options={['Daily','Weekly','Rarely','Never']}/>
                  <P label="Sleep" field="sleep2" options={['Early bird','Night owl','No preference']}/>
                </div>
              </div>

              {/* Personality */}
              <div style={{ marginBottom: 24 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Personality</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <P label="Love style" field="love2" options={['Verbal','Touch','Gifts','Time','Service']}/>
                  <P label="Conflict style" field="conflict2" options={['Direct','Cool-off','Avoider','Negotiator']}/>
                  <P label="Travel" field="travel2" options={['Constantly','Yearly','Rarely','Homebody']}/>
                  <P label="Social Battery" field="socialBattery" options={['Introvert','Extrovert','Ambivert','Social Butterfly','Lone Wolf']}/>
                </div>
              </div>

              {/* Contact */}
              <div style={{ paddingBottom: 32 }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Contact</div>
                <div style={{ padding:'12px 20px', background:'#800120', color:'#FFFFFF', borderRadius: 10, marginBottom: 14 }}>
                  <div className="mono" style={{ fontSize: 12, lineHeight: 1.5, fontStyle:'italic' }}>
                    Your contact is only shared with your matches. Prefer not to share it? Leave it blank and they can message you on the platform.
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
                  <I label="Phone" field="phone" placeholder="+1 (555) 555-0100"/>
                  <I label="Instagram" field="ig" placeholder="@handle"/>
                  <I label="Facebook" field="fb" placeholder="facebook.com/..."/>
                  <I label="Twitter / X" field="twitter" placeholder="@handle"/>
                </div>
              </div>

            </div>
          </div>
        </div>
        );
      })()}

      {/* Modal: Preferences & Interests editor */}
      {modal === 'variables' && (
        <div onClick={() => setModal(null)} style={{ position:'fixed', inset: 0, background:'#0A0A0AA8', zIndex: 50, display:'flex', alignItems:'center', justifyContent:'center', padding: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 10, width:'min(860px, 100%)', height:'min(92vh, 900px)', display:'flex', flexDirection:'column', padding:'28px 32px', boxShadow:'0 18px 60px #0A0A0A40' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: 12, marginBottom: 18, flexShrink: 0 }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)' }}>Preferences &amp; Interests</div>
                <div className="serif" style={{ fontSize: 32, letterSpacing:'-0.02em', marginTop: 4 }}>Who are you interested in?</div>
              </div>
              <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
                <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em' }}>Select {hardCount} / {MAX_HARD} deal breakers</span>
                <button onClick={() => setModal(null)} className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', padding:'6px 12px', background:'var(--ink)', color:'var(--cream)', cursor:'pointer', borderRadius: 10, border:'none' }}>Done</button>
              </div>
            </div>
            <div style={{ padding:'12px 20px', background:'#800120', color:'#FFFFFF', borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10, marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 12, lineHeight: 1.3 }}>On Premium you are placed in pods based on your dealbreakers.</div>
              <div style={{ display:'flex', gap: 6, flexShrink: 0 }}>
                <button style={{ padding:'5px 12px', background:'#FFFFFF', color:'#800120', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700 }}>Upgrade</button>
                <button style={{ padding:'5px 12px', background:'transparent', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'1px solid #FFFFFF60', cursor:'pointer' }}>Learn more</button>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY:'auto', paddingRight: 4 }}>
              {/* Interested in + Location — same row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginBottom: 18 }}>
                <div>
                  <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)', marginBottom: 8 }}>Interested in</div>
                  <div style={{ display:'flex', gap: 6 }}>
                    {['Women', 'Men', 'Everyone'].map(s => {
                      const on = values.interested === s;
                      return (<button key={s} onClick={() => set('interested', on ? '' : s)} style={{
                        padding:'8px 16px', fontSize: 12, fontFamily:'Lato, sans-serif',
                        background: on ? 'var(--ink)' : 'var(--cream)',
                        color: on ? 'var(--cream)' : 'var(--ink)',
                        border: `1px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`,
                        borderRadius: 10, cursor:'pointer', fontStyle: on ? 'italic' : 'normal',
                        display:'inline-flex', alignItems:'center', gap: 5
                      }}>{on && <span>{'\u2665'}</span>}{s}</button>);
                    })}
                  </div>
                </div>
                <div>
                  <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)', marginBottom: 8 }}>Location</div>
                  <input value={location} onChange={e => setLocation(e.target.value)}
                    className="serif"
                    style={{ width:'100%', fontSize: 18, padding:'8px 10px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--paper-2)' }}/>
                </div>
              </div>

              
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 2, border:'1px solid var(--line-strong)', borderRadius: 10, overflow:'hidden' }}>
                {DEALBREAKERS.filter(d => ['smoking','drinking','kids','religion','politics','family','diet'].includes(d.key)).map((d) => (
                  <DealbreakerRow key={d.key} d={d} value={values[d.key]} onChange={v => set(d.key, v)}
                    hard={!!hards[d.key]} onToggleHard={() => toggleHard(d.key)}
                    lockedOut={!hards[d.key] && hardCount >= MAX_HARD}/>
                ))}
              </div>

              
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 2, border:'1px solid var(--line-strong)', borderRadius: 10, overflow:'hidden' }}>
                {DEALBREAKERS.filter(d => ['zodiac','pets','workout','education','love_style','travel','sleep','conflict'].includes(d.key)).map((d) => (
                  <DealbreakerRow key={d.key} d={d} value={values[d.key]} onChange={v => set(d.key, v)}
                    hard={!!hards[d.key]} onToggleHard={() => toggleHard(d.key)}
                    lockedOut={!hards[d.key] && hardCount >= MAX_HARD}/>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
      {/* Premium popup — mirrors premium page layout, no scrolling */}
      {showPremiumPopup && (
        <div onClick={() => setShowPremiumPopup(false)} style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#1A1A1AB0', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding: 32, animation:'fade .25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', maxWidth: 960, height:'min(600px, 85vh)', display:'flex', overflow:'hidden',
            borderRadius: 10, boxShadow:'0 40px 80px -30px #1A1A1A80'
          }}>
            <div style={{ flex:'1 1 55%', background:'#FFFFFF', padding:'36px 36px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'#800120', marginBottom: 8 }}>Premium</div>
              <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, letterSpacing:'-0.03em', color:'var(--ink)' }}>
                Every call could be<br/><span style={{ fontStyle:'italic', color:'#800120' }}>the one.</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 8, maxWidth: 360, lineHeight: 1.5 }}>
                Premium removes the limits and puts you in the right rooms. Better pods, more circuits, real signals.
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 18px', marginTop: 24 }}>
                {[
                  { title:'Your dealbreakers matter', desc:'Pods curated acircuit what matters to you.', free:'Random pods', icon:'\u2665' },
                  { title:'Endless circuits', desc:'Unlimited circuits, anytime you want.', free:'2 per day', icon:'\u221E' },
                  { title:'Send a signal', desc:'Hint you are interested right after the call.', free:'No signals', icon:'\u2764' },
                  { title:'Priority seating', desc:'You fill pods first when demand is high.', free:'Queue-based', icon:'\u2606' },
                  { title:'Extra dealbreakers', desc:'Up to 6 slots instead of 3.', free:'3 max', icon:'+' },
                  { title:'Match insights', desc:'See compatibility before each call.', free:'No insights', icon:'\u2197' },
                ].map((b, i) => (
                  <div key={i} style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
                    <div style={{ width: 24, height: 24, flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'center', background:'#800120', color:'#FFFFFF', borderRadius: 10, fontSize: 12, fontFamily:'Lato, sans-serif' }}>{b.icon}</div>
                    <div>
                      <div className="serif" style={{ fontSize: 12, lineHeight: 1.1 }}>{b.title}</div>
                      <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', lineHeight: 1.3, marginTop: 1 }}>{b.desc}</div>
                      <div className="mono" style={{ fontSize: 12, color:'#AAAAAA', marginTop: 1 }}>Free: {b.free}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 14, borderTop:'1px solid var(--line-strong)' }}>
                <div className="serif" style={{ fontSize: 12, fontStyle:'italic', lineHeight: 1.3, color:'var(--ink)', maxWidth: 360 }}>
                  "I matched with my partner on my first Premium circuit. Dealbreaker matching actually works."
                </div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, letterSpacing:'0.08em' }}>-- Jordan, 29, Brooklyn</div>
              </div>
            </div>
            <div style={{ flex:'1 1 45%', background:'#0A0A0A', padding:'36px 32px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1.1, letterSpacing:'-0.02em', color:'#FFFFFF', textAlign:'center' }}>
                Choose your plan
              </div>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFF60', marginTop: 6, textAlign:'center', lineHeight: 1.5 }}>
                All plans include every feature. Cancel anytime.
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap: 10, marginTop: 22 }}>
                {[
                  { id:'weekly', label:'Weekly', price:'$9.99', period:'/week', note:'Cancel anytime' },
                  { id:'monthly', label:'Monthly', price:'$24.99', period:'/month', note:'Most popular', badge: true },
                  { id:'yearly', label:'Yearly', price:'$149.99', period:'/year', note:'Save 50%' },
                ].map(p => {
                  const active = p.id === 'monthly';
                  return (
                    <div key={p.id} style={{
                      padding:'14px 16px', borderRadius: 10, cursor:'pointer',
                      border: active ? '2px solid #800120' : '1px solid #FFFFFF1A',
                      background: active ? '#800120' : '#1A1A1A',
                      color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'space-between',
                      position:'relative'
                    }}>
                      {p.badge && (
                        <div className="mono caps" style={{ position:'absolute', top: -7, right: 14, padding:'2px 8px', background:'#FFFFFF', color:'#800120', fontSize: 12, letterSpacing:'0.12em', borderRadius: 99 }}>Most Popular</div>
                      )}
                      <div>
                        <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em' }}>{p.label}</div>
                        <div className="mono" style={{ fontSize: 12, opacity: 0.5, marginTop: 1 }}>{p.note}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <span className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{p.price}</span>
                        <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>{p.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 18, padding:'12px 20px', background:'#1A1A1A', borderRadius: 10 }}>
                <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'#FFFFFF40', marginBottom: 8 }}>Premium vs. Free</div>
                {[
                  ['Pod matching', 'Dealbreaker-based', 'Random'],
                  ['Circuits', 'Unlimited', '2/day'],
                  ['Signals', 'Send a hint', 'None'],
                  ['Dealbreakers', 'Up to 6', '3 max'],
                ].map(([feature, prem, free], i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderTop: i > 0 ? '1px solid #FFFFFF08' : 'none' }}>
                    <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', flex:'1 1 30%', textAlign:'left' }}>{'\u2665'} {prem}</div>
                    <div className="mono" style={{ fontSize: 12, color:'#FFFFFF60', flex:'1 1 40%', textAlign:'center' }}>{feature}</div>
                    <div className="mono" style={{ fontSize: 12, color:'#FFFFFF30', flex:'1 1 30%', textAlign:'right' }}>{free}</div>
                  </div>
                ))}
              </div>
              <button style={{
                marginTop: 18, width:'100%', padding:'12px', background:'#800120', color:'#FFFFFF',
                fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700
              }}>Upgrade to Premium</button>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', marginTop: 8, textAlign:'center' }}>No commitment. Just better dates.</div>
              <button onClick={() => setShowPremiumPopup(false)} style={{
                marginTop: 12, width:'100%', padding:'8px', background:'#333333', color:'#FFFFFF',
                fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                borderRadius: 10, border:'1px solid #FFFFFF12', cursor:'pointer'
              }}>Continue with Free</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DealbreakerRow({ d, value, onChange, hard, onToggleHard, lockedOut }) {
  return (
    <div style={{ padding:'14px 16px', background:'var(--cream)', borderBottom:'1px solid var(--line)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
        <span className="serif" style={{ fontSize: 18 }}>{d.label}</span>
        <button onClick={onToggleHard}
          disabled={lockedOut}
          style={{
            width: 26, height: 26, border:`1px solid ${hard ? 'var(--rust)' : lockedOut ? 'var(--line)' : 'var(--line-strong)'}`,
            color: hard ? 'var(--cream)' : lockedOut ? 'var(--line)' : 'var(--ink-3)',
            background: hard ? 'var(--rust)' : 'transparent',
            borderRadius: 99, fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center',
            cursor: lockedOut ? 'not-allowed' : 'pointer',
            opacity: lockedOut ? 0.4 : 1
          }} title={hard ? 'Hard dealbreaker — click to remove' : lockedOut ? '3 hard dealbreakers max' : 'Mark as hard dealbreaker'}>♥</button>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
        {d.options.map(opt => {
          const active = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding:'4px 10px', fontFamily:'Lato, sans-serif', fontSize: 12,
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--paper)' : 'var(--ink-2)',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line-strong)'}`,
              borderRadius: 10
            }}>{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

function ReadOnlyRow({ d, value, hard }) {
  return (
    <div style={{ padding:'14px 16px', background:'var(--cream)', borderBottom:'1px solid var(--line)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
        <span className="serif" style={{ fontSize: 18 }}>{d.label}</span>
        {hard && (
          <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em' }}>♥ hard</span>
        )}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
        {d.options.map(opt => {
          const active = value === opt;
          return (
            <span key={opt} style={{
              padding:'4px 10px', fontFamily:'Lato, sans-serif', fontSize: 12,
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--paper)' : 'var(--ink-3)',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
              borderRadius: 10,
              opacity: active ? 1 : 0.6
            }}>{opt}</span>
          );
        })}
      </div>
    </div>
  );
}

function BioChatWindow({ person, onClose }) {
  const [msgs, setMsgs] = React.useState([
    { from:'System', me: false, text: `You matched with ${person.name} in Pod ${person.pod}. Say hello!`, time:'just now', system: true },
  ]);
  const [input, setInput] = React.useState('');
  const containerRef = React.useRef(null);
  React.useEffect(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; }, [msgs.length]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { from:'You', me: true, text: input.trim(), time:'just now' }]);
    setInput('');
  };

  return (
    <>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
        <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
            <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={person.seed}/></div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{person.name}</div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>Pod {person.pod}</div>
          </div>
        </div>
        <button onClick={onClose} className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
      </div>
      <div ref={containerRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
        {msgs.map((msg, i) => {
          if (msg.system) return (
            <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 10 }}>
                {msg.text}
              </div>
            </div>
          );
          return (
            <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth:'75%', padding:'12px 20px',
                background: msg.me ? '#0A0A0A' : 'var(--paper-2)',
                color: msg.me ? '#FFFFFF' : 'var(--ink)',
                borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                border: msg.me ? 'none' : '1px solid var(--line-strong)'
              }}>
                <div className="serif" style={{ fontSize: 14, lineHeight: 1.35 }}>{msg.text}</div>
                <div className="mono" style={{ fontSize: 12, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder={`Message ${person.name}...`}
          style={{ flex: 1, padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
        <button onClick={send} style={{ padding:'12px 20px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, flexShrink: 0 }}>Send</button>
      </div>
    </>
  );
}

window.BioView = BioView;
