// Premium — upgrade page highlighting benefits of premium tier.

function PremiumView({ tweaks }) {
  const [hoveredPlan, setHoveredPlan] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState('monthly');

  const benefits = [
    { title: 'Your dealbreakers matter', desc: 'Pods curated around what matters to you.', free: 'Random pods', icon: '\u2665' },
    { title: 'Endless circuits', desc: 'Unlimited circuits, anytime you want.', free: '2 per day', icon: '\u221E' },
    { title: 'Send a signal', desc: 'Hint you are interested right after the call.', free: 'No signals', icon: '\u2764' },
    { title: 'Priority seating', desc: 'You fill pods first when demand is high.', free: 'Queue-based', icon: '\u2606' },
    { title: 'Extra dealbreakers', desc: 'Up to 6 slots instead of 3.', free: '3 max', icon: '+' },
    { title: 'Match insights', desc: 'See compatibility before each call.', free: 'No insights', icon: '\u2197' },
  ];

  const plans = [
    { id: 'weekly', label: 'Weekly', price: '$9.99', period: '/week', note: 'Cancel anytime' },
    { id: 'monthly', label: 'Monthly', price: '$24.99', period: '/month', note: 'Most popular', badge: true },
    { id: 'yearly', label: 'Yearly', price: '$149.99', period: '/year', note: 'Save 50%' },
  ];

  return (
    <div style={{ height: '100vh', background: '#FFFFFF', display: 'flex', overflow: 'hidden' }}>

      {/* LEFT — Hero + Benefits */}
      <div style={{ flex: '1 1 55%', padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Header */}
        <div>
          <div className="mono caps" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#800120', marginBottom: 10 }}>Premium</div>
          <div className="serif" style={{ fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
            Every call could be<br/><span style={{ fontStyle: 'italic', color: '#800120' }}>the one.</span>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 10, maxWidth: 400, lineHeight: 1.55 }}>
            Premium removes the limits and puts you in the right rooms. Better pods, more circuits, real signals.
          </div>
        </div>

        {/* Benefits — 2x3 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginTop: 32 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#800120', color: '#FFFFFF', borderRadius: 2, fontSize: 13, fontFamily: 'Lato, sans-serif'
              }}>{b.icon}</div>
              <div>
                <div className="serif" style={{ fontSize: 13, lineHeight: 1.2 }}>{b.title}</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', lineHeight: 1.45, marginTop: 2 }}>{b.desc}</div>
                <div className="mono" style={{ fontSize: 8, color: '#AAAAAA', marginTop: 2 }}>Free: {b.free}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line-strong)' }}>
          <div className="serif" style={{ fontSize: 14, fontStyle: 'italic', lineHeight: 1.4, color: 'var(--ink)', maxWidth: 400 }}>
            "I matched with my partner on my first Premium circuit. Dealbreaker matching actually works."
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 6, letterSpacing: '0.08em' }}>
            -- Jordan, 29, Brooklyn
          </div>
        </div>
      </div>

      {/* RIGHT — Dark panel with plans */}
      <div style={{
        flex: '1 1 45%', background: '#0A0A0A', padding: '48px 44px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>

        <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center' }}>
          Choose your plan
        </div>
        <div className="mono" style={{ fontSize: 10, color: '#FFFFFF60', marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
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
                  padding: '16px 20px', borderRadius: 2, cursor: 'pointer',
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
                    fontSize: 7, letterSpacing: '0.14em', borderRadius: 99
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
                    <div className="mono caps" style={{ fontSize: 10, letterSpacing: '0.14em' }}>{p.label}</div>
                    <div className="mono" style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>{p.note}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{p.price}</span>
                  <span className="mono" style={{ fontSize: 9, opacity: 0.5 }}>{p.period}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison mini-table */}
        <div style={{ marginTop: 24, padding: '14px 16px', background: '#1A1A1A', borderRadius: 2 }}>
          <div className="mono caps" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#FFFFFF40', marginBottom: 10 }}>Premium vs. Free</div>
          {[
            ['Pod matching', 'Dealbreaker-based', 'Random'],
            ['Circuits', 'Unlimited', '2/day'],
            ['Signals', 'Send a hint', 'None'],
            ['Dealbreakers', 'Up to 6', '3 max'],
          ].map(([feature, prem, free], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: i > 0 ? '1px solid #FFFFFF08' : 'none' }}>
              <div className="mono" style={{ fontSize: 9, color: '#FFFFFF', flex: '1 1 30%', textAlign: 'left' }}>{'\u2665'} {prem}</div>
              <div className="mono" style={{ fontSize: 9, color: '#FFFFFF60', flex: '1 1 40%', textAlign: 'center' }}>{feature}</div>
              <div className="mono" style={{ fontSize: 9, color: '#FFFFFF30', flex: '1 1 30%', textAlign: 'right' }}>{free}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            marginTop: 24, width: '100%', padding: '14px', background: '#800120', color: '#FFFFFF',
            fontFamily: 'Lato, sans-serif', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            borderRadius: 2, border: 'none', cursor: 'pointer', fontWeight: 700,
            transition: 'all .2s ease'
          }}
          onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
        >
          Upgrade to Premium
        </button>
        <div className="mono" style={{ fontSize: 9, color: '#FFFFFF', marginTop: 10, textAlign: 'center' }}>
          No commitment. Just better dates.
        </div>

        {/* Back link */}
        <button
          onClick={() => window.__setView && window.__setView('dashboard')}
          style={{
            marginTop: 16, padding: '8px', background: '#333333', color: '#FFFFFF',
            fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            borderRadius: 2, border: '1px solid #FFFFFF12', cursor: 'pointer', width: '100%'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
