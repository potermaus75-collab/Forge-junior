// --- 게임 설정 상수 ---
const PARTS = [
    { id: 'helmet', name: '헬멧', mainStat: 'hp', type: 'armor' },
    { id: 'armor', name: '갑옷', mainStat: 'hp', type: 'armor' },
    { id: 'boots', name: '신발', mainStat: 'hp', type: 'armor' },
    { id: 'belt', name: '벨트', mainStat: 'hp', type: 'armor' },
    { id: 'weapon', name: '무기', mainStat: 'dmg', type: 'weapon' }, // 무기는 동적 할당
    { id: 'glove', name: '장갑', mainStat: 'dmg', type: 'armor' },
    { id: 'neck', name: '목걸이', mainStat: 'dmg', type: 'armor' },
    { id: 'ring', name: '반지', mainStat: 'dmg', type: 'armor' }
];

const GRADE_INFO = [
    { name: '원시', color: 'grade-0', rate: 1.0 },
    { name: '중세', color: 'grade-1', rate: 1.5 },
    { name: '근대', color: 'grade-2', rate: 2.5 },
    { name: '현대', color: 'grade-3', rate: 4.0 },
    { name: '우주', color: 'grade-4', rate: 6.5 },
    { name: '항성', color: 'grade-5', rate: 10.0 },
    { name: '다중우주', color: 'grade-6', rate: 15.0 }, // 바다색
    { name: '양자', color: 'grade-7', rate: 25.0 },
    { name: '지하세계', color: 'grade-8', rate: 40.0 },
    { name: '신성', color: 'grade-9', rate: 100.0 }
];

// 보조 옵션 (밸런싱 조정)
const SUB_STATS = [
    { type: 'critRate', name: '치명타%', weight: 1 },
    { type: 'critDmg', name: '치명피해%', weight: 1 },
    { type: 'doubleHit', name: '더블찬스%', weight: 1 }, // 더블 어택
    { type: 'atkSpd', name: '공속%', weight: 1 },
    { type: 'lifesteal', name: '흡혈%', weight: 1 },
    { type: 'dmgPct', name: '피해증가%', weight: 2 },
    { type: 'hpPct', name: '체력증가%', weight: 2 }
];

// --- 확률 밸런스: 모루 레벨별 등급 등장 확률 (누적 가중치 아님, 범위 랜덤) ---
// 레벨이 오르면 높은 등급이 나올 확률 증가
function getGradeProbabilities(anvilLv) {
    // 기본적으로 낮은 등급이 많이 나옴. 모루 레벨이 오르면 minGrade가 올라감.
    let maxGrade = Math.min(9, Math.floor(anvilLv / 3) + 2); // Lv1->2등급, Lv30->9등급 해금
    let minGrade = Math.max(0, Math.floor(anvilLv / 5) - 1); 
    return { min: minGrade, max: maxGrade };
}

// --- 게임 상태 ---
let gameState = {
    nick: '', gold: 0, hammers: 100, anvilLevel: 1, 
    mainStage: 1, subStage: 1, // 1-1 ~ 1-10
    equipment: {}
};
let battle = { 
    pHp: 100, pMaxHp: 100, eHp: 100, eMaxHp: 100, 
    stats: {}, isFighting: false, lastAtk: 0 
};
let tempGear = null;
let saveTimer = null;

// --- 핵심 로직 ---

// 1. 유저 스탯 계산
function calcStats() {
    let s = { hp: 200, dmg: 20, crt: 5, cdmg: 150, dbl: 0, spd: 1.0, life: 0 };
    
    // 무기 타입 확인 (원거리/근접)
    let wType = 'melee';
    if(gameState.equipment['weapon'] && gameState.equipment['weapon'].isRange) wType = 'range';

    Object.values(gameState.equipment).forEach(g => {
        if(g.mainType === 'hp') s.hp += g.mainVal;
        if(g.mainType === 'dmg') s.dmg += g.mainVal;
        
        g.subs.forEach(sub => {
            if(sub.type === 'hpPct') s.hp *= (1 + sub.val/100);
            if(sub.type === 'dmgPct') s.dmg *= (1 + sub.val/100);
            if(sub.type === 'critRate') s.crt += sub.val;
            if(sub.type === 'critDmg') s.cdmg += sub.val;
            if(sub.type === 'doubleHit') s.dbl += sub.val;
            if(sub.type === 'atkSpd') s.spd += (sub.val/100); // 공속 증가
            if(sub.type === 'lifesteal') s.life += sub.val;
        });
    });

    s.hp = Math.floor(s.hp);
    s.dmg = Math.floor(s.dmg);
    battle.stats = s;
    battle.stats.wType = wType;
    battle.pMaxHp = s.hp;
    if(battle.pHp > battle.pMaxHp) battle.pHp = battle.pMaxHp;
    
    // CSS 무기 변경
    const heroWeapon = document.getElementById('hero-weapon');
    if(wType === 'range') {
        heroWeapon.className = 'weapon-hand bow';
    } else {
        heroWeapon.className = 'weapon-hand sword';
    }
}

