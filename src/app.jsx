// App shell — routes between states based on tweaks.stateView

function App() {
  const { tweaks, update, open, setOpen, available } = useTweaks();
  React.useEffect(() => { window.__setView = (s) => update('stateView', s); }, [update]);

  const views = {
    login: <LoginView tweaks={tweaks}/>,
    dashboard: <DashboardView tweaks={tweaks}/>,
    quiz: <QuizView tweaks={tweaks}/>,
    bio: <BioView tweaks={tweaks}/>,
    lobby: <LobbyView tweaks={tweaks}/>,
    getready: <GetReadyView tweaks={tweaks}/>,
    'prep-notify': <GetReadyNotifyView tweaks={tweaks}/>,
    circuit: <CircuitView tweaks={tweaks}/>,
    verdict: <VerdictView tweaks={tweaks}/>,
    reveal: <RevealView tweaks={tweaks}/>,
    premium: <PremiumView tweaks={tweaks}/>,
  };

  return (
    <div data-screen-label={`${tweaks.stateView}`} style={{ fontFamily:'Lato, sans-serif' }}>
      {views[tweaks.stateView] || views.lobby}

      {/* State switcher */}
      <div style={{ position:'fixed', left: 24, bottom: 24, zIndex: 9998, display: tweaks.showNav === 'off' ? 'none' : 'flex', gap: 4, padding: 6, background:'var(--cream)', border:'1px solid var(--line-strong)', borderRadius: 99, boxShadow:'0 8px 20px -10px #0A0A0A30' }}>
        {['login','quiz','dashboard','bio','lobby','getready','prep-notify','circuit','verdict','reveal','premium'].map(s => {
          const label = s === 'getready' ? 'prep room' : s;
          return (
          <button key={s} onClick={() => update('stateView', s)} style={{
            padding:'6px 12px', fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.12em', textTransform:'uppercase',
            background: tweaks.stateView === s ? 'var(--ink)' : 'transparent',
            color: tweaks.stateView === s ? 'var(--paper)' : 'var(--ink-2)',
            borderRadius: 99, cursor:'pointer'
          }}>{label}</button>);
        })}
      </div>

      {/* Tweaks toggle button — fixed bottom-right */}
      <button onClick={() => setOpen(o => !o)} style={{
        position:'fixed', right: 24, bottom: open ? 'calc(100%)' : 24, zIndex: 10000,
        display: open ? 'none' : 'flex', alignItems:'center', gap: 6,
        padding:'8px 14px', background:'var(--ink)', color:'var(--paper)',
        fontFamily:'Lato, sans-serif', fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
        borderRadius: 99, boxShadow:'0 8px 20px -10px #0A0A0A40', cursor:'pointer', border:'none'
      }}>
        <span style={{ fontSize: 14 }}>⚙</span> Tweaks
      </button>

      <TweaksPanel tweaks={tweaks} update={update} open={open} setOpen={setOpen}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
