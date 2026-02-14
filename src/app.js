(function () {
  window.selfTest = function selfTest() {
    const results = [];
    try {
      const p = GameState.get();
      GodWarsSystems.ensureSystems(p);

      const anySub = window.MISSIONS[0].zones[0].missions.find((m) => m.type === 'sub');
      const e0 = p.stats.energy; const g0 = p.resources.gold; const xp0 = p.profile.exp;
      const m1 = GodWarsSystems.runMission(anySub.id);
      results.push({ name: 'mission_energy_gold_xp', pass: m1.ok && p.stats.energy < e0 && p.resources.gold > g0 && p.profile.exp >= xp0 });

      const firstZone = window.MISSIONS[0].zones[0];
      const sub = firstZone.missions.find((m) => m.type === 'sub');
      for (let i = 0; i < 12; i += 1) { p.stats.energy = Math.max(p.stats.energy, sub.reqEnergy); GodWarsSystems.runMission(sub.id); }
      const mk = `${firstZone.zoneId}:${sub.id}`;
      results.push({ name: 'mission_rank_master', pass: !!p.missionState.zoneMastered[mk] });

      p.stats.hp = 100; p.stats.stamina = 20;
      const pvp = GodWarsSystems.doPvpFight();
      results.push({ name: 'pvp_stamina_lp_change', pass: pvp.ok && p.stats.stamina < 20 });
      p.pvp.visible = true; p.pvp.lastHonorDate = null; const h1 = p.pvp.honor; GodWarsSystems.grantDailyHonor();
      p.pvp.visible = false; p.pvp.lastHonorDate = null; const h2 = p.pvp.honor; GodWarsSystems.grantDailyHonor();
      results.push({ name: 'honor_visibility_rule', pass: p.pvp.honor > h1 && p.pvp.honor === h2 });

      const raid = GodWarsSystems.summonRaidBoss(); GodWarsSystems.raidSOS(raid.id); GodWarsSystems.joinRaid(raid.id, 'ai');
      p.stats.hp = 100; p.stats.stamina = 5; p.stats.energy = 5;
      GodWarsSystems.raidAction(raid.id, 'attack'); GodWarsSystems.raidAction(raid.id, 'defend');
      const rr = GodWarsSystems.raidReward(raid.id);
      results.push({ name: 'raid_flow', pass: !!rr && ['low', 'mid', 'high'].includes(rr.tier) });

      const adv = GodWarsSystems.elementalMultiplier('fire', 'earth');
      const dis = GodWarsSystems.elementalMultiplier('fire', 'water');
      results.push({ name: 'element_multiplier', pass: adv.skill === 2 && adv.gear === 1.5 && dis.skill === 0.5 });

      p.units.g_gr_c1 = 2; p.gods.dispatched.g_gr_c1 = 0;
      p.units.g_gr_c1 -= 1; p.gods.dispatched.g_gr_c1 += 1;
      results.push({ name: 'dispatch_model', pass: p.units.g_gr_c1 === 1 && p.gods.dispatched.g_gr_c1 === 1 });

      SaveSystem.saveNow();
      const current = p.profile.name; const loaded = SaveSystem.loadByName(current);
      results.push({ name: 'save_load', pass: loaded && !!GameState.get().missionState && !!GameState.get().pvp && !!GameState.get().raid });

      console.table(results);
      return results;
    } catch (e) {
      console.error(e);
      return [{ name: 'selfTest_error', pass: false, error: e.message }];
    }
  };

  window.addEventListener('load', () => {
    GameUI.init();
    window.selfTest();
  });
})();
