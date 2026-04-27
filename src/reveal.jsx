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
    <div style={{ minHeight:'100vh', padding:'14px 36px 120px' }}>
      {/* Top strip */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink: 0 }}>
        <div style={{ display:'flex', gap: 14, alignItems:'baseline' }}>
          <span className="serif" style={{ fontSize: 20, fontStyle:'italic' }}>Love at First Site</span>
          <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Pod Ardor</span>
        </div>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <span className="mono caps" style={{ fontSize: 11, color:'var(--cream)', background:'var(--rust)', padding:'4px 10px', letterSpacing:'0.18em', borderRadius: 2, fontWeight: 600 }}>8 / 8 {'\u00b7'} Reveal</span>
          <div style={{ display:'flex', gap: 6 }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ width: 22, height: 4, borderRadius: 2, background:'#800120' }}/>
            ))}
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 10px', background:'var(--ink)', color:'var(--cream)', borderRadius: 2, fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.14em', textTransform:'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)', animation:'pulse 1.2s infinite' }}/>
            Complete
          </span>
        </div>
      </div>

      {/* Headline row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop: 8, flexShrink: 0 }}>
        <div>
          <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)' }}>08 of 08 complete</div>
          <div className="serif" style={{ fontSize: 36, lineHeight: 0.96, letterSpacing:'-0.03em', marginTop: 4 }}>
            {mutuals.length === 0 ? <>No one <span style={{ fontStyle:'italic' }}>chose you back</span>.</>
              : mutuals.length === 1 ? <>One <span style={{ fontStyle:'italic', color:'var(--rust)' }}>mutual</span>.</>
              : <><span style={{ fontStyle:'italic', color:'var(--rust)' }}>{mutuals.length}</span> mutuals. Go write to them.</>}
          </div>
          <div className="serif" style={{ fontSize: 14, fontStyle:'italic', color:'var(--ink-2)', marginTop: 4 }}>
            Numbers and handles release only to people who picked you, too.
          </div>
        </div>
        <div style={{ display:'flex', gap: 10 }}>
          <button onClick={() => window.__setView && window.__setView('dashboard')} style={{ padding:'10px 18px', fontFamily:'Lato, sans-serif', fontSize: 11, letterSpacing:'0.12em', textTransform:'uppercase', background:'var(--ink)', color:'var(--paper)', borderRadius: 2 }}>View your dashboard</button>
        </div>
      </div>

      {/* Carousel nav */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 8, marginBottom: 6, flexShrink: 0 }}>
        <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>
          {'\u2665'} {mutuals.length} matches shown first {'\u00b7'} scroll for all {people.length}
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <button onClick={() => scrollBy(-1)} style={{ width: 32, height: 32, border:'none', borderRadius: 99, background:'#800120', fontFamily:'Lato, sans-serif', fontSize: 14, color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{'\u2190'}</button>
          <button onClick={() => scrollBy(1)} style={{ width: 32, height: 32, border:'none', borderRadius: 99, background:'#800120', fontFamily:'Lato, sans-serif', fontSize: 14, color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{'\u2192'}</button>
        </div>
      </div>

      {/* Scrolling carousel */}
      <div ref={scrollRef} className="reveal-carousel" style={{ display:'flex', gap: 12, overflowX:'auto', flex: 1, minHeight: 0, paddingBottom: 6, scrollbarWidth:'none', msOverflowStyle:'none' }}>
        {sorted.map((p, i) => (
          <div key={p.name} style={{ flex:'0 0 calc((100% - 48px) / 4.5)', maxHeight:'100%', overflowY:'hidden' }}>
            <RevealCard p={p}/>
          </div>
        ))}
      </div>

      {/* All Matches — same as bio/dashboard */}
      <RevealAllMatches/>
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
          <div className="caps mono" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
            All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 10 }}>
        {matches.map(m => (
          <div key={m.name} style={{ border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', padding: 10 }}>
            <div style={{ display:'grid', gridTemplateColumns:'48px 1fr', gap: 8 }}>
              <div style={{ width: 48, height: 60, overflow:'hidden', borderRadius: 99, border:'1px solid var(--line-strong)' }}>
                <Silhouette seed={m.seed}/>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 14, lineHeight: 1 }}>{m.name}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 11 }}>, {m.age}</span></div>
                <div className="mono" style={{ fontSize: 8, color:'var(--ink-3)', marginTop: 2 }}>{m.occ} {'\u00b7'} {m.city}</div>
                <div className="mono caps" style={{ fontSize: 7, color:'var(--rust)', letterSpacing:'0.12em', marginTop: 2 }}>{m.pod}</div>
                <div className="mono caps" style={{ fontSize: 7, color:'var(--ink-3)', letterSpacing:'0.1em', marginTop: 1 }}>{'\u2665'} {m.date}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
              <button onClick={() => setProfilePerson(m)} style={{
                flex: 1, padding:'6px 10px', fontFamily:'Lato, sans-serif', fontSize: 8, letterSpacing:'0.1em', textTransform:'uppercase',
                border:'1px solid var(--line-strong)', borderRadius: 2, color:'var(--ink-2)', background:'transparent', cursor:'pointer'
              }}>View full profile</button>
              <button onClick={() => { setChatPerson(m); setChatMsgs([{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]); }} style={{
                padding:'6px 10px', fontFamily:'Lato, sans-serif', fontSize: 7, letterSpacing:'0.1em', textTransform:'uppercase',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 2, border:'none', cursor:'pointer'
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
          <div className="caps mono" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
            All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
        {prior.map(m => (
          <div key={m.id} style={{ border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', padding: 12 }}>
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
              <button onClick={() => setProfilePerson(m)} style={{
                flex: 1, padding:'7px 10px', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase',
                border:'1px solid var(--line-strong)', borderRadius: 2, color:'var(--ink-2)', background:'transparent'
              }}>View {m.name}'s profile</button>
              <button onClick={() => { setChatPerson(m); setChatMsgs([{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]); }} style={{
                padding:'7px 14px', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 2, border:'none', cursor:'pointer'
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
          width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 2,
          display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80'
        }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
            <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
                <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={chatPerson.seed}/></div>
              </div>
              <div>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1 }}>{chatPerson.name}</div>
                <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{chatPerson.pod}</div>
              </div>
            </div>
            <button onClick={() => setChatPerson(null)} className="mono caps" style={{ fontSize: 10, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
            {chatMsgs.map((msg, i) => {
              if (msg.system) return (
                <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
                  <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.14em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 2 }}>{msg.text}</div>
                </div>
              );
              return (
                <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth:'75%', padding:'10px 14px', background: msg.me ? '#0A0A0A' : 'var(--paper-2)', color: msg.me ? '#FFFFFF' : 'var(--ink)', borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px', border: msg.me ? 'none' : '1px solid var(--line-strong)' }}>
                    <div className="serif" style={{ fontSize: 14, lineHeight: 1.45 }}>{msg.text}</div>
                    <div className="mono" style={{ fontSize: 9, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
              placeholder={`Message ${chatPerson.name}...`}
              style={{ flex: 1, padding:'10px 14px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
            <button onClick={sendChat} style={{ padding:'10px 18px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2, flexShrink: 0 }}>Send</button>
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
          <div className="caps mono" style={{ fontSize: 9, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
          <div className="serif" style={{ fontSize: 40, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
            All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
        {matches.map(m => (
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
              <button onClick={() => setProfilePerson(m)} style={{
                flex: 1, padding:'7px 10px', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase',
                border:'1px solid var(--line-strong)', borderRadius: 2, color:'var(--ink-2)', background:'transparent', cursor:'pointer'
              }}>View {m.name}'s profile</button>
              <button onClick={() => { setChatPerson(m); setChatMsgs([{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]); }} style={{
                padding:'7px 14px', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.12em', textTransform:'uppercase',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 2, border:'none', cursor:'pointer'
              }}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {profilePerson && <FullProfilePopup p={profilePerson} onClose={() => setProfilePerson(null)}/>}
    {chatPerson && (
      <div onClick={() => setChatPerson(null)} style={{ position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both' }}>
        <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 2, display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
            <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}><div style={{ position:'absolute', inset: -5 }}><Silhouette seed={chatPerson.seed}/></div></div>
              <div><div className="serif" style={{ fontSize: 20, lineHeight: 1 }}>{chatPerson.name}</div><div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{chatPerson.pod}</div></div>
            </div>
            <button onClick={() => setChatPerson(null)} className="mono caps" style={{ fontSize: 10, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
            {chatMsgs.map((msg, i) => msg.system ? (
              <div key={i} style={{ textAlign:'center', padding:'8px 0' }}><div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.14em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 2 }}>{msg.text}</div></div>
            ) : (
              <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth:'75%', padding:'10px 14px', background: msg.me ? '#0A0A0A' : 'var(--paper-2)', color: msg.me ? '#FFFFFF' : 'var(--ink)', borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px', border: msg.me ? 'none' : '1px solid var(--line-strong)' }}>
                  <div className="serif" style={{ fontSize: 14, lineHeight: 1.45 }}>{msg.text}</div>
                  <div className="mono" style={{ fontSize: 9, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat(); }} placeholder={`Message ${chatPerson.name}...`} style={{ flex: 1, padding:'10px 14px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
            <button onClick={sendChat} style={{ padding:'10px 18px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2, flexShrink: 0 }}>Send</button>
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
  return (
    <div style={{
      position:'relative',
      opacity: mutual ? 1 : 0.5,
      filter: mutual ? 'none' : 'grayscale(0.8)',
      transition: 'opacity .4s, filter .4s',
      background: mutual ? 'var(--ink)' : 'transparent',
      borderRadius: 2,
      padding: mutual ? 6 : 0,
      boxShadow: mutual ? '0 8px 24px -8px #6B152040' : 'none'
    }}>
      {/* Portrait */}
      <div style={{ position:'relative', aspectRatio:'1/1', borderRadius: 2, overflow:'hidden', border: mutual ? '2px solid var(--rust)' : '1px solid var(--line-strong)', background:'var(--paper-2)' }}>
        <Silhouette seed={p.seed}/>
        {mutual && (
          <div style={{ position:'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 99, background:'var(--rust)', color:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14 }}>
            {'\u2665'}
          </div>
        )}
        <div style={{ position:'absolute', left: 8, bottom: 8, color:'var(--cream)', textShadow:'0 1px 6px #0008' }}>
          <div className="serif" style={{ fontSize: 16, lineHeight: 1 }}>{p.name}, <span style={{ fontStyle:'italic' }}>{p.age}</span></div>
          <div className="mono" style={{ fontSize: 8, marginTop: 2, opacity: 0.85 }}>{p.occ}</div>
        </div>
      </div>

      {/* Info below portrait */}
      <div style={{ marginTop: 6, display:'flex', flexDirection:'column', height: 110 }}>
        <div className="mono caps" style={{ fontSize: 8, color: mutual ? '#FFFFFF90' : 'var(--ink-3)', letterSpacing:'0.12em', flexShrink: 0 }}>Call {p.callIdx}</div>

        {/* Note — scrollable if long */}
        <div style={{ marginTop: 6, flex: 1, minHeight: 0, overflowY:'auto' }}>
          {p.note && p.note.trim() ? (
            <div style={{ padding:'6px 8px', background: mutual ? '#FFFFFF15' : 'var(--paper-2)', borderLeft:'2px solid var(--rust)', borderRadius: 2 }}>
              <div className="mono caps" style={{ fontSize: 7, color:'var(--rust)', letterSpacing:'0.14em', marginBottom: 2 }}>Your note</div>
              <div className="serif" style={{ fontSize: 13, fontStyle:'italic', color: mutual ? '#FFFFFFD0' : 'var(--ink)', lineHeight: 1.3 }}>
                "{p.note}"
              </div>
            </div>
          ) : (
            <div className="mono" style={{ fontSize: 8, color: mutual ? '#FFFFFF60' : 'var(--ink-3)', letterSpacing:'0.12em', textTransform:'uppercase', fontStyle:'italic' }}>
              No note written.
            </div>
          )}
        </div>

        {/* Match status + action — pinned to bottom */}
        <div style={{ display:'flex', gap: 6, paddingTop: 6, flexShrink: 0 }}>
          {mutual ? (
            <button onClick={() => setContactOpen(true)} style={{
              flex: 1, padding:'6px 8px', background:'var(--rust)', color:'var(--cream)',
              fontFamily:'Lato, sans-serif', fontSize: 8, letterSpacing:'0.12em', textTransform:'uppercase',
              borderRadius: 2, border:'none', cursor:'pointer'
            }}>Contact</button>
          ) : (
            <span className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.12em', padding:'6px 0' }}>
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
              <div className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.16em' }}>♥ Connect now</div>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, marginTop: 3 }}>{p.name}</div>
            </div>
            <button onClick={() => setContactOpen(false)} className="mono caps" style={{ fontSize: 10, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Close ×</button>
          </div>
          <OverlayContactList p={p}/>
          <button onClick={() => setProfileOpen(true)}
            style={{
              marginTop: 10, width:'100%', padding:'10px 12px',
              border:'1px solid var(--line-strong)', color:'var(--ink-2)',
              fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.16em', textTransform:'uppercase',
              borderRadius: 2, background:'transparent', display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
            <span>View full profile</span>
            <span style={{ fontFamily:'Lato, sans-serif', fontSize: 14, fontStyle:'italic' }}>{'\u2192'}</span>
          </button>
          <button onClick={() => { setChatOpen(true); setChatMsgs([{ from:'System', me: false, text: `You matched with ${p.name}. Say hello!`, time:'just now', system: true }]); }}
            style={{
              marginTop: 6, width:'100%', padding:'10px 12px',
              background:'var(--ink)', color:'var(--cream)',
              fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.16em', textTransform:'uppercase',
              borderRadius: 2, border:'none', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'
            }}>
            <span>Start chat</span>
            <span style={{ fontFamily:'Lato, sans-serif', fontSize: 14, fontStyle:'italic' }}>{'\u2192'}</span>
          </button>
          <button className="mono" style={{ fontSize: 8, color:'var(--ink-3)', marginTop: 8, textDecoration:'underline', background:'transparent', border:'none', cursor:'pointer', display:'block', width:'100%', textAlign:'center' }}>Report Misconduct</button>
        </div>
      )}
      {profileOpen && <FullProfilePopup p={p} onClose={() => setProfileOpen(false)}/>}
      {chatOpen && (
        <div onClick={() => setChatOpen(false)} style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', maxWidth: 600, height:'70vh', background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 2,
            display:'flex', flexDirection:'column', boxShadow:'0 40px 80px -30px #0A0A0A80'
          }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
              <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
                  <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={p.seed}/></div>
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 20, lineHeight: 1 }}>{p.name}</div>
                  <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>Call {p.callIdx}</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="mono caps" style={{ fontSize: 10, color:'var(--ink-3)', cursor:'pointer' }}>{'\u2715'}</button>
            </div>
            <div ref={chatContRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
              {chatMsgs.map((msg, i) => {
                if (msg.system) return (
                  <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
                    <div className="mono caps" style={{ fontSize: 9, letterSpacing:'0.14em', color:'var(--rust)', display:'inline-block', padding:'5px 14px', background:'var(--paper-2)', borderRadius: 2 }}>{msg.text}</div>
                  </div>
                );
                return (
                  <div key={i} style={{ display:'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth:'75%', padding:'10px 14px', background: msg.me ? '#0A0A0A' : 'var(--paper-2)', color: msg.me ? '#FFFFFF' : 'var(--ink)', borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px', border: msg.me ? 'none' : '1px solid var(--line-strong)' }}>
                      <div className="serif" style={{ fontSize: 14, lineHeight: 1.45 }}>{msg.text}</div>
                      <div className="mono" style={{ fontSize: 9, color: msg.me ? '#888888' : 'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
                placeholder={`Message ${p.name}...`}
                style={{ flex: 1, padding:'10px 14px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none' }}/>
              <button onClick={sendMsg} style={{ padding:'10px 18px', background:'#0A0A0A', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2, flexShrink: 0 }}>Send</button>
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
          padding:'10px 12px', background:'var(--paper-2)', border:'1px solid var(--line-strong)', borderRadius: 2, textAlign:'left', cursor:'pointer', position:'relative'
        }}>
          <span className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.14em' }}>{c.icon}</span>
          <span className="mono" style={{ fontSize: 11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.handle}</span>
          <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{c.label}</span>
          <span data-copied style={{ display:'none', position:'absolute', top: -28, right: 0, padding:'4px 10px', background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 9, borderRadius: 2 }}>Copied!</span>
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
          padding:'8px 10px', background:'var(--paper-2)', borderRadius: 2,
          border:'1px solid var(--line-strong)', fontFamily:'Lato, sans-serif', fontSize: 11,
          color:'var(--ink)', textAlign:'left', cursor:'pointer'
        }}>
        <span style={{ display:'flex', alignItems:'center', gap: 8, minWidth: 0 }}>
          <span className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.14em', flexShrink: 0 }}>{ch.icon}</span>
          <span className="mono" style={{ fontSize: 11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ch.handle}</span>
        </span>
        <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em', flexShrink: 0, marginLeft: 8 }}>
          {i+1}/{allChannels.length} ▾
        </span>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 2,
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
              <span className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.14em' }}>{c.icon}</span>
              <span className="mono" style={{ fontSize: 11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.handle}</span>
              <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

window.RevealView = RevealView;
