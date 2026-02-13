(function () {
  window.selfTest = function selfTest() {
    const results = [];
    try {
      const p = GameState.get();
      const originalTitle = p.profile.title;
      p.profile.title = '초심자';
      const beforeTitle = Balance.calculateDeckPower(p).atk;
      p.profile.title = '숙련된 모험가';
      const afterTitle = Balance.calculateDeckPower(p).atk;
      p.profile.title = originalTitle;
      results.push({ name: 'title_buff', pass: afterTitle > beforeTitle });

      const oldDeck = [...p.deck];
      p.deck = ['g_gr_c1'];
      const p1 = Balance.calculateDeckPower(p).atk;
      p.deck = ['g_gr_c1', 'g_gr_c1', 'g_gr_c1'];
      const p2 = Balance.calculateDeckPower(p).atk;
      results.push({ name: 'deck_power_scaling', pass: p2 > p1 });
      p.deck = oldDeck;

      const migrated = SaveSystem.migrateSave({ saveVersion: 0, units: [{ id: 'g_gr_c1', count: 2 }] });
      results.push({ name: 'save_migration', pass: migrated.saveVersion === GameState.SAVE_VERSION || migrated.saveVersion === 4 });

      const battle = CombatEngine.simulateBossBattle(p, 'boss_s_01');
      results.push({ name: 'battle_simulation', pass: battle.ok && Array.isArray(battle.logs) });

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
