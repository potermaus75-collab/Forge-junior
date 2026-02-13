(function () {
  function unitName(id) { return DataAdapter.godMap.get(id)?.name || id; }
  function itemName(id) { return DataAdapter.itemMap.get(id)?.name || id || '-'; }
  function rankLabel(rank) { return ({ c: '일반', uc: '고급', r: '희귀', e: '영웅', l: '전설', g: '신화' }[rank] || '기타'); }

  function unitIcon(entity) {
    const myth = (entity.id || '').split('_')[1];
    const mythIcon = { gr: '🏺', kr: '🇰🇷', nr: '🪓', eg: '𓂀' }[myth] || '🛡️';
    const rankIcon = { c: '·', uc: '✦', r: '◆', e: '✸', l: '✹', g: '☀' }[entity.rank] || '';
    return `${mythIcon}${rankIcon}`;
  }

  function questTone(chapterId) {
    return ({ ch1: 'fire', ch2: 'earth', ch3: 'water', ch4: 'wind' }[chapterId] || 'neutral');
  }

  function questIcon(q) {
    if (q.type === 'boss') return '👑';
    if (q.id.includes('ch1')) return '🏛️';
    if (q.id.includes('ch2')) return '⛰️';
    if (q.id.includes('ch3')) return '❄️';
    if (q.id.includes('ch4')) return '🏜️';
    return '📜';
  }

  function portrait(kind, entity, forcedTone) {
    const tone = forcedTone || entity.element || entity.type || 'neutral';
    let icon = '🛡️';
    if (kind === 'boss') icon = entity.id?.includes('_l_') ? '🐲' : entity.id?.includes('_m_') ? '🧿' : '👹';
    if (kind === 'item') icon = entity.slot === 'weapon' ? '⚔️' : entity.slot === 'armor' ? '🛡️' : entity.type === 'material' ? '🧪' : '🎒';
    if (kind === 'unit') icon = unitIcon(entity);
    if (kind === 'quest') icon = questIcon(entity);
    return `<div class='portrait ${kind}' data-tone='${tone}' data-key='${entity.id || ''}'><span>${icon}</span></div>`;
  }

  function renderHome(el) {
    const p = GameState.get();
    const deck = Balance.calculateDeckPower(p);
    const econ = Balance.calcEconomyPerMin(p);
    el.innerHTML = `<h2 class='section-title'>대시보드</h2>
      <div class='card-item'><div class='card-info'><div class='card-title'>덱 전투력</div><div class='card-meta'>ATK ${deck.atk} / DEF ${deck.def} / ${deck.count}/${deck.capacity}</div></div></div>
      <div class='card-item'><div class='card-info'><div class='card-title'>경제</div><div class='card-meta'>수익 ${econ.income}/분 | 업킵 ${econ.upkeep}/분 | 순이익 ${econ.net}/분</div></div></div>
      <div class='card-item'><div class='card-info'><div class='card-title'>튜토리얼 체크</div><div class='card-meta'>보스 1회 처치, 제작 1회, 퀘스트 마스터 완료를 달성하세요.</div></div></div>`;
  }

  function ensureQuestState(p) {
    p.quests.cycles = p.quests.cycles || {};
    p.quests.progress = p.quests.progress || {};
    p.quests.completed = p.quests.completed || {};
    p.quests.claimed = p.quests.claimed || {};
    p.quests.doneCycles = p.quests.doneCycles || {};
    p.quests.chapterCycle = p.quests.chapterCycle || {};
  }

  function cycleTarget(q, cycle) {
    const baseRaw = Number(q.mastery_max);
    const base = Number.isFinite(baseRaw) ? baseRaw : 100;
    const c = Number.isFinite(Number(cycle)) ? Number(cycle) : 1;
    return base + ((c - 1) * 50);
  }

  function chapterQuestList(chapter) {
    return chapter.list.filter((q) => !!q.id);
  }

  function ensureQuestState(p) {
    p.quests.cycles = p.quests.cycles || {};
    p.quests.progress = p.quests.progress || {};
    p.quests.completed = p.quests.completed || {};
    p.quests.claimed = p.quests.claimed || {};
  }

  function cycleTarget(cycle) { return 100 + ((cycle - 1) * 50); }

  function renderQuest(el, modal, toast) {
    const p = GameState.get();
    ensureQuestState(p);
    el.innerHTML = `<h2 class='section-title'>퀘스트</h2><div class='card-item'><div class='card-info'>지역별로 1사이클 전체 완료 시 2사이클, 2사이클 전체 완료 시 3사이클(마스터)이 열립니다.</div></div>`;

    Object.entries(QUESTS).forEach(([chapterId, chapter]) => {
      const chCycle = p.quests.chapterCycle[chapterId] || 1;
      el.innerHTML += `<div class='card-item chapter-banner'>${portrait('quest', { id: chapterId }, questTone(chapterId))}<div class='card-info'><div class='card-title'>${chapter.name}</div><div class='card-meta'>현재 지역 사이클: ${chCycle}/3</div></div></div>`;

      chapterQuestList(chapter).forEach((q) => {
        const doneCycle = p.quests.doneCycles[q.id] || 0;
        const masterDone = doneCycle >= 3;
        if (masterDone) p.quests.completed[q.id] = true;
        const target = cycleTarget(q, chCycle);
        const key = `${q.id}:c${chCycle}`;
        const prog = Math.min(target, p.quests.progress[key] || 0);
        const doneThisCycle = doneCycle >= chCycle;

        const stateText = masterDone
          ? '마스터 완료'
          : doneThisCycle
            ? `${chCycle}/3 사이클 완료 (다른 임무 대기)`
            : `${chCycle}/3 사이클 (${prog}/${target}%)`;
        const btnText = masterDone
          ? (p.quests.claimed[q.id] ? '수령완료' : '보상수령')
          : (doneThisCycle ? '대기' : '진행');

        el.innerHTML += `<div class='card-item'>${portrait('quest', q, questTone(chapterId))}<div class='card-info'><div class='card-title'>${q.name}</div><div class='card-meta'>${stateText}</div></div>
          <div class='card-action'><button class='btn-action ${(masterDone || doneThisCycle) ? 'primary' : ''}' data-q='${q.id}' data-ch='${chapterId}'>${btnText}</button></div></div>`;
      });
    });

    el.querySelectorAll('[data-q]').forEach((btn) => btn.onclick = () => {
      const p2 = GameState.get();
      const id = btn.dataset.q;
      const chapterId = btn.dataset.ch;
      const chapter = QUESTS[chapterId];
      const q = chapter.list.find((x) => x.id === id);
      const chCycle = p2.quests.chapterCycle[chapterId] || 1;
      const doneCycle = p2.quests.doneCycles[id] || 0;

      if (doneCycle >= 3 && !p2.quests.claimed[id]) {
        p2.quests.claimed[id] = true;
        p2.resources.gold += q.rew_gold_max || 100;
        GameUI.gainExp((q.rew_exp || 10) * 2);
        toast('마스터 퀘스트 보상 수령'); SaveSystem.saveNow(); renderQuest(el, modal, toast); GameUI.updateHeader(); return;
      }
      if (doneCycle >= 3) return;
      if (doneCycle >= chCycle) return toast('해당 사이클 완료. 지역 내 다른 임무를 완료하세요.');
      if (p2.stats.energy < (q.req_energy || 1)) return toast('에너지 부족');

      p2.stats.energy -= q.req_energy || 1;
      const target = cycleTarget(q, chCycle);
      const key = `${id}:c${chCycle}`;
      const gain = 10 + ((chCycle - 1) * 5);
      p2.quests.progress[key] = (p2.quests.progress[key] || 0) + gain;
      p2.resources.gold += q.rew_gold_min || 0;
      GameUI.gainExp(q.rew_exp || 1);
      if (q.drop_item_id && Math.random() < (q.drop_rate || 0)) GameState.gainItem(q.drop_item_id, 1);

      if (p2.quests.progress[key] >= target) {
        p2.quests.doneCycles[id] = Math.max(doneCycle, chCycle);
        p2.quests.progress[key] = target;
        toast(`${q.name} ${chCycle}사이클 완료!`);

        const allDoneInCycle = chapterQuestList(chapter).every((qq) => (p2.quests.doneCycles[qq.id] || 0) >= chCycle);
        if (allDoneInCycle && chCycle < 3) {
          p2.quests.chapterCycle[chapterId] = chCycle + 1;
          toast(`${chapter.name} ${chCycle}사이클 전체 완료! ${chCycle + 1}사이클 오픈`);
        } else if (allDoneInCycle && chCycle === 3) {
          toast(`${chapter.name} 마스터 사이클 완료!`);
        }
      } else toast(`${q.name} 진행 +${gain}%`);

      SaveSystem.scheduleSave();
      renderQuest(el, modal, toast);
      GameUI.updateHeader();
    });
  }

  function availableBosses() {
    const month = new Date().getMonth();
    return Object.entries(BOSSES).filter(([id, b]) => b.rank !== 'event' || ((month + id.length) % 2 === 0));
  }

  function openBattlePlayback(boss, result) {
    const totalTurns = Math.max(1, result.turns.length);
    const html = `<div class='battle-scene'>
      <div class='battle-head'><strong>${boss.name}</strong> 자동전투 재생</div>
      <div class='hp-row'><span>아군 HP</span><div class='hp-track'><div id='team-hp' class='hp-fill ally' style='width:100%'></div></div><span id='team-hp-text'>${result.teamHpMax}/${result.teamHpMax}</span></div>
      <div class='hp-row'><span>보스 HP</span><div class='hp-track'><div id='boss-hp' class='hp-fill boss' style='width:100%'></div></div><span id='boss-hp-text'>${result.bossHpMax}/${result.bossHpMax}</span></div>
      <div id='battle-turn' class='battle-turn'>T0/${totalTurns}</div>
      <div id='battle-log-box' class='battle-log-box'></div>
    </div>`;
    GameUI.modal('전투 리플레이', html);
    const logBox = document.getElementById('battle-log-box');
    const teamBar = document.getElementById('team-hp');
    const bossBar = document.getElementById('boss-hp');
    const teamTxt = document.getElementById('team-hp-text');
    const bossTxt = document.getElementById('boss-hp-text');
    const turnText = document.getElementById('battle-turn');

    let i = 0;
    const timer = setInterval(() => {
      if (i >= totalTurns) {
        clearInterval(timer);
        return;
      }
      const frame = result.turns[i];
      teamBar.style.width = `${Math.max(0, Math.min(100, (frame.teamHp / result.teamHpMax) * 100))}%`;
      bossBar.style.width = `${Math.max(0, Math.min(100, (frame.bossHp / result.bossHpMax) * 100))}%`;
      teamTxt.textContent = `${frame.teamHp}/${result.teamHpMax}`;
      bossTxt.textContent = `${frame.bossHp}/${result.bossHpMax}`;
      turnText.textContent = `T${frame.turn}/${totalTurns}`;
      logBox.innerHTML += `<div>${frame.log}</div>`;
      logBox.scrollTop = logBox.scrollHeight;
      i += 1;
    }, 180);
  }

  function renderBattle(el, modal, toast) {
    const p = GameState.get();
    const deck = Balance.calculateDeckPower(p);
    const deckNames = (p.deck || []).map(unitName).join(', ');
    el.innerHTML = `<h2 class='section-title'>보스 전투</h2><div class='card-item'><div class='card-info'><div class='card-title'>현재 덱</div><div class='card-meta'>${deckNames || '없음'} | 전투력 ${deck.atk + deck.def}</div></div></div>`;
    availableBosses().forEach(([id, b]) => {
      const cd = (p.bossCd[id] || 0) - Date.now();
      el.innerHTML += `<div class='card-item'>${portrait('boss', { ...b, id })}<div class='card-info'><div class='card-title'>${b.name}</div><div class='card-meta'>STM ${b.req_stamina} | 제한 ${Math.floor(b.time_limit / 60)}분 | CD <span id='cd-${id}'>${cd > 0 ? Math.ceil(cd / 1000) : 0}</span></div></div><div class='card-action'><button class='btn-action primary' data-boss='${id}'>입장</button></div></div>`;
    });
    el.querySelectorAll('[data-boss]').forEach((btn) => btn.onclick = () => {
      const id = btn.dataset.boss;
      const boss = BOSSES[id];
      if ((p.bossCd[id] || 0) > Date.now()) return toast('쿨다운');
      if (p.stats.stamina < boss.req_stamina) return toast('스태미나 부족');
      p.stats.stamina -= boss.req_stamina;
      const result = CombatEngine.simulateBossBattle(p, id);
      p.battle.log = result.logs || [];
      p.stats.hp = result.playerHpAfter;
      if (result.win) {
        GameUI.gainExp(result.rewards.exp);
        p.resources.gold += result.rewards.gold;
        p.metrics.bossKills += 1;
        if (DataAdapter.godMap.has(result.rewards.card)) GameState.gainUnit(result.rewards.card, 1);
        else GameState.gainItem(result.rewards.card, 1);
        result.rewards.extraDrops.forEach((d) => GameState.gainItem(d.id, d.count));
        p.bossCd[id] = Date.now() + Math.min(3600 * 1000, boss.time_limit * 1000);
      } else p.metrics.battlesLost += 1;

      p.battle.lastResult = result;
      SaveSystem.saveNow();
      renderBattle(el, modal, toast);
      openBattlePlayback(boss, result);
      setTimeout(() => {
        if (result.win) modal('승리', `${boss.name} 처치 성공`);
        else modal('패배', result.timeout ? '시간 초과' : '전멸');
      }, Math.min(4000, Math.max(1000, result.turns.length * 180 + 200)));
      GameUI.updateHeader();
    });
  }

  function updateBattleTimer() {
    const p = GameState.get();
    Object.keys(BOSSES).forEach((id) => {
      const node = document.getElementById(`cd-${id}`);
      if (!node) return;
      const left = Math.max(0, Math.ceil(((p.bossCd[id] || 0) - Date.now()) / 1000));
      node.textContent = `${left}s`;
    });
  }

  function autoDeck() {
    const p = GameState.get();
    const cap = GameState.deckCapacity();
    p.deck.forEach((id) => GameState.gainUnit(id, 1));
    p.deck = [];
    const arr = Object.entries(p.units)
      .map(([id, c]) => ({ id, c, g: DataAdapter.godMap.get(id) }))
      .filter((x) => x.g)
      .sort((a, b) => (b.g.atk + b.g.def) - (a.g.atk + a.g.def));
    arr.forEach((u) => {
      for (let i = 0; i < u.c && p.deck.length < cap; i += 1) {
        if (GameState.consumeUnit(u.id, 1)) p.deck.push(u.id);
      }
    });
  }

  function renderUnit(el, toast) {
    const p = GameState.get();
    const cap = GameState.deckCapacity();
    const deckNames = (p.deck || []).map(unitName).join(', ');
    el.innerHTML = `<h2 class='section-title'>부대 & 덱 편성</h2><button class='btn-action' id='btn-auto'>자동 정렬</button><div class='card-item'><div class='card-info'>덱 ${p.deck.length}/${cap}: ${deckNames || '없음'}</div></div>`;
    Object.entries(p.units).forEach(([id, count]) => {
      const g = DataAdapter.godMap.get(id); if (!g) return;
      el.innerHTML += `<div class='card-item'>${portrait('unit', g)}<div class='card-info'><div class='card-title'>${g.name}</div><div class='card-meta'>등급 ${rankLabel(g.rank)} | 보유 ${count}</div></div><div class='card-action'><button class='btn-action' data-add='${id}'>추가</button><button class='btn-action' data-rem='${id}'>제거</button></div></div>`;
    });
    document.getElementById('btn-auto').onclick = () => { autoDeck(); SaveSystem.saveNow(); renderUnit(el, toast); };
    el.querySelectorAll('[data-add]').forEach((b) => b.onclick = () => {
      const id = b.dataset.add;
      if (p.deck.length >= cap) return toast('capacity 초과');
      if (!GameState.consumeUnit(id, 1)) return toast('보유 수량 초과');
      p.deck.push(id); SaveSystem.saveNow(); renderUnit(el, toast);
    });
    el.querySelectorAll('[data-rem]').forEach((b) => b.onclick = () => {
      const i = p.deck.lastIndexOf(b.dataset.rem);
      if (i >= 0) {
        p.deck.splice(i, 1);
        GameState.gainUnit(b.dataset.rem, 1);
      }
      SaveSystem.scheduleSave(); renderUnit(el, toast);
    });
  }

  function useItem(id, toast) {
    const p = GameState.get();
    const item = DataAdapter.itemMap.get(id);
    if (!item || !GameState.consumeItem(id, 1)) return;
    if (item.effect === 'hp+50') p.stats.hp = Math.min(p.stats.hpMax, p.stats.hp + 50);
    if (item.effect === 'hp+100%') p.stats.hp = p.stats.hpMax;
    if (item.effect === 'energy+100%') p.stats.energy = p.stats.energyMax;
    toast(`${item.name} 사용`);
  }

  function renderInventory(el, toast) {
    const p = GameState.get();
    const equips = ITEMS.filter((i) => i.type === 'equip');
    el.innerHTML = `<h2 class='section-title'>인벤토리 / 제작</h2><div class='card-item'><div class='card-info'>장착 무기: ${itemName(p.equipment.weapon)} / 방어구: ${itemName(p.equipment.armor)}</div></div>`;
    equips.forEach((i) => {
      const own = p.inventory[i.id] || 0;
      el.innerHTML += `<div class='card-item'>${portrait('item', i)}<div class='card-info'><div class='card-title'>${i.name}</div><div class='card-meta'>보유 ${own}</div></div><div class='card-action'><button class='btn-action' data-eq='${i.id}'>장착</button><button class='btn-action' data-uneq='${i.slot}'>해제</button></div></div>`;
    });
    Object.entries(p.inventory).forEach(([id, c]) => {
      const i = DataAdapter.itemMap.get(id); if (!i || i.type === 'equip') return;
      el.innerHTML += `<div class='card-item'>${portrait('item', i)}<div class='card-info'><div class='card-title'>${i.name}</div><div class='card-meta'>x${c}</div></div><div class='card-action'>${i.type === 'consumable' ? `<button class='btn-action' data-use='${id}'>사용</button>` : ''}</div></div>`;
    });

    el.innerHTML += `<h3 class='section-title'>제작</h3>`;
    RECIPES.slice(0, 20).forEach((r) => {
      const resultName = DataAdapter.godMap.get(r.result)?.name || DataAdapter.itemMap.get(r.result)?.name || r.result;
      const mat1 = DataAdapter.godMap.get(r.mat1)?.name || DataAdapter.itemMap.get(r.mat1)?.name || r.mat1;
      const mat2 = DataAdapter.godMap.get(r.mat2)?.name || DataAdapter.itemMap.get(r.mat2)?.name || r.mat2;
      el.innerHTML += `<div class='card-item'><div class='card-info'><div class='card-title'>${resultName}</div><div class='card-meta'>${mat1} + ${mat2} | 비용 ${r.cost} | ${r.chance}%</div></div><div class='card-action'><button class='btn-action primary' data-craft='${r.id}'>제작</button></div></div>`;
    });

    el.querySelectorAll('[data-eq]').forEach((b) => b.onclick = () => {
      const item = DataAdapter.itemMap.get(b.dataset.eq);
      if ((p.inventory[item.id] || 0) <= 0) return toast('아이템 없음');
      p.equipment[item.slot] = item.id; SaveSystem.saveNow(); renderInventory(el, toast);
    });
    el.querySelectorAll('[data-uneq]').forEach((b) => b.onclick = () => { p.equipment[b.dataset.uneq] = null; SaveSystem.scheduleSave(); renderInventory(el, toast); });
    el.querySelectorAll('[data-use]').forEach((b) => b.onclick = () => { useItem(b.dataset.use, toast); SaveSystem.scheduleSave(); renderInventory(el, toast); GameUI.updateHeader(); });
    el.querySelectorAll('[data-craft]').forEach((b) => b.onclick = () => {
      const r = DataAdapter.recipeMap.get(b.dataset.craft);
      if (p.resources.gold < r.cost) return toast('골드 부족');
      if (!hasMat(p, r.mat1) || !hasMat(p, r.mat2)) return toast('재료 부족');
      p.resources.gold -= r.cost;
      consumeMat(p, r.mat1); consumeMat(p, r.mat2);
      p.metrics.crafts += 1;
      const success = Math.random() * 100 <= r.chance;
      if (success) {
        if (DataAdapter.godMap.has(r.result)) GameState.gainUnit(r.result, 1);
        else GameState.gainItem(r.result, 1);
        toast('제작 성공');
      } else toast('제작 실패');
      SaveSystem.saveNow();
      renderInventory(el, toast);
      GameUI.updateHeader();
    });
  }

  function hasMat(p, id) { return DataAdapter.godMap.has(id) ? (p.units[id] || 0) > 0 : (p.inventory[id] || 0) > 0; }
  function consumeMat(p, id) { if (DataAdapter.godMap.has(id)) GameState.consumeUnit(id, 1); else GameState.consumeItem(id, 1); }

  function pickGachaUnit() {
    const roll = Math.random() * 100;
    const rank = roll > 99 ? 'l' : roll > 95 ? 'e' : roll > 80 ? 'r' : roll > 50 ? 'uc' : 'c';
    let pool = DataAdapter.gods.filter((g) => g.rank === rank);
    if (!pool.length) pool = DataAdapter.gods.filter((g) => g.rank === 'c');
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function doGacha(toast) {
    const p = GameState.get();
    if (p.resources.gold < 1000) return toast('골드 부족');
    p.resources.gold -= 1000;
    const picked = pickGachaUnit();

    const html = `<div class='gacha-modal'>
      <div class='gacha-wheel-wrap'>
        <div id='gacha-wheel' class='gacha-wheel'>준비 중...</div>
      </div>
      <div class='gacha-hint'>신화의 룰렛이 회전합니다...</div>
      <div id='gacha-result' class='gacha-result'></div>
    </div>`;
    GameUI.modal('용병 소환', html);

    const names = DataAdapter.gods.map((g) => g.name);
    const wheel = document.getElementById('gacha-wheel');
    const resultBox = document.getElementById('gacha-result');
    let ticks = 0;
    const timer = setInterval(() => {
      if (!wheel) return;
      wheel.textContent = names[Math.floor(Math.random() * names.length)];
      ticks += 1;
      if (ticks > 28) {
        clearInterval(timer);
        wheel.textContent = `🎉 ${picked.name}`;
        resultBox.textContent = `${picked.name} 획득!`;
        GameState.gainUnit(picked.id, 1);
        SaveSystem.saveNow();
        GameUI.updateHeader();
        GameUI.renderTab();
        toast(`${picked.name} 획득`);
      }
    }, 90);
  }

  function renderShop(el, toast) {
    const p = GameState.get();
    el.innerHTML = `<h2 class='section-title'>상점</h2><div class='card-item'><div class='card-info'><div class='card-title'>용병 소환</div><div class='card-meta'>1000G</div></div><div class='card-action'><button class='btn-action primary' id='gacha'>소환</button></div></div>`;
    BUILDINGS.slice(0, 15).forEach((b) => {
      const lv = p.buildings[b.id] || 0;
      const cost = Math.floor(b.base_cost * Math.pow(1.35, lv));
      el.innerHTML += `<div class='card-item'><div class='card-info'><div class='card-title'>${b.name} Lv.${lv}</div><div class='card-meta'>수익 ${b.income}/h | ${cost}G</div></div><div class='card-action'><button class='btn-action' data-bld='${b.id}'>구매</button></div></div>`;
    });
    ITEMS.filter((i) => i.cost > 0).forEach((i) => {
      el.innerHTML += `<div class='card-item'>${portrait('item', i)}<div class='card-info'><div class='card-title'>${i.name}</div><div class='card-meta'>${i.cost}G</div></div><div class='card-action'><button class='btn-action' data-item='${i.id}'>구매</button></div></div>`;
    });
    document.getElementById('gacha').onclick = () => { doGacha(toast); GameUI.updateHeader(); };
    el.querySelectorAll('[data-bld]').forEach((b) => b.onclick = () => {
      const id = b.dataset.bld; const bd = DataAdapter.buildingMap.get(id);
      const lv = p.buildings[id] || 0; const cost = Math.floor(bd.base_cost * Math.pow(1.35, lv));
      if (p.resources.gold < cost) return toast('골드 부족');
      p.resources.gold -= cost; p.buildings[id] = lv + 1; SaveSystem.saveNow(); renderShop(el, toast); GameUI.updateHeader();
    });
    el.querySelectorAll('[data-item]').forEach((b) => b.onclick = () => {
      const it = DataAdapter.itemMap.get(b.dataset.item);
      if (p.resources.gold < it.cost) return toast('골드 부족');
      p.resources.gold -= it.cost; GameState.gainItem(it.id, 1); SaveSystem.scheduleSave(); renderShop(el, toast); GameUI.updateHeader();
    });
  }

  window.UITabs = { renderHome, renderQuest, renderBattle, renderUnit, renderInventory, renderShop, updateBattleTimer };
})();
