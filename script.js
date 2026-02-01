// --- 1. 설정 데이터 ---
const PARTS = [
    { id: 'helmet', name: '헬멧', mainStat: 'hp', icon: '🪖' },
    { id: 'armor', name: '갑옷', mainStat: 'hp', icon: '🥋' },
    { id: 'boots', name: '신발', mainStat: 'hp', icon: '👢' },
    { id: 'belt', name: '벨트', mainStat: 'hp', icon: '🎗️' },
    { id: 'weapon', name: '무기', mainStat: 'dmg', icon: '⚔️' },
    { id: 'glove', name: '장갑', mainStat: 'dmg', icon: '🥊' },
    { id: 'neck', name: '목걸이', mainStat: 'dmg', icon: '📿' },
    { id: 'ring', name: '반지', mainStat: 'dmg', icon: '💍' }
];

const GRADE_INFO = [
    { name: '원시', class: 'g-0', mul: 1.0 },
    { name: '중세', class: 'g-1', mul: 1.2 },
    { name: '근대', class: 'g-2', mul: 1.5 },
    { name: '현대', class: 'g-3', mul: 2.0 },
    { name: '우주', class: 'g-4', mul: 3.0 },
    { name: '항성', class: 'g-5', mul: 5.0 },
    { name: '다중우주', class: 'g-6', mul: 8.0 }, // 바다색
    { name: '양자', class: 'g-7', mul: 12.0 },
    { name: '지하세계', class: 'g-8', mul: 20.0 },
    { name: '신성', class: 'g-9', mul: 50.0 }
];

// 보조 옵션 정의 (최대 수치)
const SUB_STATS_CONFIG = [
    { key: 'atkSpd', name: '공격 속도', max: 40, unit: '%' },
    { key: 'block', name: '블록 확률', max: 5, unit: '%' },
    { key: 'critRate', name: '치명타 확률', max: 12, unit: '%' },
    { key: 'critDmg', name: '치명타 피해', max: 100, unit: '%' },
    { key: 'dmgPct', name: '피해', max: 15, unit: '%' },
    { key: 'doubleHit', name: '더블 찬스', max: 40, unit: '%' },
    { key: 'hpPct', name: '체력', max: 15, unit: '%' },
    { key: 'hpRegen', name: '체력 재생', max: 6, unit: '%' },
    { key: 'lifesteal', name: '생명력 흡수', max: 20, unit: '%' },
    { key: 'meleeDmg', name: '근접 피해', max: 50, unit: '%' },
    { key: 'rangeDmg', name: '원거리 피해', max: 15, unit: '%' },
    { key: 'cooldown', name: '스킬 재사용', max: 7, unit: '%' },
    { key: 'skillDmg', name: '스킬 피해', max: 30, unit: '%' }
];

// 스킬 정의
const SKILLS = {
    1: { name: "강타", cd: 5, icon: '⚡' }, // 5초 쿨타임, 강한 공격
    2: { name: "회복", cd: 10, icon: '❤️' }  // 10초 쿨타임, 체력 회복
};

// --- 2. 게임 상태 ---
let game = {
    nick: '', gold: 0, hammers: 100, anvilLv: 1, 
    stageMain: 1, stageSub: 1, equipment: {}
};
let battle = { 
    pHp: 100, pMax: 100, eHp: 100, eMax: 100, 
    stats: {}, state: 'idle', lastAtk: 0,
    skillCD: { 1: 0, 2: 0 } // 스킬 쿨타임 종료 시간
};
let tempGear = null;
let animReq = null;

// --- 3. 로직 함수 ---

// 스탯 계산
function calcStats() {
    let s = { 
        hp: 200, dmg: 20, 
        atkSpd: 0, block: 0, critRate: 5, critDmg: 150, 
        dmgPct: 0, doubleHit: 0, hpPct: 0, hpRegen: 0, 
        lifesteal: 0, meleeDmg: 0, rangeDmg: 0, 
        cooldown: 0, skillDmg: 0
    };
    
    let isRange = false;
    if(game.equipment['weapon'] && game.equipment['weapon'].isRange) isRange = true;

    // 장비 스탯 합산
    Object.values(game.equipment).forEach(g => {
        if(g.mainType === 'hp') s.hp += g.mainVal;
        if(g.mainType === 'dmg') s.dmg += g.mainVal;
        
        g.subs.forEach(sub => {
            if(s[sub.key] !== undefined) s[sub.key] += sub.val;
        });
    });

    // % 적용
    s.hp = Math.floor(s.hp * (1 + s.hpPct/100));
    s.dmg = Math.floor(s.dmg * (1 + s.dmgPct/100));
    
    // 무기 타입별 추가 피해
    if(isRange) s.dmg = Math.floor(s.dmg * (1 + s.rangeDmg/100));
    else s.dmg = Math.floor(s.dmg * (1 + s.meleeDmg/100));

    // 공속 변환 (기본 1.0 + %)
    s.finalSpd = 1.0 * (1 + s.atkSpd/100);

    battle.stats = s;
    battle.stats.isRange = isRange;
    battle.pMax = s.hp;
    if(battle.pHp > battle.pMax) battle.pHp = battle.pMax;

    // 무기 그래픽 변경
    document.getElementById('hero-weapon').className = isRange ? 'weapon bow' : 'weapon sword';
}

