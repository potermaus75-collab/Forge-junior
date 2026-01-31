// --- 데이터 상수 ---
const PARTS = [
    { id: 'helmet', name: '헬멧', mainStat: 'hp' },
    { id: 'armor', name: '갑옷', mainStat: 'hp' },
    { id: 'boots', name: '신발', mainStat: 'hp' },
    { id: 'belt', name: '벨트', mainStat: 'hp' },
    { id: 'weapon', name: '무기', mainStat: 'dmg' },
    { id: 'glove', name: '장갑', mainStat: 'dmg' },
    { id: 'neck', name: '목걸이', mainStat: 'dmg' },
    { id: 'ring', name: '반지', mainStat: 'dmg' }
];

const GRADE_INFO = [
    { name: '원시', colorClass: 'grade-0' },
    { name: '중세', colorClass: 'grade-1' },
    { name: '근대', colorClass: 'grade-2' },
    { name: '현대', colorClass: 'grade-3' },
    { name: '우주', colorClass: 'grade-4' },
    { name: '항성', colorClass: 'grade-5' },
    { name: '다중우주', colorClass: 'grade-6' },
    { name: '양자', colorClass: 'grade-7' },
    { name: '지하세계', colorClass: 'grade-8' },
    { name: '신성', colorClass: 'grade-9' }
];

// 보조 스탯 (모두 % 단위)
const SUB_STATS_LIST = [
    { type: 'critRate', name: '치명타 확률' },
    { type: 'critDmg', name: '치명타 피해' },
    { type: 'block', name: '블록 확률' },
    { type: 'hpRegen', name: '체력 재생' },
    { type: 'lifesteal', name: '흡혈율' },
    { type: 'doubleHit', name: '더블 찬스' },
    { type: 'dmgPct', name: '피해량 증가' },
    { type: 'meleeDmg', name: '근접 피해' },
    { type: 'rangeDmg', name: '원거리 피해' },
    { type: 'atkSpd', name: '공격 속도' },
    { type: 'skillDmg', name: '스킬 피해' },
    { type: 'cooldown', name: '쿨타임 감소' },
    { type: 'hpPct', name: '체력 증가' }
];

// --- 게임 상태 ---
let currentUser = "";
let gameState = {
    gold: 0,
    hammers: 50,
    anvilLevel: 1,
    stage: 1,
    equipment: {}, 
};
let battleState = {
    playerHp: 100,
    playerMaxHp: 100,
    enemyHp: 100,
    enemyMaxHp: 100,
    isFighting: false
};
let pendingGear = null;
let saveInterval = null;

