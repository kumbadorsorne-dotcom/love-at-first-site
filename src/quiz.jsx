// Quiz — 4 pages: About Me, Preferences & Interests, Dealbreakers, How It Works

const QUIZ_DEALBREAKERS = [
  { key:'education',  label:'Education',      options:['High school','In college','Bachelor','Trade school','In grad school','Masters','PhD'], section:'A', dropdown: true, any:'Any background' },
  { key:'smoking',    label:'Smoking',        options:['Socially','Regularly','Trying to quit','Never'],             section:'A', any:'No preference' },
  { key:'drinking',   label:'Drinking',       options:['Socially','Often','Never'],                                  section:'A', any:'No preference' },
  { key:'children',   label:'Children',       options:['I want children','I don\'t want children','I have children and want more','I have children and don\'t want more','Not sure yet'], section:'A', dropdown: true, any:'Open to all' },
  { key:'cannabis',   label:'Cannabis',       options:['Yes','Occasionally','Socially','Never'],                     section:'A', any:'No preference' },
  { key:'diet',       label:'Diet',           options:['Omnivore','Vegetarian','Vegan','Pescatarian','Keto','Halal','Kosher','Other'], section:'A', dropdown: true, any:'No restrictions' },
  { key:'gender',     label:'Interested in',  options:['Women','Men','Beyond binary'],                               section:'A', any:'Open to all' },
  { key:'religion',   label:'Religion',       options:['Agnostic','Atheist','Buddhist','Catholic','Christian','Hindu','Jewish','Muslim','Sikh','Spiritual','Other'], section:'A', dropdown: true, any:'Open-minded' },
  { key:'politics',   label:'Politics',       options:['Liberal','Moderate','Conservative','Apolitical','Other'],    section:'A', dropdown: true, any:'Open-minded' },
  { key:'zodiac',     label:'Zodiac',         options:['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'], section:'A', dropdown: true, any:'Any sign' },
  { key:'pets',       label:'Pets',           options:['Dog','Cat','Bird','Fish','Reptile'],                         section:'B', multi: true, any:'No preference' },
  { key:'workout',    label:'Workout', options:['Daily','Weekly','Rarely','Never'],                           section:'B', any:'Not a factor' },
  { key:'love_style', label:'Love style',     options:['Verbal','Touch','Gifts','Time','Service'],                   section:'B', any:'No preference' },
  { key:'travel',     label:'Travel',         options:['Constantly','Yearly','Rarely','Homebody'],                   section:'B', any:'Not a factor' },
  { key:'sleep',      label:'Sleep',          options:['Early bird','Night owl','No preference'],                         section:'B', any:'Flexible' },
  { key:'conflict',   label:'Conflict style', options:['Direct','Cool-off','Avoider','Negotiator'],                  section:'B', any:'Not a factor' },
  { key:'socialBattery', label:'Social Battery', options:['Introvert','Extrovert','Ambivert','Social Butterfly','Lone Wolf'], section:'B', any:'No preference' },
];

const CITIES = ['New York, NY','Los Angeles, CA','Chicago, IL','Houston, TX','Phoenix, AZ','Philadelphia, PA','San Antonio, TX','San Diego, CA','Dallas, TX','San Jose, CA','Austin, TX','Jacksonville, FL','Fort Worth, TX','Columbus, OH','Charlotte, NC','Indianapolis, IN','San Francisco, CA','Seattle, WA','Denver, CO','Nashville, TN','Oklahoma City, OK','Portland, OR','Las Vegas, NV','Memphis, TN','Louisville, KY','Baltimore, MD','Milwaukee, WI','Albuquerque, NM','Tucson, AZ','Fresno, CA','Sacramento, CA','Atlanta, GA','Raleigh, NC','Miami, FL','Oakland, CA','Minneapolis, MN','Tampa, FL','New Orleans, LA','Cleveland, OH','Pittsburgh, PA','Cincinnati, OH','Orlando, FL','Brooklyn, NY','Boston, MA','Detroit, MI','El Paso, TX','Madison, WI','Boise, ID','Richmond, VA','Spokane, WA','Salt Lake City, UT','Birmingham, AL','Providence, RI','Charleston, SC','Savannah, GA','Asheville, NC','Honolulu, HI'];

const ZODIAC_ICONS = {
  Aries:'\u2648', Taurus:'\u2649', Gemini:'\u264A', Cancer:'\u264B',
  Leo:'\u264C', Virgo:'\u264D', Libra:'\u264E', Scorpio:'\u264F',
  Sagittarius:'\u2650', Capricorn:'\u2651', Aquarius:'\u2652', Pisces:'\u2653'
};

function getZodiac(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const m = d.getMonth() + 1, day = d.getDate();
  if ((m===1&&day>=20)||(m===2&&day<=18)) return 'Aquarius';
  if ((m===2&&day>=19)||(m===3&&day<=20)) return 'Pisces';
  if ((m===3&&day>=21)||(m===4&&day<=19)) return 'Aries';
  if ((m===4&&day>=20)||(m===5&&day<=20)) return 'Taurus';
  if ((m===5&&day>=21)||(m===6&&day<=20)) return 'Gemini';
  if ((m===6&&day>=21)||(m===7&&day<=22)) return 'Cancer';
  if ((m===7&&day>=23)||(m===8&&day<=22)) return 'Leo';
  if ((m===8&&day>=23)||(m===9&&day<=22)) return 'Virgo';
  if ((m===9&&day>=23)||(m===10&&day<=22)) return 'Libra';
  if ((m===10&&day>=23)||(m===11&&day<=21)) return 'Scorpio';
  if ((m===11&&day>=22)||(m===12&&day<=21)) return 'Sagittarius';
  return 'Capricorn';
}

