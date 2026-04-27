// PreLobby — preflight screen before joining the lobby queue.
// Layout: 2 columns. Premium sits directly under the headline (full width above the columns).
// T&C visually prioritized — large, central, required before Submit unlocks.

function PreLobbyView({ tweaks }) {
  const [agreed, setAgreed] = React.useState({ rules: false, locked: false, strikes: false, decorum: false });
  const [micFixed, setMicFixed] = React.useState(false);
  const preflightOk = micFixed; // all other checks are ok by default
  const allReady = agreed.rules && agreed.locked && agreed.strikes && agreed.decorum && preflightOk;
  const toggle = (k) => setAgreed(o => ({ ...o, [k]: !o[k] }));

  return (
    <div style={{ minHeight:'100vh', padding:'16px 36px 24px', maxWidth: 1280, margin:'0 auto' }}>
      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--line-strong)', paddingBottom: 10, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap: 16 }}>
          <span className="serif" style={{ fontSize: 26, letterSpacing:'-0.02em' }}>Love at First Site<span style={{ color:'var(--rust)' }}>.</span></span>
          <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em' }}>01 · Before you enter</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 4 }}>
            <span className="mono" style={{ fontSize: 11, color:'var(--ink-2)' }}>Marie D. · 29 · Brooklyn</span>
            <div style={{ display:'flex', gap: 6 }}>
              <button onClick={() => window.__setView && window.__setView('bio')}
                className="mono caps"
                style={{ fontSize: 9, letterSpacing:'0.14em', padding:'4px 8px', border:'1px solid var(--line-strong)', background:'var(--cream)', color:'var(--ink)', borderRadius: 2, cursor:'pointer' }}>
                View profile
              </button>
              <button onClick={() => window.__setView && window.__setView('matches')}
                className="mono caps"
                style={{ fontSize: 9, letterSpacing:'0.14em', padding:'4px 8px', border:'1px solid var(--line-strong)', background:'var(--cream)', color:'var(--ink)', borderRadius: 2, cursor:'pointer' }}>
                View previous matches
              </button>
            </div>
          </div>
          <button onClick={() => window.__setView && window.__setView('matches')} style={{ width: 36, height: 36, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)' }}>
            <Silhouette seed={2}/>
          </button>
        </div>
      </div>

      {/* Masthead */}
      <div style={{ marginBottom: 14 }}>
        <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em' }}>Read this. Not skimming. Reading.</div>
        <div className="serif" style={{ fontSize: 56, lineHeight: 0.95, letterSpacing:'-0.03em', marginTop: 6 }}>
          Before you <span style={{ fontStyle:'italic', color:'var(--rust)' }}>enter the lobby</span>.
        </div>
        <div className="serif" style={{ fontSize: 15, fontStyle:'italic', color:'var(--ink-2)', marginTop: 8, maxWidth: 820, lineHeight: 1.3 }}>
          Once you press Submit, you'll wait in the lobby until a pod of nine forms. After that there's no door. Eight calls. Five minutes each. Finish what you started.
        </div>
      </div>

      {/* Two columns: T&C (prioritized) · Profile review */}
      <div style={{ display:'grid', gridTemplateColumns:'1.35fr 1fr', gap: 24, alignItems:'start' }}>
        {/* 1. House Rules — prioritized */}
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 10, marginBottom: 2 }}>
            <span className="mono" style={{ fontSize: 10, color:'var(--rust)', letterSpacing:'0.14em' }}>REQUIRED</span>
            <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Tick every box — Submit stays locked until you do</span>
          </div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, letterSpacing:'-0.02em', marginBottom: 10 }}>
            The <span style={{ fontStyle:'italic', color:'var(--rust)' }}>pod rules.</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            <RuleRow n="I" checked={agreed.rules} onToggle={() => toggle('rules')}
              title="Eight calls, no escapes"
              body="Five minutes each, a two-minute verdict gap in between, and a five-minute refresh after call four. Leaving mid-circuit issues a strike."/>
            <RuleRow n="II" checked={agreed.locked} onToggle={() => toggle('locked')}
              title="Your profile is sealed"
              body="The 15 variables you set earlier are locked. If your life genuinely changes, file the Manual Contact Form."/>
            <RuleRow n="III" checked={agreed.strikes} onToggle={() => toggle('strikes')}
              title="Three strikes, then silence"
              body="Abandoning a pod is strike 1. Strike 2 is a 14-day shadowban. Strike 3 is the end."/>
            <RuleRow n="IV" checked={agreed.decorum} onToggle={() => toggle('decorum')}
              title="The Decorum Engine is watching"
              body="AI review runs live on every call. Reclining, face off-screen, screen-recording, indecorum, and background audio leaks all trigger pauses, mutes, strikes, or bans."/>
          </div>

          {/* Timing strip */}
          <div style={{ display:'flex', gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, padding:'10px 12px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', textAlign:'center' }}>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, color:'var(--ink)' }}>5:00</div>
              <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4 }}>Per call</div>
            </div>
            <div style={{ flex: 1, padding:'10px 12px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', textAlign:'center' }}>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, color:'var(--ink)' }}>2:00</div>
              <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4 }}>Verdict</div>
            </div>
            <div style={{ flex: 1, padding:'10px 12px', border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', textAlign:'center' }}>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, color:'var(--ink)' }}>5:00</div>
              <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4 }}>Refresh</div>
            </div>
            <div style={{ flex: 1, padding:'10px 12px', border:'1px solid var(--rust)', borderRadius: 2, background:'var(--cream)', textAlign:'center' }}>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1, color:'var(--rust)' }}>8</div>
              <div className="mono caps" style={{ fontSize: 8, color:'var(--rust)', letterSpacing:'0.14em', marginTop: 4 }}>Total calls</div>
            </div>
          </div>

          {/* Set-Up Checklist — hoverable chips with tooltips */}
          <div style={{ marginTop: 10, padding:'10px 12px', background:'var(--paper-2)', borderRadius: 2, border:'1px dotted var(--line-strong)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div className="caps mono" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em' }}>Set-Up Checklist · hover for detail</div>
              
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 6, marginTop: 6 }}>
              <PreflightChip label="Wi-Fi" ok tooltipTitle="Wi-Fi" tooltipBody="94 Mbps · signal strong."/>
              <PreflightChip label="78% charge" ok tooltipTitle="Battery · 78%" tooltipBody="Make sure you have enough charge to last the full circuit (≈45 min)."/>
              <PreflightChip label="Mic" ok={micFixed} warn={!micFixed} tooltipTitle={micFixed ? "Microphone is on" : "Microphone is off"} tooltipBody={micFixed ? "Mic is working." : "Go to settings to turn on your mic."} cta={micFixed ? null : "Toggle on"} onCta={() => setMicFixed(true)}/>
              <PreflightChip label="Cam" ok tooltipTitle="Camera" tooltipBody="Make sure your cam is working before the bell."/>
            </div>
          </div>

        </div>

        {/* Right column: Profile review + Premium / filters */}
        <div>
          {/* Profile review */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap: 10, marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 10, color:'var(--rust)', letterSpacing:'0.14em' }}>02</span>
              <span className="serif" style={{ fontSize: 20, letterSpacing:'-0.01em' }}>Review your profile</span>
            </div>
            <div style={{ border:'1px solid var(--line-strong)', borderRadius: 2, background:'var(--cream)', overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'72px 1fr', gap: 10, padding: 10 }}>
                <div style={{ width: 72, height: 88, borderRadius: 99, overflow:'hidden', border:'1px solid var(--line-strong)' }}>
                  <Silhouette seed={2}/>
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 19, lineHeight: 1 }}>Marie, <span style={{ fontStyle:'italic', color:'var(--ink-3)' }}>29</span></div>
                  <div className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.14em', marginTop: 4 }}>Brooklyn · Translator</div>
                  <div className="serif" style={{ fontSize: 12, fontStyle:'italic', color:'var(--ink-2)', marginTop: 5, lineHeight: 1.3 }}>
                    "Restores old radios. Too emotional at dog parks."
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PremiumUpsell tier={tweaks.tier}/>

          {/* Submit strip — moved under filters */}
          <div style={{
            marginTop: 12, padding:'14px 18px',
            border: allReady ? '2px solid var(--ink)' : '2px solid var(--line-strong)',
            borderRadius: 2, background: allReady ? 'var(--cream)' : 'transparent',
            display:'grid', gridTemplateColumns:'1fr auto', gap: 14, alignItems:'center'
          }}>
            <div>
              <div className="mono caps" style={{ fontSize: 9, color: allReady ? 'var(--rust)' : 'var(--ink-3)', letterSpacing:'0.16em' }}>
                {allReady ? '\u25c6 Ready. The lobby is waiting.' : `Check ${Object.values(agreed).filter(Boolean).length}/4 rules \u00b7 Fix ${micFixed ? 4 : 3}/4 Set-Up Checklist`}
              </div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1.02, marginTop: 2 }}>
                {allReady
                  ? <>Enter the <span style={{ fontStyle:'italic', color:'var(--rust)' }}>lobby.</span></>
                  : <>Check off the rules, then <span style={{ fontStyle:'italic', color:'var(--ink-3)' }}>click enter</span>.</>}
              </div>
            </div>
            <div style={{ position:'relative' }}
              onMouseEnter={(e) => { if (!allReady) e.currentTarget.querySelector('[data-lobby-tooltip]').style.display = 'block'; }}
              onMouseLeave={(e) => { e.currentTarget.querySelector('[data-lobby-tooltip]').style.display = 'none'; }}>
              <button
                disabled={!allReady}
                onClick={() => allReady && window.__setView && window.__setView('lobby')}
                style={{
                  padding:'12px 18px', minWidth: 180,
                  background: allReady ? 'var(--ink)' : 'var(--paper-2)',
                  color: allReady ? 'var(--paper)' : 'var(--ink-3)',
                  fontFamily:'Lato, sans-serif', fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
                  borderRadius: 2, cursor: allReady ? 'pointer' : 'not-allowed'
                }}>
                Enter lobby {'\u2192'}
              </button>
              <div data-lobby-tooltip style={{
                display:'none', position:'absolute', bottom:'calc(100% + 8px)', right: 0,
                width: 260, padding:'12px 14px',
                background:'var(--ink)', color:'var(--cream)', borderRadius: 2,
                boxShadow:'0 10px 24px -12px #00000060', zIndex: 60
              }}>
                <div className="mono caps" style={{ fontSize: 8, color:'var(--rust)', letterSpacing:'0.14em', marginBottom: 6 }}>Before you can enter:</div>
                {!agreed.rules && <div className="mono" style={{ fontSize: 9, color:'#FFFFFFB0', marginBottom: 3 }}>{'\u2022'} Agree to Rule I: Eight calls, no escapes</div>}
                {!agreed.locked && <div className="mono" style={{ fontSize: 9, color:'#FFFFFFB0', marginBottom: 3 }}>{'\u2022'} Agree to Rule II: Profile is sealed</div>}
                {!agreed.strikes && <div className="mono" style={{ fontSize: 9, color:'#FFFFFFB0', marginBottom: 3 }}>{'\u2022'} Agree to Rule III: Three strikes</div>}
                {!agreed.decorum && <div className="mono" style={{ fontSize: 9, color:'#FFFFFFB0', marginBottom: 3 }}>{'\u2022'} Agree to Rule IV: Decorum Engine</div>}
                {!preflightOk && <div className="mono" style={{ fontSize: 9, color:'var(--rust)', marginBottom: 3 }}>{'\u2022'} Fix set-up checklist: turn on microphone</div>}
                <div style={{ position:'absolute', top:'100%', right: 20, width: 0, height: 0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'6px solid var(--ink)' }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutButton/>
    </div>
  );
}

