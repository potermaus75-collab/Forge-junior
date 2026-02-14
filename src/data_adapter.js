(function () {
  const mythMap = { gr: 'greek', kr: 'korean', nr: 'norse', eg: 'egypt' };
  const defaultSkills = {
    c: [{ id: 'basic_strike', name: '강타', type: 'damage', power: 1.0, cooldown: 0 }],
    uc: [{ id: 'burning_hit', name: '화상 타격', type: 'dot', power: 0.8, dotTurns: 3, dotRate: 0.2, cooldown: 2 }],
    r: [{ id: 'shield_break', name: '방패 분쇄', type: 'damage', power: 1.2, defShred: 0.1, cooldown: 2 }],
    e: [{ id: 'stun_blow', name: '기절 강타', type: 'stun', power: 0.9, stunRate: 0.2, stunTurns: 1, cooldown: 3 }],
    l: [{ id: 'divine_heal', name: '신성 치유', type: 'heal', power: 0.35, cooldown: 3 }],
    g: [{ id: 'god_wrath', name: '신의 분노', type: 'damage', power: 1.8, critBonus: 0.2, cooldown: 2 }],
  };

  const gods = GODS.map((g, idx) => {
    const tokens = g.id.split('_');
    const mythKey = tokens[1] || 'gr';
    const category = g.category || (idx % 7 === 0 ? 'limited' : idx % 6 === 0 ? 'honor_shop' : idx % 5 === 0 ? 'event' : idx % 4 === 0 ? 'support_shop' : idx % 3 === 0 ? 'craft_only' : 'basic_shop');
    return {
      ...g,
      category,
      tier: g.tier || (g.rank === 'c' ? '1st' : g.rank === 'r' ? '2nd' : g.rank === 'g' ? '3rd' : '1st'),
      mainBuff: g.mainBuff || (g.element === 'fire' || g.element === 'wind' ? 'ATK%+' : 'DEF%+'),
      subBuff: g.subBuff || (g.element === 'water' || g.element === 'earth' ? 'Shield+' : 'StaminaRegen+'),
      slotConstraint: g.slotConstraint || 'any',
      condition: g.condition || { type: 'adjacent_element', value: g.element },
      awakenTo: g.awakenTo || null,
      summonCost: g.summonCost ?? g.cost ?? 100,
      upkeepPerMin: g.upkeepPerMin ?? Math.max(1, Math.floor((g.cost ?? 10) / 4)),
      myth: g.myth ?? mythMap[mythKey] ?? 'mixed',
      skills: Array.isArray(g.skills) && g.skills.length ? g.skills : defaultSkills[g.rank] || defaultSkills.c,
    };
  });

  const itemMap = new Map(ITEMS.map((i) => [i.id, i]));
  const godMap = new Map(gods.map((g) => [g.id, g]));
  const buildingMap = new Map(BUILDINGS.map((b) => [b.id, b]));
  const bossMap = new Map(Object.entries(BOSSES));
  const recipeMap = new Map(RECIPES.map((r) => [r.id, r]));

  function getQuestList() {
    const list = [];
    Object.entries(QUESTS).forEach(([chapterId, chapter]) => {
      chapter.list.forEach((q) => list.push({ ...q, chapterId, chapterName: chapter.name }));
    });
    return list;
  }

  window.DataAdapter = {
    gods,
    items: ITEMS,
    buildings: BUILDINGS,
    bosses: BOSSES,
    recipes: RECIPES,
    quests: QUESTS,
    itemMap,
    godMap,
    buildingMap,
    bossMap,
    recipeMap,
    getQuestList,
  };
})();
