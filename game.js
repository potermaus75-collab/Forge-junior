/**
 * Neo God Wars - Game Engine (v2.0 Refined)
 * game.js
 */

// ==========================================
// 1. 전역 상태 및 초기화 (Global State)
// ==========================================

const DEFAULT_PLAYER = {
    profile: {
        name: "신입 모험가",
        title: "[무명]",
        level: 1,
        exp: 0,
        expMax: 100
    },
    stats: {
        hp: 100,
        hpMax: 100,
        energy: 50,
        energyMax: 50,
        stamina: 10,
        staminaMax: 10
    },
    resources: {
        gold: 1000,
        gem: 0
    },
    inventory: {}, // { item_id: count }
    units: [],     // [ {id: "u_001", count: 1} ]
    buildings: {}, // { building_id: count }
    
    // 퀘스트 진행도: { quest_id: current_mastery_point }
    // 1랭크당 mastery_max 필요. 총 3랭크(Master)까지 도달하려면 mastery_max * 3 필요.
    quests: {},    
    bossCd: {},    // { boss_id: timestamp_next_spawn }
    
    timers: {
        lastSave: Date.now(),
        lastEnergy: Date.now(),
        lastStamina: Date.now(),
        lastIncome: Date.now()
    }
};

let player = JSON.parse(JSON.stringify(DEFAULT_PLAYER));
let activeTab = "home";

window.onload = function() {
    loadGame();
    initEventListeners();
    gameLoop();
    renderAll();
    showToast("네오 갓워즈에 오신 것을 환영합니다!");
};

// ==========================================
// 2. 세이브 & 로드
// ==========================================

function saveGame() {
    player.timers.lastSave = Date.now();
    localStorage.setItem('neoGodWars_save', JSON.stringify(player));
}

function loadGame() {
    const saveData = localStorage.getItem('neoGodWars_save');
    if (saveData) {
        const saved = JSON.parse(saveData);
        player = { ...DEFAULT_PLAYER, ...saved, 
            stats: { ...DEFAULT_PLAYER.stats, ...saved.stats }, 
            resources: { ...DEFAULT_PLAYER.resources, ...saved.resources },
            // 데이터 구조가 바뀐 경우를 대비해 병합
            quests: saved.quests || {},
            bossCd: saved.bossCd || {}
        };
        calculateOfflineProgress();
    } else {
        gainUnit("g_gr_c1", 5); 
        saveGame();
    }
}

function calculateOfflineProgress() {
    const now = Date.now();
    const last = player.timers.lastSave;
    const diffSec = Math.floor((now - last) / 1000);

    if (diffSec > 0) {
        const energyGain = Math.floor(diffSec / 180); // 3분
        player.stats.energy = Math.min(player.stats.energyMax, player.stats.energy + energyGain);

        const staminaGain = Math.floor(diffSec / 180); // 3분 (영상 고증 반영)
        player.stats.stamina = Math.min(player.stats.staminaMax, player.stats.stamina + staminaGain);

        let hourlyIncome = calculateHourlyIncome();
        let goldGain = Math.floor((hourlyIncome / 3600) * diffSec);
        
        if (goldGain > 0) {
            player.resources.gold += goldGain;
            showToast(`오프라인 수익: +${goldGain.toLocaleString()} Gold`);
        }
    }
    
    player.timers.lastEnergy = now;
    player.timers.lastStamina = now;
    player.timers.lastIncome = now;
}

// ==========================================
// 3. 메인 루프 (1초마다 실행)
// ==========================================

