// Shared notes store — used across circuit/verdict/refresh/reveal so notes
// the user types in Circuit show up everywhere else.

const LAFS_NOTES_KEY = 'lafs.notes.v1';

const DEFAULT_NOTES = {
  1: "Voice actor — good radio voice. Reads menus out loud. Dog named Persimmon.",
  2: "Jazz fan. Plays standup. Cooks. Mentioned his grandmother three times (good sign).",
  3: "", // current call in progress
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
};

function loadNotes() {
  try {
    const raw = localStorage.getItem(LAFS_NOTES_KEY);
    if (raw) return { ...DEFAULT_NOTES, ...JSON.parse(raw) };
  } catch(e) {}
  return DEFAULT_NOTES;
}

function saveNotes(n) {
  try { localStorage.setItem(LAFS_NOTES_KEY, JSON.stringify(n)); } catch(e) {}
}

function useNotes() {
  const [notes, setNotes] = React.useState(() => loadNotes());
  const update = React.useCallback((callIdx, text) => {
    setNotes(prev => {
      const next = { ...prev, [callIdx]: text };
      saveNotes(next);
      return next;
    });
  }, []);
  return [notes, update];
}

// Verdicts — also shared
const LAFS_VERDICTS_KEY = 'lafs.verdicts.v1';
const DEFAULT_VERDICTS = { 1:'yes', 2:'no', 3:null, 4:null, 5:null, 6:null, 7:null, 8:null };

function loadVerdicts() {
  try {
    const raw = localStorage.getItem(LAFS_VERDICTS_KEY);
    if (raw) return { ...DEFAULT_VERDICTS, ...JSON.parse(raw) };
  } catch(e) {}
  return DEFAULT_VERDICTS;
}

function useVerdicts() {
  const [v, setV] = React.useState(() => loadVerdicts());
  const update = React.useCallback((i, val) => {
    setV(prev => {
      const next = { ...prev, [i]: val };
      try { localStorage.setItem(LAFS_VERDICTS_KEY, JSON.stringify(next)); } catch(e) {}
      return next;
    });
  }, []);
  return [v, update];
}

window.useNotes = useNotes;
window.useVerdicts = useVerdicts;
window.loadNotes = loadNotes;
window.loadVerdicts = loadVerdicts;
