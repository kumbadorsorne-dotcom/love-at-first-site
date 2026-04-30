// Profile — unified: your bio, your variables, your past matches (with contact dropdown).
// Chameleons lockdown is deprioritized: moved below matches as a quiet footer note.

const PROFILE_MATCHES = [
  {
    id: 1, name:'Mateo', age:31, city:'Oakland', occ:'Sound designer', seed: 2,
    pod:'Pod Ardor', date:'Last Thursday',
    quote:"I have strong feelings about pressed sandwiches.",
    bio:"Records strangers' voices on a portable tape machine. Cooks for people who can\u2019t.",
    shared: ['Love style · Touch','Zodiac · Air','Workout · Weekly','Diet · Omnivore','Politics · Left'],
    channels: ['instagram','phone','tiktok'],
    status:'Active · traded three voice notes',
  },
  {
    id: 2, name:'Ilse', age:27, city:'Portland', occ:'Literary translator', seed: 5,
    pod:'Pod Kismet', date:'Two weeks ago',
    quote:"I\u2019ll read a restaurant menu out loud if nobody stops me.",
    bio:"Translates Spanish poetry. Opinions on every bakery between 23rd and Alberta.",
    shared: ['Wants kids · Yes','Politics · Left','Sleep · Night owl'],
    channels: ['instagram','phone'],
    status:'Met for coffee · second date booked',
  },
  {
    id: 3, name:'Harper', age:29, city:'Denver', occ:'Arborist', seed: 7,
    pod:'Pod Tryst', date:'Last month',
    quote:"Ask me which tree would win in a fight. I\u2019ll tell you.",
    bio:"Climbs cottonwoods for a living. Reads three books at a time.",
    shared: ['Pets · Dog','Workout · Weekly','Education · Graduate'],
    channels: ['instagram','tiktok','spotify'],
    status:'Quiet · your move',
  },
  {
    id: 4, name:'Theo', age:32, city:'Brooklyn', occ:'Bassoonist', seed: 4,
    pod:'Pod Beloved', date:'Six weeks ago',
    quote:"I own more sheet music than books. Don\u2019t look at me like that.",
    bio:"Section player, occasional soloist. Bakes rye on his day off.",
    shared: ['Love style · Service','Religion · None'],
    channels: ['phone','email'],
    status:'Closed · mutual fade',
  },
];

function buildChannelList(p) {
  const slug = p.name.toLowerCase();
  const city = (p.city || '').replace(/\s|,/g,'').toLowerCase();
  const dict = {
    instagram: { key:'instagram', label:'Instagram', icon:'IG', handle: '@' + slug + '.' + city },
    phone:     { key:'phone',     label:'Phone',     icon:'TEL', handle: '+1 (415) 555-0' + String(100 + p.seed*13 % 900).padStart(3,'0') },
    tiktok:    { key:'tiktok',    label:'TikTok',    icon:'TT', handle: '@' + slug + 'irl' },
    spotify:   { key:'spotify',   label:'Spotify',   icon:'SP', handle: slug + '.onwave' },
    email:     { key:'email',     label:'Email',     icon:'EM', handle: slug + '@' + city + '.co' },
  };
  return p.channels.map(k => dict[k]);
}

