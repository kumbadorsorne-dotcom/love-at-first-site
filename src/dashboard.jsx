// Dashboard — home view: quick stats, recent matches, message threads, CTA to lobby

const DASH_MESSAGES = [
  { id: 1, name:'Mateo',  seed: 2, pod:'Pod Ardor',    last:'Voice note \u00b7 0:47', preview:'you mentioned your grandmother\'s radio \u2014 does it still\u2026', time:'12m', unread: 2, channel:'IG',  recent: false, age: 31, city:'Oakland', occ:'Sound designer' },
  { id: 2, name:'Ilse',   seed: 5, pod:'Pod Kismet',   last:'Text',              preview:'second date is booked. pick a bakery.',                        time:'3h',  unread: 0, channel:'TEL', recent: false, age: 27, city:'Portland', occ:'Translator' },
  { id: 3, name:'Harper', seed: 7, pod:'Pod Tryst',    last:'Text',              preview:'the cottonwood argument continues on my end. don\'t\u2026',    time:'2d',  unread: 1, channel:'IG',  recent: false, age: 29, city:'Denver', occ:'Arborist' },
  { id: 4, name:'June',   seed: 3, pod:'Pod Covenant', last:'New match',         preview:'you both said yes after Call 01 \u00b7 contact shared',      time:'just now', unread: 0, channel:'\u2014', recent: true, age: 29, city:'Brooklyn', occ:'Archivist' },
  { id: 5, name:'Desmond',seed: 9, pod:'Pod Covenant', last:'New match',         preview:'you both said yes after Call 05 \u00b7 contact shared',      time:'today',    unread: 0, channel:'\u2014', recent: true, age: 30, city:'Atlanta', occ:'Civil engineer' },
  { id: 6, name:'Theo',   seed: 4, pod:'Pod Beloved',  last:'Archived',          preview:'mutual fade, as they say. you still have my rye recipe.',      time:'6w',  unread: 0, channel:'EM',  recent: false, age: 32, city:'Boston', occ:'Oncologist' },
];

const DASH_THREAD = {
  1: [
    { from:'Mateo',  me: false, text:'you mentioned your grandmother\'s radio — does it still pick up that one AM station?', time:'12m ago' },
    { from:'Mateo',  me: false, text:'[voice note · 0:47]', time:'12m ago', voice: true },
    { from:'You',    me: true,  text:'it does! every Sunday morning, same static, same bolero. I think it\'s haunted honestly.', time:'8m ago' },
    { from:'Mateo',  me: false, text:'haunted radios are the best radios.', time:'5m ago' },
  ],
  2: [
    { from:'You',    me: true,  text:'what about that place on 4th with the cardamom rolls?', time:'4h ago' },
    { from:'Ilse',   me: false, text:'second date is booked. pick a bakery.', time:'3h ago' },
    { from:'You',    me: true,  text:'the one near the park. Saturday 10am?', time:'2h ago' },
    { from:'Ilse',   me: false, text:'perfect. don\'t be late this time.', time:'1h ago' },
  ],
  3: [
    { from:'Harper', me: false, text:'the cottonwood argument continues on my end. don\'t even get me started on the pollen count.', time:'2d ago' },
    { from:'You',    me: true,  text:'I will die on this hill: cottonwoods are beautiful and worth every sneeze.', time:'2d ago' },
    { from:'Harper', me: false, text:'you are deeply unserious.', time:'2d ago' },
  ],
  4: [
    { from:'System', me: false, text:'You both said yes after Call 01. Contact has been released.', time:'just now', system: true },
    { from:'System', me: false, text:'Say hello when you\'re ready — no rush.', time:'just now', system: true },
  ],
  5: [
    { from:'System', me: false, text:'You both said yes after Call 05. Contact has been released.', time:'today', system: true },
    { from:'System', me: false, text:'Say hello when you\'re ready — no rush.', time:'today', system: true },
  ],
  6: [
    { from:'You',    me: true,  text:'hey — I think we both kind of felt the same thing. no hard feelings?', time:'6w ago' },
    { from:'Theo',   me: false, text:'mutual fade, as they say. you still have my rye recipe.', time:'6w ago' },
    { from:'You',    me: true,  text:'I do. it\'s genuinely good. take care, Theo.', time:'6w ago' },
  ],
};

