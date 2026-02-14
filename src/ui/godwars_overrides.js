(function () {
  function getMainSubRows() {
    const rows = [];
    (window.MISSIONS || []).forEach((ch) => ch.zones.forEach((z) => z.missions.forEach((m) => rows.push({ chapter: ch, zone: z, mission: m }))));
    return rows;
  }

  function renderQuest(el, modal, toast) {
    const p = GameState.get();
    GodWarsSystems.ensureSystems(p);
    const rows = getMainSubRows();
    let html = `<h2 class='section-title'>임무(data_missions.js 기준)</h2>`;
    rows.forEach(({ chapter, zone, mission }) => {
      const chapterOpen = !!p.missionState.unlockedChapters[chapter.chapterId];
      const key = `${zone.zoneId}:${mission.id}`;
      const rank = p.missionState.zoneRanks[key] || 1;
      const progress = p.missionState.missionProgress[`${key}:r${rank}`] || 0;
      const mastered = !!p.missionState.zoneMastered[key];
      const canMain = mission.type === 'main' ? GodWarsSystems.isMainUnlocked(p, zone.zoneId) : true;
      const locked = !chapterOpen || !canMain;
      html += `<div class='card-item'><div class='card-info'><div class='card-title'>[${chapter.chapterId}-${zone.zoneId}] ${mission.name} (${mission.type})</div>
      <div class='card-meta'>E:${mission.reqEnergy} / G:${mission.rewardGold} / XP:${mission.rewardXp} | Rank ${rank} | ${mastered ? 'Master' : progress + '%'}</div></div>
      <div class='card-action'><button class='btn-action ${locked ? '' : 'primary'}' data-mission='${mission.id}' ${locked ? 'disabled' : ''}>실행</button></div></div>`;
    });
    el.innerHTML = html;
    el.querySelectorAll('[data-mission]').forEach((b) => b.onclick = () => {
      const r = GodWarsSystems.runMission(b.dataset.mission);
      if (!r.ok) return toast(`실패: ${r.reason}`);
      toast('임무 완료');
      GameUI.updateHeader();
      renderQuest(el, modal, toast);
    });
  }

  function renderBattle(el, modal, toast) {
    const p = GameState.get(); GodWarsSystems.ensureSystems(p);
    const lg = GodWarsSystems.getLeague(p.pvp.lp);
    const raid = p.raid.activeId ? p.raid.instances[p.raid.activeId] : null;
    el.innerHTML = `<h2 class='section-title'>대결/PVP + SOS 레이드</h2>
    <div class='card-item'><div class='card-info'><div class='card-title'>리그 ${lg.id} (${p.pvp.lp} LP)</div><div class='card-meta'>명예 ${p.pvp.honor} | 노출:${p.pvp.visible ? 'ON' : 'OFF'}</div></div>
    <div class='card-action'><button class='btn-action' id='honor'>일일 명예</button><button class='btn-action primary' id='pvp'>PVP(소모 ${lg.staminaCost})</button></div></div>
    <div class='card-item'><div class='card-info'><div class='card-title'>보스 레이드</div><div class='card-meta'>HP<20 PVP불가 / HP<10 레이드불가 규칙 적용</div></div>
    <div class='card-action'><button class='btn-action' id='summon'>소환</button><button class='btn-action' id='sos'>SOS</button><button class='btn-action' id='join'>참여</button></div></div>
    ${raid ? `<div class='card-item'><div class='card-info'><div class='card-title'>활성 레이드 ${raid.id}</div><div class='card-meta'>HP ${raid.hp}/${raid.hpMax} | Shield ${raid.shield} | Anger ${raid.anger} | SOS:${raid.isSOS}</div></div>
    <div class='card-action'><button class='btn-action primary' id='rAtk'>공격(STM)</button><button class='btn-action' id='rDef'>방어(ENG)</button><button class='btn-action' id='rReward'>보상</button></div></div>` : ''}`;

    document.getElementById('honor').onclick = () => { toast(GodWarsSystems.grantDailyHonor() ? '명예 지급' : '지급 불가'); GameUI.renderTab(); };
    document.getElementById('pvp').onclick = () => {
      const r = GodWarsSystems.doPvpFight();
      if (!r.ok) return toast(`PVP 실패:${r.reason}`);
      toast(r.win ? '승리' : '패배'); GameUI.updateHeader(); GameUI.renderTab();
    };
    document.getElementById('summon').onclick = () => { const rr = GodWarsSystems.summonRaidBoss(); toast(`소환 ${rr.id}`); GameUI.renderTab(); };
    document.getElementById('sos').onclick = () => { if (!p.raid.activeId) return toast('활성 레이드 없음'); GodWarsSystems.raidSOS(p.raid.activeId); toast('SOS 공유'); GameUI.renderTab(); };
    document.getElementById('join').onclick = () => { if (!p.raid.activeId) return toast('활성 레이드 없음'); GodWarsSystems.joinRaid(p.raid.activeId); toast('마법참여 완료'); };
    if (raid) {
      document.getElementById('rAtk').onclick = () => { const r = GodWarsSystems.raidAction(raid.id, 'attack'); toast(r.ok ? `피해 ${r.damage}` : r.reason); GameUI.updateHeader(); GameUI.renderTab(); };
      document.getElementById('rDef').onclick = () => { const r = GodWarsSystems.raidAction(raid.id, 'defend'); toast(r.ok ? `방벽 ${r.shield}` : r.reason); GameUI.updateHeader(); GameUI.renderTab(); };
      document.getElementById('rReward').onclick = () => { const r = GodWarsSystems.raidReward(raid.id); if (r) toast(`보상등급 ${r.tier} (확보:${r.secured})`); };
    }
  }

  function renderUnit(el, toast) {
    const p = GameState.get(); GodWarsSystems.ensureSystems(p);
    const gods = DataAdapter.gods.slice(0, 30);
    const combat = GodWarsSystems.totalCombatWithElement('wind');
    let html = `<h2 class='section-title'>신 카드/속성/스킬</h2><div class='card-item'><div class='card-info'><div class='card-title'>주신:${p.gods.mainSlot || '-'} | 최종 ATK ${Math.floor(combat.atk)} / DEF ${Math.floor(combat.def)}</div><div class='card-meta'>관계:${combat.relation || 'neutral'} | Lv20+ 스킬 습득 가능(포인트:${p.skills.points})</div></div></div>`;
    gods.forEach((g) => {
      const owned = p.units[g.id] || 0;
      const dispatched = p.gods.dispatched[g.id] || 0;
      const canDispatch = owned > 0;
      html += `<div class='card-item'><div class='card-info'><div class='card-title'>${g.name}(${g.element})</div><div class='card-meta'>보유:${owned} 파견:${dispatched} | cat:${g.category || 'basic'} | rarity:${g.tier || g.rank} | mainBuff:${g.mainBuff || '-'} subBuff:${g.subBuff || '-'}</div></div>
      <div class='card-action'><button class='btn-action' data-main='${g.id}'>주신</button><button class='btn-action' data-dispatch='${g.id}' ${canDispatch ? '' : 'disabled'}>파견</button><button class='btn-action' data-recall='${g.id}' ${dispatched ? '' : 'disabled'}>회수</button></div></div>`;
    });
    html += `<div class='card-item'><div class='card-info'><div class='card-title'>속성 스킬</div><div class='card-meta'>불/물/바람/땅 atk/def(+골드) | 우위 스킬2배 장비1.5배, 열세0.5배</div></div>
    <div class='card-action'><button class='btn-action primary' id='learnFireAtk'>불ATK</button></div></div>`;
    el.innerHTML = html;
    el.querySelectorAll('[data-main]').forEach((b) => b.onclick = () => { p.gods.mainSlot = b.dataset.main; SaveSystem.scheduleSave(); GameUI.renderTab(); });
    el.querySelectorAll('[data-dispatch]').forEach((b) => b.onclick = () => { const id = b.dataset.dispatch; if ((p.units[id] || 0) < 1) return; p.units[id] -= 1; p.gods.dispatched[id] = (p.gods.dispatched[id] || 0) + 1; SaveSystem.scheduleSave(); GameUI.renderTab(); });
    el.querySelectorAll('[data-recall]').forEach((b) => b.onclick = () => { const id = b.dataset.recall; if ((p.gods.dispatched[id] || 0) < 1) return; p.gods.dispatched[id] -= 1; p.units[id] = (p.units[id] || 0) + 1; SaveSystem.scheduleSave(); GameUI.renderTab(); });
    document.getElementById('learnFireAtk').onclick = () => {
      if (p.profile.level < 20) return toast('20레벨 필요');
      if (p.skills.points < 1 || p.resources.gold < 500) return toast('포인트/골드 부족');
      p.skills.points -= 1; p.resources.gold -= 500; p.skills.fire.atk += 1; SaveSystem.scheduleSave(); GameUI.renderTab();
    };
  }

  window.UITabs.renderQuest = renderQuest;
  window.UITabs.renderBattle = renderBattle;
  window.UITabs.renderUnit = renderUnit;
})();
