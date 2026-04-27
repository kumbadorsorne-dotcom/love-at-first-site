// Full-profile popup — shared by Reveal and Matches pages.

function FullProfilePopup({ p, onClose }) {
  if (!p) return null;
  // Normalize across Reveal (callIdx/seed/theyYes/youYes) and Matches (MatchRow shape)
  const name = p.name;
  const age = p.age;
  const city = p.city || '';
  const occ = p.occ || '';
  const seed = p.seed || 2;
  const quote = p.quote || p.note || '';
  const bioText = p.bio || '';
  const pod = p.pod || (p.callIdx ? `Pod Ardor · Call ${p.callIdx}` : '');
  const shared = p.shared || [];

  // Build channels if we don't already have them (reveal case).
  const channels = React.useMemo(() => {
    const slug = name.toLowerCase();
    const cityslug = city.replace(/\s|,/g,'').toLowerCase() || 'city';
    const base = [
      { key:'instagram', label:'Instagram', icon:'IG', handle: '@' + slug + '.' + cityslug },
      { key:'phone',     label:'Phone',     icon:'TEL', handle: '+1 (415) 555-0' + String(100 + seed*13 % 900).padStart(3,'0') },
      { key:'tiktok',    label:'TikTok',    icon:'TT', handle: '@' + slug + 'irl' },
      { key:'spotify',   label:'Spotify',   icon:'SP', handle: slug + '.onwave' },
      { key:'email',     label:'Email',     icon:'EM', handle: slug + '@' + cityslug + '.co' },
    ];
    if (p.channels) {
      const dict = Object.fromEntries(base.map(b => [b.key, b]));
      return p.channels.map(k => dict[k]).filter(Boolean);
    }
    const picks = [[0,1,2],[0,1],[0,2,3],[1,4],[0,1,4],[2,3],[0,1,3],[1,2,4]];
    return picks[seed % picks.length].map(i => base[i]);
  }, [p]);

  const traits = [
    ['Wants kids','Yes ♥'], ['Smoking','Never'], ['Zodiac','Air'],
    ['Pets','Dog'], ['Workout','Weekly'], ['Diet','Omnivore'],
    ['Love style','Touch'], ['Sleep','Night owl'], ['Politics','Left'],
  ];

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position:'fixed', inset: 0, zIndex: 10000, background:'#0A0A0AB0',
      display:'flex', alignItems:'center', justifyContent:'center', padding: 32,
      animation:'fade .2s ease both'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background:'var(--cream)', border:'1px solid var(--ink)', borderRadius: 2,
        width:'min(1080px, 100%)', maxHeight:'92vh', overflow:'auto',
        display:'grid', gridTemplateColumns:'440px 1fr', position:'relative'
      }}>
        <button onClick={onClose} className="mono caps" style={{
          position:'absolute', top: 14, right: 16, fontSize: 10, letterSpacing:'0.16em', color:'var(--ink-3)', zIndex: 2
        }}>Close ×</button>

        {/* LEFT — portrait + bio */}
        <div style={{ padding: 28, borderRight:'1px solid var(--line-strong)', display:'flex', flexDirection:'column', gap: 18 }}>
          <div style={{ aspectRatio:'4/5', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)', position:'relative' }}>
            <Silhouette seed={seed}/>
            <div style={{ position:'absolute', top: 10, left: 10, padding:'3px 8px', background:'var(--rust)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 9, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2 }}>
              ♥ Mutual match
            </div>
          </div>
          {/* Mini gallery */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 5 }}>
            {[seed, seed+7, seed+3, seed+11, seed+5].map((s,i) => (
              <div key={i} style={{ aspectRatio:'1/1', overflow:'hidden', borderRadius: 2, border:'1px solid var(--line-strong)' }}>
                <Silhouette seed={s % 15 + 1}/>
              </div>
            ))}
          </div>
          <div>
            <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em' }}>{name} said</div>
            <div className="serif" style={{ fontSize: 17, fontStyle:'italic', lineHeight: 1.45, marginTop: 6, color:'var(--ink-2)' }}>
              "{bioText || ("I'm " + name + ". Let's see if we click.")}"
            </div>
          </div>
          {quote && !p.note && (
            <div style={{ padding:'10px 12px', background:'var(--paper-2)', borderLeft:'2px solid var(--rust)', borderRadius: 2 }}>
              <div className="mono caps" style={{ fontSize: 8, color:'var(--rust)', letterSpacing:'0.16em' }}>Their opening line</div>
              <div className="serif" style={{ fontSize: 15, fontStyle:'italic', lineHeight: 1.4, marginTop: 4 }}>"{quote}"</div>
            </div>
          )}
        </div>

        {/* RIGHT — header, traits, contact */}
        <div style={{ padding: 28, display:'flex', flexDirection:'column', gap: 20 }}>
          <div>
            <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em' }}>{pod || 'Mutual match'}</div>
            <div className="serif" style={{ fontSize: 54, lineHeight: 0.98, letterSpacing:'-0.02em', marginTop: 6 }}>
              {name}<span style={{ color:'var(--ink-3)', fontStyle:'italic' }}>, {age}</span>
            </div>
            {(occ || city) && (
              <div className="mono" style={{ fontSize: 11, color:'var(--ink-3)', letterSpacing:'0.08em', marginTop: 6 }}>
                {occ}{occ && city ? ' · ' : ''}{city}{city ? ` · ${4 + (seed * 3) % 22} mi away` : ''}
              </div>
            )}
            <div className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.16em', marginTop: 8 }}>♥ Matched · Thu, Mar 14</div>
          </div>

          <div>
            <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em', marginBottom: 8 }}>
              Their 15 variables <span style={{ color:'var(--rust)' }}>· ♥ = matched</span>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 5 }}>
              {(() => {
                // Build a set of matched field names from the `shared` array (reveal passes e.g. "Wants kids · Yes")
                const sharedSet = new Set(shared.map(s => (s.split(' · ')[0] || '').trim().toLowerCase()));
                // Also treat the first 4 traits as matched by default when no shared data is provided
                const fallback = new Set(['wants kids','smoking','zodiac','pets']);
                return traits.map(([field, value], i) => {
                  const isMatch = sharedSet.has(field.toLowerCase()) || (!shared.length && fallback.has(field.toLowerCase()));
                  return (
                    <span key={i} className="mono" style={{
                      fontSize: 10, padding:'4px 9px',
                      border: isMatch ? '1px solid var(--rust)' : '1px solid var(--line-strong)',
                      borderRadius: 2,
                      background: isMatch ? '#6B152010' : 'transparent',
                      color: isMatch ? 'var(--ink)' : 'var(--ink-2)'
                    }}>
                      {isMatch && <span style={{ color:'#FFFFFF', marginRight: 4 }}>{'\u2665'}</span>}
                      {field} <span style={{ color:'var(--ink-3)' }}>· {value}</span>
                    </span>
                  );
                });
              })()}
            </div>
          </div>

          <div>
            <div className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.16em', marginBottom: 8 }}>♥ Contact released</div>
            <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
              {channels.map(c => (
                <button key={c.key} onClick={(e) => { navigator.clipboard.writeText(c.handle); const el = e.currentTarget.querySelector('[data-copied]'); el.style.display='block'; setTimeout(() => el.style.display='none', 1500); }} style={{
                  display:'grid', gridTemplateColumns:'44px 1fr auto', alignItems:'center', gap: 10,
                  padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line-strong)', borderRadius: 2, textAlign:'left', cursor:'pointer', position:'relative'
                }}>
                  <span className="mono caps" style={{ fontSize: 9, color:'var(--rust)', letterSpacing:'0.14em' }}>{c.icon}</span>
                  <span className="mono" style={{ fontSize: 12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.handle}</span>
                  <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{c.label}</span>
                  <span data-copied style={{ display:'none', position:'absolute', top: -28, right: 0, padding:'4px 10px', background:'var(--ink)', color:'var(--cream)', fontFamily:'Lato, sans-serif', fontSize: 9, borderRadius: 2 }}>Copied!</span>
                </button>
              ))}
            </div>
          </div>

          {p.note && (
            <div style={{ padding:'12px 14px', background:'var(--paper-2)', borderLeft:'2px solid var(--rust)', borderRadius: 2 }}>
              <div className="mono caps" style={{ fontSize: 8, color:'var(--rust)', letterSpacing:'0.16em' }}>Your note from the call</div>
              <div className="serif" style={{ fontSize: 15, fontStyle:'italic', lineHeight: 1.4, marginTop: 4 }}>"{p.note}"</div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

window.FullProfilePopup = FullProfilePopup;