function MessageWindow({ activeThread, threads, setThreads, msgInput, setMsgInput }) {
  const activePerson = DASH_MESSAGES.find(m => m.id === activeThread);
  const msgs = threads[activeThread] || [];
  const msgContainerRef = React.useRef(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  React.useEffect(() => { if (msgContainerRef.current) msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight; }, [activeThread, msgs.length]);

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    setThreads(prev => ({
      ...prev,
      [activeThread]: [...(prev[activeThread] || []), { from:'You', me: true, text: msgInput.trim(), time:'just now' }]
    }));
    setMsgInput('');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height: 600 }}>
      {/* Chat header */}
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-strong)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink: 0 }}>
        <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative' }}>
            <div style={{ position:'absolute', inset: -5 }}><Silhouette seed={activePerson?.seed || 0}/></div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{activePerson?.name}</div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 2 }}>{activePerson?.pod} · {activePerson?.last}</div>
          </div>
        </div>
        <button onClick={() => setProfileOpen(true)} className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--ink-3)', padding:'6px 12px', border:'1px solid var(--line-strong)', borderRadius: 10 }}>
          View {activePerson?.name}'s profile
        </button>
      </div>

      {/* Messages */}
      <div ref={msgContainerRef} style={{ flex: 1, overflowY:'auto', padding:'20px 20px 10px', display:'flex', flexDirection:'column', gap: 10 }}>
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
                background: msg.me ? 'var(--ink)' : 'var(--paper-2)',
                color: msg.me ? 'var(--cream)' : 'var(--ink)',
                borderRadius: msg.me ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                border: msg.me ? 'none' : '1px solid var(--line-strong)'
              }}>
                <div className="serif" style={{ fontSize: 14, lineHeight: 1.35, fontStyle: msg.voice ? 'italic' : 'normal' }}>
                  {msg.voice && <span style={{ color: msg.me ? 'var(--paper-3)' : 'var(--rust)', marginRight: 6 }}>♪</span>}
                  {msg.text}
                </div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, textAlign:'right' }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
        <div/>
      </div>

      {/* Input */}
      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line-strong)', display:'flex', gap: 10, flexShrink: 0 }}>
        <input
          value={msgInput} onChange={e => setMsgInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
          placeholder={`Message ${activePerson?.name}…`}
          style={{
            flex: 1, padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10,
            background:'var(--paper)', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, outline:'none'
          }}
        />
        <button onClick={sendMsg} style={{
          padding:'12px 20px', background:'var(--ink)', color:'var(--cream)',
          fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
          borderRadius: 10, flexShrink: 0
        }}>Send</button>
      </div>
      {profileOpen && activePerson && <FullProfilePopup p={activePerson} onClose={() => setProfileOpen(false)}/>}
    </div>
  );
}

const btnSubD = {
  padding:'9px 14px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em',
  textTransform:'uppercase', border:'1px solid var(--line-strong)', borderRadius: 10, color:'var(--ink-2)'
};