// 몬스터 생성 (워킹 애니메이션)
function spawnEnemy() {
    battle.state = 'walking';
    
    // 스테이지 난이도
    const factor = (game.stageMain - 1) * 10 + game.stageSub;
    const isBoss = (game.stageSub === 10);
    const isMid = (game.stageSub === 5);
    const mul = isBoss ? 5 : (isMid ? 2.5 : 1);

    // 몬스터 UI
    const mArt = document.getElementById('enemy-art');
    const badge = document.getElementById('boss-badge');
    if(isBoss || isMid) {
        mArt.classList.add('boss');
        badge.classList.remove('hidden');
        badge.innerText = isBoss ? "BOSS" : "MID";
    } else {
        mArt.classList.remove('boss');
        badge.classList.add('hidden');
    }

    // 스탯
    battle.eMax = Math.floor(100 * Math.pow(1.15, factor) * mul);
    battle.eHp = battle.eMax;
    battle.eAtk = Math.floor(10 * Math.pow(1.1, factor) * mul);

    document.getElementById('stage-num').innerText = `${game.stageMain}-${game.stageSub}`;
    updateHp();

    // 워킹 연출
    const hero = document.getElementById('hero-wrapper');
    const enemy = document.getElementById('enemy-wrapper');
    
    // 위치 리셋
    hero.className = 'unit-wrapper hero-pos';
    enemy.className = 'unit-wrapper enemy-pos';
    void hero.offsetWidth; // reflow

    // 이동 시작
    const isRange = battle.stats.isRange;
    hero.classList.add(isRange ? 'hero-walk-range' : 'hero-walk-melee');
    enemy.classList.add('enemy-walk');

    setTimeout(() => { battle.state = 'fighting'; }, 1500);
}

// 전투 루프
function gameLoop(time) {
    animReq = requestAnimationFrame(gameLoop);
    updateSkillCD(time); // 스킬 쿨타임 UI 갱신

    if(battle.state !== 'fighting') return;

    // 플레이어 공격
    const atkGap = 1000 / battle.stats.finalSpd;
    if(time - battle.lastAtk > atkGap) {
        battle.lastAtk = time;
        playerAttack();
    }

    // 적 공격 (랜덤)
    if(Math.random() < 0.02) { 
        // 블록 확률 체크
        if(Math.random() * 100 < battle.stats.block) {
            showDmg(0, false, false, true); // Blocked
        } else {
            battle.pHp -= battle.eAtk;
            if(battle.pHp <= 0) {
                battle.pHp = battle.pMax;
                battle.eHp = battle.eMax; // 재시작
            }
            updateHp();
        }
    }
}

function playerAttack() {
    // 애니메이션
    const wp = document.getElementById('hero-weapon');
    const anim = battle.stats.isRange ? 'anim-shoot' : 'anim-swing';
    wp.classList.remove(anim); void wp.offsetWidth; wp.classList.add(anim);

    // 데미지
    let dmg = battle.stats.dmg;
    let isCrit = Math.random() * 100 < battle.stats.critRate;
    if(isCrit) dmg *= (battle.stats.critDmg / 100);

    hitEnemy(dmg, isCrit, false);

    // 더블 찬스
    if(Math.random() * 100 < battle.stats.doubleHit) {
        setTimeout(() => hitEnemy(dmg, false, true), 150);
    }
}

function hitEnemy(dmg, isCrit, isDouble) {
    battle.eHp -= dmg;
    showDmg(Math.floor(dmg), isCrit, isDouble, false);
    
    // 피격 모션
    const en = document.getElementById('enemy-art');
    en.classList.remove('anim-hit'); void en.offsetWidth; en.classList.add('anim-hit');

    // 흡혈
    if(battle.stats.lifesteal > 0) {
        battle.pHp = Math.min(battle.pMax, battle.pHp + dmg * (battle.stats.lifesteal/100));
    }
    updateHp();

    if(battle.eHp <= 0) {
        winStage();
    }
}

