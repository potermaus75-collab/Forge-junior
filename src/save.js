(function () {
  const KEY = 'neoGodWars_save';
  let saveTimer = null;

  function sanitizeNum(n, d = 0) { return Number.isFinite(n) ? n : d; }

  function migrateSave(raw) {
    let save = raw || {};
    let v = save.saveVersion || 0;
    while (v < GameState.SAVE_VERSION) {
      if (v === 0) {
        save.saveVersion = 1;
        save.deck = save.deck || [];
        save.equipment = save.equipment || { weapon: null, armor: null };
      } else if (v === 1) {
        save.saveVersion = 2;
        save.units = Array.isArray(save.units)
          ? Object.fromEntries(save.units.map((u) => [u.id, u.count]))
          : (save.units || {});
      } else if (v === 2) {
        save.saveVersion = 3;
        save.quests = save.quests?.progress ? save.quests : { progress: save.quests || {}, completed: {}, claimed: {} };
      } else if (v === 3) {
        save.saveVersion = 4;
        save.quests = { ...(save.quests || {}), cycles: save.quests?.cycles || {} };
      }
      v = save.saveVersion;
    }
    return save;
  }

  function validate(save) {
    const d = GameState.cloneDefault();
    const out = { ...d, ...save };
    out.profile = { ...d.profile, ...(save.profile || {}) };
    out.stats = { ...d.stats, ...(save.stats || {}) };
    out.resources = { ...d.resources, ...(save.resources || {}) };
    out.equipment = { ...d.equipment, ...(save.equipment || {}) };
    out.quests = { ...d.quests, ...(save.quests || {}) };
    out.quests.progress = out.quests.progress || {};
    out.quests.cycles = out.quests.cycles || {};
    out.quests.completed = out.quests.completed || {};
    out.quests.claimed = out.quests.claimed || {};
    out.units = out.units || {};
    out.inventory = out.inventory || {};
    out.buildings = out.buildings || {};
    out.deck = Array.isArray(out.deck) ? out.deck.filter((id) => DataAdapter.godMap.has(id)) : [];

    ['gold', 'gem'].forEach((k) => out.resources[k] = Math.max(0, sanitizeNum(out.resources[k], d.resources[k])));
    ['hp', 'hpMax', 'energy', 'energyMax', 'stamina', 'staminaMax'].forEach((k) => out.stats[k] = Math.max(0, sanitizeNum(out.stats[k], d.stats[k])));
    Object.keys(out.units).forEach((id) => {
      if (!DataAdapter.godMap.has(id) || !Number.isFinite(out.units[id]) || out.units[id] < 0) delete out.units[id];
      else out.units[id] = Math.floor(out.units[id]);
    });
    Object.keys(out.inventory).forEach((id) => {
      if (!DataAdapter.itemMap.has(id) || !Number.isFinite(out.inventory[id]) || out.inventory[id] < 0) delete out.inventory[id];
      else out.inventory[id] = Math.floor(out.inventory[id]);
    });

    if (!DataAdapter.itemMap.has(out.equipment.weapon)) out.equipment.weapon = null;
    if (!DataAdapter.itemMap.has(out.equipment.armor)) out.equipment.armor = null;
    out.saveVersion = GameState.SAVE_VERSION;
    return out;
  }

  function saveNow() {
    const p = GameState.get();
    p.timers.lastSave = Date.now();
    localStorage.setItem(KEY, JSON.stringify(p));
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 600);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return false;
      const migrated = migrateSave(JSON.parse(raw));
      GameState.set(validate(migrated));
      return true;
    } catch (_) {
      return false;
    }
  }

  window.SaveSystem = { load, saveNow, scheduleSave, validate, migrateSave };
})();