function gameLoop() {
    setInterval(() => {
        const now = Date.now();

        // 에너지 (3분)
        if (now - player.timers.lastEnergy >= 180000) {
            if (player.stats.energy < player.stats.energyMax) {
                player.stats.energy++;
                updateUI();
            }
            player.timers.lastEnergy = now;
        }

        // 스태미나 (3분 - 고증 수정)
        if (now - player.timers.lastStamina >= 180000) {
            if (player.stats.stamina < player.stats.staminaMax) {
                player.stats.stamina++;
                updateUI();
            }
            player.timers.lastStamina = now;
        }

        // 건물 수익 (1분)
        if (now - player.timers.lastIncome >= 60000) {
            let hourlyIncome = calculateHourlyIncome();
            let minIncome = Math.floor(hourlyIncome / 60);
            if (minIncome > 0) {
                player.resources.gold += minIncome;
                updateUI();
            }
            player.timers.lastIncome = now;
        }

        updateTimersUI(now);
        
        // 보스전 탭을 보고 있다면 쿨타임 실시간 갱신
        if (activeTab === 'battle') {
            updateBattleTimers(now);
        }

        if (now % 10000 < 1000) saveGame();
    }, 1000);
}

// ==========================================
// 4. 핵심 로직
// ==========================================

function gainExp(amount) {
    player.profile.exp += amount;
    player.profile.expMax = player.profile.level * player.profile.level * 100;

    if (player.profile.exp >= player.profile.expMax) {
        player.profile.level++;
        player.profile.exp -= player.profile.expMax;
        player.profile.expMax = player.profile.level * player.profile.level * 100;
        
        player.stats.energy = player.stats.energyMax;
        player.stats.stamina = player.stats.staminaMax;
        
        showModal("레벨 업!", `Lv.${player.profile.level} 달성!<br>모든 자원이 회복되었습니다.`);
        saveGame();
    }
    updateUI();
}

function gainItem(itemId, count = 1) {
    if (!player.inventory[itemId]) player.inventory[itemId] = 0;
    player.inventory[itemId] += count;
    const itemData = ITEMS.find(i => i.id === itemId);
    if (itemData) showToast(`획득: ${itemData.name} x${count}`);
}

function gainUnit(unitId, count = 1) {
    let existing = player.units.find(u => u.id === unitId);
    if (existing) {
        existing.count += count;
    } else {
        player.units.push({ id: unitId, count: count });
    }
}

function calculateHourlyIncome() {
    let income = 0;
    for (let bId in player.buildings) {
        const count = player.buildings[bId];
        const bData = BUILDINGS.find(b => b.id === bId);
        if (bData && count > 0) {
            income += bData.income * count;
        }
    }
    let upkeep = 0;
    player.units.forEach(u => {
        const uData = GODS.find(g => g.id === u.id);
        if (uData) upkeep += uData.cost * u.count;
    });
    return Math.max(0, income - upkeep);
}

function calculateDeckPower() {
    const capacity = 5 + player.profile.level;
    let army = [];
    player.units.forEach(u => {
        const uData = GODS.find(g => g.id === u.id);
        if (uData) {
            for(let i=0; i<u.count; i++) army.push(uData);
        }
    });

    army.sort((a, b) => b.atk - a.atk);
    
    let totalAtk = 0;
    let totalDef = 0;
    let count = 0;

    for (let i = 0; i < army.length; i++) {
        if (count >= capacity) break;
        totalAtk += army[i].atk;
        totalDef += army[i].def;
        count++;
    }
    
    // 가장 강한 무기/방어구 1개씩 자동 적용 (약식)
    let bestWeapon = ITEMS.filter(i => i.type === 'equip' && i.slot === 'weapon' && player.inventory[i.id] > 0).sort((a,b) => b.atk - a.atk)[0];
    let bestArmor = ITEMS.filter(i => i.type === 'equip' && i.slot === 'armor' && player.inventory[i.id] > 0).sort((a,b) => b.def - a.def)[0];

    if (bestWeapon) totalAtk += bestWeapon.atk;
    if (bestArmor) totalDef += bestArmor.def;

    return { atk: totalAtk, def: totalDef, count: count, capacity: capacity };
}

// ==========================================
// 5. UI 렌더링 & 탭 처리
// ==========================================