function winStage() {
    battle.state = 'idle';
    game.gold += (game.stageMain * 10 + game.stageSub) * 5;
    game.hammers += 2;
    updateRes();
    
    game.stageSub++;
    if(game.stageSub > 10) { game.stageMain++; game.stageSub = 1; }

    const en = document.getElementById('enemy-wrapper');
    en.style.transform = 'translateY(100px) scale(0)';
    setTimeout(spawnEnemy, 1000);
}

// --- 4. 스킬 시스템 ---
function useSkill(slotId) {
    if(battle.state !== 'fighting') return;
    const now = Date.now();
    if(now < battle.skillCD[slotId]) return; // 쿨타임 중

    const skill = SKILLS[slotId];
    // 쿨타임 적용 (CDR 적용)
    const cdr = battle.stats.cooldown; 
    const realCD = skill.cd * 1000 * (1 - cdr/100);
    battle.skillCD[slotId] = now + realCD;

    // 효과 발동
    if(slotId === 1) { // 강타
        let dmg = battle.stats.dmg * 3 * (1 + battle.stats.skillDmg/100);
        hitEnemy(dmg, true, false); // 확정 크리티컬
    } else if(slotId === 2) { // 회복
        let heal = battle.pMax * 0.3 * (1 + battle.stats.skillDmg/100); // 30% 회복
        battle.pHp = Math.min(battle.pMax, battle.pHp + heal);
        updateHp();
    }
}

function updateSkillCD(now) {
    for(let i=1; i<=2; i++) {
        const end = battle.skillCD[i];
        const el = document.getElementById(`cd-${i}`);
        if(now >= end) {
            el.style.height = '0%';
        } else {
            const skill = SKILLS[i];
            const cdr = battle.stats.cooldown;
            const total = skill.cd * 1000 * (1 - cdr/100);
            const remain = end - now;
            const pct = (remain / total) * 100;
            el.style.height = `${pct}%`;
        }
    }
}

// --- 5. 장비 제작 (중복 옵션 방지 로직) ---
function craftGear() {
    if(game.hammers < 10) return alert("망치 부족!");
    game.hammers -= 10;
    updateRes();

    // 부위 랜덤
    const p = PARTS[Math.floor(Math.random() * PARTS.length)];
    // 등급 (모루 레벨 영향)
    const maxG = Math.min(9, Math.floor(game.anvilLevel/3) + 2);
    const minG = Math.max(0, Math.floor(game.anvilLevel/5) - 1);
    const gIdx = Math.floor(Math.random()*(maxG - minG + 1)) + minG;
    const grade = GRADE_INFO[gIdx];

    const lv = Math.max(1, (game.anvilLevel * 5) + Math.floor(Math.random()*10));
    const mainVal = Math.floor(lv * 10 * grade.mul);
    
    // 무기 원거리 여부
    const isRange = (p.id === 'weapon' && Math.random() > 0.5);

    // [중복 방지] 보조 옵션 뽑기
    const subCount = Math.floor(Math.random()*3) + 1; // 1~3개
    let availSubs = [...SUB_STATS_CONFIG]; // 복사본 생성
    let subs = [];

    for(let i=0; i<subCount; i++) {
        if(availSubs.length === 0) break;
        // 랜덤 인덱스 추출
        const idx = Math.floor(Math.random() * availSubs.length);
        const s = availSubs[idx];
        
        // 수치 계산: (1 ~ Max) * (등급보정/10 + 0.5) 대략적 밸런스
        // 등급이 높으면 Max에 가까울 확률을 높이거나 한계 돌파?
        // 여기선 단순하게 랜덤 * 등급보정하면 너무 커지니 Max값 안에서 랜덤하게 뜨되, 등급 높으면 잘 뜨게
        const ratio = Math.random() * 0.5 + 0.5; // 50~100% 효율
        let val = s.max * ratio; 
        
        // 소수점 정리
        if(val < 1) val = 1;
        val = parseFloat(val.toFixed(1));

        subs.push({ ...s, val: val });

        // 뽑힌 옵션은 배열에서 제거 (중복 방지 핵심)
        availSubs.splice(idx, 1);
    }

    tempGear = {
        id: p.id, name: p.name, icon: p.icon, mainType: p.mainStat,
        lv: lv, gradeIdx: gIdx, gName: grade.name, gClass: grade.class,
        mainVal: mainVal, subs: subs, isRange: isRange
    };

    showCompare(tempGear);
    saveGame();
}

