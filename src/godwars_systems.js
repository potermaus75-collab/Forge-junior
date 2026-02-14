(function () {
  const LEAGUES = [
    { id: 'Copper', min: 0, max: 1500, honor: 1, staminaCost: 1 },
    { id: 'Bronze', min: 1501, max: 3000, honor: 2, staminaCost: 2 },
    { id: 'Silver', min: 3001, max: 5000, honor: 3, staminaCost: 3 },
    { id: 'Gold', min: 5001, max: 10000, honor: 5, staminaCost: 4 },
    { id: 'Platinum', min: 10001, max: Infinity, honor: 8, staminaCost: 5 },
  ];

  const ELEMENT_ADV = { fire: 'earth', water: 'fire', wind: 'water', earth: 'wind' };

  function ensureSystems(p) {
    p.missionState = p.missionState || { unlockedChapters: { '1': true }, missionProgress: {}, zoneRanks: {}, zoneMastered: {}, missionRuns: {} };
    p.pvp = p.pvp || { lp: 1000, honor: 0, visible: true, lastHonorDate: null };
    p.raid = p.raid || { instances: {}, activeId: null, joined: {}, damageByRaid: {} };
    p.skills = p.skills || { points: 0, fire: { atk: 0, def: 0 }, water: { atk: 0, def: 0 }, wind: { atk: 0, def: 0 }, earth: { atk: 0, def: 0 } };
    p.gods = p.gods || { mainSlot: p.deck?.[0] || null, subSlots: (p.deck || []).slice(1, 4), dispatched: {}, awaken: {} };
    p.achievements = p.achievements || { raidDamageDone: 0, missionMasterCount: 0 };
  }

  function getMissionById(id) {
    for (const ch of (window.MISSIONS || [])) {
      for (const z of ch.zones) {
        for (const m of z.missions) if (m.id === id) return { chapter: ch, zone: z, mission: m };
      }
    }
    return null;
  }

  function zoneSubs(zone) { return zone.missions.filter((m) => m.type === 'sub'); }

  function isMainUnlocked(p, zoneId) {
    const zone = (window.MISSIONS || []).flatMap((c) => c.zones).find((z) => z.zoneId === zoneId);
    if (!zone) return false;
    return zoneSubs(zone).every((m) => (p.missionState.zoneMastered[`${zoneId}:${m.id}`] || false));
  }

  function runMission(missionId) {
    const p = GameState.get();
    ensureSystems(p);
    const found = getMissionById(missionId);
    if (!found) return { ok: false, reason: 'mission_not_found' };
    const { chapter, zone, mission } = found;
    if (!p.missionState.unlockedChapters[chapter.chapterId]) return { ok: false, reason: 'chapter_locked' };
    if (mission.type === 'main' && !isMainUnlocked(p, zone.zoneId)) return { ok: false, reason: 'main_locked' };
    if (p.stats.energy < mission.reqEnergy) return { ok: false, reason: 'energy_low' };

    p.stats.energy -= mission.reqEnergy;
    p.resources.gold += mission.rewardGold;
    GameUI.gainExp(mission.rewardXp);
    p.skills.points += 1;

    const runKey = mission.id;
    p.missionState.missionRuns[runKey] = (p.missionState.missionRuns[runKey] || 0) + 1;

    if (mission.type === 'sub') {
      const rankKey = `${zone.zoneId}:${mission.id}`;
      const currentRank = p.missionState.zoneRanks[rankKey] || 1;
      const progressKey = `${rankKey}:r${currentRank}`;
      const inc = 25;
      const next = Math.min(100, (p.missionState.missionProgress[progressKey] || 0) + inc);
      p.missionState.missionProgress[progressKey] = next;
      if (next >= 100) {
        if (currentRank < 3) p.missionState.zoneRanks[rankKey] = currentRank + 1;
        else {
          p.missionState.zoneMastered[rankKey] = true;
          p.achievements.missionMasterCount += 1;
        }
      }
    }

    if (mission.type === 'main') {
      const count = p.missionState.missionRuns[mission.id] || 1;
      if (count === 1) {
        const idx = (window.MISSIONS || []).findIndex((c) => c.chapterId === chapter.chapterId);
        const next = window.MISSIONS?.[idx + 1];
        if (next) p.missionState.unlockedChapters[next.chapterId] = true;
      }
      const dropRoll = Math.random();
      if (dropRoll < 0.3) GameState.gainItem('mat_g_01', 1);
      else if (dropRoll < 0.5) GameState.gainUnit('g_gr_u1', 1);
    }

    SaveSystem.scheduleSave();
    return { ok: true };
  }

  function getLeague(lp) { return LEAGUES.find((l) => lp >= l.min && lp <= l.max) || LEAGUES[0]; }

  function grantDailyHonor() {
    const p = GameState.get(); ensureSystems(p);
    const today = new Date().toISOString().slice(0, 10);
    if (!p.pvp.visible || p.pvp.lastHonorDate === today) return false;
    const league = getLeague(p.pvp.lp);
    p.pvp.honor += league.honor;
    p.pvp.lastHonorDate = today;
    return true;
  }

  function doPvpFight() {
    const p = GameState.get(); ensureSystems(p);
    if (p.stats.hp < 20) return { ok: false, reason: 'hp_low' };
    const league = getLeague(p.pvp.lp);
    if (p.stats.stamina < league.staminaCost) return { ok: false, reason: 'stamina_low' };
    p.stats.stamina -= league.staminaCost;
    p.stats.hp = Math.max(0, p.stats.hp - 8);

    const my = Balance.calculateDeckPower(p).atk + (p.profile.level * 5);
    const enemy = my * (0.8 + Math.random() * 0.6);
    const win = my >= enemy;
    if (win) {
      p.pvp.lp += 35;
      p.resources.gold += 1200;
      GameUI.gainExp(30);
    } else {
      p.pvp.lp = Math.max(0, p.pvp.lp - 22);
      p.resources.gold = Math.max(0, p.resources.gold - 300);
      GameUI.gainExp(10);
    }
    SaveSystem.scheduleSave();
    return { ok: true, win, league: getLeague(p.pvp.lp), staminaCost: league.staminaCost };
  }

  function summonRaidBoss() {
    const p = GameState.get(); ensureSystems(p);
    const id = `raid_${Date.now()}`;
    p.raid.instances[id] = { id, owner: p.profile.name, hp: 5000, hpMax: 5000, anger: 50, shield: 500, isSOS: false, participants: {}, securedThreshold: 700 };
    p.raid.activeId = id;
    return p.raid.instances[id];
  }

  function raidSOS(id) {
    const p = GameState.get(); ensureSystems(p);
    if (!p.raid.instances[id]) return false;
    p.raid.instances[id].isSOS = true;
    return true;
  }

  function joinRaid(id, name = 'localAI') {
    const p = GameState.get(); ensureSystems(p);
    const raid = p.raid.instances[id];
    if (!raid) return false;
    raid.participants[name] = raid.participants[name] || { dmg: 0, buffJoined: true };
    return true;
  }

  function raidAction(id, action) {
    const p = GameState.get(); ensureSystems(p);
    const raid = p.raid.instances[id];
    if (!raid) return { ok: false, reason: 'raid_not_found' };
    if (p.stats.hp < 10) return { ok: false, reason: 'hp_low' };
    let out = { ok: true, damage: 0, shield: raid.shield, anger: raid.anger };
    if (action === 'attack') {
      if (p.stats.stamina < 1) return { ok: false, reason: 'stamina_low' };
      p.stats.stamina -= 1;
      p.stats.hp = Math.max(0, p.stats.hp - 5);
      const atk = Math.max(1, Math.floor((p.stats.atk || 30) + Balance.calculateDeckPower(p).atk * 0.1));
      const effective = Math.max(1, atk - Math.floor(raid.shield * 0.2));
      raid.hp = Math.max(0, raid.hp - effective);
      raid.shield = Math.max(0, raid.shield - Math.floor(atk * 0.4));
      raid.anger = Math.min(100, raid.anger + 8);
      p.raid.damageByRaid[id] = (p.raid.damageByRaid[id] || 0) + effective;
      p.achievements.raidDamageDone += effective;
      out.damage = effective;
    } else {
      if (p.stats.energy < 1) return { ok: false, reason: 'energy_low' };
      p.stats.energy -= 1;
      raid.shield = Math.min(raid.hpMax, raid.shield + Math.max(10, Math.floor((p.stats.def || 20) * 1.2)));
      raid.anger = Math.max(0, raid.anger - Math.max(8, Math.floor((p.stats.def || 20) * 0.2)));
    }
    out.shield = raid.shield; out.anger = raid.anger; out.hp = raid.hp;
    return out;
  }

  function raidReward(id) {
    const p = GameState.get(); ensureSystems(p);
    const raid = p.raid.instances[id]; if (!raid) return null;
    const dmg = p.raid.damageByRaid[id] || 0;
    const secured = dmg >= raid.securedThreshold;
    const roll = Math.random();
    let tier = 'low';
    if (secured && roll > 0.75) tier = 'high';
    else if (secured || roll > 0.5) tier = 'mid';
    return { secured, dmg, tier };
  }

  function relation(att, def) {
    if (ELEMENT_ADV[att] === def) return 'adv';
    if (ELEMENT_ADV[def] === att) return 'dis';
    return 'neutral';
  }

  function elementalMultiplier(att, def) {
    const r = relation(att, def);
    if (r === 'adv') return { skill: 2.0, gear: 1.5, penalty: 1 };
    if (r === 'dis') return { skill: 0.5, gear: 0.5, penalty: 0.5 };
    return { skill: 1, gear: 1, penalty: 1 };
  }

  function totalCombatWithElement(defElement = 'earth') {
    const p = GameState.get(); ensureSystems(p);
    const mainId = p.gods.mainSlot;
    const god = DataAdapter.godMap.get(mainId);
    const baseAtk = p.stats.atk || 30;
    const baseDef = p.stats.def || 30;
    if (!god) return { atk: baseAtk, def: baseDef };
    const e = god.element;
    const mul = elementalMultiplier(e, defElement);
    const s = p.skills[e] || { atk: 0, def: 0 };
    return {
      atk: baseAtk + (s.atk * 5 * mul.skill) + ((god.atk || 0) * 0.1 * mul.gear),
      def: baseDef + (s.def * 5 * mul.skill) + ((god.def || 0) * 0.1 * mul.gear),
      relation: relation(e, defElement),
      element: e,
    };
  }

  window.GodWarsSystems = {
    LEAGUES,
    ensureSystems,
    runMission,
    isMainUnlocked,
    getLeague,
    grantDailyHonor,
    doPvpFight,
    summonRaidBoss,
    raidSOS,
    joinRaid,
    raidAction,
    raidReward,
    elementalMultiplier,
    totalCombatWithElement,
  };
})();