function updateUI() {
    document.getElementById('user-name').innerText = player.profile.name;
    document.getElementById('user-level').innerText = player.profile.level;
    let expPct = Math.floor((player.profile.exp / player.profile.expMax) * 100);
    document.getElementById('user-exp').innerText = expPct;
    document.getElementById('res-gold').innerText = player.resources.gold.toLocaleString();
    document.getElementById('res-gem').innerText = player.resources.gem.toLocaleString();

    document.getElementById('bar-hp').style.width = `${(player.stats.hp / player.stats.hpMax) * 100}%`;
    document.getElementById('val-hp').innerText = player.stats.hp;
    
    document.getElementById('bar-energy').style.width = `${(player.stats.energy / player.stats.energyMax) * 100}%`;
    document.getElementById('val-energy').innerText = player.stats.energy;

    document.getElementById('bar-stamina').style.width = `${(player.stats.stamina / player.stats.staminaMax) * 100}%`;
    document.getElementById('val-stamina').innerText = player.stats.stamina;
}

function updateTimersUI(now) {
    const energyLeft = 180000 - (now - player.timers.lastEnergy);
    const staminaLeft = 180000 - (now - player.timers.lastStamina); // 3분

    const formatTime = (ms) => {
        if (ms < 0) return "00:00";
        let sec = Math.floor(ms / 1000);
        let min = Math.floor(sec / 60);
        sec = sec % 60;
        return `${min}:${sec < 10 ? '0'+sec : sec}`;
    };

    document.getElementById('timer-energy').innerText = player.stats.energy < player.stats.energyMax ? formatTime(energyLeft) : "FULL";
    document.getElementById('timer-stamina').innerText = player.stats.stamina < player.stats.staminaMax ? formatTime(staminaLeft) : "FULL";
}

function renderAll() {
    updateUI();
    renderTab(activeTab);
}

function initEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTab = btn.getAttribute('data-tab');
            renderTab(activeTab);
        });
    });

    document.getElementById('btn-heal').addEventListener('click', () => {
        if (player.resources.gold >= 100 && player.stats.hp < player.stats.hpMax) {
            player.resources.gold -= 100;
            player.stats.hp = Math.min(player.stats.hpMax, player.stats.hp + 20);
            updateUI();
            showToast("체력을 회복했습니다.");
        } else {
            showToast("골드가 부족하거나 체력이 가득 찼습니다.");
        }
    });

    document.getElementById('modal-close').addEventListener('click', () => document.getElementById('modal-overlay').classList.add('hidden'));
    document.getElementById('modal-action-btn').addEventListener('click', () => document.getElementById('modal-overlay').classList.add('hidden'));
}

// 탭별 렌더링
function renderTab(tabName) {
    const main = document.getElementById('main-content');
    main.innerHTML = "";

    switch(tabName) {
        case "home": renderHome(main); break;
        case "quest": renderQuest(main); break;
        case "battle": renderBattle(main); break;
        case "unit": renderUnit(main); break;
        case "shop": renderShop(main); break;
    }
}