// 2. 적 생성 (밸런싱)
function spawnEnemy() {
    const stageFactor = (gameState.mainStage - 1) * 10 + gameState.subStage;
    
    // 5스테이지: 중간보스, 10스테이지: 보스
    let isBoss = (gameState.subStage === 10);
    let isMid = (gameState.subStage === 5);
    let multiplier = 1.0;
    
    const mobArt = document.getElementById('enemy-art');
    const badge = document.getElementById('boss-badge');

    if(isBoss) {
        multiplier = 5.0; // 보스 체력 5배
        mobArt.className = 'css-monster boss';
        badge.innerText = "☠️BOSS";
        badge.classList.remove('hidden');
    } else if (isMid) {
        multiplier = 2.5; // 중간보스 2.5배
        mobArt.className = 'css-monster boss'; // 외형은 보스 공유하되 조금 작게? (CSS 한계로 색만 공유)
        badge.innerText = "😈MID";
        badge.classList.remove('hidden');
    } else {
        mobArt.className = 'css-monster slime';
        badge.classList.add('hidden');
    }

    // 적 스탯 공식 (지수 상승)
    let baseHp = 100 * Math.pow(1.15, stageFactor) * multiplier;
    let baseAtk = 10 * Math.pow(1.1, stageFactor) * multiplier;

    battle.eMaxHp = Math.floor(baseHp);
    battle.eHp = battle.eMaxHp;
    battle.eAtk = Math.floor(baseAtk);

    document.getElementById('stage-num').innerText = `${gameState.mainStage}-${gameState.subStage}`;
    updateBars();
}

// 3. 장비 생성 (가챠 확률 조정)
function craftGear() {
    if(gameState.hammers < 10) return alert("망치 부족!");
    gameState.hammers -= 10;
    updateUI();

    const part = PARTS[Math.floor(Math.random() * PARTS.length)];
    const range = getGradeProbabilities(gameState.anvilLevel);
    
    // 가중치 랜덤 등급 선택
    let gradeIdx = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    if(Math.random() < 0.1) gradeIdx = Math.min(9, gradeIdx + 1); // 10% 확률로 럭키 업그레이드

    const grade = GRADE_INFO[gradeIdx];
    
    // 레벨: 모루 레벨 * 10 근처
    const lv = Math.max(1, (gameState.anvilLevel * 5) + Math.floor(Math.random()*10));
    
    // 주스탯
    let mainVal = lv * 10 * grade.rate;
    // 무기일 경우 원거리/근접 랜덤 부여 (50%)
    let isRange = false;
    if(part.id === 'weapon') isRange = Math.random() > 0.5;

    // 보조옵션 1~4줄
    const subCnt = Math.floor(Math.random() * 4) + 1;
    let subs = [];
    for(let i=0; i<subCnt; i++){
        let s = SUB_STATS[Math.floor(Math.random()*SUB_STATS.length)];
        let val = (Math.random() * 5 * grade.rate).toFixed(1); // % 수치
        subs.push({ ...s, val: parseFloat(val) });
    }

    tempGear = {
        id: part.id, name: part.name, type: part.type,
        lv: lv, gradeIdx: gradeIdx, gradeName: grade.name, color: grade.color,
        mainType: part.mainStat, mainVal: Math.floor(mainVal),
        subs: subs, isRange: isRange
    };

    showCompare(tempGear);
    saveGame();
}