function RuleRow({ n, checked, onToggle, title, body }) {
  return (
    <button onClick={onToggle} style={{
      textAlign:'left', padding:'10px 14px',
      background: checked ? 'var(--cream)' : 'transparent',
      border: `1px solid ${checked ? 'var(--ink)' : 'var(--line-strong)'}`,
      borderRadius: 2, display:'grid', gridTemplateColumns:'24px 22px 1fr', gap: 10, alignItems:'start'
    }}>
      <span className="serif" style={{ fontSize: 18, lineHeight: 1, color: checked ? 'var(--rust)' : 'var(--ink-3)', fontStyle:'italic' }}>{n}</span>
      <div style={{
        width: 18, height: 18, marginTop: 1, borderRadius: 2,
        background: checked ? 'var(--rust)' : 'transparent',
        border: `1px solid ${checked ? 'var(--rust)' : 'var(--line-strong)'}`,
        color: 'var(--cream)', fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center'
      }}>{checked ? '✓' : ''}</div>
      <div>
        <div className="serif" style={{ fontSize: 15, lineHeight: 1.1 }}>{title}</div>
        <div className="mono" style={{ fontSize: 10, color:'var(--ink-2)', marginTop: 3, lineHeight: 1.45 }}>{body}</div>
      </div>
    </button>
  );
}