// --- [A. 임무 (Quest) - 랭크 시스템 적용] ---
function renderQuest(container) {
    let isPreviousMastered = true; // 첫 임무는 항상 해금

    for (let chKey in QUESTS) {
        const chapter = QUESTS[chKey];
        
        const chDiv = document.createElement('div');
        chDiv.className = 'chapter-header';
        chDiv.innerHTML = `<h2>${chapter.name}</h2>`;
        container.appendChild(chDiv);

        chapter.list.forEach(q => {
            const qItem = document.createElement('div');
            qItem.className = 'card-item';
            
            // 숙련도 계산 (총 3단계)
            // 1단계: 0 ~ 100%
            // 2단계: 100 ~ 200%
            // 3단계(Master): 200 ~ 300%
            
            let currentPoints = player.quests[q.id] || 0;
            let maxPoints = q.mastery_max * 3; // 총 3랭크
            let currentRank = Math.floor(currentPoints / q.mastery_max) + 1;
            if (currentRank > 3) currentRank = "MASTER";
            
            let progressInRank = currentPoints % q.mastery_max;
            let percent = Math.floor((progressInRank / q.mastery_max) * 100);
            if (currentRank === "MASTER") percent = 100;

            // 잠금 여부 (이전 퀘스트가 마스터되지 않았으면 잠금)
            let isLocked = !isPreviousMastered;
            
            // 현재 퀘스트가 마스터 상태인지 업데이트 (다음 퀘스트 해금용)
            isPreviousMastered = (currentRank === "MASTER");

            // 보스전 표시
            let isBoss = q.type === 'boss';
            
            // 잠긴 상태 UI
            if (isLocked) {
                qItem.classList.add('locked');
                qItem.style.opacity = "0.5";
                qItem.innerHTML = `
                    <div class="card-thumb"><i class="fa-solid fa-lock"></i></div>
                    <div class="card-info"><div class="card-title">??? (이전 임무 완료 필요)</div></div>
                `;
            } else {
                let rankBadge = currentRank === "MASTER" 
                    ? `<span style="color:#FFD700; border:1px solid #FFD700; padding:2px 4px; font-size:10px;">MASTER</span>` 
                    : `<span style="color:#aaa; border:1px solid #555; padding:2px 4px; font-size:10px;">RANK ${currentRank}</span>`;

                qItem.innerHTML = `
                    <div class="card-thumb" style="border-color:${isBoss ? 'red': '#444'}">${isBoss ? '<i class="fa-solid fa-skull"></i>' : '<i class="fa-solid fa-scroll"></i>'}</div>
                    <div class="card-info">
                        <div class="card-title">${q.name} ${rankBadge}</div>
                        <div class="card-meta">
                            <span><i class="fa-solid fa-bolt"></i> -${q.req_energy}</span>
                            <span><i class="fa-solid fa-star"></i> +${q.rew_exp}</span>
                            <span><i class="fa-solid fa-coins"></i> ${q.rew_gold_min}~${q.rew_gold_max}</span>
                        </div>
                        ${!isBoss ? `<div class="quest-progress-bg"><div class="quest-progress-fill" style="width:${percent}%"></div></div>` : ''}
                    </div>
                    <div class="card-action">
                        <button class="btn-action ${isBoss ? 'primary':''}" id="btn-q-${q.id}">${isBoss ? '레이드' : '수행'}</button>
                    </div>
                `;
            }
            container.appendChild(qItem);

            if (!isLocked) {
                document.getElementById(`btn-q-${q.id}`).addEventListener('click', () => {
                    if (isBoss) {
                        // 보스는 스태미너 사용하므로 배틀 탭으로 유도하거나 바로 실행
                        // 여기선 퀘스트 목록의 '보스 발견' 개념이므로 에너지 소모 후 배틀 탭 보스 해금 로직이 맞으나, 
                        // 편의상 바로 보스 탭으로 이동시킵니다.
                        activeTab = 'battle';
                        renderAll();
                        showToast("배틀 탭에서 보스를 처치하세요!");
                    } else {
                        doQuest(q, currentRank, maxPoints);
                    }
                });
            }
        });
    }
}

function doQuest(q, rank, maxPoints) {
    if (player.stats.energy < q.req_energy) {
        showToast("에너지가 부족합니다.");
        return;
    }
    
    // 마스터 상태면 수행 불가? -> 보통은 계속 파밍 가능함.
    // 하지만 랭크업의 재미를 위해 마스터 후에는 골드 보너스 주는 식으로 처리
    
    player.stats.energy -= q.req_energy;
    
    // 보상 지급
    gainExp(q.rew_exp);
    const gold = Math.floor(Math.random() * (q.rew_gold_max - q.rew_gold_min + 1)) + q.rew_gold_min;
    player.resources.gold += gold;

    // 아이템 드랍
    if (Math.random() < q.drop_rate) {
        gainItem(q.drop_item_id, 1);
        showToast("아이템을 발견했습니다!");
    }

    // 숙련도 증가
    let current = player.quests[q.id] || 0;
    if (current < maxPoints) {
        player.quests[q.id] = current + 10; // 클릭당 숙련도 10 증가 (빠른 진행 위해)
        
        // 랭크업 체크
        let newRank = Math.floor(player.quests[q.id] / q.mastery_max) + 1;
        if (newRank > rank && newRank <= 3) {
            showModal("랭크 상승!", `${q.name}의 숙련도가 올랐습니다!<br>RANK ${newRank} 달성!`);
        }
        if (player.quests[q.id] >= maxPoints) {
             showModal("마스터 달성!", `${q.name}을(를) 완전히 정복했습니다!<br>다음 임무가 해금됩니다.`);
        }
    }

    updateUI();
    renderQuest(document.getElementById('main-content')); // 화면 갱신
}


