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

function FaceCompliment() {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % COMPLIMENTS.length), 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position:'absolute', top: 10, right: 10, padding:'3px 7px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 8, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 2 }}>
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
  const [bio, setBio] = React.useState('I restore old radios and get too emotional at dog parks. Looking for someone who reads menus cover to cover.');
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
  const [chatOpen, setChatOpen] = React.useState(null);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ minHeight: compact ? 'auto' : '100vh', padding: compact ? '20px 28px 24px' : '36px 48px 72px', maxWidth: 1280, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: compact ? 10 : 16, marginBottom: compact ? 16 : 28 }}>
        <div>
          <div className="mono caps" style={{ fontSize: 10, letterSpacing:'0.16em', color:'var(--ink-3)' }}>02 · Profile setup · Step 2 of 3</div>
          <div className="serif" style={{ fontSize: compact ? 34 : 52, lineHeight: 1.02, letterSpacing:'-0.02em', marginTop: compact ? 4 : 8 }}>
            Tell us who you <span style={{ fontStyle:'italic' }}>are.</span>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: compact ? '240px 1fr' : '340px 1fr', gap: compact ? 28 : 40, alignItems:'start' }}>
        {/* LEFT: photo + bio + socials */}
        <div style={{ display:'flex', flexDirection:'column', gap: 22 }}>
          <div>
            <div className="caps mono" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--ink-3)', marginBottom: 8 }}>Your portrait</div>
            <div style={{ aspectRatio:'1/1', border:'1px solid var(--line-strong)', position:'relative', overflow:'hidden', borderRadius: 2, background:'var(--paper-2)' }}>
              <Silhouette seed={2}/>
              <button style={{ position:'absolute', left: 10, bottom: 10, padding:'6px 10px', background:'var(--cream)', border:'1px solid var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 2 }}>
                Upload
              </button>
              <FaceCompliment/>
            </div>
            {/* Additional photo thumbnails */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 6, marginTop: 8 }}>
              {[11,12,13,14,15].map((seed, i) => (
                <button key={i} style={{ aspectRatio:'1/1', position:'relative', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)', background:'var(--paper-2)', cursor:'pointer' }}>
                  <Silhouette seed={seed}/>
                  <div style={{ position:'absolute', bottom: 2, right: 3, fontFamily:'Lato, sans-serif', fontSize: 8, color:'var(--cream)', textShadow:'0 1px 2px #0008' }}>{i+2}</div>
                </button>
              ))}
            </div>
            <div className="mono" style={{ fontSize: 10, color:'var(--ink-3)', marginTop: 6, fontStyle:'italic', lineHeight: 1.5 }}>
              Six photos max.
            </div>
          </div>

        </div>

        {/* RIGHT: dealbreakers grid */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
            <div>
              
              <div className="serif" style={{ fontSize: 24, fontStyle:'italic', marginTop: 4 }}>Heart up to 3 as hard dealbreakers.</div>
            </div>
            <div style={{ textAlign:'right' }}>
              
            </div>
          </div>

          {/* Two popup triggers — About me, and the combined editor */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            <button onClick={() => setModal('about')} style={{
              textAlign:'left', padding:'18px 20px', background:'var(--paper-2)', border:'1px solid var(--line-strong)', borderRadius: 2, cursor:'pointer', fontFamily:'inherit'
            }}>
              <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>view</div>
              <div className="serif" style={{ fontSize: 22, letterSpacing:'-0.01em', marginTop: 4 }}>About me <span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>→</span></div>
              <div className="mono" style={{ fontSize: 10, color:'var(--ink-3)', marginTop: 6, lineHeight: 1.5, fontStyle:'italic' }}>Read-only snapshot of all 15 answers as a sentence.</div>
            </button>
            <button onClick={() => setModal('variables')} style={{
              textAlign:'left', padding:'18px 20px', background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 2, cursor:'pointer', fontFamily:'inherit'
            }}>
              <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>edit</div>
              <div className="serif" style={{ fontSize: 22, letterSpacing:'-0.01em', marginTop: 4 }}>Preferences &amp; Interests <span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>→</span></div>
              <div className="mono" style={{ fontSize: 10, color:'var(--ink-3)', marginTop: 6, lineHeight: 1.5, fontStyle:'italic' }}>Tell us your preferences and interests.</div>
            </button>
          </div>

          {/* One-liner bio */}
          <div style={{ marginTop: 16 }}>
            <div className="caps mono" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--ink-3)', marginBottom: 6 }}>One-liner bio</div>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} maxLength={240}
              style={{ width:'100%', padding:'10px 12px', border:'1px solid var(--line-strong)', borderRadius: 2,
                background:'var(--paper-2)', color:'var(--ink)', fontFamily:'Lato, sans-serif',
                fontSize: 16, fontStyle:'italic', lineHeight: 1.4, resize:'none', outline:'none' }}/>
            <div className="mono" style={{ fontSize: 9, color:'var(--ink-3)', marginTop: 3, textAlign:'right' }}>{bio.length} / 240</div>
          </div>

          {/* Premium / Free callout */}
          {!compact && (
            tier === 'premium' ? (
              <div style={{ marginTop: 24, padding:'14px 18px', background:'#800120', color:'#FFFFFF', borderRadius: 2, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{'\u2665'}</span>
                  <div>
                    <div className="serif" style={{ fontSize: 16, lineHeight: 1.2 }}>Premium is active</div>
                    <div className="mono" style={{ fontSize: 9, opacity: 0.75, marginTop: 2, lineHeight: 1.4 }}>Your dealbreakers shape your pods. Unlimited circuits, early signals enabled.</div>
                  </div>
                </div>
                <div className="mono caps" style={{ fontSize: 8, letterSpacing:'0.14em', padding:'4px 10px', background:'#FFFFFF', color:'#800120', borderRadius: 99, flexShrink: 0, fontWeight: 700 }}>Active</div>
              </div>
            ) : (
              <div style={{ marginTop: 24, padding:'14px 18px', background:'var(--paper-2)', borderRadius: 2, border:'1px solid var(--line-strong)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <span style={{ fontSize: 16, color:'var(--ink-3)' }}>{'\u2661'}</span>
                  <div>
                    <div className="serif" style={{ fontSize: 16, lineHeight: 1.2, color:'var(--ink)' }}>You're on the free plan</div>
                    <div className="mono" style={{ fontSize: 9, color:'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>Random pods, 2 circuits a day, no early signals.</div>
                  </div>
                </div>
                <button
                  onClick={() => window.__setView && window.__setView('premium')}
                  style={{ padding:'6px 14px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 2, border:'none', cursor:'pointer', fontWeight: 700, flexShrink: 0 }}
                >Upgrade</button>
              </div>
            )
          )}

          {/* Lock disclaimer + enter lobby */}
          {!compact && (
          <div style={{ marginTop: 14, padding:'22px 24px', border:'1px solid var(--ink)', borderRadius: 2, background:'var(--cream)' }}>
            <div style={{ display:'flex', gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setRulesOpen(true)}
                style={{
                  flex: 1, padding:'14px 18px',
                  background:'var(--ink)', color:'var(--cream)',
                  border:'1px solid var(--ink)',
                  borderRadius: 2,
                  fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.14em', textTransform:'uppercase',
                  cursor:'pointer',
                  display:'flex', justifyContent:'space-between', alignItems:'center'
                }}>
                <span>Enter lobby</span>
                <span style={{ fontFamily:'Lato, sans-serif', fontSize: 20, fontStyle:'italic' }}>{'\u2192'}</span>
              </button>
              <button
                onClick={() => window.__setView && window.__setView('dashboard')}
                style={{
                  padding:'14px 18px',
                  border:'1px solid var(--line-strong)',
                  borderRadius: 2,
                  fontFamily:'Lato, sans-serif', fontSize: 11, letterSpacing:'0.14em', textTransform:'uppercase',
                  color:'var(--ink-2)', cursor:'pointer'
                }}>
                View Dashboard
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Compact-mode footer */}

      {/* Past matches — full width, two columns */}
      {!compact && (
      <div style={{ marginTop: 44, paddingTop: 28, borderTop:'1px solid var(--line-strong)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <div>
            <div className="caps mono" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
            <div className="serif" style={{ fontSize: 40, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
              All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
          {[
            { name:'Mateo',  age:31, seed:2, pod:'Pod Ardor',   occ:'Sound designer',     city:'Oakland',  date:'Apr 2026' },
            { name:'Ilse',   age:27, seed:5, pod:'Pod Kismet',  occ:'Literary translator', city:'Portland', date:'Mar 2026' },
            { name:'Harper', age:29, seed:7, pod:'Pod Tryst',   occ:'Arborist',            city:'Denver',   date:'Mar 2026' },
            { name:'Theo',   age:32, seed:4, pod:'Pod Beloved', occ:'Bassoonist',          city:'Brooklyn', date:'Feb 2026' },
          ].map(m => (
            <div key={m.name} style={{ border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', padding: 12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'54px 1fr', gap: 10 }}>
                <div style={{ width: 54, height: 68, overflow:'hidden', borderRadius: 99, border:'1px solid var(--line-strong)' }}>
                  <Silhouette seed={m.seed}/>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="serif" style={{ fontSize: 16, lineHeight: 1 }}>{m.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 13 }}>, {m.age}</span></div>
                  <div className="mono" style={{ fontSize: 9, color:'var(--ink-3)', marginTop: 3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.occ} {'\u00b7'} {m.city}</div>
                  <div className="mono caps" style={{ fontSize: 8, color:'var(--rust)', letterSpacing:'0.14em', marginTop: 4 }}>{m.pod}</div>
                  <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{'\u2665'} {m.date}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
                <button onClick={() => setMatchProfile(m)} style={{
                  flex: 1, padding:'7px 10px', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase',
                  border:'1px solid var(--line-strong)', borderRadius: 2, color:'var(--ink-2)', background:'transparent'
                }}>View {m.name}'s profile</button>
                <button onClick={() => setChatOpen(m)} style={{
                  padding:'7px 14px', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase',
                  background:'var(--ink)', color:'var(--cream)', borderRadius: 2, border:'none', cursor:'pointer'
                }}>Chat</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      {matchProfile && <FullProfilePopup p={matchProfile} onClose={() => setMatchProfile(null)}/>}
      {chatOpen && (
        <div onClick={() => setChatOpen(null)} style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 2,
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

      {/* Modal: About me — read-only, styled like the editor */}
      {modal === 'about' && (
        <div onClick={() => setModal(null)} style={{ position:'fixed', inset: 0, background:'#0A0A0AA8', zIndex: 50, display:'flex', alignItems:'center', justifyContent:'center', padding: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 2, width:'min(860px, 100%)', height:'min(92vh, 900px)', display:'flex', flexDirection:'column', padding:'28px 32px', boxShadow:'0 18px 60px #0A0A0A40' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: 12, marginBottom: 18, flexShrink: 0 }}>
              <div>
                <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>About me</div>
                <div className="serif" style={{ fontSize: 28, letterSpacing:'-0.02em', marginTop: 4 }}>Your answers, <span style={{ fontStyle:'italic' }}>at a glance.</span></div>
              </div>
              <button onClick={() => setModal(null)} className="mono caps" style={{ fontSize: 10, letterSpacing:'0.14em', padding:'6px 10px', border:'1px solid var(--line-strong)', background:'var(--paper-2)', cursor:'pointer', borderRadius: 2 }}>Close ✕</button>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY:'auto', paddingRight: 4 }}>
              {/* Location row — top */}
              <div style={{ display:'flex', alignItems:'baseline', gap: 10, margin:'4px 0 6px' }}>
                <span className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>Location</span>
              </div>
              <div style={{ padding:'14px 16px', background:'var(--cream)', border:'1px solid var(--line-strong)', borderRadius: 2, marginBottom: 18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span className="serif" style={{ fontSize: 18 }}>{location}</span>
                  <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>within {radius} mi</span>
                </div>
                <div className="serif" style={{ fontSize: 15, fontStyle:'italic', color:'var(--ink-2)', marginTop: 8, lineHeight: 1.4, paddingTop: 8, borderTop:'1px dotted var(--line-strong)' }}>
                  "{bio}"
                </div>
              </div>

              {/* Preferences read-only */}
              
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 2, border:'1px solid var(--line-strong)', borderRadius: 2, overflow:'hidden' }}>
                {DEALBREAKERS.filter(d => ['smoking','drinking','kids','religion','politics','family','diet'].includes(d.key)).map((d) => (
                  <ReadOnlyRow key={d.key} d={d} value={values[d.key]} hard={!!hards[d.key]}/>
                ))}
              </div>

              
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 2, border:'1px solid var(--line-strong)', borderRadius: 2, overflow:'hidden' }}>
                {DEALBREAKERS.filter(d => ['zodiac','pets','workout','education','love_style','travel','sleep','conflict'].includes(d.key)).map((d) => (
                  <ReadOnlyRow key={d.key} d={d} value={values[d.key]} hard={!!hards[d.key]}/>
                ))}
              </div>

              <div className="mono" style={{ fontSize: 10, color:'var(--ink-3)', marginTop: 16, fontStyle:'italic', lineHeight: 1.5 }}>
                ♥ = hard dealbreaker (never ignored, even under fuzzy match).
              </div>

              {/* Contact at bottom */}
              <div style={{ display:'flex', alignItems:'baseline', gap: 10, margin:'22px 0 6px' }}>
                <span className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>Contact</span>
                <span className="mono" style={{ fontSize: 9, color:'var(--ink-3)', fontStyle:'italic' }}>— released only on mutual match</span>
              </div>
              <div style={{ padding:'14px 16px', background:'var(--cream)', border:'1px solid var(--line-strong)', borderRadius: 2, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em', marginBottom: 4 }}>Instagram</div>
                  <div className="serif" style={{ fontSize: 17, fontStyle:'italic' }}>{handle.ig}</div>
                </div>
                <div>
                  <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em', marginBottom: 4 }}>Phone</div>
                  <div className="serif" style={{ fontSize: 17, fontStyle:'italic' }}>{handle.phone}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal: Preferences & Interests editor */}
      {modal === 'variables' && (
        <div onClick={() => setModal(null)} style={{ position:'fixed', inset: 0, background:'#0A0A0AA8', zIndex: 50, display:'flex', alignItems:'center', justifyContent:'center', padding: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 2, width:'min(860px, 100%)', height:'min(92vh, 900px)', display:'flex', flexDirection:'column', padding:'28px 32px', boxShadow:'0 18px 60px #0A0A0A40' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: 12, marginBottom: 18, flexShrink: 0 }}>
              <div>
                <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>Preferences &amp; Interests</div>
                <div className="serif" style={{ fontSize: 28, letterSpacing:'-0.02em', marginTop: 4 }}>Who are you interested in?</div>
              </div>
              <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
                <span className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.14em' }}>Select {hardCount} / {MAX_HARD} deal breakers</span>
                <button onClick={() => setModal(null)} className="mono caps" style={{ fontSize: 10, letterSpacing:'0.14em', padding:'6px 14px', background:'var(--ink)', color:'var(--cream)', cursor:'pointer', borderRadius: 2, border:'none' }}>Done</button>
              </div>
            </div>
            <div style={{ padding:'10px 14px', background:'#800120', color:'#FFFFFF', borderRadius: 2, display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10, marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 10, lineHeight: 1.4 }}>On Premium you are placed in pods based on your dealbreakers.</div>
              <div style={{ display:'flex', gap: 6, flexShrink: 0 }}>
                <button style={{ padding:'5px 12px', background:'#FFFFFF', color:'#800120', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius: 2, border:'none', cursor:'pointer', fontWeight: 700 }}>Upgrade</button>
                <button style={{ padding:'5px 12px', background:'transparent', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius: 2, border:'1px solid #FFFFFF60', cursor:'pointer' }}>Learn more</button>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY:'auto', paddingRight: 4 }}>
              {/* Interested in */}
              <div style={{ marginBottom: 18 }}>
                <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)', marginBottom: 8 }}>Interested in</div>
                <div style={{ display:'flex', gap: 6 }}>
                  {['Women', 'Men', 'Everyone'].map(s => {
                    const on = values.interested === s;
                    return (<button key={s} onClick={() => set('interested', on ? '' : s)} style={{
                      padding:'8px 16px', fontSize: 13, fontFamily:'Lato, sans-serif',
                      background: on ? 'var(--ink)' : 'var(--cream)',
                      color: on ? 'var(--cream)' : 'var(--ink)',
                      border: `1px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`,
                      borderRadius: 2, cursor:'pointer', fontStyle: on ? 'italic' : 'normal',
                      display:'inline-flex', alignItems:'center', gap: 5
                    }}>{on && <span>{'\u2665'}</span>}{s}</button>);
                  })}
                </div>
              </div>

              {/* Location + radius editor */}
              <div style={{ display:'flex', alignItems:'baseline', gap: 10, margin:'4px 0 6px' }}>
                <span className="mono caps" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--rust)' }}>Location</span>
              </div>
              <div style={{ padding:'14px 16px', background:'var(--cream)', border:'1px solid var(--line-strong)', borderRadius: 2, marginBottom: 18, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em', marginBottom: 6 }}>City</div>
                  <input value={location} onChange={e => setLocation(e.target.value)}
                    className="serif"
                    style={{ width:'100%', fontSize: 18, padding:'6px 10px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--paper-2)' }}/>
                </div>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
                    <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Radius</span>
                    <span className="mono" style={{ fontSize: 11, color:'var(--rust)' }}>{radius} mi</span>
                  </div>
                  <input type="range" min="5" max="200" step="5" value={radius}
                    onChange={e => setRadius(parseInt(e.target.value))}
                    style={{ width:'100%', accentColor:'#6B1520' }}/>
                </div>
              </div>

              
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 2, border:'1px solid var(--line-strong)', borderRadius: 2, overflow:'hidden' }}>
                {DEALBREAKERS.filter(d => ['smoking','drinking','kids','religion','politics','family','diet'].includes(d.key)).map((d) => (
                  <DealbreakerRow key={d.key} d={d} value={values[d.key]} onChange={v => set(d.key, v)}
                    hard={!!hards[d.key]} onToggleHard={() => toggleHard(d.key)}
                    lockedOut={!hards[d.key] && hardCount >= MAX_HARD}/>
                ))}
              </div>

              
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 2, border:'1px solid var(--line-strong)', borderRadius: 2, overflow:'hidden' }}>
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
            borderRadius: 99, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center',
            cursor: lockedOut ? 'not-allowed' : 'pointer',
            opacity: lockedOut ? 0.4 : 1
          }} title={hard ? 'Hard dealbreaker — click to remove' : lockedOut ? '3 hard dealbreakers max' : 'Mark as hard dealbreaker'}>♥</button>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
        {d.options.map(opt => {
          const active = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding:'4px 10px', fontFamily:'Lato, sans-serif', fontSize: 11,
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--paper)' : 'var(--ink-2)',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line-strong)'}`,
              borderRadius: 2
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
          <span className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.14em' }}>♥ hard</span>
        )}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
        {d.options.map(opt => {
          const active = value === opt;
          return (
            <span key={opt} style={{
              padding:'4px 10px', fontFamily:'Lato, sans-serif', fontSize: 11,
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--paper)' : 'var(--ink-3)',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
              borderRadius: 2,
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
          <div style={{ width: 36, height: 36, borderRadius: 2, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
            <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={person.seed}/></div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 20, lineHeight: 1 }}>{person.name}</div>
            <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>Pod {person.pod}</div>
          </div>
        </div>
        <button onClick={onClose} className="mono caps" style={{ fontSize: 10, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
      </div>
      <div ref={containerRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
        {msgs.map((msg, i) => {
          if (msg.system) return (
            <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
              <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.14em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 2 }}>
                {msg.text}
              </div>
            </div>
          );
          return (
            <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth:'75%', padding:'10px 14px',
                background: msg.me ? '#0A0A0A' : 'var(--paper-2)',
                color: msg.me ? '#FFFFFF' : 'var(--ink)',
                borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                border: msg.me ? 'none' : '1px solid var(--line-strong)'
              }}>
                <div className="serif" style={{ fontSize: 14, lineHeight: 1.45 }}>{msg.text}</div>
                <div className="mono" style={{ fontSize: 9, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder={`Message ${person.name}...`}
          style={{ flex: 1, padding:'10px 14px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
        <button onClick={send} style={{ padding:'10px 18px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2, flexShrink: 0 }}>Send</button>
      </div>
    </>
  );
}

window.BioView = BioView;