// --- 전투 루프 (애니메이션 포함) ---
function gameLoop(time) {
    if(!battle.isFighting) return requestAnimationFrame(gameLoop);

    const now = time;
    // 공속 반영 (기본 1초 / 공속)
    const atkInterval = 1000 / battle.stats.spd;

    if(now - battle.lastAtk > atkInterval) {
        battle.lastAtk = now;
        performAttack();
    }
    requestAnimationFrame(gameLoop);
}

function performAttack() {
    // 1. 유저 공격 연출
    const hero = document.getElementById('hero-art');
    const wType = battle.stats.wType;
    const animClass = wType === 'range' ? 'hero-attack-range' : 'hero-attack-melee';
    
    hero.classList.remove(animClass);
    void hero.offsetWidth; // 리플로우 강제 (애니메이션 리셋)
    hero.classList.add(animClass);

    // 2. 데미지 계산 및 적 피격
    let dmg = battle.stats.dmg;
    let isCrit = Math.random() * 100 < battle.stats.crt;
    if(isCrit) dmg *= (battle.stats.cdmg / 100);

    hitEnemy(dmg, isCrit);

    // 3. 더블 찬스 (확률 발동)
    if(Math.random() * 100 < battle.stats.dbl) {
        setTimeout(() => {
            hitEnemy(dmg * 0.5, false, true); // 50% 데미지로 추가타
        }, 200);
    }

    // 4. 적 반격 (회피 개념 없음, 무조건 맞음)
    battle.pHp -= battle.eAtk;
    if(battle.pHp <= 0) {
        // 패배: 스테이지 유지, 체력 회복
        battle.pHp = battle.pMaxHp;
        battle.eHp = battle.eMaxHp; // 적도 회복
    }
    updateBars();
}

function hitEnemy(dmg, isCrit, isDouble = false) {
    const enemy = document.getElementById('enemy-art');
    battle.eHp -= dmg;
    
    // 피격 연출
    enemy.classList.remove('monster-hit');
    void enemy.offsetWidth;
    enemy.classList.add('monster-hit');

    // 데미지 텍스트
    showDmgText(Math.floor(dmg), isCrit, isDouble);

    if(battle.eHp <= 0) {
        // 승리
        const stageFactor = (gameState.mainStage - 1) * 10 + gameState.subStage;
        gameState.gold += stageFactor * 10;
        gameState.hammers += 2;
        
        // 스테이지 진행
        gameState.subStage++;
        if(gameState.subStage > 10) {
            gameState.mainStage++;
            gameState.subStage = 1;
        }
        
        // 체력 흡수
        if(battle.stats.life > 0) {
            battle.pHp += dmg * (battle.stats.life / 100);
            if(battle.pHp > battle.pMaxHp) battle.pHp = battle.pMaxHp;
        }

        updateUI();
        spawnEnemy();
    }
}

function showDmgText(dmg, isCrit, isDouble) {
    const el = document.getElementById('damage-text');
    el.innerText = isDouble ? `Double! ${dmg}` : dmg;
    el.style.color = isCrit ? '#ff4444' : 'white';
    el.style.fontSize = isCrit ? '30px' : '24px';
    if(isDouble) el.classList.add('double-hit-effect');
    else el.classList.remove('double-hit-effect');

    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
}

// --- UI 업데이트 ---
function updateBars() {
    let pPct = (battle.pHp / battle.pMaxHp) * 100;
    let ePct = (battle.eHp / battle.eMaxHp) * 100;
    document.getElementById('player-hp-bar').style.width = `${Math.max(0, pPct)}%`;
    document.getElementById('enemy-hp-bar').style.width = `${Math.max(0, ePct)}%`;
    document.getElementById('hero-hp-text').innerText = Math.floor(battle.pHp);
    document.getElementById('enemy-hp-text').innerText = Math.floor(battle.eHp);
}

function updateUI() {
    document.getElementById('hammer-cnt').innerText = gameState.hammers;
    document.getElementById('gold-cnt').innerText = gameState.gold;
    document.getElementById('anvil-lv').innerText = gameState.anvilLevel;
    document.getElementById('upgrade-cost').innerText = gameState.anvilLevel * 500;
}