const ALL_MATCHES = [
  { name:'Mateo',   age:31, seed:2,  pod:'Pod Ardor',    occ:'Sound designer',      city:'Oakland',   date:'Apr 2026' },
  { name:'Ilse',    age:27, seed:5,  pod:'Pod Kismet',   occ:'Literary translator',  city:'Portland',  date:'Mar 2026' },
  { name:'Harper',  age:29, seed:7,  pod:'Pod Tryst',    occ:'Arborist',             city:'Denver',    date:'Mar 2026' },
  { name:'Theo',    age:32, seed:4,  pod:'Pod Beloved',  occ:'Bassoonist',           city:'Brooklyn',  date:'Feb 2026' },
  { name:'June',    age:29, seed:3,  pod:'Pod Covenant', occ:'Archivist',            city:'Brooklyn',  date:'Apr 2026' },
  { name:'Desmond', age:30, seed:9,  pod:'Pod Covenant', occ:'Civil engineer',       city:'Atlanta',   date:'Apr 2026' },
  { name:'Priya',   age:28, seed:6,  pod:'Pod Ember',    occ:'Pastry chef',          city:'Chicago',   date:'Jan 2026' },
  { name:'Wren',    age:33, seed:8,  pod:'Pod Ember',    occ:'Set builder',          city:'Austin',    date:'Jan 2026' },
  { name:'Nadia',   age:34, seed:10, pod:'Pod Solace',   occ:'Ceramicist',           city:'Savannah',  date:'Dec 2025' },
  { name:'Kai',     age:26, seed:11, pod:'Pod Solace',   occ:'Marine biologist',     city:'San Diego',  date:'Dec 2025' },
  { name:'Soren',   age:31, seed:12, pod:'Pod Reverie',  occ:'Architect',            city:'Seattle',   date:'Nov 2025' },
  { name:'Lena',    age:28, seed:13, pod:'Pod Reverie',  occ:'Documentary editor',   city:'Brooklyn',  date:'Nov 2025' },
  { name:'Felix',   age:30, seed:14, pod:'Pod Drift',    occ:'Jazz pianist',         city:'New Orleans', date:'Oct 2025' },
  { name:'Maren',   age:27, seed:15, pod:'Pod Drift',    occ:'Botanist',             city:'Portland',  date:'Oct 2025' },
  { name:'Ezra',    age:35, seed:1,  pod:'Pod Vesper',   occ:'Sommelier',            city:'Napa',      date:'Sep 2025' },
  { name:'Cleo',    age:29, seed:6,  pod:'Pod Vesper',   occ:'Muralist',             city:'Detroit',   date:'Sep 2025' },
];

function DashLobbyCTA({ onEnter }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const spawn = () => {
      const heart = document.createElement('span');
      heart.textContent = '\u2665';
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 16;
      const dur = 3 + Math.random() * 3;
      const delay = Math.random() * 0.5;
      Object.assign(heart.style, {
        position: 'absolute', bottom: '0', left: left + '%',
        fontSize: size + 'px', color: '#800120',
        opacity: '0', pointerEvents: 'none', zIndex: '0',
        animation: 'heartFloat ' + dur + 's ' + delay + 's ease-out forwards'
      });
      el.appendChild(heart);
      setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, (dur + delay) * 1000 + 200);
    };
    const id = setInterval(spawn, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} style={{
      marginBottom: 14, padding: '44px 28px', border: '1px solid var(--ink)', borderRadius: 10,
      background: 'var(--ink)', color: 'var(--cream)', textAlign: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="mono caps" style={{ fontSize: 12, color: '#FFFFFF', letterSpacing: '0.16em' }}>Time to join the pods</div>
        <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 8, letterSpacing: '-0.02em', color: 'var(--cream)' }}>
          We are ready when <span style={{ fontStyle: 'italic' }}>you are.</span>
        </div>
        <div className="serif" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--paper-2)', marginTop: 6, opacity: 0.85 }}>
          Let's get started on your 6 first dates.
        </div>
        <button onClick={onEnter} style={{
          marginTop: 20, padding: '16px 40px', background: 'var(--rust)', color: 'var(--cream)',
          fontFamily: 'Lato, sans-serif', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
          borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
          cursor: 'pointer', border: 'none', transition: 'all .2s ease'
        }}
        onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
        >
          <span>Enter lobby</span>
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 24, fontStyle: 'italic' }}>{'\u2192'}</span>
        </button>
      </div>
    </div>
  );
}

