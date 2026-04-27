// Shared log-out button — fixed to lower right of the viewport.
// Dropped into bio, prelobby, reveal, matches, and other post-login pages.
// Clicking sends the user back to the login screen and clears stray local state.

function LogoutButton({ dark = false }) {
  const handle = () => {
    try {
      localStorage.removeItem('lfs.chatSec');
      localStorage.removeItem('lfs.firstCallSec');
    } catch(e) {}
    if (window.__setView) window.__setView('login');
  };
  return (
    <button
      onClick={handle}
      className="mono caps"
      style={{
        display:'flex', marginLeft:'auto', marginRight: 24, marginTop: 48, marginBottom: 24,
        padding:'8px 14px',
        fontSize: 9, letterSpacing:'0.16em',
        background: dark ? '#111111' : 'var(--cream)',
        color: dark ? '#FFFFFF' : 'var(--ink)',
        border: `1px solid ${dark ? '#FFFFFF40' : 'var(--line-strong)'}`,
        borderRadius: 2,
        cursor:'pointer',
        alignItems:'center', gap: 6,
        boxShadow: '0 4px 12px -4px #00000020'
      }}
    >
      Log out
    </button>
  );
}

window.LogoutButton = LogoutButton;