function renderSlots() {
    const con = document.getElementById('equip-slots');
    con.innerHTML = '';
    PARTS.forEach(p => {
        const d = document.createElement('div');
        const gear = gameState.equipment[p.id];
        
        // 아이콘 모양 결정
        let iconClass = 'armor'; 
        if(p.id === 'helmet') iconClass = 'helmet';
        else if(p.id === 'weapon') {
             // 장착된 무기에 따라 아이콘 변경
             if(gear && gear.isRange) iconClass = 'weapon-range';
             else iconClass = 'weapon-melee';
        }

        if(gear) {
            d.className = `slot ${gear.color}`;
            d.innerHTML = `
                <div class="gear-icon ${iconClass}"></div>
                <div style="font-size:10px; font-weight:bold;">Lv.${gear.lv}</div>
            `;
        } else {
            d.className = 'slot';
            d.innerHTML = `<div style="font-size:10px; color:#777;">${p.name}</div>`;
        }
        d.onclick = () => showDetail(gear);
        con.appendChild(d);
    });
}

function getGearHTML(g) {
    if(!g) return '<div style="padding:20px; color:#777;">장비 없음</div>';
    let typeTxt = g.isRange ? '(원거리)' : ''; 
    return `
        <div class="view-grade ${g.color}">[${g.gradeName}] ${g.name} ${typeTxt}</div>
        <div class="view-main">${g.mainType==='hp'?'체력':'공격력'} +${g.mainVal}</div>
        <div class="view-sub">
            ${g.subs.map(s=>`<div>• ${s.name} +${s.val}%</div>`).join('')}
        </div>
        <div style="font-size:10px; color:#555; margin-top:5px;">Lv.${g.lv}</div>
    `;
}

function showCompare(newG) {
    const curG = gameState.equipment[newG.id];
    document.getElementById('current-gear-detail').innerHTML = getGearHTML(curG);
    document.getElementById('new-gear-detail').innerHTML = getGearHTML(newG);
    document.getElementById('compare-modal').classList.remove('hidden');
}

function showDetail(g) {
    if(!g) return;
    document.getElementById('selected-gear-detail').innerHTML = getGearHTML(g);
    document.getElementById('detail-modal').classList.remove('hidden');
}

// --- 시스템: 저장/로드 ---
function saveGame() {
    if(!gameState.nick) return;
    localStorage.setItem(`cssRpg_${gameState.nick}`, JSON.stringify(gameState));
}
function loadGame(nick) {
    const data = localStorage.getItem(`cssRpg_${nick}`);
    if(data) {
        gameState = JSON.parse(data);
    } else {
        gameState.nick = nick;
        gameState.gold = 0; gameState.hammers = 50; 
        gameState.mainStage = 1; gameState.subStage = 1;
        gameState.equipment = {};
    }
    // 초기화
    document.getElementById('start-screen').classList.add('hidden');
    calcStats();
    spawnEnemy();
    renderSlots();
    updateUI();
    battle.isFighting = true;
    requestAnimationFrame(gameLoop);
    saveTimer = setInterval(saveGame, 5000);
}

// --- 이벤트 리스너 ---
document.getElementById('start-game-btn').onclick = () => {
    const n = document.getElementById('nickname-input').value.trim();
    if(n) loadGame(n);
};
document.getElementById('summon-btn').onclick = craftGear;
document.getElementById('keep-btn').onclick = () => {
    gameState.gold += 50;
    document.getElementById('compare-modal').classList.add('hidden');
    updateUI();
};
document.getElementById('equip-btn').onclick = () => {
    gameState.equipment[tempGear.id] = tempGear;
    calcStats(); // 스탯 재계산
    renderSlots();
    document.getElementById('compare-modal').classList.add('hidden');
    saveGame();
};
document.getElementById('close-detail-btn').onclick = () => {
    document.getElementById('detail-modal').classList.add('hidden');
};
document.getElementById('upgrade-btn').onclick = () => {
    const cost = gameState.anvilLevel * 500;
    if(gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.anvilLevel++;
        updateUI();
        saveGame();
    }
};
document.getElementById('reset-data-btn').onclick = () => {
    if(confirm('초기화 하시겠습니까?')) {
        localStorage.removeItem(`cssRpg_${gameState.nick}`);
        location.reload();
    }
};
