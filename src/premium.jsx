// Premium — upgrade page highlighting benefits of premium tier.

function PremiumView({ tweaks }) {
  const [hoveredPlan, setHoveredPlan] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState('monthly');

  const benefits = [
    { title: 'Your dealbreakers matter', desc: 'You are moved into curated pods with people who align with your interests.', free: 'Random pods', icon: '\u2665' },
    { title: 'Endless circuits', desc: 'Join as many circuits as you like, whenever you\'re ready.', free: 'Only 2 per day', icon: '\u221E' },
    { title: 'Send a hint', desc: 'At the end of a call when it\'s time to make a decision, you can send a hint that you are interested.', free: 'No signals', icon: '\u2764' },
  ];

  const plans = [
    { id: 'weekly', label: 'Weekly', price: '$9.99', period: '/week', note: 'Cancel anytime' },
    { id: 'monthly', label: 'Monthly', price: '$24.99', period: '/month', note: 'Most popular', badge: true },
    { id: 'yearly', label: 'Yearly', price: '$149.99', period: '/year', note: 'Save 50%' },
  ];

  return (
    <div style={{ height: '100vh', background: '#FFFFFF', display: 'flex' }}>

      {/* LEFT — Hero + Benefits */}
      <div style={{ flex: '1 1 55%', padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>

        {/* Header */}
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 12, marginBottom: 10 }}>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.02em' }}>
              <span style={{ fontStyle:'italic' }}>Love</span> at First Site
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>Premium</div>
          </div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
            Every call could be<br/><span style={{ fontStyle: 'italic', color: '#800120' }}>the one.</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: '#8f8f8f', marginTop: 10, maxWidth: 440, lineHeight: 1.5 }}>
            Premium removes the barriers to finding your person. Move into more intentional pods, enjoy more circuits, and send the right signals from the start.
          </div>
        </div>

        {/* Benefits — 2x3 grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#800120', color: '#FFFFFF', borderRadius: 10, fontSize: 12, fontFamily: 'Lato, sans-serif'
              }}>{b.icon}</div>
              <div>
                <div className="serif" style={{ fontSize: 12, lineHeight: 1.1 }}>{b.title}</div>
                <div className="mono" style={{ fontSize: 12, color: '#8f8f8f', lineHeight: 1.35, marginTop: 2 }}>{b.desc}</div>
                <div className="mono" style={{ fontSize: 12, color: '#8f8f8f', marginTop: 2 }}>Free: {b.free}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling testimonials */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line-strong)', overflow: 'hidden' }}>
          <div className="mono caps" style={{ fontSize: 12, letterSpacing: '0.12em', color: '#8f8f8f', marginBottom: 12 }}>Real matches, real stories</div>
          <div style={{ display: 'flex', animation: 'marq 20s linear infinite', gap: 24 }}>
            {[
              { quote: "I matched with my partner on my first Premium circuit. Dealbreaker matching actually works.", name: 'Jordan', age: 29, city: 'Brooklyn', seed1: 2, seed2: 6 },
              { quote: "We both said yes after Date 3. Four months later, we moved in together.", name: 'Priya & Wren', age: 28, city: 'Chicago', seed1: 5, seed2: 8 },
              { quote: "I was skeptical about five minutes. Turns out that's all it takes to know.", name: 'Theo', age: 32, city: 'Boston', seed1: 4, seed2: 3 },
              { quote: "The dealbreaker filter meant every date felt intentional. No wasted time.", name: 'Nadia & Kai', age: 34, city: 'Savannah', seed1: 10, seed2: 11 },
              { quote: "I matched with my partner on my first Premium circuit. Dealbreaker matching actually works.", name: 'Jordan', age: 29, city: 'Brooklyn', seed1: 2, seed2: 6 },
              { quote: "We both said yes after Date 3. Four months later, we moved in together.", name: 'Priya & Wren', age: 28, city: 'Chicago', seed1: 5, seed2: 8 },
            ].map((t, i) => (
              <div key={i} style={{ minWidth: 240, flexShrink: 0, padding: '14px 16px', background: 'var(--paper-2)', borderRadius: 10, border: '1px solid var(--line-strong)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 99, overflow: 'hidden', border: '2px solid #800120', position: 'relative' }}>
                    <Silhouette seed={t.seed1}/>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 99, overflow: 'hidden', border: '2px solid #800120', position: 'relative', marginLeft: -14 }}>
                    <Silhouette seed={t.seed2}/>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="mono caps" style={{ fontSize: 12, color: '#800120', letterSpacing: '0.08em' }}>{'\u2665'} Matched</span>
                  </div>
                </div>
                <div className="serif" style={{ fontSize: 14, fontStyle: 'italic', lineHeight: 1.3, color: 'var(--ink)' }}>
                  "{t.quote}"
                </div>
                <div className="mono" style={{ fontSize: 12, color: '#8f8f8f', marginTop: 8, letterSpacing: '0.08em' }}>
                  {t.name}, {t.age} {'\u00b7'} {t.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Dark panel with plans */}
      <div style={{
        flex: '1 1 45%', background: '#0A0A0A', padding: '36px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        overflowY: 'auto'
      }}>

        <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center' }}>
          Choose your plan
        </div>
        <div className="mono" style={{ fontSize: 12, color: '#8f8f8f', marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
          All plans include every feature. Cancel anytime.
        </div>

        {/* Plan cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
          {plans.map(p => {
            const active = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                onMouseEnter={() => setHoveredPlan(p.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{
                  padding: '16px 20px', borderRadius: 10, cursor: 'pointer',
                  border: active ? '2px solid #800120' : '1px solid #FFFFFF1A',
                  background: active ? '#800120' : '#1A1A1A',
                  color: '#FFFFFF',
                  transition: 'all .2s ease',
                  transform: hoveredPlan === p.id ? 'translateY(-1px)' : 'translateY(0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {p.badge && (
                  <div className="mono caps" style={{
                    position: 'absolute', top: -8, right: 16,
                    padding: '2px 10px', background: '#FFFFFF',
                    color: '#800120',
                    fontSize: 12, letterSpacing: '0.12em', borderRadius: 99
                  }}>Most Popular</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 99,
                    border: active ? '2px solid #FFFFFF' : '1px solid #FFFFFF40',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {active && <div style={{ width: 8, height: 8, borderRadius: 99, background: '#FFFFFF' }}/>}
                  </div>
                  <div>
                    <div className="mono caps" style={{ fontSize: 12, letterSpacing: '0.12em' }}>{p.label}</div>
                    <div className="mono" style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{p.note}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{p.price}</span>
                  <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>{p.period}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison chart — two columns */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 10, overflow: 'hidden' }}>
          {/* Premium column */}
          <div style={{ background: '#800120' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #FFFFFF1A' }}>
              <div className="mono caps" style={{ fontSize: 12, color: '#FFFFFF', letterSpacing: '0.12em', fontWeight: 700 }}>Premium</div>
            </div>
            {[
              { label: 'Pod matching', value: 'Curated by dealbreakers' },
              { label: 'Circuits', value: 'Unlimited' },
              { label: 'Signals', value: 'Send a hint' },
              { label: 'Dealbreakers', value: 'Up to 6' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #FFFFFF1A' }}>
                <div className="mono" style={{ fontSize: 12, color: '#FFFFFFB0' }}>{r.label}</div>
                <div style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Lato', fontWeight: 600, marginTop: 2 }}>{'\u2665'} {r.value}</div>
              </div>
            ))}
          </div>
          {/* Free column */}
          <div style={{ background: '#1A1A1A' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #FFFFFF08' }}>
              <div className="mono caps" style={{ fontSize: 12, color: '#8f8f8f', letterSpacing: '0.12em' }}>Free</div>
            </div>
            {[
              { label: 'Pod matching', value: 'Random' },
              { label: 'Circuits', value: '2 per day' },
              { label: 'Signals', value: 'None' },
              { label: 'Dealbreakers', value: '3 max' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #FFFFFF08' }}>
                <div className="mono" style={{ fontSize: 12, color: '#8f8f8f' }}>{r.label}</div>
                <div style={{ fontSize: 14, color: '#8f8f8f', fontFamily: 'Lato', marginTop: 2 }}>{r.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mono" style={{ fontSize: 12, color: '#FFFFFF', marginTop: 24, marginBottom: 10, textAlign: 'center' }}>
          No commitment. Just better dates.
        </div>
        <button
          style={{
            width: '100%', padding: '14px', background: '#800120', color: '#FFFFFF',
            fontFamily: 'Lato, sans-serif', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700,
            transition: 'all .2s ease'
          }}
          onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
        >
          Upgrade to Premium
        </button>

        {/* Back link */}
        <button
          onClick={() => window.__setView && window.__setView('dashboard')}
          style={{
            marginTop: 16, padding: '8px', background: '#333333', color: '#FFFFFF',
            fontFamily: 'Lato, sans-serif', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            borderRadius: 10, border: '1px solid #FFFFFF12', cursor: 'pointer', width: '100%'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
