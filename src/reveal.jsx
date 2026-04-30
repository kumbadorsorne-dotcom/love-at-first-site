// Reveal — three choreographies.

// 8 people from the pod — shape aligns with refresh roster.
const REVEAL_NAMES = [
  { name:'you',     age:29, city:'Brooklyn', occ:'—' },
  { name:'June',    age:29, city:'Brooklyn', occ:'Archivist' },
  { name:'Mateo',   age:31, city:'Oakland',  occ:'Sound designer' },
  { name:'Mateo',   age:28, city:'Chicago',  occ:'Pastry chef' },
  { name:'Wren',    age:33, city:'Austin',   occ:'Set builder' },
  { name:'Desmond', age:30, city:'Atlanta',  occ:'Civil engineer' },
  { name:'Ilse',    age:27, city:'Portland', occ:'Translator' },
  { name:'Tomás',   age:32, city:'Boston',   occ:'Oncologist' },
  { name:'Harper',  age:29, city:'Denver',   occ:'Arborist' },
];

function RevealView({ tweaks }) {
  const [notes] = useNotes();
  const people = REVEAL_NAMES.slice(1, 9).map((p, i) => ({
    ...p,
    seed: i+2,
    callIdx: i+1,
    theyYes: [true, false, true, false, false, true, false, false][i],
    youYes:  [true, true, true, false, false, true, true, false][i],
    note: notes[i+1] || '',
  }));
  const choreo = tweaks.revealChoreo;
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (choreo !== 'onebyone') return;
    const id = setInterval(() => setStep(s => Math.min(s+1, 8)), 1400);
    return () => clearInterval(id);
  }, [choreo]);

  const mutuals = people.filter(p => p.theyYes && p.youYes);
  const nonMutuals = people.filter(p => !(p.theyYes && p.youYes));
  const sorted = [...mutuals, ...nonMutuals];
  const scrollRef = React.useRef(null);

  const scrollBy = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight:'100vh', padding:'14px 36px 20px', display:'flex', flexDirection:'column' }}>
      {/* Top strip */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink: 0 }}>
        <div style={{ display:'flex', gap: 14, alignItems:'baseline' }}>
          <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.02em' }}>
            <span style={{ fontStyle:'italic' }}>Love</span> at First Site
          </div>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>Reveal</span>
        </div>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--cream)', background:'var(--rust)', padding:'4px 10px', letterSpacing:'0.16em', borderRadius: 10, fontWeight: 600 }}>6 / 6 {'\u00b7'} Reveal</span>
          <div style={{ display:'flex', gap: 6 }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ width: 22, height: 4, borderRadius: 10, background:'#800120' }}/>
            ))}
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 10px', background:'var(--ink)', color:'var(--cream)', borderRadius: 10, fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)', animation:'pulse 1.2s infinite' }}/>
            Complete
          </span>
        </div>
      </div>

      {/* Headline row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop: 8, flexShrink: 0 }}>
        <div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.03em', marginTop: 4 }}>
            {mutuals.length === 0 ? <>No one <span style={{ fontStyle:'italic' }}>chose you back</span>.</>
              : mutuals.length === 1 ? <>One <span style={{ fontStyle:'italic', color:'var(--rust)' }}>mutual</span>.</>
              : <><span style={{ fontStyle:'italic', color:'var(--rust)' }}>{mutuals.length}</span> mutuals. Go write to them.</>}
          </div>
          <div className="serif" style={{ fontSize: 14, fontStyle:'italic', color:'var(--ink-2)', marginTop: 4 }}>
            Numbers and handles release only to people who picked you, too.
          </div>
        </div>
      </div>

      {/* Carousel nav */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 8, marginBottom: 6, flexShrink: 0 }}>
        <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>
          {'\u2665'} {mutuals.length} matches shown first {'\u00b7'} scroll for all {people.length}
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <button onClick={() => scrollBy(-1)} style={{ width: 32, height: 32, border:'none', borderRadius: 99, background:'#800120', fontFamily:'Lato, sans-serif', fontSize: 14, color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{'\u2190'}</button>
          <button onClick={() => scrollBy(1)} style={{ width: 32, height: 32, border:'none', borderRadius: 99, background:'#800120', fontFamily:'Lato, sans-serif', fontSize: 14, color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{'\u2192'}</button>
        </div>
      </div>

      {/* Scrolling carousel */}
      <div ref={scrollRef} className="reveal-carousel" style={{ display:'flex', gap: 12, overflow:'visible', paddingBottom: 6 }}>
        {sorted.map((p, i) => (
          <div key={p.name} style={{ flex:'0 0 calc((100% - 48px) / 4.5)' }}>
            <RevealCard p={p}/>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 14, textAlign:'center', flexShrink: 0 }}>
        <button onClick={() => { window.__scrollToInbox = true; window.__setView && window.__setView('dashboard'); }} style={{
          padding:'16px 36px', background:'#0A0A0A', color:'#FFFFFF',
          fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.16em', textTransform:'uppercase',
          borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700,
          display:'inline-flex', alignItems:'center', gap: 10,
          transition:'all .2s ease'
        }}
        onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
        >
          <span>Chat with New Matches</span>
          <span style={{ fontFamily:'Lato, sans-serif', fontSize: 24, fontStyle:'italic' }}>{'\u2192'}</span>
        </button>
      </div>

      <LogoutButton/>
    </div>
  );
}

function AllMatchesReveal() {
  const [profilePerson, setProfilePerson] = React.useState(null);
  const [chatPerson, setChatPerson] = React.useState(null);
  const [chatMsgs, setChatMsgs] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const chatRef = React.useRef(null);
  React.useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatMsgs.length]);
  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => [...prev, { from:'You', me: true, text: chatInput.trim(), time:'just now' }]);
    setChatInput('');
  };
  const matches = [
    { name:'Mateo',   age:31, seed:2, pod:'Pod Ardor',    occ:'Sound designer',      city:'Oakland',   date:'Apr 2026' },
    { name:'Ilse',    age:27, seed:5, pod:'Pod Kismet',   occ:'Literary translator',  city:'Portland',  date:'Mar 2026' },
    { name:'Harper',  age:29, seed:7, pod:'Pod Tryst',    occ:'Arborist',             city:'Denver',    date:'Mar 2026' },
    { name:'Theo',    age:32, seed:4, pod:'Pod Beloved',  occ:'Bassoonist',           city:'Brooklyn',  date:'Feb 2026' },
    { name:'June',    age:29, seed:3, pod:'Pod Covenant', occ:'Archivist',            city:'Brooklyn',  date:'Apr 2026' },
    { name:'Desmond', age:30, seed:9, pod:'Pod Covenant', occ:'Civil engineer',       city:'Atlanta',   date:'Apr 2026' },
  ];
  return (
    <>
    <div style={{ marginTop: 10, paddingTop: 8, borderTop:'1px dotted var(--line-strong)', flexShrink: 0 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
        <div>
          <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
            All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 10 }}>
        {matches.map(m => (
          <div key={m.name} style={{ border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', padding: 10 }}>
            <div style={{ display:'grid', gridTemplateColumns:'48px 1fr', gap: 8 }}>
              <div style={{ width: 48, height: 48, overflow:'hidden', borderRadius: 99, border:'1px solid var(--line-strong)' }}>
                <Silhouette seed={m.seed}/>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 14, lineHeight: 1 }}>{m.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 12 }}>, {m.age}</span></div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>{m.occ} {'\u00b7'} {m.city}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginTop: 2 }}>{m.pod}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 1 }}>{'\u2665'} {m.date}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
              <button onClick={() => setProfilePerson(m)} style={{
                flex: 1, padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                border:'1px solid var(--line-strong)', borderRadius: 10, color:'var(--ink-2)', background:'transparent', cursor:'pointer'
              }}>View full profile</button>
              <button onClick={() => { setChatPerson(m); setChatMsgs([{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]); }} style={{
                padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 10, border:'none', cursor:'pointer'
              }}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {profilePerson && <FullProfilePopup p={profilePerson} onClose={() => setProfilePerson(null)}/>}
    </>
  );
}

