(function () {
  const SAVE_VERSION = 6;
  const now = () => Date.now();
  const DEFAULT_PLAYER = {
    saveVersion: SAVE_VERSION,
    profile: { name: '신입 모험가', title: '초심자', level: 1, exp: 0, unlocked_titles: ['초심자'] },
    stats: { hp: 100, hpMax: 100, energy: 50, energyMax: 50, stamina: 10, staminaMax: 10, atk: 30, def: 30 },
    resources: { gold: 2000, gem: 20 },
    units: { g_gr_c1: 5 },
    deck: ['g_gr_c1', 'g_gr_c1', 'g_gr_c1'],
    equipment: { weapon: null, armor: null },
    inventory: { pot_hp_s: 3, mat_g_01: 3, mat_g_02: 3, w_001: 1, a_001: 1 },
    buildings: {},
    titlesUnlocked: ['초심자'],
    quests: { progress: {}, cycles: {}, doneCycles: {}, chapterCycle: {}, completed: {}, claimed: {} },
    bossCd: {},
    battle: { log: [], activeBossId: null, lastResult: null },
    metrics: { battlesWon: 0, battlesLost: 0, crafts: 0, goldEarnedTotal: 0, bossKills: 0 },
    timers: { lastTick: now(), lastSave: now(), lastIncome: now(), lastEnergy: now(), lastStamina: now(), energyRegenAcc: 0, staminaRegenAcc: 0 },
  };

  let player = JSON.parse(JSON.stringify(DEFAULT_PLAYER));

  function cloneDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_PLAYER));
  }

  function get() { return player; }
  function set(newState) { player = newState; }

  function gainItem(id, amount = 1) {
    if (!player.inventory[id]) player.inventory[id] = 0;
    player.inventory[id] += amount;
  }

  function consumeItem(id, amount = 1) {
    if ((player.inventory[id] || 0) < amount) return false;
    player.inventory[id] -= amount;
    if (player.inventory[id] <= 0) delete player.inventory[id];
    return true;
  }

  function gainUnit(id, amount = 1) {
    if (!player.units[id]) player.units[id] = 0;
    player.units[id] += amount;
  }

  function consumeUnit(id, amount = 1) {
    if ((player.units[id] || 0) < amount) return false;
    player.units[id] -= amount;
    if (player.units[id] <= 0) delete player.units[id];
    return true;
  }

  function changeResource(type, delta) {
    player.resources[type] = Math.max(0, (player.resources[type] || 0) + delta);
  }

  function deckCapacity() { return 4 + Math.floor(player.profile.level / 2); }

  window.GameState = {
    SAVE_VERSION,
    DEFAULT_PLAYER,
    cloneDefault,
    get,
    set,
    gainItem,
    consumeItem,
    gainUnit,
    consumeUnit,
    changeResource,
    deckCapacity,
  };
})();