// --- UI 및 유틸 ---
function showDmg(val, isCrit, isDouble, isBlock) {
    const layer = document.getElementById('damage-layer');
    const el = document.createElement('div');
    el.className = 'dmg-txt';
    el.style.left = '60%'; el.style.top = '40%';
    
    if(isBlock) {
        el.innerText = "BLOCK"; el.style.color = '#aaa';
    } else {
        el.innerText = isDouble ? `Double ${val}` : val;
        el.style.color = isCrit ? '#ff4444' : 'white';
        if(isDouble) el.style.color = '#ffd700';
    }
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 600);
}

function updateHp() {
    const p = (battle.pHp / battle.pMax) * 100;
    const e = (battle.eHp / battle.eMax) * 100;
    document.getElementById('hero-hp-fill').style.width = `${Math.max(0,p)}%`;
    document.getElementById('enemy-hp-fill').style.width = `${Math.max(0,e)}%`;
}

function updateRes() {
    document.getElementById('hammer-cnt').innerText = game.hammers;
    document.getElementById('gold-cnt').innerText = game.gold;
    document.getElementById('anvil-lv').innerText = game.anvilLevel;
    document.getElementById('upgrade-cost').innerText = game.anvilLevel * 500;
}

function renderSlots() {
    const con = document.getElementById('equip-slots');
    con.innerHTML = '';
    PARTS.forEach(p => {
        const d = document.createElement('div');
        const g = game.equipment[p.id];
        
        if(g) {
            d.className = `slot ${g.gClass}`;
            let ico = g.icon;
            if(p.id === 'weapon') ico = g.isRange ? '🏹' : '⚔️';
            d.innerHTML = `<div class="slot-icon">${ico}</div><div>Lv.${g.lv}</div>`;
            d.onclick = () => showDetail(g);
        } else {
            d.className = 'slot';
            d.innerHTML = `<div>${p.name}</div>`;
        }
        con.appendChild(d);
    });
}

function getGearDesc(g) {
    if(!g) return '<div style="color:#777; padding:10px;">없음</div>';
    let type = g.isRange ? '(원거리)' : '';
    let html = `
        <div class="${g.gClass}" style="font-weight:bold; margin-bottom:5px;">[${g.gName}] ${g.name} ${type}</div>
        <div class="stat-main">${g.mainType==='hp'?'체력':'피해'} +${g.mainVal}</div>
        <div class="stat-sub">
    `;
    g.subs.forEach(s => {
        html += `<div>• ${s.name} +${s.val}% (Max ${s.max})</div>`;
    });
    html += `</div><div style="margin-top:5px; color:#555;">Lv.${g.lv}</div>`;
    return html;
}

function showCompare(newG) {
    const curG = game.equipment[newG.id];
    document.getElementById('current-gear-detail').innerHTML = getGearDesc(curG);
    document.getElementById('new-gear-detail').innerHTML = getGearDesc(newG);
    document.getElementById('compare-modal').classList.remove('hidden');
}
function showDetail(g) {
    document.getElementById('selected-gear-detail').innerHTML = getGearDesc(g);
    document.getElementById('detail-modal').classList.remove('hidden');
}

// 저장
function saveGame() {
    if(!game.nick) return;
    localStorage.setItem(`v3_${game.nick}`, JSON.stringify(game));
}
function loadGame(nick) {
    const d = localStorage.getItem(`v3_${nick}`);
    if(d) game = JSON.parse(d);
    else {
        game.nick = nick; game.gold=0; game.hammers=100; game.equipment={};
        game.stageMain=1; game.stageSub=1;
    }
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-app').classList.remove('hidden');
    
    calcStats(); renderSlots(); updateRes();
    spawnEnemy();
    gameLoop();
    setInterval(saveGame, 5000);
}

// 이벤트
document.getElementById('start-game-btn').onclick = () => {
    const n = document.getElementById('nickname-input').value.trim();
    if(n) loadGame(n);
};
document.getElementById('summon-btn').onclick = craftGear;
document.getElementById('keep-btn').onclick = () => {
    game.gold += 50; updateRes();
    document.getElementById('compare-modal').classList.add('hidden');
};
document.getElementById('equip-btn').onclick = () => {
    game.equipment[tempGear.id] = tempGear;
    calcStats(); renderSlots();
    document.getElementById('compare-modal').classList.add('hidden');
    saveGame();
};
document.getElementById('close-detail-btn').onclick = () => document.getElementById('detail-modal').classList.add('hidden');
document.getElementById('upgrade-btn').onclick = () => {
    let cost = game.anvilLevel * 500;
    if(game.gold >= cost) {
        game.gold -= cost; game.anvilLevel++; updateRes(); saveGame();
    }
};
document.getElementById('reset-data-btn').onclick = () => {
    if(confirm("초기화?")) { localStorage.removeItem(`v3_${game.nick}`); location.reload(); }
};
