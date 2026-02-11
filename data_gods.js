// data_gods.js
const GODS = [
    // ==========================================
    // 1. 그리스 신화 (Greek)
    // ==========================================
    // [Common]
    { id: "g_gr_c1", name: "그리스 민병대", rank: "c", element: "earth", atk: 10, def: 10, cost: 1, desc: "마을을 지키는 시민." },
    { id: "g_gr_c2", name: "올림포스 시녀", rank: "c", element: "water", atk: 5, def: 15, cost: 2, desc: "신전의 잡일을 돕는다." },
    // [Uncommon]
    { id: "g_gr_u1", name: "홉라이트", rank: "uc", element: "earth", atk: 25, def: 40, cost: 5, desc: "팔랑크스 진형을 짠다." },
    { id: "g_gr_u2", name: "아마존 전사", rank: "uc", element: "wind", atk: 45, def: 20, cost: 6, desc: "여성 부족의 전사." },
    // [Rare]
    { id: "g_gr_r1", name: "켄타우로스", rank: "r", element: "wind", atk: 80, def: 50, cost: 12, desc: "기동력이 뛰어나다." },
    { id: "g_gr_r2", name: "사이클롭스", rank: "r", element: "fire", atk: 100, def: 30, cost: 15, desc: "외눈박이 거인." },
    // [Epic]
    { id: "g_gr_e1", name: "헤라클레스", rank: "e", element: "earth", atk: 250, def: 200, cost: 40, desc: "그리스 최고의 영웅." },
    { id: "g_gr_e2", name: "메두사", rank: "e", element: "water", atk: 220, def: 230, cost: 42, desc: "눈을 보면 돌이 된다." },
    // [Legend]
    { id: "g_gr_l1", name: "아레스", rank: "l", element: "fire", atk: 500, def: 300, cost: 100, desc: "전쟁의 신." },
    { id: "g_gr_l2", name: "아테나", rank: "l", element: "wind", atk: 450, def: 450, cost: 100, desc: "지혜와 전쟁의 여신." },
    // [God]
    { id: "g_gr_g1", name: "제우스", rank: "g", element: "wind", atk: 1200, def: 1000, cost: 300, desc: "신들의 왕." },
    { id: "g_gr_g2", name: "포세이돈", rank: "g", element: "water", atk: 1100, def: 1100, cost: 300, desc: "바다의 지배자." },
    { id: "g_gr_g3", name: "하데스", rank: "g", element: "earth", atk: 1150, def: 1050, cost: 300, desc: "명계의 왕." },

    // ==========================================
    // 2. 한국 신화 (Korean)
    // ==========================================
    // [Common]
    { id: "g_kr_c1", name: "포졸", rank: "c", element: "earth", atk: 12, def: 8, cost: 1, desc: "육모방망이를 든다." },
    { id: "g_kr_c2", name: "사당패", rank: "c", element: "wind", atk: 8, def: 12, cost: 2, desc: "흥을 돋구는 무리." },
    // [Uncommon]
    { id: "g_kr_u1", name: "착호갑사", rank: "uc", element: "fire", atk: 50, def: 20, cost: 6, desc: "호랑이 잡는 특수부대." },
    { id: "g_kr_u2", name: "저승사자", rank: "uc", element: "water", atk: 40, def: 40, cost: 7, desc: "검은 갓을 쓴 사자." },
    // [Rare]
    { id: "g_kr_r1", name: "도깨비", rank: "r", element: "earth", atk: 90, def: 60, cost: 13, desc: "씨름을 좋아한다." },
    { id: "g_kr_r2", name: "구미호", rank: "r", element: "fire", atk: 110, def: 40, cost: 15, desc: "간을 좋아하는 여우." },
    // [Epic]
    { id: "g_kr_e1", name: "불가사리", rank: "e", element: "earth", atk: 200, def: 280, cost: 45, desc: "쇠를 먹는 괴물." },
    { id: "g_kr_e2", name: "주작", rank: "e", element: "fire", atk: 300, def: 150, cost: 50, desc: "남방을 지키는 신수." },
    // [Legend]
    { id: "g_kr_l1", name: "치우천왕", rank: "l", element: "fire", atk: 550, def: 400, cost: 110, desc: "전쟁의 신." },
    { id: "g_kr_l2", name: "단군", rank: "l", element: "earth", atk: 400, def: 600, cost: 105, desc: "고조선의 건국자." },
    // [God]
    { id: "g_kr_g1", name: "환웅", rank: "g", element: "wind", atk: 1300, def: 900, cost: 320, desc: "하늘을 열고 내려온 자." },
    { id: "g_kr_g2", name: "환인", rank: "g", element: "wind", atk: 1500, def: 1500, cost: 350, desc: "하늘님의 주재자." },

    // ==========================================
    // 3. 북유럽 신화 (Norse)
    // ==========================================
    // [Common]
    { id: "g_nr_c1", name: "바이킹 약탈자", rank: "c", element: "water", atk: 15, def: 5, cost: 2, desc: "도끼를 든 전사." },
    // [Uncommon]
    { id: "g_nr_u1", name: "실드메이든", rank: "uc", element: "earth", atk: 30, def: 40, cost: 6, desc: "방패의 여전사." },
    // [Rare]
    { id: "g_nr_r1", name: "발키리", rank: "r", element: "wind", atk: 85, def: 75, cost: 14, desc: "전사자를 인도하는 자." },
    // [Epic]
    { id: "g_nr_e1", name: "펜릴", rank: "e", element: "earth", atk: 320, def: 180, cost: 55, desc: "신을 삼키는 늑대." },
    // [Legend]
    { id: "g_nr_l1", name: "토르", rank: "l", element: "fire", atk: 600, def: 350, cost: 120, desc: "천둥의 신." },
    { id: "g_nr_l2", name: "로키", rank: "l", element: "water", atk: 350, def: 350, cost: 100, desc: "장난의 신." },
    // [God]
    { id: "g_nr_g1", name: "오딘", rank: "g", element: "wind", atk: 1400, def: 1100, cost: 330, desc: "모든 신의 아버지." },

    // ==========================================
    // 4. 이집트 신화 (Egyptian)
    // ==========================================
    // [Common]
    { id: "g_eg_c1", name: "노예", rank: "c", element: "earth", atk: 5, def: 5, cost: 0, desc: "피라미드를 짓는다." },
    // [Uncommon]
    { id: "g_eg_u1", name: "미라", rank: "uc", element: "earth", atk: 30, def: 30, cost: 5, desc: "썩지 않는 육체." },
    // [Rare]
    { id: "g_eg_r1", name: "스핑크스", rank: "r", element: "fire", atk: 100, def: 80, cost: 16, desc: "수수께끼의 괴수." },
    // [Epic]
    { id: "g_eg_e1", name: "아누비스", rank: "e", element: "earth", atk: 280, def: 280, cost: 50, desc: "죽은 자의 관리자." },
    // [Legend]
    { id: "g_eg_l1", name: "오시리스", rank: "l", element: "water", atk: 450, def: 550, cost: 110, desc: "부활의 신." },
    // [God]
    { id: "g_eg_g1", name: "라 (Ra)", rank: "g", element: "fire", atk: 1600, def: 800, cost: 350, desc: "태양신." }
];