function ProfileContactDropdown({ p }) {
  const channels = React.useMemo(() => buildChannelList(p), [p]);
  const [open, setOpen] = React.useState(false);
  const [i, setI] = React.useState(0);
  const ch = channels[i];
  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'9px 12px', background:'var(--paper-2)', borderRadius: 2,
          border:'1px solid var(--line-strong)', fontFamily:'Lato, sans-serif', fontSize: 12,
          color:'var(--ink)', textAlign:'left', cursor:'pointer'
        }}>
        <span style={{ display:'flex', alignItems:'center', gap: 10, minWidth: 0 }}>
          <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.14em', flexShrink: 0 }}>{ch.icon}</span>
          <span className="mono" style={{ fontSize: 12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ch.handle}</span>
        </span>
        <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em', flexShrink: 0, marginLeft: 8 }}>
          {i+1}/{channels.length} ▾
        </span>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 2,
          boxShadow:'0 12px 24px -12px #0A0A0A40', overflow:'hidden'
        }}>
          {channels.map((c, idx) => (
            <button key={c.key}
              onClick={e => { e.stopPropagation(); setI(idx); setOpen(false); }}
              style={{
                width:'100%', display:'grid', gridTemplateColumns:'36px 1fr auto', alignItems:'center',
                gap: 8, padding:'9px 10px',
                background: idx === i ? 'var(--paper-2)' : 'transparent',
                borderBottom: idx === channels.length-1 ? 'none' : '1px dotted var(--line-strong)',
                textAlign:'left', cursor:'pointer'
              }}>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.14em' }}>{c.icon}</span>
              <span className="mono" style={{ fontSize: 12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.handle}</span>
              <span className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView() {
  const [accurate, setAccurate] = React.useState(() => {
    try { return localStorage.getItem('lfs.accurate') === '1'; } catch { return false; }
  });
  React.useEffect(() => {
    const id = setInterval(() => {
      try {
        const v = localStorage.getItem('lfs.accurate') === '1';
        setAccurate(prev => prev === v ? prev : v);
      } catch {}
    }, 500);
    return () => clearInterval(id);
  }, []);
  const bio = 'I restore old radios and get too emotional at dog parks. Looking for someone who reads menus cover to cover.';
  const traits = [
    ['Wants kids', 'Yes ♥'], ['Smoking', 'Never ♥'], ['Zodiac', 'Air'],
    ['Pets', 'Dog'], ['Workout', 'Weekly'], ['Diet', 'Omnivore'],
    ['Love style', 'Touch'], ['Sleep', 'Night owl'], ['Politics', 'Left'],
  ];
  const stats = [
    ['Pods completed', '7'],
    ['Mutual matches', String(PROFILE_MATCHES.length)],
    ['Met history', '56 faces'],
    ['Strikes', '0 / 3'],
  ];

  return (
    <div style={{ minHeight:'100vh', padding:'36px 48px 72px', maxWidth: 1280, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: 18, marginBottom: 28 }}>
        <div>
          <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>Your profile</div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 8 }}>
            Marie <span style={{ fontStyle:'italic' }}>Delacroix</span>
          </div>
        </div>
        <div style={{ display:'flex', gap: 10 }}>
          <button onClick={() => window.__setView && window.__setView('bio')} style={btnSubP}>View your profile</button>
          <button style={btnSubP}>Log out</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap: 32, alignItems:'start' }}>
        {/* LEFT: portrait + bio + variables + stats */}
        <div style={{ display:'flex', flexDirection:'column', gap: 22 }}>
          <div style={{ aspectRatio:'4/5', borderRadius: 2, overflow:'hidden', border:'1px solid var(--line-strong)' }}>
            <Silhouette seed={2}/>
          </div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1 }}>29 · Brooklyn</div>
          <div className="serif" style={{ fontSize: 24, fontStyle:'italic', color:'var(--ink-2)', lineHeight: 1.4 }}>
            "{bio}"
          </div>
          <div>
            <div className="caps mono" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)', marginBottom: 10 }}>Your 15 variables</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, border:'1px solid var(--line-strong)', borderRadius: 2, overflow:'hidden' }}>
              {traits.map(([k,v], i) => (
                <div key={i} style={{ padding:'12px 14px', background:'var(--cream)', borderBottom: i < traits.length - 2 ? '1px solid var(--line)' : 'none', borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none' }}>
                  <div className="caps mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{k}</div>
                  <div className="serif" style={{ fontSize: 18, marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding:'16px 18px', border:'1px solid var(--line-strong)', borderRadius: 2 }}>
            <div className="caps mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.16em' }}>Circuit history</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 12, marginTop: 10 }}>
              {stats.map(([k,v], i) => (
                <div key={i}>
                  <div className="serif" style={{ fontSize: 32, lineHeight: 1 }}>{v}</div>
                  <div className="caps mono" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: past matches gallery */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:'1px solid var(--line-strong)', paddingBottom: 12, marginBottom: 20 }}>
            <div>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'var(--ink-3)' }}>The little archive</div>
              <div className="serif" style={{ fontSize: 48, lineHeight: 1, marginTop: 6, letterSpacing:'-0.02em' }}>
                Your <span style={{ fontStyle:'italic', color:'var(--rust)' }}>{PROFILE_MATCHES.length}</span> mutual matches.
              </div>
            </div>
            <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.14em', color:'var(--ink-3)' }}>by most recent</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap: 18 }}>
            {PROFILE_MATCHES.map(m => <MatchRow key={m.id} m={m}/>)}
          </div>

        </div>
      </div>
      <LogoutButton/>
    </div>
  );
}

function MatchRow({ m }) {
  const [profileOpen, setProfileOpen] = React.useState(false);
  return (
    <div style={{ border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', overflow:'hidden', display:'grid', gridTemplateColumns:'160px 1fr', gap: 0 }}>
      <div style={{ position:'relative' }}>
        <Silhouette seed={m.seed}/>
        <div style={{ position:'absolute', top: 10, left: 10, padding:'3px 8px', background:'var(--rust)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2 }}>
          ♥ Mutual
        </div>
      </div>
      <div style={{ padding:'14px 18px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <div>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>
              {m.name}<span style={{ color:'var(--ink-3)' }}>, </span><span style={{ fontStyle:'italic', color:'var(--ink-3)' }}>{m.age}</span>
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4 }}>{m.occ} · {m.city}</div>
          </div>
          <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', fontStyle:'italic' }}>{m.pod} · {m.date}</div>
        </div>

        <div className="serif" style={{ fontSize: 18, fontStyle:'italic', color:'var(--ink-2)', marginTop: 10, lineHeight: 1.3, borderLeft:'2px solid var(--rust)', paddingLeft: 10 }}>
          "{m.quote}"
        </div>

        <div style={{ marginTop: 12, display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 16, alignItems:'end' }}>
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em' }}>You agreed on</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 4, marginTop: 6 }}>
              {m.shared.slice(0,4).map((s,i) => {
                const [field, value] = s.split(' · ');
                return <span key={i} className="mono" style={{ fontSize: 12, padding:'3px 8px', border:'1px solid var(--line-strong)', borderRadius: 2 }}>{field} · <span style={{ color:'var(--ink-3)' }}>{value}</span></span>;
              })}
            </div>
          </div>
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.14em', marginBottom: 6 }}>Contact</div>
            <ProfileContactDropdown p={m}/>
            <button onClick={() => setProfileOpen(true)} style={{
              marginTop: 6, width:'100%', padding:'9px 12px',
              background:'var(--ink)', color:'var(--cream)',
              fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.14em', textTransform:'uppercase',
              borderRadius: 2, display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
              <span>View full profile</span>
              <span style={{ fontFamily:'Lato, sans-serif', fontSize: 14, fontStyle:'italic' }}>→</span>
            </button>
          </div>
        </div>

        <div className="mono caps" style={{ fontSize: 12, color:'var(--rust)', letterSpacing:'0.14em', marginTop: 12 }}>● {m.status}</div>
      </div>
      {profileOpen && <FullProfilePopup p={m} onClose={() => setProfileOpen(false)}/>}
    </div>
  );
}

const btnSubP = {
  padding:'9px 14px', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em',
  textTransform:'uppercase', border:'1px solid var(--line-strong)', borderRadius: 2, color:'var(--ink-2)'
};

window.ProfileView = ProfileView;
window.PROFILE_MATCHES = PROFILE_MATCHES;