function PremiumUpsell({ tier }) {
  const isPremium = tier === 'premium';
  return (
    <div style={{
      padding:'14px 16px',
      background: isPremium ? 'var(--cream)' : 'var(--ink)',
      color: isPremium ? 'var(--ink)' : 'var(--cream)',
      border: isPremium ? '1px solid var(--line-strong)' : '1px solid var(--ink)',
      borderRadius: 2, position:'relative', overflow:'hidden',
      display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 14, alignItems:'center'
    }}>
      <svg style={{ position:'absolute', right:-40, top:-40, opacity: 0.08 }} width="220" height="220" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke={isPremium ? 'var(--ink)' : 'var(--paper)'} strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="30" stroke={isPremium ? 'var(--ink)' : 'var(--paper)'} strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="20" stroke={isPremium ? 'var(--ink)' : 'var(--paper)'} strokeWidth="0.5"/>
        <path d="M50 8 L50 92 M8 50 L92 50" stroke={isPremium ? 'var(--ink)' : 'var(--paper)'} strokeWidth="0.5"/>
      </svg>

      <div>
        <div className="mono caps" style={{ fontSize: 9, color: isPremium ? '#FFFFFF' : '#E8C9A880', letterSpacing:'0.16em' }}>
          {isPremium ? 'Premium is active' : 'Upgrade available'}
        </div>
        <div className="serif" style={{ fontSize: 22, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 4 }}>
          {isPremium
            ? <>Heartbreaker Filters <span style={{ fontStyle:'italic', color:'var(--rust)' }}>on.</span></>
            : <>Activate to get the following <span style={{ fontStyle:'italic' }}>benefits.</span></>}
        </div>
        <ul style={{ listStyle:'none', padding: 0, margin:'8px 0 0', display:'flex', flexDirection:'column', gap: 3 }}>
          <li className="mono" style={{ fontSize: 9, color: isPremium ? 'var(--ink-2)' : '#FFFFFFB0', lineHeight: 1.4 }}>{'\u2665'} You will enter pods based on your deal breakers</li>
          <li className="mono" style={{ fontSize: 9, color: isPremium ? 'var(--ink-2)' : '#FFFFFFB0', lineHeight: 1.4 }}>{'\u2665'} You can go through endless circuits</li>
          <li className="mono" style={{ fontSize: 9, color: isPremium ? 'var(--ink-2)' : '#FFFFFFB0', lineHeight: 1.4 }}>{'\u2665'} Can provide a hint that you're interested after each call</li>
        </ul>
      </div>

      <div style={{ textAlign:'right', position:'relative' }}>
        {!isPremium ? (
          <>
            <div style={{ display:'flex', alignItems:'baseline', gap: 4, justifyContent:'flex-end' }}>
              <span className="serif" style={{ fontSize: 28, lineHeight: 1 }}>$20</span>
              <span className="mono" style={{ fontSize: 10, color:'#FFFFFFB0' }}>/ mo</span>
            </div>
            <button style={{
              marginTop: 6, padding:'8px 14px', background:'var(--rust)', color:'var(--cream)',
              fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius: 2
            }}>
              Upgrade →
            </button>
          </>
        ) : (
          <>
            <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.14em' }}>Renews</div>
            <div className="serif" style={{ fontSize: 16, marginTop: 2 }}>May 18 · $20</div>
          </>
        )}
      </div>
    </div>
  );
}