// --- 1. 저장 및 불러오기 ---
function loadGame(nickname) {
    currentUser = nickname;
    const savedData = localStorage.getItem(`saveData_${nickname}`);
    if (savedData) {
        gameState = JSON.parse(savedData);
        alert(`${nickname}님의 데이터를 불러왔습니다!`);
    } else {
        // 새 게임 초기화
        gameState = {
            gold: 0, hammers: 50, anvilLevel: 1, stage: 1, equipment: {}
        };
        alert(`새로운 유저 ${nickname}님 환영합니다!`);
    }
    
    // UI 초기화
    document.getElementById('start-screen').classList.add('hidden');
    initSlots();
    updateResources();
    updateEquipmentUI();
    
    // 전투 및 저장 시작
    battleState.isFighting = true;
    spawnEnemy();
    requestAnimationFrame(gameLoop);
    
    if(saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(saveGame, 10000); // 10초마다 자동 저장
}

function saveGame() {
    if(!currentUser) return;
    localStorage.setItem(`saveData_${currentUser}`, JSON.stringify(gameState));
    console.log("Auto saved.");
}

function resetGame() {
    if(confirm("정말로 데이터를 초기화하시겠습니까?")) {
        localStorage.removeItem(`saveData_${currentUser}`);
        location.reload();
    }
}

// --- 2. 로직: 장비 생성 및 스탯 ---
function getGradeByLevel(level) {
    // 1~100 레벨을 10개 구간으로 나눔
    let gradeIdx = Math.floor((level - 1) / 10);
    if(gradeIdx > 9) gradeIdx = 9;
    return gradeIdx;
}

function generateRandomGear() {
    const part = PARTS[Math.floor(Math.random() * PARTS.length)];
    
    // 레벨 결정: 모루 레벨 기반 (모루 Lv1 -> 1~10Lv, Lv10 -> 90~100Lv 느낌으로 조정)
    // 게임 밸런스를 위해 1~100 사이 랜덤이지만 모루 레벨이 높을수록 최소 레벨 보정
    const minLv = Math.min(90, (gameState.anvilLevel - 1) * 5);
    const level = Math.floor(Math.random() * (100 - minLv)) + minLv + 1;
    
    const gradeIdx = getGradeByLevel(level);
    const grade = GRADE_INFO[gradeIdx];

    // 주스탯 (체력 or 피해량)
    const mainVal = level * 100 * (1 + gradeIdx * 0.5); // 등급 높을수록 계수 증가

    // 보조스탯 (1~4줄)
    const subCount = Math.floor(Math.random() * 4) + 1;
    const subStats = [];
    for(let i=0; i<subCount; i++) {
        const subInfo = SUB_STATS_LIST[Math.floor(Math.random() * SUB_STATS_LIST.length)];
        // % 수치 (1% ~ 10% * 등급보정)
        const val = parseFloat((Math.random() * 5 + 1 + (gradeIdx)).toFixed(1)); 
        subStats.push({ ...subInfo, val: val });
    }

    return {
        id: part.id,
        name: part.name,
        level: level,
        gradeIdx: gradeIdx,
        gradeName: grade.name,
        colorClass: grade.colorClass,
        mainVal: Math.floor(mainVal),
        mainType: part.mainStat, // hp or dmg
        subStats: subStats
    };
}

function getStatString(gear) {
    if(!gear) return "장비 없음";
    
    // HTML 생성 (큰 주스탯, 작은 보조스탯)
    let mainStatName = gear.mainType === 'hp' ? '체력' : '피해량';
    let subHtml = gear.subStats.map(s => `<div>- ${s.name}: +${s.val}%</div>`).join('');
    
    return `
        <div class="${gear.colorClass} view-name" style="padding:5px; border-radius:3px;">[${gear.gradeName}] ${gear.name} Lv.${gear.level}</div>
        <div class="view-main">${mainStatName} +${gear.mainVal}</div>
        <div class="view-sub">${subHtml}</div>
    `;
}

// --- 3. UI 및 인터랙션 ---
function initSlots() {
    const container = document.getElementById('equip-slots');
    container.innerHTML = '';
    PARTS.forEach(part => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `slot-${part.id}`;
        slot.innerText = part.name;
        // 클릭 이벤트: 상세 보기
        slot.onclick = () => showDetailModal(part.id);
        container.appendChild(slot);
    });
}

function updateEquipmentUI() {
    PARTS.forEach(part => {
        const el = document.getElementById(`slot-${part.id}`);
        const gear = gameState.equipment[part.id];
        if (gear) {
            el.className = `slot ${gear.colorClass}`; // 등급 색상 적용
            el.innerHTML = `<span style="font-size:10px">${part.name}</span><br><strong>Lv.${gear.level}</strong>`;
        } else {
            el.className = 'slot';
            el.innerText = part.name;
            el.style.background = '#444';
        }
    });
}

function updateResources() {
    document.getElementById('hammer-cnt').innerText = gameState.hammers;
    document.getElementById('gold-cnt').innerText = gameState.gold;
    document.getElementById('anvil-lv').innerText = gameState.anvilLevel;
    document.getElementById('upgrade-cost').innerText = gameState.anvilLevel * 500;
}

// 모달: 비교 화면
function showCompareModal(newGear) {
    const currentGear = gameState.equipment[newGear.id];
    
    const currentDetail = document.getElementById('current-gear-detail');
    const newDetail = document.getElementById('new-gear-detail');

    currentDetail.innerHTML = getStatString(currentGear);
    newDetail.innerHTML = getStatString(newGear);

    document.getElementById('compare-modal').classList.remove('hidden');
}