function PreviousMatchesStrip() {
  const [profilePerson, setProfilePerson] = React.useState(null);
  const [chatPerson, setChatPerson] = React.useState(null);
  const [chatMsgs, setChatMsgs] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const chatRef2 = React.useRef(null);
  React.useEffect(() => { if (chatRef2.current) chatRef2.current.scrollTop = chatRef2.current.scrollHeight; }, [chatMsgs.length]);
  const sendChat = () => { if (!chatInput.trim()) return; setChatMsgs(prev => [...prev, { from:'You', me: true, text: chatInput.trim(), time:'just now' }]); setChatInput(''); };
  const prior = [
    { id: 1, name:'Mateo',  age:31, seed:2, pod:'Pod Ardor',   occ:'Sound designer',     city:'Oakland',  date:'Apr 2026' },
    { id: 2, name:'Ilse',   age:27, seed:5, pod:'Pod Kismet',  occ:'Literary translator', city:'Portland', date:'Mar 2026' },
    { id: 3, name:'Harper', age:29, seed:7, pod:'Pod Tryst',   occ:'Arborist',            city:'Denver',   date:'Mar 2026' },
    { id: 4, name:'Theo',   age:32, seed:4, pod:'Pod Beloved', occ:'Bassoonist',          city:'Brooklyn', date:'Feb 2026' },
  ];
  return (
    <>
    <div style={{ marginTop: 24, paddingTop: 20, borderTop:'1px solid var(--line-strong)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
        <div>
          <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
            All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
        {prior.map(m => (
          <div key={m.id} style={{ border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', padding: 12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'54px 1fr', gap: 10 }}>
              <div style={{ width: 54, height: 54, overflow:'hidden', borderRadius: 99, border:'1px solid var(--line-strong)' }}>
                <Silhouette seed={m.seed}/>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 18, lineHeight: 1 }}>{m.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 12 }}>, {m.age}</span></div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.occ} {'\u00b7'} {m.city}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginTop: 4 }}>{m.pod}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{'\u2665'} {m.date}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
              <button onClick={() => setProfilePerson(m)} style={{
                flex: 1, padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                border:'1px solid var(--line-strong)', borderRadius: 10, color:'var(--ink-2)', background:'transparent'
              }}>View {m.name}'s profile</button>
              <button onClick={() => { setChatPerson(m); setChatMsgs([{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]); }} style={{
                padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 10, border:'none', cursor:'pointer'
              }}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {profilePerson && <FullProfilePopup p={profilePerson} onClose={() => setProfilePerson(null)}/>}
    {chatPerson && (
      <div onClick={() => setChatPerson(null)} style={{
        position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 10,
          display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80'
        }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
            <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
                <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={chatPerson.seed}/></div>
              </div>
              <div>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{chatPerson.name}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{chatPerson.pod}</div>
              </div>
            </div>
            <button onClick={() => setChatPerson(null)} className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
            {chatMsgs.map((msg, i) => {
              if (msg.system) return (
                <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
                  <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 10 }}>{msg.text}</div>
                </div>
              );
              return (
                <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth:'75%', padding:'12px 20px', background: msg.me ? '#0A0A0A' : 'var(--paper-2)', color: msg.me ? '#FFFFFF' : 'var(--ink)', borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px', border: msg.me ? 'none' : '1px solid var(--line-strong)' }}>
                    <div className="serif" style={{ fontSize: 14, lineHeight: 1.35 }}>{msg.text}</div>
                    <div className="mono" style={{ fontSize: 12, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
              placeholder={`Message ${chatPerson.name}...`}
              style={{ flex: 1, padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
            <button onClick={sendChat} style={{ padding:'12px 20px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, flexShrink: 0 }}>Send</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function RevealAllMatches() {
  const [profilePerson, setProfilePerson] = React.useState(null);
  const [chatPerson, setChatPerson] = React.useState(null);
  const [chatMsgs, setChatMsgs] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const chatRef = React.useRef(null);
  React.useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatMsgs.length]);
  const sendChat = () => { if (!chatInput.trim()) return; setChatMsgs(prev => [...prev, { from:'You', me: true, text: chatInput.trim(), time:'just now' }]); setChatInput(''); };

  const matches = [
    { name:'Mateo',  age:31, seed:2, pod:'Pod Ardor',   occ:'Sound designer',     city:'Oakland',  date:'Apr 2026' },
    { name:'Ilse',   age:27, seed:5, pod:'Pod Kismet',  occ:'Literary translator', city:'Portland', date:'Mar 2026' },
    { name:'Harper', age:29, seed:7, pod:'Pod Tryst',   occ:'Arborist',            city:'Denver',   date:'Mar 2026' },
    { name:'Theo',   age:32, seed:4, pod:'Pod Beloved', occ:'Bassoonist',          city:'Brooklyn', date:'Feb 2026' },
  ];
  return (
    <>
    <div style={{ marginTop: 44, paddingTop: 28, borderTop:'1px solid var(--line-strong)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
        <div>
          <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
            All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
        {matches.map(m => (
          <div key={m.name} style={{ border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', padding: 12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'54px 1fr', gap: 10 }}>
              <div style={{ width: 54, height: 54, overflow:'hidden', borderRadius: 99, border:'1px solid var(--line-strong)' }}>
                <Silhouette seed={m.seed}/>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 18, lineHeight: 1 }}>{m.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 12 }}>, {m.age}</span></div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.occ} {'\u00b7'} {m.city}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginTop: 4 }}>{m.pod}</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{'\u2665'} {m.date}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
              <button onClick={() => setProfilePerson(m)} style={{
                flex: 1, padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                border:'1px solid var(--line-strong)', borderRadius: 10, color:'var(--ink-2)', background:'transparent', cursor:'pointer'
              }}>View {m.name}'s profile</button>
              <button onClick={() => { setChatPerson(m); setChatMsgs([{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]); }} style={{
                padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 10, border:'none', cursor:'pointer'
              }}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {profilePerson && <FullProfilePopup p={profilePerson} onClose={() => setProfilePerson(null)}/>}
    {chatPerson && (
      <div onClick={() => setChatPerson(null)} style={{ position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both' }}>
        <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 10, display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
            <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}><div style={{ position:'absolute', inset: -5 }}><Silhouette seed={chatPerson.seed}/></div></div>
              <div><div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{chatPerson.name}</div><div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{chatPerson.pod}</div></div>
            </div>
            <button onClick={() => setChatPerson(null)} className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
            {chatMsgs.map((msg, i) => msg.system ? (
              <div key={i} style={{ textAlign:'center', padding:'8px 0' }}><div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 10 }}>{msg.text}</div></div>
            ) : (
              <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth:'75%', padding:'12px 20px', background: msg.me ? '#0A0A0A' : 'var(--paper-2)', color: msg.me ? '#FFFFFF' : 'var(--ink)', borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px', border: msg.me ? 'none' : '1px solid var(--line-strong)' }}>
                  <div className="serif" style={{ fontSize: 14, lineHeight: 1.35 }}>{msg.text}</div>
                  <div className="mono" style={{ fontSize: 12, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat(); }} placeholder={`Message ${chatPerson.name}...`} style={{ flex: 1, padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
            <button onClick={sendChat} style={{ padding:'12px 20px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, flexShrink: 0 }}>Send</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function RevealCard({ p, big = false }) {
  const mutual = p.youYes && p.theyYes;
  const [contactOpen, setContactOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatMsgs, setChatMsgs] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const chatContRef = React.useRef(null);
  React.useEffect(() => { if (chatContRef.current) chatContRef.current.scrollTop = chatContRef.current.scrollHeight; }, [chatMsgs.length]);
  const sendMsg = () => { if (!chatInput.trim()) return; setChatMsgs(prev => [...prev, { from:'You', me: true, text: chatInput.trim(), time:'just now' }]); setChatInput(''); };
  const [profileOpen, setProfileOpen] = React.useState(false);
  const cardRef = React.useRef(null);
  React.useEffect(() => {
    if (!mutual || !cardRef.current) return;
    const el = cardRef.current;
    const spawn = () => {
      const heart = document.createElement('span');
      heart.textContent = '\u2665';
      const left = Math.random() * 100;
      const size = 8 + Math.random() * 10;
      const dur = 2.5 + Math.random() * 2;
      const delay = Math.random() * 0.3;
      Object.assign(heart.style, {
        position:'absolute', bottom:'0', left: left + '%',
        fontSize: size + 'px', color:'#800120',
        opacity:'0', pointerEvents:'none', zIndex:'0',
        animation: 'heartFloat ' + dur + 's ' + delay + 's ease-out forwards'
      });
      el.appendChild(heart);
      setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, (dur + delay) * 1000 + 200);
    };
    const id = setInterval(spawn, 1200);
    return () => clearInterval(id);
  }, [mutual]);
  return (
    <div ref={cardRef} style={{
      position:'relative',
      opacity: mutual ? 1 : 0.5,
      filter: mutual ? 'none' : 'grayscale(0.8)',
      transition: 'opacity .4s, filter .4s, transform .4s',
      background: mutual ? 'var(--ink)' : 'transparent',
      borderRadius: 10,
      padding: mutual ? '12px 18px' : 0,
      boxShadow: mutual ? '0 8px 24px -8px #6B152040' : 'none',
      animation: mutual ? 'matchPop 0.6s ease both, matchGlow 3s ease infinite 0.6s' : 'none',
      overflow:'hidden'
    }}>
      {/* Portrait */}
      <div style={{ position:'relative', aspectRatio:'1/1', borderRadius: 10, overflow:'hidden', border: mutual ? '2px solid var(--rust)' : '1px solid var(--line-strong)', background:'var(--paper-2)' }}>
        <Silhouette seed={p.seed}/>
        {mutual && (
          <div className="mono caps" style={{
            position:'absolute', top: 8, left: 8, padding:'4px 10px',
            background:'var(--rust)', color:'var(--cream)',
            fontSize: 12, letterSpacing:'0.12em', fontWeight: 700,
            borderRadius: 99, animation:'matchBadgePulse 2s ease infinite'
          }}>
            New Match!
          </div>
        )}
      </div>

      {/* Info below portrait */}
      <div style={{ marginTop: 12, display:'flex', flexDirection:'column', height: 170 }}>
        <div style={{ marginBottom: 4 }}>
          <div className="serif" style={{ fontSize: 18, lineHeight: 1, color: mutual ? '#FFFFFF' : 'var(--ink)' }}>{p.name}, <span style={{ fontStyle:'italic' }}>{p.age}</span></div>
          <div className="mono" style={{ fontSize: 12, marginTop: 2, color: mutual ? '#FFFFFF90' : 'var(--ink-3)' }}>{p.occ}</div>
        </div>

        {/* Note — scrollable if long */}
        <div style={{ marginTop: 6, flex: 1, minHeight: 0, overflowY:'auto' }}>
          {p.note && p.note.trim() ? (
            <div style={{ padding:'6px 12px', background: mutual ? '#FFFFFF15' : 'var(--paper-2)', borderLeft:'2px solid var(--rust)', borderRadius: 10 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginBottom: 2 }}>Your note</div>
              <div className="serif" style={{ fontSize: 12, fontStyle:'italic', color: mutual ? '#FFFFFFD0' : 'var(--ink)', lineHeight: 1.3 }}>
                "{p.note}"
              </div>
            </div>
          ) : (
            <div className="mono" style={{ fontSize: 12, color: mutual ? '#FFFFFF60' : 'var(--ink-3)', letterSpacing:'0.12em', textTransform:'uppercase', fontStyle:'italic' }}>
              No note written.
            </div>
          )}
        </div>

        {/* Match status + action — pinned to bottom */}
        <div style={{ display:'flex', gap: 6, paddingTop: 6, paddingBottom: 10, flexShrink: 0 }}>
          {mutual ? (
            <button onClick={() => setContactOpen(true)} style={{
              flex: 1, padding:'6px 12px', background:'var(--rust)', color:'var(--cream)',
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
              borderRadius: 10, border:'none', cursor:'pointer'
            }}>Contact</button>
          ) : (
            <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', padding:'6px 0' }}>
              Not a match
            </span>
          )}
        </div>
      </div>

      {/* Overlay: contact dropdown takes over the card */}
      {mutual && contactOpen && (
        <div style={{
          position:'absolute', inset: 0, background:'var(--cream)', zIndex: 10,
          display:'flex', flexDirection:'column', padding:'16px 18px',
          animation:'fadeIn .18s ease'
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: 10, marginBottom: 12 }}>
            <div>
              <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.16em' }}>♥ Connect now</div>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, marginTop: 3 }}>{p.name}</div>
            </div>
            <button onClick={() => setContactOpen(false)} className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>Close ×</button>
          </div>
          {/* Contact */}
          <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginBottom: 6 }}>Contact</div>
          <OverlayContactList p={p}/>

          {/* View full profile */}
          <button onClick={() => setProfileOpen(true)}
            style={{
              marginTop: 10, width:'100%', padding:'12px 20px',
              border:'1px solid var(--line-strong)', color:'var(--ink-2)',
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.16em', textTransform:'uppercase',
              borderRadius: 10, background:'transparent', display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
            <span>View full profile</span>
            <span style={{ fontFamily:'Lato, sans-serif', fontSize: 14, fontStyle:'italic' }}>{'\u2192'}</span>
          </button>
          <button className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 8, textDecoration:'underline', background:'transparent', border:'none', cursor:'pointer', display:'block', width:'100%', textAlign:'center' }}>Report Misconduct</button>
        </div>
      )}
      {profileOpen && <FullProfilePopup p={p} onClose={() => setProfileOpen(false)}/>}
      {chatOpen && (
        <div onClick={() => setChatOpen(false)} style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 10,
            display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80'
          }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
              <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
                  <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={p.seed}/></div>
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{p.name}</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
            </div>
            <div ref={chatContRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
              {chatMsgs.map((msg, i) => {
                if (msg.system) return (
                  <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
                    <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 10 }}>{msg.text}</div>
                  </div>
                );
                return (
                  <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth:'75%', padding:'12px 20px', background: msg.me ? '#0A0A0A' : 'var(--paper-2)', color: msg.me ? '#FFFFFF' : 'var(--ink)', borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px', border: msg.me ? 'none' : '1px solid var(--line-strong)' }}>
                      <div className="serif" style={{ fontSize: 14, lineHeight: 1.35 }}>{msg.text}</div>
                      <div className="mono" style={{ fontSize: 12, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
                placeholder={`Message ${p.name}...`}
                style={{ flex: 1, padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
              <button onClick={sendMsg} style={{ padding:'12px 20px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, flexShrink: 0 }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverlayContactList({ p }) {
  const allChannels = React.useMemo(() => {
    const slug = p.name.toLowerCase();
    const city = (p.city || '').replace(/\s|,/g,'').toLowerCase();
    const base = [
      { key:'instagram', label:'Instagram', icon:'IG', handle: '@' + slug + '.' + city },
      { key:'phone',     label:'Phone',     icon:'TEL', handle: '+1 (415) 555-0' + String(100 + p.seed*13 % 900).padStart(3,'0') },
      { key:'tiktok',    label:'TikTok',    icon:'TT', handle: '@' + slug + 'irl' },
      { key:'spotify',   label:'Spotify',   icon:'SP', handle: slug + '.onwave' },
      { key:'email',     label:'Email',     icon:'EM', handle: slug + '@' + city + '.co' },
    ];
    const picks = [[0,1,2],[0,1],[0,2,3],[1,4],[0,1,4],[2,3],[0,1,3],[1,2,4]];
    const set = picks[p.seed % picks.length];
    return set.map(i => base[i]);
  }, [p]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      {allChannels.map(c => (
        <button key={c.key} onClick={(e) => { navigator.clipboard.writeText(c.handle); const el = e.currentTarget.querySelector('[data-copied]'); el.style.display='block'; setTimeout(() => el.style.display='none', 1500); }} style={{
          display:'grid', gridTemplateColumns:'36px 1fr auto', alignItems:'center', gap: 8,
          padding:'12px 20px', background:'var(--paper-2)', border:'1px solid var(--line-strong)', borderRadius: 10, textAlign:'left', cursor:'pointer', position:'relative'
        }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em' }}>{c.icon}</span>
          <span className="mono" style={{ fontSize: 12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.handle}</span>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>{c.label}</span>
          <span data-copied style={{ display:'none', position:'absolute', top: -28, right: 0, padding:'4px 10px', background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, borderRadius: 10 }}>Copied!</span>
        </button>
      ))}
    </div>
  );
}

function ContactDropdown({ p }) {
  // Each person provides a subset of channels. Deterministic by seed so it's stable.
  const allChannels = React.useMemo(() => {
    const slug = p.name.toLowerCase();
    const city = (p.city || '').replace(/\s|,/g,'').toLowerCase();
    const base = [
      { key:'instagram', label:'Instagram', icon:'IG', handle: '@' + slug + '.' + city },
      { key:'phone',     label:'Phone',     icon:'TEL', handle: '+1 (415) 555-0' + String(100 + p.seed*13 % 900).padStart(3,'0') },
      { key:'tiktok',    label:'TikTok',    icon:'TT', handle: '@' + slug + 'irl' },
      { key:'spotify',   label:'Spotify',   icon:'SP', handle: slug + '.onwave' },
      { key:'email',     label:'Email',     icon:'EM', handle: slug + '@' + city + '.co' },
    ];
    // Pick 2-3 per person based on seed
    const picks = [[0,1,2],[0,1],[0,2,3],[1,4],[0,1,4],[2,3],[0,1,3],[1,2,4]];
    const set = picks[p.seed % picks.length];
    return set.map(i => base[i]);
  }, [p]);

  const [open, setOpen] = React.useState(false);
  const [i, setI] = React.useState(0);
  const ch = allChannels[i];

  return (
    <div style={{ marginTop: 10, position:'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'8px 10px', background:'var(--paper-2)', borderRadius: 10,
          border:'1px solid var(--line-strong)', fontFamily:'Lato, sans-serif', fontSize: 12,
          color:'var(--ink)', textAlign:'left', cursor:'pointer'
        }}>
        <span style={{ display:'flex', alignItems:'center', gap: 8, minWidth: 0 }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', flexShrink: 0 }}>{ch.icon}</span>
          <span className="mono" style={{ fontSize: 12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ch.handle}</span>
        </span>
        <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', flexShrink: 0, marginLeft: 8 }}>
          {i+1}/{allChannels.length} ▾
        </span>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 10,
          boxShadow:'0 12px 24px -12px #0A0A0A40', overflow:'hidden'
        }}>
          {allChannels.map((c, idx) => (
            <button key={c.key}
              onClick={e => { e.stopPropagation(); setI(idx); setOpen(false); }}
              style={{
                width:'100%', display:'grid', gridTemplateColumns:'36px 1fr auto', alignItems:'center',
                gap: 8, padding:'9px 10px',
                background: idx === i ? 'var(--paper-2)' : 'transparent',
                borderBottom: idx === allChannels.length-1 ? 'none' : '1px dotted var(--line-strong)',
                textAlign:'left', cursor:'pointer'
              }}>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em' }}>{c.icon}</span>
              <span className="mono" style={{ fontSize: 12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.handle}</span>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

window.RevealView = RevealView;