// --- [B. 배틀 & 보스 (타이머 기능 추가)] ---
function renderBattle(container) {
    container.innerHTML = `<h2 class="section-title">보스 레이드</h2>`;
    
    for (let bKey in BOSSES) {
        const boss = BOSSES[bKey];
        const bItem = document.createElement('div');
        bItem.className = 'card-item';
        
        // 쿨타임 계산
        let now = Date.now();
        let readyTime = player.bossCd[bKey] || 0;
        let isLocked = now < readyTime;

        // 등급 색상
        let borderColor = '#fff';
        if (boss.rank === 'small') borderColor = 'var(--rank-uc)';
        if (boss.rank === 'medium') borderColor = 'var(--rank-r)';
        if (boss.rank === 'large') borderColor = 'var(--rank-l)';

        bItem.innerHTML = `
            <div class="card-thumb" style="border-color:${borderColor}; color:${borderColor}">
                <i class="fa-solid fa-dragon"></i>
            </div>
            <div class="card-info">
                <div class="card-title" style="color:${borderColor}">${boss.name}</div>
                <div class="card-meta">
                    <span><i class="fa-solid fa-heart"></i> ${boss.hp_max.toLocaleString()}</span>
                    <span><i class="fa-solid fa-fist-raised"></i> -${boss.req_stamina}</span>
                </div>
            </div>
            <div class="card-action">
                <button class="btn-action ${isLocked ? 'disabled' : 'primary'}" 
                    id="btn-boss-${bKey}" data-boss-id="${bKey}">
                    ${isLocked ? '대기중...' : '전투'}
                </button>
            </div>
        `;
        container.appendChild(bItem);

        // 이벤트 리스너 (중복 방지 없이 매번 새로 그려지므로 괜찮음)
        const btn = document.getElementById(`btn-boss-${bKey}`);
        btn.addEventListener('click', () => {
            let rTime = player.bossCd[bKey] || 0;
            if (Date.now() < rTime) {
                showToast("아직 보스가 다시 나타나지 않았습니다.");
                return;
            }
            doBossBattle(bKey, boss);
        });
    }
}

function updateBattleTimers(now) {
    const btns = document.querySelectorAll('button[data-boss-id]');
    btns.forEach(btn => {
        const bKey = btn.getAttribute('data-boss-id');
        const readyTime = player.bossCd[bKey] || 0;
        const diff = readyTime - now;

        if (diff > 0) {
            // 쿨타임 남음
            let sec = Math.ceil(diff / 1000);
            let min = Math.floor(sec / 60);
            sec = sec % 60;
            btn.innerText = `${min}:${sec < 10 ? '0'+sec : sec}`;
            btn.className = 'btn-action disabled';
        } else {
            // 준비됨
            if (btn.innerText !== '전투') {
                btn.innerText = '전투';
                btn.className = 'btn-action primary';
            }
        }
    });
}