function QuizView({ tweaks }) {
  const [page, setPage] = React.useState(0);
  const [showPremiumPopup, setShowPremiumPopup] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);
  const quizHeroRef = React.useRef(null);
  React.useEffect(() => {
    if (page !== 3) return;
    const el = quizHeroRef.current;
    if (!el) return;
    const spawn = () => {
      const heart = document.createElement('span');
      heart.textContent = '\u2665';
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 16;
      const dur = 3 + Math.random() * 3;
      const delay = Math.random() * 0.5;
      Object.assign(heart.style, {
        position:'absolute', bottom:'0', left: left + '%',
        fontSize: size + 'px', color:'#800120',
        opacity:'0', pointerEvents:'none', zIndex:'0',
        animation: 'heartFloat ' + dur + 's ' + delay + 's ease-out forwards'
      });
      el.appendChild(heart);
      setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, (dur + delay) * 1000 + 200);
    };
    const id = setInterval(spawn, 600);
    return () => clearInterval(id);
  }, [page]);
  const totalPages = 4;
  const [values, setValues] = React.useState(() => {
    try { const saved = localStorage.getItem('lfs.quiz'); if (saved) return JSON.parse(saved); } catch {}
    return {
    smoking:'', drinking:'', kids:'', religion:'',
    politics:'', zodiac:'', pets:'', workout:'',
    education:'', diet:'', love_style:'',
    family:'', travel:'', sleep:'', conflict:'',
    location:'', radius: 50,
    bio:'',
    ig:'', phone:'', facebook:'', twitter:'',
    birthday:'', age:'', height:'', job:'',
    gender:'', interested:'', ethnicity:'',
    edu:'', faith:'', politics2:'', children:'',
    drinking2:'', smoking2:'', drugs:'', cannabis:'',
    smokingList: [], petsList: [],
    workout2:'', sleep2:'', diet2:'', love2:'', conflict2:'', socialBattery:'',
  };
  });
  // Sync quiz data to localStorage + window for bio page
  React.useEffect(() => {
    try { localStorage.setItem('lfs.quiz', JSON.stringify(values)); } catch {}
    window.__quizData = values;
  }, [values]);
  const [hards, setHards] = React.useState({});
  const MAX_HARD = 3;
  const hardCount = Object.values(hards).filter(Boolean).length;
  const set = (k,v) => setValues(o => ({ ...o, [k]: v }));
  const toggleHard = (k) => setHards(o => {
    if (o[k]) return { ...o, [k]: false };
    if (hardCount >= MAX_HARD) return o;
    return { ...o, [k]: true };
  });

  // Page completion checks
  const page0Complete = values.bio && values.birthday && values.location && values.gender && values.interested && values.ethnicity && values.faith && values.children && values.drinking2 && values.workout2 && values.sleep2 && values.love2 && values.conflict2 && values.travel2 && values.height && (values.petsList && values.petsList.length > 0) && values.edu && values.drugs;
  const page1Complete = QUIZ_DEALBREAKERS.every(d => values[d.key]);
  const page2Complete = hardCount === MAX_HARD;
  const validationOff = tweaks && tweaks.quizValidation === 'off';
  const canProceed = validationOff ? true : (page === 0 ? page0Complete : page === 1 ? page1Complete : page === 2 ? page2Complete : true);

  const isPremium = tweaks && tweaks.tier === 'premium';
  const next = () => { setPage(p => Math.min(p + 1, totalPages - 1)); };
  const prev = () => setPage(p => Math.max(p - 1, 0));

  const pageTitles = ['About me', 'Your Preferences', 'Your Dealbreakers', 'How it works'];

  const Status = ({ done }) => (
    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width: 14, height: 14, borderRadius: 99, background: done ? '#800120' : '#FFFBDE', color: done ? '#FFFFFF' : '#1A1A1A', fontSize: 12, fontFamily:'Lato, sans-serif', marginLeft: 6, verticalAlign:'middle', flexShrink: 0, position:'relative', top: -1 }}>
      {done ? '\u2713' : '!'}
    </span>
  );

  // Completion counts per page
  const page0Fields = [values.bio, values.birthday, values.location, values.height, values.gender, values.interested, values.edu, values.job, values.ethnicity, values.faith, values.politics2, values.children, (values.petsList && values.petsList.length > 0), values.drinking2, (values.smokingList && values.smokingList.length > 0), values.drugs, values.diet2, values.workout2, values.sleep2, values.love2, values.conflict2, values.travel2];
  const page0Done = page0Fields.filter(Boolean).length;
  const page0Total = page0Fields.length;
  const page1Done = QUIZ_DEALBREAKERS.filter(d => values[d.key]).length;
  const page1Total = QUIZ_DEALBREAKERS.length;

  return (
    <div style={{ height:'100vh', padding:'20px 36px 14px', maxWidth: 980, margin:'0 auto', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: 10, marginBottom: 12, flexShrink: 0 }}>
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 12, marginBottom: 4 }}>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing:'-0.02em' }}>
              <span style={{ fontStyle:'italic' }}>Love</span> at First Site
            </div>
            <div className="mono caps" style={{ fontSize: 12, color:'var(--ink-3)', letterSpacing:'0.12em' }}>Quiz</div>
          </div>
          <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing:'-0.02em', marginTop: 4 }}>
            {page === 0 ? <>Tell us about <span style={{ fontStyle:'italic', color:'#800120' }}>yourself.</span></> : page === 1 ? <>What's your <span style={{ fontStyle:'italic', color:'#800120' }}>type?</span></> : page === 2 ? <>Pick your top 3 <span style={{ fontStyle:'italic', color:'#800120' }}>Dealbreakers.</span></> : <>The <span style={{ fontStyle:'italic' }}>full picture.</span></>}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div className="mono caps" style={{ fontSize: 18, color:'#800120', letterSpacing:'0.12em' }}>{page + 1} / {totalPages}</div>
        </div>
      </div>

      {/* Progress bar — segmented */}
      <div style={{ display:'flex', gap: 3, marginBottom: 12, flexShrink: 0 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 10, background: i < page ? '#800120' : i === page ? '#800120' : 'var(--paper-3)', opacity: i <= page ? 1 : 0.4, transition:'all .3s' }}/>
        ))}
      </div>

      {/* Page 1: About Me */}
      {page === 0 && (
        <div className="fadein" style={{ padding:'24px 28px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', flex: 1, minHeight: 0, overflowY:'auto', scrollbarWidth:'thin' }}>

          {/* === PHOTOS === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700 }}>Your Photos</div>
            <div style={{ display:'flex', gap: 14, alignItems:'flex-start' }}>
              {/* Primary photo — large */}
              <div style={{ width: 200, flexShrink: 0, position:'relative' }}>
                <PhotoUploadSlot style={{ aspectRatio:'1/1', borderRadius: 4, border:'2px solid #800120', background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Silhouette seed={2}/>
                  <div style={{ position:'absolute', top: 8, left: 8, padding:'4px 10px', background:'#800120', color:'#FFFFFF', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius: 99, fontWeight: 700, pointerEvents:'none' }}>Primary Photo</div>
                  <div style={{ position:'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 99, background:'#FFFFFF', border:'1px solid var(--line-strong)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px #0001', pointerEvents:'none' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#800120" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </PhotoUploadSlot>
              </div>
              {/* Thumbnails grid */}
              <div style={{ flex: 1 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
                  {[11, 12, null, null].map((seed, i) => (
                    <PhotoUploadSlot key={i} style={{
                      aspectRatio:'1/1', borderRadius: 4,
                      border: seed ? '1px solid var(--line-strong)' : '2px dashed var(--line-strong)',
                      background: seed ? 'var(--paper)' : '#FFFFFF',
                      display:'flex', alignItems:'center', justifyContent:'center'
                    }}>
                      {seed ? (
                        <>
                          <Silhouette seed={seed}/>
                          <div className="mono" style={{ position:'absolute', bottom: 3, right: 4, fontSize: 12, color:'#FFFFFF', textShadow:'0 1px 3px #000A', pointerEvents:'none' }}>{i + 2}</div>
                        </>
                      ) : (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 2, pointerEvents:'none' }}>
                          <span style={{ fontSize: 24, color:'var(--ink-3)', lineHeight: 1 }}>+</span>
                          <span className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>Add</span>
                        </div>
                      )}
                    </PhotoUploadSlot>
                  ))}
                </div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 6, fontStyle:'italic' }}>5 photos max, 3 minimum. Drag to reorder.</div>
              </div>
            </div>
          </div>

          {/* === NAME + BIRTHDAY === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>The Basics</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Birthday <Status done={!!(values.birthday)}/></div>
                <input type="date" value={values.birthday || '1997-03-14'} onChange={e => set('birthday', e.target.value)}
                  style={{ width:'100%', padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontFamily:'Lato', fontSize: 12 }}/>
                <div className="mono" style={{ fontSize: 12, color:'#800120', marginTop: 4 }}>Age: {(() => { const b = new Date(values.birthday || '1997-03-14'); const now = new Date(); return Math.floor((now - b) / 31557600000); })()} {'\u00b7'} {getZodiac(values.birthday || '1997-03-14')}</div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 15 }}>
                  <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>One-liner <Status done={!!(values.bio)}/></div>
                  <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)' }}>{values.bio.length} / 240</div>
                </div>
                <textarea value={values.bio} onChange={e => set('bio', e.target.value)} rows={2} maxLength={240}
                  placeholder="Write something about yourself..."
                  style={{ width:'100%', padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color:'var(--ink)', fontFamily:'Lato, sans-serif', fontSize: 18, fontStyle:'italic', lineHeight: 1.3, resize:'none', outline:'none' }}/>
              </div>
            </div>
          </div>

          {/* === CITY + HEIGHT === */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>City <Status done={!!(values.location)}/></div>
                <div style={{ position:'relative' }}>
                  <input value={values.location} onChange={e => set('location', e.target.value)} placeholder="Start typing..."
                    style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontStyle:'italic', fontFamily:'Lato' }}/>
                  {values.location && values.location.length >= 3 && !CITIES.includes(values.location) && (
                    <div style={{ position:'absolute', top:'100%', left: 0, right: 0, zIndex: 20, background:'#FFFFFF', border:'1px solid var(--ink)', borderRadius: 10, boxShadow:'0 8px 20px -8px #00000030', maxHeight: 180, overflowY:'auto' }}>
                      {CITIES.filter(c => c.toLowerCase().includes(values.location.toLowerCase())).slice(0, 8).map(c => (
                        <button key={c} onClick={() => set('location', c)} style={{ width:'100%', textAlign:'left', padding:'8px 12px', fontFamily:'Lato', fontSize: 14, fontStyle:'italic', borderBottom:'1px dotted var(--line)', background:'transparent', cursor:'pointer', color:'var(--ink)' }}>{c}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Height <Status done={!!(values.height)}/></div>
                <select value={values.height || ''} onChange={e => set('height', e.target.value)}
                  style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.height ? 'var(--ink)' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {["4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\"","6'5\"","6'6\"","6'7\"","6'8\""].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* === BACKGROUND === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Background</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Gender <Status done={!!(values.gender)}/></div>
                <div style={{ display:'flex', gap: 5, flexWrap:'wrap' }}>
                  {['Woman', 'Man', 'Non-binary', 'Trans', 'Other'].map(s => { const on = values.gender === s; return (<button key={s} onClick={() => set('gender', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Ethnicity <Status done={!!(values.ethnicity)}/></div>
                <select value={values.ethnicity || ''} onChange={e => set('ethnicity', e.target.value)}
                  style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.ethnicity ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {['Black/African Descent','East Asian','Hispanic/Latino','Middle Eastern','Native American','Pacific Islander','South Asian','White/Caucasian','Mixed','Other'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Religion <Status done={!!(values.faith)}/></div>
                <select value={values.faith} onChange={e => set('faith', e.target.value)}
                  style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.faith ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {['Agnostic','Atheist','Buddhist','Catholic','Christian','Hindu','Jewish','Muslim','Sikh','Spiritual','Other'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Politics <Status done={!!(values.politics2)}/></div>
                <select value={values.politics2} onChange={e => set('politics2', e.target.value)}
                  style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.politics2 ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {['Liberal','Moderate','Conservative','Apolitical','Other'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </div>

          {/* === CAREER === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Career</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Education <Status done={!!(values.edu)}/></div>
                <select value={values.edu || ''} onChange={e => set('edu', e.target.value)}
                  style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.edu ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {['High school','In college','Bachelor','Trade school','In grad school','Masters','PhD'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Job title <Status done={!!(values.job)}/></div>
                <input value={values.job} onChange={e => set('job', e.target.value)} placeholder="e.g. Translator"
                  style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontStyle:'italic', fontFamily:'Lato' }}/>
              </div>
            </div>
          </div>

          {/* === CHILDREN + PETS === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Lifestyle</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Children <Status done={!!(values.children)}/></div>
                <select value={values.children || ''} onChange={e => set('children', e.target.value)}
                  style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.children ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {['I want children','I don\'t want children','I have children and want more','I have children and don\'t want more','Not sure yet'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Pets <Status done={!!(values.petsList && values.petsList.length > 0)}/></div>
                <div style={{ display:'flex', gap: 5, flexWrap:'wrap' }}>
                  {['Dog','Cat','Bird','Fish','Reptile'].map(s => { const selected = values.petsList || []; const on = selected.includes(s); return (<button key={s} onClick={() => set('petsList', on ? selected.filter(x => x !== s) : [...selected, s])} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
            </div>
          </div>

          {/* === HABITS === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Habits</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Drinking <Status done={!!(values.drinking2)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Socially','Often','Never'].map(s => { const on = values.drinking2 === s; return (<button key={s} onClick={() => set('drinking2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Smoking <Status done={!!(values.smokingList && values.smokingList.length > 0)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Socially','Regularly','Trying to quit','Never'].map(s => { const on = values.smoking2 === s; return (<button key={s} onClick={() => set('smoking2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
            </div>
            {/* Row 2: Cannabis + Diet */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px', marginTop: 20 }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Cannabis <Status done={!!(values.cannabis)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Yes','Occasionally','Socially','Never'].map(s => { const on = values.cannabis === s; return (<button key={s} onClick={() => set('cannabis', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Diet <Status done={!!(values.diet2)}/></div>
                <select value={values.diet2} onChange={e => set('diet2', e.target.value)}
                  style={{ width:'100%', fontSize: 14, padding:'8px 10px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', color: values.diet2 ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato' }}>
                  <option value="" disabled>Select</option>
                  {['Omnivore','Vegetarian','Vegan','Pescatarian','Keto','Halal','Kosher','Other'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
            {/* Row 3: Workout + Sleep */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px', marginTop: 20 }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Workout <Status done={!!(values.workout2)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Daily','Weekly','Rarely','Never'].map(s => { const on = values.workout2 === s; return (<button key={s} onClick={() => set('workout2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Sleep <Status done={!!(values.sleep2)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Early bird','Night owl','No preference'].map(s => { const on = values.sleep2 === s; return (<button key={s} onClick={() => set('sleep2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
            </div>
          </div>

          {/* === PERSONALITY === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Personality</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Love style <Status done={!!(values.love2)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Verbal','Touch','Gifts','Time','Service'].map(s => { const on = values.love2 === s; return (<button key={s} onClick={() => set('love2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Conflict style <Status done={!!(values.conflict2)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Direct','Cool-off','Avoider','Negotiator'].map(s => { const on = values.conflict2 === s; return (<button key={s} onClick={() => set('conflict2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Travel <Status done={!!(values.travel2)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Constantly','Yearly','Rarely','Homebody'].map(s => { const on = values.travel2 === s; return (<button key={s} onClick={() => set('travel2', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Social Battery <Status done={!!(values.socialBattery)}/></div>
                <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
                  {['Introvert','Extrovert','Ambivert','Social Butterfly','Lone Wolf'].map(s => { const on = values.socialBattery === s; return (<button key={s} onClick={() => set('socialBattery', on ? '' : s)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 3 }}>{on && <span>{'\u2665'}</span>}{s}</button>); })}
                </div>
              </div>
            </div>
          </div>

          {/* === CONTACT === */}
          <div>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Contact</div>
            <div style={{ padding:'12px 20px', background:'#800120', color:'#FFFFFF', borderRadius: 10, marginBottom: 14 }}>
              <div className="mono" style={{ fontSize: 12, lineHeight: 1.5, fontStyle:'italic' }}>
                Your contact is only shared with your matches. Prefer not to share it? Leave it blank and they can message you on the platform.
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px' }}>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Phone <span style={{ color:'var(--ink-3)', fontWeight:300 }}>(optional)</span></div>
                <input value={values.phone} onChange={e => set('phone', e.target.value)} style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontStyle:'italic', fontFamily:'Lato' }} placeholder="+1 (555) 555-0100"/>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Instagram <span style={{ color:'var(--ink-3)', fontWeight:300 }}>(optional)</span></div>
                <input value={values.ig} onChange={e => set('ig', e.target.value)} style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontStyle:'italic', fontFamily:'Lato' }} placeholder="@yourhandle"/>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Facebook <span style={{ color:'var(--ink-3)', fontWeight:300 }}>(optional)</span></div>
                <input value={values.facebook || ''} onChange={e => set('facebook', e.target.value)} style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontStyle:'italic', fontFamily:'Lato' }} placeholder="facebook.com/yourname"/>
              </div>
              <div>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 15 }}>Twitter / X <span style={{ color:'var(--ink-3)', fontWeight:300 }}>(optional)</span></div>
                <input value={values.twitter || ''} onChange={e => set('twitter', e.target.value)} style={{ width:'100%', fontSize: 18, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF', fontStyle:'italic', fontFamily:'Lato' }} placeholder="@yourhandle"/>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Page 2: Preferences & Interests */}
      {page === 1 && (
        <div className="fadein" style={{ padding:'24px 28px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', flex: 1, minHeight: 0, overflowY:'auto', scrollbarWidth:'thin' }}>

          {/* === YOUR RANGE === */}
          <div style={{ marginBottom: 28 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700 }}>The Basics</div>
            {/* Interested in — above age range */}
            {QUIZ_DEALBREAKERS.filter(d => d.key === 'gender').map(d => {
              const isAny = values[d.key] === d.any;
              return (
              <div key={d.key} style={{ marginBottom: 16 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                  <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={!!values[d.key]}/></div>
                  {d.any && <button onClick={() => set(d.key, isAny ? '' : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap: 5, opacity: isAny ? 0.4 : 1 }}>
                  {d.options.map(opt => { const on = !isAny && values[d.key] === opt; return (
                    <button key={opt} onClick={() => !isAny && set(d.key, on ? '' : opt)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor: isAny ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{opt}</button>
                  ); })}
                </div>
              </div>
              );
            })}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px', padding:'14px 16px', border:'0.5px solid #CCCCCC', borderRadius: 10, background:'#FFFFFF' }}>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 15 }}>
                  <span className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>Age range</span>
                  <span style={{ fontSize: 14, fontStyle:'italic', color:'#800120', fontFamily:'Lato' }}>{values.ageMin || 21} - {values.ageMax || 45}</span>
                </div>
                <div style={{ position:'relative', height: 20 }}>
                  <input type="range" min="18" max="95" value={values.ageMin || 21}
                    onChange={e => { const v = parseInt(e.target.value); if (v < (values.ageMax || 45)) set('ageMin', v); }}
                    style={{ position:'absolute', width:'100%', accentColor:'#800120', pointerEvents:'auto', zIndex: 2, background:'transparent', WebkitAppearance:'none' }}/>
                  <input type="range" min="18" max="95" value={values.ageMax || 45}
                    onChange={e => { const v = parseInt(e.target.value); if (v > (values.ageMin || 21)) set('ageMax', v); }}
                    style={{ position:'absolute', width:'100%', accentColor:'#800120', pointerEvents:'auto', zIndex: 1 }}/>
                </div>
                <div className="mono" style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>
                  <span>18</span><span>95</span>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 15 }}>
                  <span className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>Distance from you</span>
                  <span style={{ fontSize: 14, fontStyle:'italic', color:'#800120', fontFamily:'Lato' }}>{values.prefRadius || 50} mi</span>
                </div>
                <input type="range" min="5" max="200" step="5" value={values.prefRadius || 50}
                  onChange={e => set('prefRadius', parseInt(e.target.value))}
                  style={{ width:'100%', accentColor:'#800120' }}/>
                <div className="mono" style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>
                  <span>5 mi</span><span>200 mi</span>
                </div>
              </div>
            </div>
          </div>

          {/* === THE ESSENTIALS === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>The Essentials</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              {QUIZ_DEALBREAKERS.filter(d => d.key === 'education' || d.key === 'children').map(d => {
                const isAny = values[d.key] === d.any;
                return (
                <div key={d.key}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={!!values[d.key]}/></div>
                    {d.any && <button onClick={() => set(d.key, isAny ? '' : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                  </div>
                  {d.dropdown ? (
                    <select value={isAny ? '' : (values[d.key] || '')} onChange={e => set(d.key, e.target.value)} disabled={isAny}
                      style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background: isAny ? '#F5F5F5' : '#FFFFFF', color: values[d.key] ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato', opacity: isAny ? 0.5 : 1 }}>
                      <option value="" disabled>Select</option>
                      {d.options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                  ) : (
                    <div style={{ display:'flex', flexWrap:'wrap', gap: 5, opacity: isAny ? 0.4 : 1 }}>
                      {d.options.map(opt => { const on = !isAny && values[d.key] === opt; return (
                        <button key={opt} onClick={() => !isAny && set(d.key, on ? '' : opt)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor: isAny ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{opt}</button>
                      ); })}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>

          {/* === BACKGROUND === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Background</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              {QUIZ_DEALBREAKERS.filter(d => d.key === 'religion' || d.key === 'politics' || d.key === 'zodiac' || d.key === 'diet').map(d => {
                const isAny = values[d.key] === d.any;
                return (
                <div key={d.key}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={!!values[d.key]}/></div>
                    {d.any && <button onClick={() => set(d.key, isAny ? '' : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                  </div>
                  <select value={isAny ? '' : (values[d.key] || '')} onChange={e => set(d.key, e.target.value)} disabled={isAny}
                    style={{ width:'100%', fontSize: 14, padding:'12px 20px', border:'0.5px solid #CCCCCC', borderRadius: 10, background: isAny ? '#F5F5F5' : '#FFFFFF', color: values[d.key] ? '#333333' : 'var(--ink-3)', fontStyle:'italic', appearance:'auto', fontFamily:'Lato', opacity: isAny ? 0.5 : 1 }}>
                    <option value="" disabled>Select</option>
                    {d.options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                </div>
                );
              })}
            </div>
          </div>

          {/* === HABITS === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Habits</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px' }}>
              {QUIZ_DEALBREAKERS.filter(d => ['smoking','drinking','cannabis'].includes(d.key)).map(d => {
                const isAny = values[d.key] === d.any;
                return (
                <div key={d.key}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={!!values[d.key]}/></div>
                    {d.any && <button onClick={() => set(d.key, isAny ? '' : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 5, opacity: isAny ? 0.4 : 1 }}>
                    {d.options.map(opt => { const on = !isAny && values[d.key] === opt; return (
                      <button key={opt} onClick={() => !isAny && set(d.key, on ? '' : opt)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor: isAny ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{opt}</button>
                    ); })}
                  </div>
                </div>
                );
              })}
              {QUIZ_DEALBREAKERS.filter(d => d.key === 'workout').map(d => {
                const isAny = values[d.key] === d.any;
                return (
                <div key={d.key}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={!!values[d.key]}/></div>
                    {d.any && <button onClick={() => set(d.key, isAny ? '' : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 5, opacity: isAny ? 0.4 : 1 }}>
                    {d.options.map(opt => { const on = !isAny && values[d.key] === opt; return (
                      <button key={opt} onClick={() => !isAny && set(d.key, on ? '' : opt)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor: isAny ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{opt}</button>
                    ); })}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* === LIFESTYLE === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Lifestyle</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '32px 16px' }}>
              {QUIZ_DEALBREAKERS.filter(d => d.key === 'pets' || d.key === 'sleep').map(d => {
                const isAny = values[d.key] === d.any;
                const isMulti = d.multi;
                return (
                <div key={d.key}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={isMulti ? (values[d.key] || []).length > 0 : !!values[d.key]}/></div>
                    {d.any && <button onClick={() => set(d.key, isAny ? (isMulti ? [] : '') : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 5, opacity: isAny ? 0.4 : 1 }}>
                    {d.options.map(opt => {
                      const on = isMulti ? !isAny && (values[d.key] || []).includes(opt) : !isAny && values[d.key] === opt;
                      return (
                      <button key={opt} onClick={() => { if (isAny) return; if (isMulti) { const cur = values[d.key] || []; set(d.key, on ? cur.filter(x => x !== opt) : [...cur, opt]); } else { set(d.key, on ? '' : opt); } }} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor: isAny ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{opt}</button>
                    ); })}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* === PERSONALITY === */}
          <div style={{ marginBottom: 24 }}>
            <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.16em', marginBottom: 12, fontWeight: 700, paddingTop: 16 }}>Personality</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '28px 14px' }}>
              {QUIZ_DEALBREAKERS.filter(d => ['love_style','travel','conflict','socialBattery'].includes(d.key)).map(d => {
                const isAny = values[d.key] === d.any;
                return (
                <div key={d.key}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 15 }}>
                    <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em' }}>{d.label} <Status done={!!values[d.key]}/></div>
                    {d.any && <button onClick={() => set(d.key, isAny ? '' : d.any)} style={{ padding:'2px 8px', fontSize: 12, fontFamily:'Lato', background: isAny ? '#800120' : 'transparent', color: isAny ? '#FFFFFF' : '#888888', border: `1px solid ${isAny ? '#800120' : '#CCCCCC'}`, borderRadius: 99, cursor:'pointer' }}>{d.any}</button>}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 5, opacity: isAny ? 0.4 : 1 }}>
                    {d.options.map(opt => { const on = !isAny && values[d.key] === opt; return (
                      <button key={opt} onClick={() => !isAny && set(d.key, on ? '' : opt)} style={{ padding:'6px 12px', fontSize: 12, fontFamily:'Lato', background: on ? '#800120' : '#FFFFFF', color: on ? '#FFFFFF' : '#333333', border: `0.5px solid ${on ? '#800120' : '#CCCCCC'}`, borderRadius: 10, cursor: isAny ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', gap: 4 }}>{on && <span>{'\u2665'}</span>}{opt}</button>
                    ); })}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Page 3: Dealbreakers */}
      {page === 2 && (
        <div className="fadein" style={{ padding:'16px 20px', border:'1px solid var(--line-strong)', borderRadius: 10, background:'var(--cream)', flex: 1, minHeight: 0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          {/* Subtitle */}
          <div className="serif" style={{ fontSize: 14, fontStyle:'italic', color:'var(--ink-2)', marginBottom: 10 }}>
            Everyone has a few. Pick 3 things that are absolute "must-haves" (or must-nots). <span style={{ color:'#800120', fontWeight: 700 }}>{hardCount}/{MAX_HARD}</span> selected.
          </div>

          {/* Premium callout */}
          <div style={{ padding:'10px 14px', background:'#800120', color:'#FFFFFF', borderRadius: 10, display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12, marginBottom: 12, flexShrink: 0 }}>
            <div className="serif" style={{ fontSize: 14, lineHeight: 1.3 }}>
              {'\u2665'} Premium users are matched into pods based on their dealbreakers. Free users are placed into random pods.
            </div>
            <button onClick={() => setShowPremiumPopup(true)} style={{ padding:'4px 12px', background:'#FFFFFF', color:'#800120', fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.08em', borderRadius: 99, border:'none', cursor:'pointer', fontWeight: 700, flexShrink: 0, whiteSpace:'nowrap' }}>Learn more</button>
          </div>

          {/* Dealbreaker grid — 4 columns, compact */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 6, flex: 1, alignContent:'start' }}>
            {[
              { key:'ageRange', label:'Age range', display: `${values.ageMin || 21} - ${values.ageMax || 45}` },
              { key:'distance', label:'Distance', display: `${values.prefRadius || 50} mi` },
              ...QUIZ_DEALBREAKERS.map(d => ({ key: d.key, label: d.label, display: values[d.key] || 'Not set' }))
            ].map(d => {
              const isHard = !!hards[d.key];
              const disabled = !isHard && hardCount >= MAX_HARD;
              return (
                <button key={d.key} onClick={() => toggleHard(d.key)} style={{
                  padding:'8px 10px', textAlign:'left',
                  background: isHard ? '#800120' : disabled ? 'var(--paper-3)' : '#FFFFFF',
                  color: isHard ? '#FFFFFF' : disabled ? 'var(--ink-3)' : '#333333',
                  border: isHard ? '2px solid #800120' : '0.5px solid #CCCCCC',
                  borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1, transition:'all .15s'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize: 14, lineHeight: 1.1, fontFamily:'Lato', fontWeight: 600 }}>{d.label}</span>
                    {isHard && <span style={{ fontSize: 12 }}>{'\u2665'}</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                    {d.display}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Page 4: How It Works + Are You Ready */}
      {page === 3 && (
        <div className="fadein" style={{ flex: 1, minHeight: 0, display:'flex', flexDirection:'column', overflow:'auto' }}>
          {/* Hero — matches dashboard lobby CTA */}
          <div ref={quizHeroRef} style={{ padding:'28px 28px', border:'1px solid var(--ink)', borderRadius: 10, background:'var(--ink)', color:'var(--cream)', textAlign:'center', position:'relative', overflow:'hidden', flexShrink: 0 }}>
            <div style={{ position:'relative', zIndex: 1 }}>
              <div className="mono caps" style={{ fontSize: 12, color:'#FFFFFF', letterSpacing:'0.16em' }}>You're all set</div>
              <div className="serif" style={{ fontSize: 36, lineHeight: 1, marginTop: 8, letterSpacing:'-0.02em', color:'var(--cream)' }}>
                Ready to meet <span style={{ fontStyle:'italic' }}>someone new?</span>
              </div>
              <div className="serif" style={{ fontSize: 16, fontStyle:'italic', color:'var(--paper-2)', marginTop: 6, opacity: 0.85 }}>
                Here's how your first circuit works. Six dates. Five minutes each. No pressure.
              </div>
            </div>
          </div>

          {/* Steps — vertical timeline */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginTop: 20, flex: 1 }}>
            {[
              { step:'01', title:'Secure your spot', desc:'Join the lobby with 10 others. We\'ll alert you the second the pod is locked.' },
              { step:'02', title:'The Speed Circuits', desc:'6 back-to-back video dates. 5 minutes each. We\'ll even handle the icebreakers.' },
              { step:'03', title:'The Decision', desc:'It\'s a simple Yes or No. Your choice is private unless the feeling is mutual.' },
              { step:'04', title:'Quick Refresher', desc:'60 seconds between circuits. Grab a drink, check the mirror, and get ready for the next one.' },
              { step:'05', title:'The Match Reveal', desc:'See your mutual reveal instantly. No guessing games \u2014 just chemistry.' },
              { step:'06', title:'Keep the Spark', desc:'Transition to chat, plan your first real date, and take it from there.' },
            ].map(s => (
              <div key={s.step} style={{ display:'flex', gap: 14, padding:'16px 18px', background:'#FFFFFF', border:'1px solid var(--line-strong)', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, background:'#800120', color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>{s.step}</span>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontFamily:'Lato', fontWeight: 600, lineHeight: 1.1 }}>{s.title}</div>
                  <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowRules(true)} style={{
            marginTop: 16, padding:'16px 36px', background:'#800120', color:'#FFFFFF',
            fontFamily:'Lato, sans-serif', fontSize: 14, letterSpacing:'0.16em', textTransform:'uppercase',
            borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'center', gap: 10, cursor:'pointer', width:'100%', fontWeight: 700, border:'none',
            transition:'all .2s ease', flexShrink: 0
          }}
          onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
          >
            <span>Enter the Lobby</span>
            <span style={{ fontSize: 24, fontStyle:'italic' }}>{'\u2192'}</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 24 }}>
        {page > 0 ? (
          <button onClick={prev} style={{
            padding:'12px 20px', border:'1px solid var(--line-strong)', borderRadius: 10,
            fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
            color:'var(--ink-2)', cursor:'pointer'
          }}>{'\u2190'} Back</button>
        ) : <div/>}
        {page < totalPages - 1 && (() => {
          const missing = [];
          if (page === 0) {
            if (!values.bio) missing.push('One-liner bio');
            if (!values.birthday) missing.push('Birthday');
            if (!values.location) missing.push('City');
            if (!values.height) missing.push('Height');
            if (!values.edu) missing.push('Education');
            if (!values.gender) missing.push('Gender');
            if (!values.interested) missing.push('Interested in');
            if (!values.ethnicity) missing.push('Ethnicity');
            if (!values.faith) missing.push('Religious beliefs');
            if (!values.children) missing.push('Children');
            if (!values.petsList || !values.petsList.length) missing.push('Pets');
            if (!values.drinking2) missing.push('Drinking');
            if (!values.drugs) missing.push('Drugs');
            if (!values.workout2) missing.push('Workout');
            if (!values.sleep2) missing.push('Sleep');
            if (!values.love2) missing.push('Love style');
            if (!values.conflict2) missing.push('Conflict style');
            if (!values.travel2) missing.push('Travel');
          } else if (page === 1) {
            QUIZ_DEALBREAKERS.filter(d => !values[d.key]).forEach(d => missing.push(d.label));
          } else if (page === 2) {
            if (hardCount < MAX_HARD) missing.push(`${MAX_HARD - hardCount} more dealbreaker${MAX_HARD - hardCount > 1 ? 's' : ''}`);
          }
          return (
            <div style={{ position:'relative' }}
              onMouseEnter={(e) => { if (!canProceed) e.currentTarget.querySelector('[data-quiz-tip]').style.display = 'block'; }}
              onMouseLeave={(e) => { e.currentTarget.querySelector('[data-quiz-tip]').style.display = 'none'; }}>
              <button onClick={() => canProceed && next()} disabled={!canProceed} style={{
                padding:'12px 20px',
                background: canProceed ? 'var(--ink)' : 'var(--paper-3)',
                color: canProceed ? 'var(--cream)' : 'var(--ink-3)',
                fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.16em', textTransform:'uppercase',
                borderRadius: 10, display:'inline-flex', alignItems:'center', gap: 10,
                cursor: canProceed ? 'pointer' : 'not-allowed', opacity: canProceed ? 1 : 0.6
              }}>
                <span>{page === 0 ? 'Your Preferences and Interests' : page === 1 ? 'Your Dealbreakers' : 'Next'}</span>
                <span style={{ fontFamily:'Lato, sans-serif', fontSize: 24, fontStyle:'italic' }}>{'\u2192'}</span>
              </button>
              <div data-quiz-tip style={{
                display:'none', position:'absolute', bottom:'calc(100% + 8px)', right: 0,
                width: 240, padding:'12px 20px', background:'var(--ink)', color:'var(--cream)', borderRadius: 10,
                boxShadow:'0 10px 24px -12px #00000060', zIndex: 60
              }}>
                <div className="mono caps" style={{ fontSize: 12, color:'#800120', letterSpacing:'0.12em', marginBottom: 4 }}>Still needed ({missing.length}):</div>
                {missing.slice(0, 8).map((m, i) => (
                  <div key={i} className="mono" style={{ fontSize: 12, color:'#FFFFFFB0', marginBottom: 2 }}>{'\u2022'} {m}</div>
                ))}
                {missing.length > 8 && <div className="mono" style={{ fontSize: 12, color:'#FFFFFFB0' }}>...and {missing.length - 8} more</div>}
                <div style={{ position:'absolute', top:'100%', right: 20, width: 0, height: 0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'6px solid var(--ink)' }}/>
              </div>
            </div>
          );
        })()}
        {page === totalPages - 1 && <div/>}
      </div>

      {/* Premium popup — mirrors premium page layout, no scrolling */}
      {showPremiumPopup && (
        <div onClick={() => setShowPremiumPopup(false)} style={{
          position:'fixed', inset: 0, zIndex: 9999, background:'#1A1A1AB0', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding: 32, animation:'fade .25s ease both'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', maxWidth: 960, height:'min(600px, 85vh)', display:'flex', overflow:'hidden',
            borderRadius: 10, boxShadow:'0 40px 80px -30px #1A1A1A80'
          }}>
            {/* Left — white, benefits */}
            <div style={{ flex:'1 1 55%', background:'#FFFFFF', padding:'36px 36px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.16em', color:'#800120', marginBottom: 8 }}>Premium</div>
              <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, letterSpacing:'-0.03em', color:'var(--ink)' }}>
                Every call could be<br/><span style={{ fontStyle:'italic', color:'#800120' }}>the one.</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 8, maxWidth: 360, lineHeight: 1.5 }}>
                Premium removes the limits and puts you in the right rooms. Better pods, more circuits, real signals.
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 18px', marginTop: 24 }}>
                {[
                  { title:'Your dealbreakers matter', desc:'Pods curated acircuit what matters to you.', free:'Random pods', icon:'\u2665' },
                  { title:'Endless circuits', desc:'Unlimited circuits, anytime you want.', free:'2 per day', icon:'\u221E' },
                  { title:'Send a signal', desc:'Hint you are interested right after the call.', free:'No signals', icon:'\u2764' },
                  { title:'Priority seating', desc:'You fill pods first when demand is high.', free:'Queue-based', icon:'\u2606' },
                  { title:'Extra dealbreakers', desc:'Up to 6 slots instead of 3.', free:'3 max', icon:'+' },
                  { title:'Match insights', desc:'See compatibility before each call.', free:'No insights', icon:'\u2197' },
                ].map((b, i) => (
                  <div key={i} style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
                    <div style={{ width: 24, height: 24, flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'center', background:'#800120', color:'#FFFFFF', borderRadius: 10, fontSize: 12, fontFamily:'Lato, sans-serif' }}>{b.icon}</div>
                    <div>
                      <div className="serif" style={{ fontSize: 12, lineHeight: 1.1 }}>{b.title}</div>
                      <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', lineHeight: 1.3, marginTop: 1 }}>{b.desc}</div>
                      <div className="mono" style={{ fontSize: 12, color:'#AAAAAA', marginTop: 1 }}>Free: {b.free}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop:'1px solid var(--line-strong)' }}>
                <div className="serif" style={{ fontSize: 12, fontStyle:'italic', lineHeight: 1.3, color:'var(--ink)', maxWidth: 360 }}>
                  "I matched with my partner on my first Premium circuit. Dealbreaker matching actually works."
                </div>
                <div className="mono" style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, letterSpacing:'0.08em' }}>-- Jordan, 29, Brooklyn</div>
              </div>
            </div>

            {/* Right — dark, plans */}
            <div style={{ flex:'1 1 45%', background:'#0A0A0A', padding:'36px 32px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div className="serif" style={{ fontSize: 24, lineHeight: 1.1, letterSpacing:'-0.02em', color:'#FFFFFF', textAlign:'center' }}>
                Choose your plan
              </div>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFF60', marginTop: 6, textAlign:'center', lineHeight: 1.5 }}>
                All plans include every feature. Cancel anytime.
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap: 10, marginTop: 22 }}>
                {[
                  { id:'weekly', label:'Weekly', price:'$9.99', period:'/week', note:'Cancel anytime' },
                  { id:'monthly', label:'Monthly', price:'$24.99', period:'/month', note:'Most popular', badge: true },
                  { id:'yearly', label:'Yearly', price:'$149.99', period:'/year', note:'Save 50%' },
                ].map(p => {
                  const active = true && p.id === 'monthly';
                  return (
                    <div key={p.id} style={{
                      padding:'14px 16px', borderRadius: 10, cursor:'pointer',
                      border: active ? '2px solid #800120' : '1px solid #FFFFFF1A',
                      background: active ? '#800120' : '#1A1A1A',
                      color:'#FFFFFF', display:'flex', alignItems:'center', justifyContent:'space-between',
                      position:'relative'
                    }}>
                      {p.badge && (
                        <div className="mono caps" style={{ position:'absolute', top: -7, right: 14, padding:'2px 8px', background:'#FFFFFF', color:'#800120', fontSize: 12, letterSpacing:'0.12em', borderRadius: 99 }}>Most Popular</div>
                      )}
                      <div>
                        <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em' }}>{p.label}</div>
                        <div className="mono" style={{ fontSize: 12, opacity: 0.5, marginTop: 1 }}>{p.note}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <span className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{p.price}</span>
                        <span className="mono" style={{ fontSize: 12, opacity: 0.5 }}>{p.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison mini-table */}
              <div style={{ marginTop: 18, padding:'12px 20px', background:'#1A1A1A', borderRadius: 10 }}>
                <div className="mono caps" style={{ fontSize: 12, letterSpacing:'0.12em', color:'#FFFFFF40', marginBottom: 8 }}>Premium vs. Free</div>
                {[
                  ['Pod matching', 'Dealbreaker-based', 'Random'],
                  ['Circuits', 'Unlimited', '2/day'],
                  ['Signals', 'Send a hint', 'None'],
                  ['Dealbreakers', 'Up to 6', '3 max'],
                ].map(([feature, prem, free], i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderTop: i > 0 ? '1px solid #FFFFFF08' : 'none' }}>
                    <div className="mono" style={{ fontSize: 12, color:'#FFFFFF60', flex:'1 1 40%' }}>{feature}</div>
                    <div className="mono" style={{ fontSize: 12, color:'#FFFFFF', flex:'1 1 30%', textAlign:'right' }}>{'\u2665'} {prem}</div>
                    <div className="mono" style={{ fontSize: 12, color:'#FFFFFF30', flex:'1 1 30%', textAlign:'right' }}>{free}</div>
                  </div>
                ))}
              </div>

              <button style={{
                marginTop: 18, width:'100%', padding:'12px', background:'#800120', color:'#FFFFFF',
                fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                borderRadius: 10, border:'none', cursor:'pointer', fontWeight: 700
              }}>Upgrade to Premium</button>
              <div className="mono" style={{ fontSize: 12, color:'#FFFFFF40', marginTop: 8, textAlign:'center' }}>No commitment. Just better dates.</div>

              <button onClick={() => setShowPremiumPopup(false)} style={{
                marginTop: 12, width:'100%', padding:'8px', background:'transparent', color:'#FFFFFF40',
                fontFamily:'Lato, sans-serif', fontSize: 12, letterSpacing:'0.12em', textTransform:'uppercase',
                borderRadius: 10, border:'1px solid #FFFFFF12', cursor:'pointer'
              }}>Continue with Free</button>
            </div>
          </div>
        </div>
      )}
      {showRules && <HouseRulesModal onClose={() => setShowRules(false)} onAck={() => {
        setShowRules(false);
        window.__setView && window.__setView('lobby');
      }} tier={tweaks && tweaks.tier}/>}
    </div>
  );
}

window.QuizView = QuizView;