// 모달: 상세 보기 화면
function showDetailModal(partId) {
    const gear = gameState.equipment[partId];
    if(!gear) return; // 장비 없으면 무반응

    const container = document.getElementById('selected-gear-detail');
    container.innerHTML = getStatString(gear);
    document.getElementById('detail-modal').classList.remove('hidden');
}

// 버튼 이벤트
document.getElementById('start-game-btn').onclick = () => {
    const nick = document.getElementById('nickname-input').value.trim();
    if(nick) loadGame(nick);
    else alert("닉네임을 입력해주세요.");
};

document.getElementById('reset-data-btn').onclick = resetGame;

document.getElementById('close-detail-btn').onclick = () => {
    document.getElementById('detail-modal').classList.add('hidden');
};

document.getElementById('summon-btn').onclick = () => {
    if(gameState.hammers < 10) { alert("망치가 부족합니다."); return; }
    gameState.hammers -= 10;
    updateResources();
    pendingGear = generateRandomGear();
    showCompareModal(pendingGear);
};

document.getElementById('keep-btn').onclick = () => {
    gameState.gold += 50; // 판매 보상
    updateResources();
    document.getElementById('compare-modal').classList.add('hidden');
    pendingGear = null;
    saveGame();
};

document.getElementById('equip-btn').onclick = () => {
    gameState.equipment[pendingGear.id] = pendingGear;
    updateEquipmentUI();
    recalcStats();
    document.getElementById('compare-modal').classList.add('hidden');
    pendingGear = null;
    saveGame();
};

document.getElementById('upgrade-btn').onclick = () => {
    const cost = gameState.anvilLevel * 500;
    if(gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.anvilLevel++;
        updateResources();
        saveGame();
    }
};

// --- 4. 전투 로직 (간소화) ---
let totalStats = {};

function recalcStats() {
    let stats = { hp: 500, dmg: 50 }; // 기본값
    
    // 장비 스탯 합산
    Object.values(gameState.equipment).forEach(gear => {
        if(gear.mainType === 'hp') stats.hp += gear.mainVal;
        if(gear.mainType === 'dmg') stats.dmg += gear.mainVal;
        
        // 보조 스탯 (% 적용은 여기서 간단히 처리 - 실제 게임에선 복잡함)
        gear.subStats.forEach(sub => {
            if(sub.type === 'hpPct') stats.hp *= (1 + sub.val/100);
            if(sub.type === 'dmgPct') stats.dmg *= (1 + sub.val/100);
        });
    });
    
    totalStats = stats;
    battleState.playerMaxHp = Math.floor(totalStats.hp);
    // 현재 체력이 최대 체력보다 많으면 조정
    if(battleState.playerHp > battleState.playerMaxHp) battleState.playerHp = battleState.playerMaxHp;
}

function spawnEnemy() {
    battleState.enemyMaxHp = gameState.stage * 300;
    battleState.enemyHp = battleState.enemyMaxHp;
    document.getElementById('stage-num').innerText = gameState.stage;
}

function gameLoop() {
    if (!battleState.isFighting) return;

    // 공격 주기 (약 0.5초마다)
    if (Math.random() < 0.05) { 
        // 플레이어 공격
        let dmg = totalStats.dmg || 10;
        battleState.enemyHp -= dmg;
        document.getElementById('damage-text').innerText = `💥${Math.floor(dmg)}`;
        
        if(battleState.enemyHp <= 0) {
            gameState.gold += gameState.stage * 20;
            gameState.hammers += 2;
            gameState.stage++;
            updateResources();
            spawnEnemy();
        } else {
            // 적 반격
            battleState.playerHp -= (gameState.stage * 2);
            if(battleState.playerHp <= 0) {
                battleState.playerHp = battleState.playerMaxHp; // 부활
                document.getElementById('damage-text').innerText = "💀부활!";
            }
        }
    }

    // UI 갱신
    const pPct = (battleState.playerHp / battleState.playerMaxHp) * 100;
    const ePct = (battleState.enemyHp / battleState.enemyMaxHp) * 100;
    document.getElementById('player-hp-bar').style.width = `${Math.max(0, pPct)}%`;
    document.getElementById('enemy-hp-bar').style.width = `${Math.max(0, ePct)}%`;

    requestAnimationFrame(gameLoop);
}

// 초기 실행
recalcStats();