function doBossBattle(bossId, boss) {
    if (player.stats.stamina < boss.req_stamina) {
        showToast("스태미나가 부족합니다.");
        return;
    }
    if (player.stats.hp < 10) {
        showToast("체력이 너무 낮습니다.");
        return;
    }

    player.stats.stamina -= boss.req_stamina;
    
    const myPower = calculateDeckPower();
    // 승률 계산 (내 공격력 vs 보스 방어력)
    // 갓워즈는 친구들과 함께 때리는 레이드지만, 싱글에서는 1:1 확률 승부로 구현
    let winChance = 0.3; // 기본 30%
    if (myPower.atk > boss.def) winChance += 0.3; // 공격력이 방어력을 뚫으면 +30%
    if (myPower.atk > boss.def * 2) winChance = 0.95; // 압도적이면 95%
    
    // 결과
    let isWin = Math.random() < winChance;
    let dmgTaken = Math.floor(boss.atk * 0.1); // 보스 공격력의 10%만큼 피해
    player.stats.hp = Math.max(0, player.stats.hp - dmgTaken);

    if (isWin) {
        gainExp(boss.rew_exp);
        player.resources.gold += boss.rew_gold;
        
        // 보스 카드 드랍 (100% 획득으로 변경하여 확인 쉽도록 함)
        gainUnit(boss.drop_card, 1);
        
        // 쿨타임 적용 (데이터에 있는 time_limit 사용)
        player.bossCd[bossId] = Date.now() + (boss.time_limit * 1000);
        
        showModal("VICTORY", `
            <div style="text-align:center;">
                <h3 style="color:gold;">${boss.name} 처치!</h3>
                <p>획득: ${boss.rew_gold} G / ${boss.rew_exp} EXP</p>
                <p style="color:#69f0ae;">★ 보스 카드 획득! ★</p>
                <p style="font-size:12px; color:#888;">(부대 탭에서 확인하세요)</p>
            </div>
        `);
    } else {
        showModal("DEFEAT", `패배했습니다... 체력 -${dmgTaken}`);
    }
    
    updateUI();
    renderBattle(document.getElementById('main-content'));
}


// --- [C. 상점 (먹통 수정 완료)] ---
function renderShop(container) {
    container.innerHTML = `<h2 class="section-title">상점</h2>`;
    
    // 1. 뽑기
    const gachaDiv = document.createElement('div');
    gachaDiv.className = 'card-item';
    gachaDiv.innerHTML = `
        <div class="card-thumb rank-l"><i class="fa-solid fa-dice"></i></div>
        <div class="card-info">
            <div class="card-title">용병 모집</div>
            <div class="card-desc">무작위 등급의 유닛을 소환합니다.</div>
            <div class="card-meta">비용: 1,000 G</div>
        </div>
        <div class="card-action">
            <button class="btn-action primary" id="btn-gacha">소환</button>
        </div>
    `;
    container.appendChild(gachaDiv);
    
    // 이벤트 리스너 즉시 연결 (ID가 확실히 존재할 때)
    setTimeout(() => {
        const gBtn = document.getElementById('btn-gacha');
        if(gBtn) gBtn.onclick = doGacha; 
    }, 0);

    // 2. 부동산
    container.innerHTML += `<div style="margin:20px 0 10px; font-weight:bold; color:gold;">부동산</div>`;
    
    // BUILDINGS 데이터가 없으면 에러 방지
    if (typeof BUILDINGS !== 'undefined') {
        BUILDINGS.forEach(b => {
            let count = player.buildings[b.id] || 0;
            let cost = Math.floor(b.base_cost * Math.pow(1.5, count));
            
            const bDiv = document.createElement('div');
            bDiv.className = 'card-item';
            bDiv.innerHTML = `
                <div class="card-thumb"><i class="fa-solid fa-landmark"></i></div>
                <div class="card-info">
                    <div class="card-title">${b.name} (Lv.${count})</div>
                    <div class="card-desc">${b.desc}</div>
                    <div class="card-meta">수입: +${b.income}/h | 비용: ${cost.toLocaleString()}G</div>
                </div>
                <div class="card-action">
                    <button class="btn-action" id="btn-build-${b.id}">구매</button>
                </div>
            `;
            container.appendChild(bDiv);

            // 클로저 문제 해결을 위해 즉시 바인딩하지 않고 방식 변경
            setTimeout(() => {
                const btn = document.getElementById(`btn-build-${b.id}`);
                if (btn) {
                    btn.onclick = function() {
                        if (player.resources.gold >= cost) {
                            player.resources.gold -= cost;
                            if(!player.buildings[b.id]) player.buildings[b.id] = 0;
                            player.buildings[b.id]++;
                            showToast(`${b.name} 구매 완료!`);
                            updateUI();
                            renderShop(document.getElementById('main-content')); // 가격 갱신 리렌더링
                        } else {
                            showToast("골드가 부족합니다.");
                        }
                    };
                }
            }, 0);
        });
    } else {
        container.innerHTML += "<div>건물 데이터가 로드되지 않았습니다. (data_buildings.js 확인 필요)</div>";
    }
}

