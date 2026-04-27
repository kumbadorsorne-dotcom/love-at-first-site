// Tweaks panel — floating, bottom-right.
// Controls the variation dimensions and pushes state back to host for persistence.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "verdictUI": "dial",
  "teaserBlur": "editorial",
  "callLayout": "split",
  "revealChoreo": "grid",
  "tier": "premium",
  "stateView": "quiz",
  "quizValidation": "on",
  "showNav": "on",
  "userType": "new"
}/*EDITMODE-END*/;

const TWEAK_OPTIONS = {
  theme: ['light','dark'],
  verdictUI: ['dial','tap','swipe'],
  teaserBlur: ['editorial','mosaic','ink','veil'],
  callLayout: ['split','pip','stage','mirror'],
  revealChoreo: ['grid','onebyone','gallery'],
  tier: ['free','premium'],
  quizValidation: ['on','off'],
  showNav: ['on','off'],
  userType: ['new','returning'],
  stateView: ['login','quiz','dashboard','bio','lobby','getready','circuit','verdict','reveal'],
};

const TWEAK_LABELS = {
  theme: 'Theme',
  verdictUI: 'Verdict UI',
  teaserBlur: 'Teaser blur',
  callLayout: 'Call layout',
  revealChoreo: 'Reveal',
  tier: 'Tier',
  quizValidation: 'Quiz limitations',
  showNav: 'Navigation',
  userType: 'User type',
  stateView: 'Screen',
};

function useTweaks() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [open, setOpen] = React.useState(false);
  const [available, setAvailable] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    setAvailable(true);
    // Toggle with keyboard shortcut (T key)
    const onKey = (e) => { if (e.key === 't' && !e.target.closest('input,textarea,[contenteditable]')) setOpen(o => !o); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('message', onMsg); window.removeEventListener('keydown', onKey); };
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
  }, [tweaks.theme]);

  const update = (k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      return next;
    });
  };

  return { tweaks, update, open, setOpen, available };
}

function TweaksPanel({ tweaks, update, open, setOpen }) {
  if (!open) return null;
  return (
    <div style={{
      position:'fixed', right: 24, bottom: 24, zIndex: 9999,
      background: 'var(--cream)', border:'1px solid var(--line-strong)',
      boxShadow:'0 30px 60px -20px #0A0A0A30, 0 8px 20px -8px #0A0A0A20',
      borderRadius: 4, padding: '18px 20px 16px', width: 300,
      fontFamily:'Lato, sans-serif', color:'var(--ink)'
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
        <div className="caps mono" style={{ fontSize: 10, color:'var(--ink-3)' }}>Tweaks · LaFS</div>
        <button onClick={() => setOpen(false)} style={{ fontSize: 18, color:'var(--ink-3)', lineHeight:1 }}>×</button>
      </div>
      {Object.keys(TWEAK_OPTIONS).map(key => (
        <div key={key} style={{ marginBottom: 12 }}>
          <div className="caps mono" style={{ fontSize: 9, color:'var(--ink-3)', marginBottom: 5, letterSpacing:'0.14em' }}>
            {TWEAK_LABELS[key]}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
            {TWEAK_OPTIONS[key].map(opt => {
              const active = tweaks[key] === opt;
              return (
                <button key={opt} onClick={() => update(key, opt)}
                  style={{
                    padding: '5px 9px', fontSize: 11, fontFamily:'Lato, sans-serif',
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--paper)' : 'var(--ink-2)',
                    border: `1px solid ${active ? 'var(--ink)' : 'var(--line-strong)'}`,
                    borderRadius: 99, cursor:'pointer', textTransform:'lowercase'
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop:'1px solid var(--line)', fontFamily:'Lato, sans-serif', fontSize: 13, color:'var(--ink-3)', fontStyle:'italic' }}>
        Toggle in the toolbar to hide.
      </div>
    </div>
  );
}

window.useTweaks = useTweaks;
window.TweaksPanel = TweaksPanel;
window.TWEAK_DEFAULTS = TWEAK_DEFAULTS;
