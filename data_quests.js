// data_quests.js
const QUESTS = {
    // ==========================================
    // Chapter 1. 그리스 신화 (The Greek)
    // ==========================================
    "ch1": {
        name: "그리스 신화: 신들의 전쟁",
        desc: "올림포스 신들의 다툼이 시작되었습니다.",
        background: "bg_greek.jpg", // 나중에 이미지가 들어갈 자리
        list: [
            {
                id: "q_ch1_01",
                name: "신전 청소하기",
                req_energy: 1,
                rew_exp: 2,
                rew_gold_min: 5,
                rew_gold_max: 10,
                drop_item_id: "mat_g_01", // 부러진 창
                drop_rate: 0.15,
                mastery_max: 100 // 숙련도 최대치
            },
            {
                id: "q_ch1_02",
                name: "님프들에게 길 묻기",
                req_energy: 2,
                rew_exp: 5,
                rew_gold_min: 15,
                rew_gold_max: 25,
                drop_item_id: "mat_g_04", // 님프의 날개가루
                drop_rate: 0.12,
                mastery_max: 120
            },
            {
                id: "q_ch1_03",
                name: "네메아의 사자 추적",
                req_energy: 4,
                rew_exp: 10,
                rew_gold_min: 40,
                rew_gold_max: 60,
                drop_item_id: "mat_g_06", // 황금 양털
                drop_rate: 0.08,
                mastery_max: 150
            },
            {
                id: "q_ch1_04",
                name: "올림포스 입구 방어",
                req_energy: 6,
                rew_exp: 20,
                rew_gold_min: 80,
                rew_gold_max: 100,
                drop_item_id: "mat_g_rare", // 제우스의 번개 조각
                drop_rate: 0.03,
                mastery_max: 200
            },
            // [보스 소환 임무]
            {
                id: "q_ch1_boss",
                type: "boss",
                name: "[보스] 히드라의 둥지",
                req_energy: 10,
                boss_id: "boss_s_01", // 소형 보스: 히드라
                desc: "히드라를 발견했습니다! (클릭 시 레이드 발생)"
            }
        ]
    },

    // ==========================================
    // Chapter 2. 한국 신화 (The Korean)
    // ==========================================
    "ch2": {
        name: "한국 신화: 고조선의 아침",
        desc: "동방의 나라에서 호랑이와 곰의 전설이 들려옵니다.",
        background: "bg_korea.jpg",
        list: [
            {
                id: "q_ch2_01",
                name: "쑥과 마늘 채집",
                req_energy: 8,
                rew_exp: 30,
                rew_gold_min: 100,
                rew_gold_max: 120,
                drop_item_id: "mat_k_01", 
                drop_rate: 0.15,
                mastery_max: 150
            },
            {
                id: "q_ch2_02",
                name: "산적 소탕",
                req_energy: 10,
                rew_exp: 45,
                rew_gold_min: 150,
                rew_gold_max: 200,
                drop_item_id: "mat_k_04", // 도깨비 감투
                drop_rate: 0.10,
                mastery_max: 180
            },
            {
                id: "q_ch2_03",
                name: "호랑이굴 탐험",
                req_energy: 12,
                rew_exp: 60,
                rew_gold_min: 250,
                rew_gold_max: 300,
                drop_item_id: "mat_k_02", // 호랑이 가죽
                drop_rate: 0.08,
                mastery_max: 200
            },
            {
                id: "q_ch2_04",
                name: "천부인 찾기",
                req_energy: 15,
                rew_exp: 100,
                rew_gold_min: 400,
                rew_gold_max: 500,
                drop_item_id: "mat_k_rare", // 천부인
                drop_rate: 0.02,
                mastery_max: 300
            },
            {
                id: "q_ch2_boss",
                type: "boss",
                name: "[보스] 구미호의 유혹",
                req_energy: 20,
                boss_id: "boss_m_01", // 중형 보스: 구미호
                desc: "구미호가 나타났습니다!"
            }
        ]
    },

    // ==========================================
    // Chapter 3. 북유럽 신화 (The Norse)
    // ==========================================
    "ch3": {
        name: "북유럽 신화: 라그나로크의 서막",
        desc: "차가운 바람과 함께 거인들이 움직입니다.",
        background: "bg_norse.jpg",
        list: [
            {
                id: "q_ch3_01",
                name: "빙하 깨기",
                req_energy: 15,
                rew_exp: 120,
                rew_gold_min: 500,
                rew_gold_max: 600,
                drop_item_id: "mat_n_04", // 영원한 얼음
                drop_rate: 0.15,
                mastery_max: 200
            },
            {
                id: "q_ch3_02",
                name: "발키리의 시험",
                req_energy: 18,
                rew_exp: 150,
                rew_gold_min: 700,
                rew_gold_max: 800,
                drop_item_id: "mat_n_02", // 발키리의 깃털
                drop_rate: 0.10,
                mastery_max: 250
            },
            {
                id: "q_ch3_03",
                name: "세계수 관리",
                req_energy: 20,
                rew_exp: 200,
                rew_gold_min: 1000,
                rew_gold_max: 1200,
                drop_item_id: "mat_n_05", // 세계수의 잎
                drop_rate: 0.05,
                mastery_max: 300
            },
            {
                id: "q_ch3_04",
                name: "오딘의 지혜 구하기",
                req_energy: 25,
                rew_exp: 300,
                rew_gold_min: 1500,
                rew_gold_max: 2000,
                drop_item_id: "mat_n_rare", // 오딘의 안대
                drop_rate: 0.01,
                mastery_max: 500
            },
            {
                id: "q_ch3_boss",
                type: "boss",
                name: "[보스] 펜릴의 포효",
                req_energy: 30,
                boss_id: "boss_l_01", // 대형 보스: 펜릴
                desc: "거대한 늑대 펜릴을 막아야 합니다."
            }
        ]
    }
	// ==========================================
    // Chapter 4. 이집트 신화 (The Egyptian) - 누락분 추가
    // ==========================================
    "ch4": {
        name: "이집트 신화: 사막의 그림자",
        desc: "뜨거운 태양 아래, 피라미드의 저주가 깨어납니다.",
        background: "bg_egypt.jpg",
        list: [
            {
                id: "q_ch4_01",
                name: "나일강의 범람 막기",
                req_energy: 20,
                rew_exp: 250,
                rew_gold_min: 800,
                rew_gold_max: 1000,
                drop_item_id: "mat_e_01", // 파피루스
                drop_rate: 0.15,
                mastery_max: 200
            },
            {
                id: "q_ch4_02",
                name: "피라미드 도굴꾼 처단",
                req_energy: 22,
                rew_exp: 300,
                rew_gold_min: 1200,
                rew_gold_max: 1500,
                drop_item_id: "mat_e_03", // 미라의 붕대
                drop_rate: 0.12,
                mastery_max: 250
            },
            {
                id: "q_ch4_03",
                name: "스핑크스의 수수께끼",
                req_energy: 25,
                rew_exp: 400,
                rew_gold_min: 1800,
                rew_gold_max: 2200,
                drop_item_id: "mat_e_02", // 풍뎅이 보석
                drop_rate: 0.08,
                mastery_max: 300
            },
            {
                id: "q_ch4_04",
                name: "아누비스의 심판",
                req_energy: 30,
                rew_exp: 600,
                rew_gold_min: 2500,
                rew_gold_max: 3000,
                drop_item_id: "mat_e_rare", // 태양의 서
                drop_rate: 0.02,
                mastery_max: 500
            },
            {
                id: "q_ch4_boss",
                type: "boss",
                name: "[보스] 아포피스의 귀환",
                req_energy: 40,
                boss_id: "boss_l_04", // 대형 보스: 아포피스
                desc: "태양을 삼키려는 뱀 아포피스가 나타났습니다."
            }
        ]
    }
    // 이후 올림포스 탑, 지하세계 등 추가 확장 가능

};