function doGacha() {
    const cost = 1000;
    if (player.resources.gold < cost) {
        showToast("골드가 부족합니다.");
        return;
    }
    player.resources.gold -= cost;

    const rand = Math.random() * 100;
    let rank = 'c';
    if (rand > 50) rank = 'uc';
    if (rand > 80) rank = 'r';
    if (rand > 95) rank = 'e';
    if (rand > 99) rank = 'l';

    // 해당 랭크의 유닛 풀
    const pool = GODS.filter(g => g.rank === rank);
    if (pool.length === 0) {
        // 혹시 데이터가 없으면 커먼이라도 줌
        gainUnit("g_gr_c1", 1);
        updateUI();
        return;
    }
    
    const picked = pool[Math.floor(Math.random() * pool.length)];
    gainUnit(picked.id, 1);
    
    showModal("소환 결과", `
        <div style="text-align:center">
            <h2 style="color:var(--rank-${rank})">${picked.name}</h2>
            <p>등급: ${rank.toUpperCase()}</p>
        </div>
    `);
    updateUI();
}

// --- [나머지 마이홈/부대/조합 렌더링은 기존 유지] ---

function renderHome(container) {
    container.innerHTML = `<h2 class="section-title">대시보드</h2>`;
    const power = calculateDeckPower();
    const income = calculateHourlyIncome();
    container.innerHTML += `
        <div class="stat-grid">
            <div class="stat-box"><span>⚔️ 총 공격</span><span>${power.atk.toLocaleString()}</span></div>
            <div class="stat-box"><span>🛡️ 총 방어</span><span>${power.def.toLocaleString()}</span></div>
            <div class="stat-box"><span>👥 부대</span><span>${power.count} / ${power.capacity}</span></div>
            <div class="stat-box"><span>💰 시간당</span><span>+${income.toLocaleString()}</span></div>
        </div>
    `;
}

function renderUnit(container) {
    container.innerHTML = `<h2 class="section-title">내 병력 (보스카드 포함)</h2>`;
    
    // 정렬: 등급순
    const rankOrder = { 'g': 6, 'l': 5, 'e': 4, 'r': 3, 'uc': 2, 'c': 1 };
    
    // 유닛 데이터 복사해서 정렬
    let displayUnits = [...player.units];
    displayUnits.sort((a, b) => {
        let da = GODS.find(g => g.id === a.id) || {rank:'c'};
        let db = GODS.find(g => g.id === b.id) || {rank:'c'};
        return rankOrder[db.rank] - rankOrder[da.rank];
    });

    displayUnits.forEach(u => {
        const data = GODS.find(g => g.id === u.id);
        if (!data) return;
        const rankClass = `rank-${data.rank}`;
        
        container.innerHTML += `
            <div class="card-item">
                <div class="card-thumb ${rankClass}"><i class="fa-solid fa-user-shield"></i></div>
                <div class="card-info">
                    <div class="card-title">${data.name} <small>[${data.rank.toUpperCase()}]</small></div>
                    <div class="card-meta">⚔️ ${data.atk} 🛡️ ${data.def} | 보유: ${u.count}</div>
                </div>
            </div>
        `;
    });
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function showModal(title, content) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-content').innerHTML = content;
    overlay.classList.remove('hidden');
}