function DashboardView({ tweaks }) {
  React.useEffect(() => {
    if (window.__scrollToInbox) {
      window.__scrollToInbox = false;
      setTimeout(() => {
        document.querySelector('[data-inbox-section]')?.scrollIntoView({ behavior:'smooth' });
      }, 100);
    }
  }, []);
  const [rulesOpen, setRulesOpen] = React.useState(false);
  const [bioOpen, setBioOpen] = React.useState(false);
  const [activeThread, setActiveThread] = React.useState(1);
  const [msgInput, setMsgInput] = React.useState('');
  const [threads, setThreads] = React.useState(DASH_THREAD);
  const [matchProfile, setMatchProfile] = React.useState(null);

  const startChat = (m) => {
    // Find existing thread or use the matching DASH_MESSAGES entry
    const existing = DASH_MESSAGES.find(dm => dm.name === m.name);
    if (existing) {
      setActiveThread(existing.id);
    } else {
      // Create a new thread for this person
      const newId = 100 + ALL_MATCHES.indexOf(m);
      if (!threads[newId]) {
        setThreads(prev => ({
          ...prev,
          [newId]: [{ from:'System', me: false, text: `You matched with ${m.name} in ${m.pod}. Say hello!`, time:'just now', system: true }]
        }));
      }
      // Add to DASH_MESSAGES if not there (won't persist but works for the session)
      if (!DASH_MESSAGES.find(dm => dm.name === m.name)) {
        DASH_MESSAGES.push({ id: newId, name: m.name, seed: m.seed, pod: m.pod, last:'New match', preview:`Matched in ${m.pod}`, time:'just now', unread: 0, channel:'\u2014', recent: true, age: m.age, city: m.city, occ: m.occ });
      }
      setActiveThread(existing ? existing.id : newId);
    }
    // Scroll to inbox
    document.querySelector('[data-inbox-section]')?.scrollIntoView({ behavior:'smooth' });
  };
  const stats = [
    ['Pods completed',   '7',     'since March'],
    ['Mutual matches',   '4',     '3 active threads'],
    ['Met history',      '56',    'faces on record'],
    ['Strikes',          '0 / 3', 'clean standing'],
  ];

  return (
    <div style={{ minHeight:'100vh', padding:'20px 36px 120px', maxWidth: 1280, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom: 12, marginBottom: 14, flexShrink: 0 }}>
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 12, marginBottom: 6 }}>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.02em' }}>
              <span style={{ fontStyle:'italic' }}>Love</span> at First Site
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>Dashboard</div>
          </div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em' }}>
            Good evening, <span style={{ fontStyle:'italic' }}>Marie.</span>
          </div>
        </div>
        <div style={{ display:'flex', gap: 10 }}>
          <button onClick={() => window.__setView && window.__setView('bio')} style={btnSubD}>View your profile</button>
        </div>
      </div>

      {/* CTA — enter lobby */}
      <DashLobbyCTA onEnter={() => setRulesOpen(true)}/>

      {/* Premium / Free callout */}
      {(tweaks && tweaks.tier) === 'premium' ? (
        <div style={{ marginBottom: 24, padding:'12px 20px', background:'#800120', color:'#FFFFFF', borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{'\u2665'}</span>
            <div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1.1 }}>Premium is active</div>
              <div className="mono" style={{ fontSize: 12, opacity: 0.75, marginTop: 2, lineHeight: 1.3 }}>Curated for you. Your dealbreakers shape every pod, with unlimited circuits and early signals.</div>
            </div>
          </div>
          <div style={{ display:'flex', gap: 8, alignItems:'center', flexShrink: 0 }}>
            <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', padding:'4px 10px', background:'#FFFFFF', color:'#800120', borderRadius: 99, fontWeight: 700 }}>Active</div>
            <button onClick={() => window.__setView && window.__setView('premium')} style={{ padding:'4px 10px', background:'transparent', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.08em', borderRadius: 99, border:'1px solid #FFFFFF60', cursor:'pointer' }}>Learn more</button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 24, padding:'12px 20px', background:'var(--paper-2)', borderRadius: 10, border:'1px solid var(--line-strong)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <span style={{ fontSize: 18, color:'var(--ink-3)' }}>{'\u2661'}</span>
            <div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1.1, color:'var(--ink)' }}>You're on the free plan</div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2, lineHeight: 1.3 }}>Random pods, 2 circuits a day, no early signals.</div>
            </div>
          </div>
          <button
            onClick={() => window.__setView && window.__setView('premium')}
            style={{ padding:'6px 12px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700, flexShrink: 0 }}
          >Upgrade</button>
        </div>
      )}

      {/* STATS STRIP */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 0, border:'1px solid var(--line-strong)', borderRadius: 10, marginBottom: 32, background:'var(--cream)' }}>
        {stats.map(([k, v, note], i) => (
          <div key={i} style={{ padding:'18px 20px', borderRight: i < stats.length - 1 ? '1px solid var(--line)' : 'none', textAlign:'center', position:'relative' }}
            onMouseEnter={e => { if (k === 'Strikes') { const tip = e.currentTarget.querySelector('[data-strike-tip]'); if (tip) tip.style.display = 'block'; } }}
            onMouseLeave={e => { if (k === 'Strikes') { const tip = e.currentTarget.querySelector('[data-strike-tip]'); if (tip) tip.style.display = 'none'; } }}
          >
            <div className="caps mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>{k}</div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 6, color:'#800120' }}>
              {v.includes('/')
                ? <>{v.split(' / ')[0]}<span style={{ color:'var(--ink-3)', fontStyle:'italic', fontSize: 24 }}> / {v.split(' / ')[1]}</span></>
                : v}
            </div>
            <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, fontStyle:'italic' }}>{note}</div>
            {k === 'Strikes' && (
              <div data-strike-tip style={{ display:'none', position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)', width: 240, padding:'12px 14px', background:'var(--ink)', color:'var(--cream)', borderRadius: 10, boxShadow:'0 10px 24px -12px #00000060', zIndex: 60, textAlign:'left' }}>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginBottom: 6 }}>Strike Rules</div>
                <div className="mono" style={{ fontSize: 12, color:'#FFFFFFB0', lineHeight: 1.5 }}>
                  1 strike: Abandoning a pod<br/>
                  2 strikes: 14-day shadowban<br/>
                  3 strikes: Membership ends
                </div>
                <div style={{ position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', width: 0, height: 0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'6px solid var(--ink)' }}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* INBOX + MESSAGE WINDOW */}
      <div data-inbox-section/>
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom: 10, marginBottom: 16 }}>
          <div>
            <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Messages</div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 4, letterSpacing:'-0.02em' }}>
              The <span style={{ fontStyle:'italic', color:'var(--rust)' }}>inbox.</span>
            </div>
          </div>
          <div style={{ display:'flex', gap: 18, alignItems:'baseline' }}>
            <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--rust)' }}>{'\u2665'} {DASH_MESSAGES.filter(m=>m.recent).length} new matches</span>
            <span className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'var(--ink-3)' }}>{DASH_MESSAGES.reduce((n,m)=>n+m.unread,0)} unread</span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', overflow:'hidden', minHeight: 520 }}>
          {/* LEFT - thread list */}
          <div style={{ borderRight:'1px solid var(--line-strong)', overflowY:'auto', maxHeight: 600 }}>
            {[...DASH_MESSAGES].sort((a, b) => (b.recent ? 1 : 0) - (a.recent ? 1 : 0)).map((m, i) => {
              const isActive = activeThread === m.id;
              return (
                <div key={m.id} onClick={() => setActiveThread(m.id)} style={{
                  display:'flex', gap: 14, alignItems:'center', padding:'12px 20px', cursor:'pointer',
                  borderBottom: i < DASH_MESSAGES.length - 1 ? '1px dotted var(--line-strong)' : 'none',
                  opacity: m.last === 'Archived' ? 0.55 : 1,
                  background: isActive ? 'var(--paper)' : m.recent ? 'var(--paper-2)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--rust)' : '3px solid transparent',
                  transition:'backgcircuit .15s'
                }}>
                  {/* avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)', position:'relative', flexShrink: 0 }}>
                    <div style={{ position:'absolute', inset: -6 }}><Silhouette seed={m.seed}/></div>
                    {m.unread > 0 && <div style={{ position:'absolute', top: -3, right: -3, minWidth: 14, height: 14, padding:'0 4px', borderRadius: 99, background:'var(--rust)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center' }}>{m.unread}</div>}
                  </div>
                  {/* name + preview */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <div style={{ display:'flex', gap: 8, alignItems:'baseline' }}>
                        <span className="serif" style={{ fontSize: 18, lineHeight: 1 }}>{m.name}</span>
                        {m.recent && <span style={{ fontSize: 12, color:'#FFFFFF', background:'#800120', padding:'2px 8px', borderRadius: 99, display:'inline-flex', alignItems:'center', gap: 4, fontFamily:'Lato, sans-serif', letterSpacing:'0.12em', textTransform:'uppercase' }}>{'\u2665'} New match</span>}
                      </div>
                      <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)', flexShrink: 0 }}>{m.time}</span>
                    </div>
                    <div className="serif" style={{ fontSize: 12, fontStyle:'italic', color: m.unread > 0 ? 'var(--ink)' : 'var(--ink-3)', marginTop: 3, lineHeight: 1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {m.preview}
                    </div>
                    <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 3 }}>{m.pod}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - message window */}
          <MessageWindow activeThread={activeThread} threads={threads} setThreads={setThreads} msgInput={msgInput} setMsgInput={setMsgInput}/>
        </div>
      </div>

      {/* All Matches */}
      <div style={{ marginTop: 44, paddingTop: 28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <div>
            <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your matches {'\u00b7'} all pods</div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
              All <span style={{ fontStyle:'italic', color:'var(--rust)' }}>matches.</span>
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
          {ALL_MATCHES.map(m => (
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
              <div style={{ marginTop: 10 }}>
                <button onClick={() => startChat(m)} style={{
                  width:'100%', padding:'10px 14px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                  background:'#800120', color:'#FFFFFF', borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700,
                  display:'flex', alignItems:'center', justifyContent:'center', gap: 8
                }}>
                  <span>{'\u2665'}</span>
                  <span>Chat with {m.name}</span>
                </button>
                <button onClick={() => setMatchProfile(m)} style={{
                  width:'100%', marginTop: 6, padding:'4px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.08em',
                  color:'var(--ink-3)', background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline'
                }}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {rulesOpen && <HouseRulesModal tier={tweaks && tweaks.tier} onClose={() => setRulesOpen(false)} onAck={() => {
        setRulesOpen(false);
        window.__setView && window.__setView('lobby');
      }}/>}

      {bioOpen && <BioPopup onClose={() => setBioOpen(false)}/>}
      {matchProfile && <FullProfilePopup p={matchProfile} onClose={() => setMatchProfile(null)}/>}

      <LogoutButton/>
    </div>
  );
}

function HouseRulesModal({ onClose, onAck, tier }) {
  const isPremium = tier === 'premium';
  const [agreed, setAgreed] = React.useState({ rules: false, locked: false, strikes: false, decorum: false });
  const [micFixed, setMicFixed] = React.useState(false);
  const preflightOk = micFixed;
  const allReady = agreed.rules && agreed.locked && agreed.strikes && agreed.decorum && preflightOk;
  const toggle = (k) => setAgreed(o => ({ ...o, [k]: !o[k] }));

  const rules = [
    { k:'rules',   n:'I',   title:'Six dates, no escapes',    body:'Five minutes each, a two-minute verdict between, five-minute refresh at halftime.' },
    { k:'locked',  n:'II',  title:'Your profile is sealed',     body:'Your 15 variables are locked. Genuine life changes require the Manual Contact Form.' },
    { k:'strikes', n:'III', title:'Three strikes, then silence', body:'Abandoning a pod = strike 1. Two = 14-day shadowban. Three ends your membership.' },
    { k:'decorum', n:'IV',  title:'The Decorum Engine watches',  body:'Live AI review. Reclining, face off-screen, recording, and audio leaks all trigger action.' },
  ];

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding: 20, animation:'fade .25s ease both'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:'100%', maxWidth: 860, maxHeight:'92vh', overflowY:'auto',
        background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 10,
        padding:'28px 32px', boxShadow:'0 40px 80px -30px #0A0A0A80'
      }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 16 }}>
          <div>
            <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--rust)' }}>{'\u25c6'} Before you enter the lobby</div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 6 }}>
              The <span style={{ fontStyle:'italic', color:'var(--rust)' }}>pod rules.</span>
            </div>
            <div className="serif" style={{ fontSize: 18, fontStyle:'italic', color:'var(--ink-2)', marginTop: 6 }}>
              Tick every box. Submit stays locked until you do.
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 99, background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 18, display:'flex', alignItems:'center', justifyContent:'center' }}>{'\u2715'}</button>
        </div>

        {/* Two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap: 20 }}>
          {/* Left: Rules */}
          <div>
            <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
              {rules.map(r => {
                const checked = agreed[r.k];
                return (
                  <button key={r.k} onClick={() => toggle(r.k)} style={{
                    textAlign:'left', padding:'12px 20px',
                    background: checked ? 'var(--cream)' : 'transparent',
                    border: `1px solid ${checked ? 'var(--ink)' : 'var(--line-strong)'}`,
                    borderRadius: 10, display:'grid', gridTemplateColumns:'24px 20px 1fr', gap: 10, alignItems:'start', cursor:'pointer'
                  }}>
                    <span className="serif" style={{ fontSize: 18, lineHeight: 1, color: checked ? 'var(--rust)' : 'var(--ink-3)', fontStyle:'italic' }}>{r.n}</span>
                    <div style={{
                      width: 18, height: 18, marginTop: 1, borderRadius: 10,
                      background: checked ? 'var(--rust)' : 'transparent',
                      border: `1px solid ${checked ? 'var(--rust)' : 'var(--line-strong)'}`,
                      color:'var(--cream)', fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center'
                    }}>{checked ? '\u2713' : ''}</div>
                    <div>
                      <div className="serif" style={{ fontSize: 18, lineHeight: 1.1 }}>{r.title}</div>
                      <div className="mono" style={{ fontSize: 12, color:'var(--ink-2)', marginTop: 3, lineHeight: 1.3 }}>{r.body}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Timing strip */}
            <div style={{ display:'flex', gap: 6, marginTop: 12 }}>
              <div style={{ flex: 1, padding:'8px 10px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', textAlign:'center' }}>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>5:00</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 3 }}>minutes per call</div>
              </div>
              <div style={{ flex: 1, padding:'8px 10px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', textAlign:'center' }}>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>1:00</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em', marginTop: 3 }}>minute breaks</div>
              </div>
              <div style={{ flex: 1, padding:'8px 10px', border:'1px solid var(--rust)', borderRadius: 10, background:'var(--cream)', textAlign:'center' }}>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1, color:'var(--rust)' }}>8</div>
                <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginTop: 3 }}>Calls</div>
              </div>
            </div>
          </div>

          {/* Right: Checklist + Premium */}
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {/* Checklist */}
            <div style={{ padding:'12px 14px', background:'var(--paper-2)', borderRadius: 10, border:'1px dotted var(--line-strong)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
                <div className="caps mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>Checklist</div>
                
              </div>
              {[
                { label:'Wi-Fi', info:'94 Mbps', ok: true },
                { label:'Battery', info:'78%', ok: true },
                { label:'Camera', info:'FaceTime HD', ok: true },
                { label:'Microphone', info:'Built-in Mic', ok: micFixed },
              ].map(c => (
                <div key={c.label} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', alignItems:'center', padding:'4px 0', borderBottom:'1px dotted var(--line)', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 12, color:'var(--ink-2)' }}>{c.label}</span>
                  <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)', textAlign:'center' }}>{c.info}</span>
                  {c.label === 'Microphone' && !micFixed ? (
                    <button onClick={() => setMicFixed(true)} className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', background:'transparent', border:'1px solid var(--rust)', borderRadius: 10, padding:'2px 8px', cursor:'pointer' }}>Fix</button>
                  ) : (
                    <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', textAlign:'right' }}>{'\u2713'} Good</span>
                  )}
                </div>
              ))}
            </div>

            {/* Premium */}
            <div style={{ padding:'14px 16px', background: isPremium ? 'var(--ink)' : 'var(--paper-2)', color: isPremium ? 'var(--cream)' : 'var(--ink)', borderRadius: 10, border: isPremium ? 'none' : '1px solid var(--line-strong)' }}>
              <div className="mono caps" style={{ fontSize: 12, color: isPremium ? '#FFFFFF' : 'var(--ink-3)', letterSpacing:'0.12em' }}>
                {isPremium ? 'Premium is active' : 'Premium is not active'}
              </div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1, marginTop: 4 }}>
                {isPremium
                  ? <>Heartbreaker Filters <span style={{ fontStyle:'italic', color:'var(--rust)' }}>on.</span></>
                  : <>Activate to get the following <span style={{ fontStyle:'italic', color:'var(--rust)' }}>benefits.</span></>}
              </div>
              <ul style={{ listStyle:'none', padding: 0, margin:'8px 0 0', display:'flex', flexDirection:'column', gap: 4 }}>
                <li className="mono" style={{ fontSize: 12, color: isPremium ? '#FFFFFFB0' : 'var(--ink-3)', lineHeight: 1.3 }}>{'\u2665'} You will enter pods based on your deal breakers</li>
                <li className="mono" style={{ fontSize: 12, color: isPremium ? '#FFFFFFB0' : 'var(--ink-3)', lineHeight: 1.3 }}>{'\u2665'} You can go through endless circuits</li>
                <li className="mono" style={{ fontSize: 12, color: isPremium ? '#FFFFFFB0' : 'var(--ink-3)', lineHeight: 1.3 }}>{'\u2665'} Can provide a hint that you're interested after each call</li>
              </ul>
              {!isPremium && (
                <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
                  <button style={{ padding:'6px 12px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700 }}>Upgrade Now</button>
                  <button style={{ padding:'6px 12px', background:'transparent', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 10, border:'1px solid var(--line-strong)', cursor:'pointer' }}>Learn more</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display:'flex', gap: 10, marginTop: 20, alignItems:'center' }}>
          <div style={{ position:'relative', flex: 1 }}
            onMouseEnter={(e) => { if (!allReady) e.currentTarget.querySelector('[data-tip]').style.display = 'block'; }}
            onMouseLeave={(e) => { e.currentTarget.querySelector('[data-tip]').style.display = 'none'; }}>
            <button disabled={!allReady} onClick={() => allReady && onAck()} style={{
              width:'100%', padding:'14px 20px',
              background: allReady ? 'var(--ink)' : 'var(--paper-2)',
              color: allReady ? 'var(--cream)' : 'var(--ink-3)',
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.16em', textTransform:'uppercase',
              borderRadius: 10, cursor: allReady ? 'pointer' : 'not-allowed',
              display:'flex', alignItems:'center', justifyContent:'space-between'
            }}>
              <span>{allReady ? 'Enter the lobby' : `Check ${Object.values(agreed).filter(Boolean).length}/4 rules \u00b7 Fix ${micFixed ? 4 : 3}/4 Checklist`}</span>
              <span style={{ fontFamily:'Lato, sans-serif', fontSize: 24, fontStyle:'italic' }}>{'\u2192'}</span>
            </button>
            <div data-tip style={{
              display:'none', position:'absolute', bottom:'calc(100% + 8px)', left: 0, right: 0,
              padding:'12px 20px', background:'var(--ink)', color:'var(--cream)', borderRadius: 10,
              boxShadow:'0 10px 24px -12px #00000060', zIndex: 60
            }}>
              <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.12em', marginBottom: 4 }}>Still needed:</div>
              {!agreed.rules && <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', marginBottom: 2 }}>{'\u2022'} Rule I: Six dates, no escapes</div>}
              {!agreed.locked && <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', marginBottom: 2 }}>{'\u2022'} Rule II: Profile is sealed</div>}
              {!agreed.strikes && <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', marginBottom: 2 }}>{'\u2022'} Rule III: Three strikes</div>}
              {!agreed.decorum && <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', marginBottom: 2 }}>{'\u2022'} Rule IV: Decorum Engine</div>}
              {!preflightOk && <div className="mono" style={{ fontSize: 12, color:'var(--rust)', marginBottom: 2 }}>{'\u2022'} Fix set-up checklist: turn on microphone</div>}
              <div style={{ position:'absolute', top:'100%', left: '50%', transform:'translateX(-50%)', width: 0, height: 0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'6px solid var(--ink)' }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BioPopup({ onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position:'fixed', inset: 0, zIndex: 9999, background:'#0A0A0AB0', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'3vh 4vw', animation:'fade .25s ease both'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:'100%', maxWidth: 1180, maxHeight:'94vh', overflowY:'auto',
        background:'var(--paper)', border:'1px solid var(--ink)', borderRadius: 10,
        position:'relative', boxShadow:'0 40px 80px -30px #0A0A0A80'
      }}>
        <button onClick={onClose} style={{
          position:'absolute', top: 18, right: 18, zIndex: 5,
          width: 36, height: 36, borderRadius: 99, background:'var(--ink)', color:'var(--cream)',
          fontFamily:'Lato, sans-serif', fontSize: 18, display:'flex', alignItems:'center', justifyContent:'center'
        }}>✕</button>
        {window.BioView ? <window.BioView compact={true}/> : <div style={{ padding: 40 }}>Loading…</div>}
      </div>
    </div>
  );
}

window.DashboardView = DashboardView;
window.HouseRulesModal = HouseRulesModal;