function PreLobbyDecorumCard() {
  const flags = [
    { label:'Reclining / lying down',        note:'Pause · strike' },
    { label:'Face not visible',              note:'Pause after 10s' },
    { label:'Screen recording detected',     note:'Call ends · ban' },
    { label:'Indecorum',                     note:'Auto-report' },
    { label:'Background audio leak',         note:'Mic muted · warning' },
  ];
  return (
    <div style={{ marginTop: 22, padding:'20px 22px', border:'1px solid var(--ink)', borderRadius: 2, background:'var(--cream)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <span className="caps mono" style={{ fontSize: 10, letterSpacing:'0.16em', color:'var(--ink-3)' }}>04 · Decorum Engine</span>
        <span className="caps mono" style={{ fontSize: 10, letterSpacing:'0.16em', color:'var(--rust)' }}>
          <span style={{ display:'inline-block', width: 6, height: 6, borderRadius: 99, background:'var(--rust)', marginRight: 6, verticalAlign:'middle', animation:'pulse 1.2s infinite' }}/>
          Arms at the bell
        </span>
      </div>

      <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 10, letterSpacing:'-0.01em' }}>
        AI vision <span style={{ fontStyle:'italic' }}>watches the room.</span>
      </div>
      <div className="serif" style={{ fontSize: 15, fontStyle:'italic', color:'var(--ink-2)', marginTop: 8, lineHeight: 1.4, maxWidth: 520 }}>
        These behaviors get flagged automatically. No human is on the call — the model is.
      </div>

      {/* Strike meter */}
      <div style={{ marginTop: 16, padding:'12px 14px', background:'var(--paper-2)', borderRadius: 2 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <span className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em' }}>Your strike count</span>
          <span className="mono" style={{ fontSize: 10, color:'var(--ink-3)' }}>0 of 3</span>
        </div>
        <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
          {[['Warning',1],['14-day ban',2],['Deleted',3]].map(([label, n]) => (
            <div key={n} style={{
              flex: 1, padding:'8px 6px', borderRadius: 2,
              border:'1px dashed var(--line-strong)',
              color:'var(--ink-3)', textAlign:'center'
            }}>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1, fontStyle:'italic' }}>{n}</div>
              <div className="mono" style={{ fontSize: 8, letterSpacing:'0.14em', textTransform:'uppercase', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div style={{ marginTop: 14 }}>
        <div className="mono caps" style={{ fontSize: 9, color:'var(--ink-3)', letterSpacing:'0.16em', marginBottom: 8 }}>Flags · auto-triggered</div>
        <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
          {flags.map((f, i) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'auto 1fr auto', gap: 10, alignItems:'center',
              padding:'8px 10px', border:'1px solid var(--line-strong)', borderLeft:'3px solid var(--rust)', borderRadius: 2, background:'var(--paper-2)'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background:'var(--rust)' }}/>
              <span className="serif" style={{ fontSize: 14, lineHeight: 1.2 }}>{f.label}</span>
              <span className="mono caps" style={{ fontSize: 8, color:'var(--ink-3)', letterSpacing:'0.14em' }}>{f.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.PreLobbyView = PreLobbyView;

function PreflightChip({ label, ok, warn, tooltipTitle, tooltipBody, cta, onCta }) {
  const [open, setOpen] = React.useState(false);
  const bad = warn && !ok;
  const color = bad ? 'var(--rust)' : 'var(--ink)';
  const borderC = bad ? 'var(--rust)' : 'var(--line-strong)';
  const bg = bad ? '#6B152010' : 'var(--cream)';
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      style={{ position:'relative' }}
    >
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
        padding:'8px 6px',
        border:`1px solid ${borderC}`,
        borderRadius: 2,
        background: bg,
        cursor:'help',
        transition:'all .2s'
      }}>
        {bad && (
          <svg width="14" height="12" viewBox="0 0 24 22" fill="none" aria-hidden>
            <path d="M12 1L23 21H1L12 1Z" stroke="var(--rust)" strokeWidth="2" strokeLinejoin="round" fill="#6B152030"/>
            <rect x="11" y="8" width="2" height="6" fill="var(--rust)"/>
            <rect x="11" y="16" width="2" height="2" fill="var(--rust)"/>
          </svg>
        )}
        <span className="mono caps" style={{ fontSize: 9, letterSpacing:'0.14em', color }}>
          {label} {bad ? '⚠' : '✓'}
        </span>
      </div>
      {open && (
        <div role="tooltip" style={{
          position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)',
          width: 200, padding:'10px 12px',
          background:'var(--ink)', color:'var(--cream)',
          border:'1px solid var(--ink)', borderRadius: 2,
          boxShadow:'0 10px 24px -12px #00000080',
          zIndex: 60, pointerEvents: cta ? 'auto' : 'none',
          animation:'fade .15s ease'
        }}>
          <div className="mono caps" style={{ fontSize: 9, color: bad ? 'var(--rust)' : '#FFFFFFB0', letterSpacing:'0.16em', marginBottom: 4 }}>
            {tooltipTitle}
          </div>
          <div className="serif" style={{ fontSize: 14, fontStyle:'italic', lineHeight: 1.3 }}>
            {tooltipBody}
          </div>
          {cta && (
            <button
              onClick={(e) => { e.stopPropagation(); onCta && onCta(); }}
              className="mono caps"
              style={{
                marginTop: 8, padding:'6px 10px',
                fontSize: 9, letterSpacing:'0.16em',
                background:'var(--rust)', color:'var(--cream)',
                border:'1px solid var(--rust)', borderRadius: 2, cursor:'pointer'
              }}
            >
              {cta} →
            </button>
          )}
          {/* arrow */}
          <div style={{
            position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
            width: 0, height: 0,
            borderLeft:'6px solid transparent',
            borderRight:'6px solid transparent',
            borderTop:'6px solid var(--ink)'
          }}/>
        </div>
      )}
    </div>
  );
}