// data_missions.js
// Source: user-provided mission table screenshots (transcribed)

const MISSIONS = [
  {
    chapterId: "1",
    chapterName: "튜토리얼",
    zones: [
      {
        zoneId: "1.1",
        zoneName: "튜토리얼",
        missions: [
          { id: "1.1.sub.01", type: "sub",  name: "선택의 시간", reqEnergy: 2, rewardGold: 100,  rewardXp: 2 },
          { id: "1.1.main.01", type: "main", name: "모험의 시간", reqEnergy: 3, rewardGold: 100,  rewardXp: 3 },
        ],
      },
    ],
  },

  {
    chapterId: "2",
    chapterName: "영웅이 되기 위한 첫걸음 - 그리스",
    zones: [
      {
        zoneId: "2.1",
        zoneName: "제우스",
        missions: [
          { id: "2.1.sub.01", type: "sub",  name: "제우스의 시험",     reqEnergy: 2, rewardGold: 100,  rewardXp: 2 },
          { id: "2.1.sub.02", type: "sub",  name: "과수원 파수꾼",     reqEnergy: 2, rewardGold: 200,  rewardXp: 3 },
          { id: "2.1.sub.03", type: "sub",  name: "엉터리 요리사",     reqEnergy: 2, rewardGold: 400,  rewardXp: 4 },
          { id: "2.1.sub.04", type: "sub",  name: "이젠 내가 요리사", reqEnergy: 2, rewardGold: 450,  rewardXp: 5 },
          { id: "2.1.sub.05", type: "sub",  name: "편안한 오후의 낮잠", reqEnergy: 2, rewardGold: 500, rewardXp: 5 },
          { id: "2.1.main.01", type: "main", name: "돌연변이 버섯",    reqEnergy: 5, rewardGold: 2000, rewardXp: 8 },
        ],
      },

      {
        zoneId: "2.2",
        zoneName: "포세이돈",
        missions: [
          { id: "2.2.sub.01", type: "sub",  name: "바다의 제왕 포세이돈", reqEnergy: 2, rewardGold: 600,  rewardXp: 3 },
          { id: "2.2.sub.02", type: "sub",  name: "포세이돈의 궁전",      reqEnergy: 2, rewardGold: 700,  rewardXp: 3 },
          { id: "2.2.sub.03", type: "sub",  name: "삼지창 연마",          reqEnergy: 3, rewardGold: 900,  rewardXp: 5 },
          { id: "2.2.sub.04", type: "sub",  name: "보물선 수색",          reqEnergy: 3, rewardGold: 1200, rewardXp: 5 },
          { id: "2.2.sub.05", type: "sub",  name: "심해 상어 퇴치",       reqEnergy: 4, rewardGold: 1500, rewardXp: 7 },
          { id: "2.2.main.01", type: "main", name: "거대 상어",           reqEnergy: 10, rewardGold: 3000, rewardXp: 15 },
        ],
      },

      {
        zoneId: "2.3",
        zoneName: "아테나",
        missions: [
          { id: "2.3.sub.01", type: "sub",  name: "아테나의 신전 청소", reqEnergy: 5, rewardGold: 2000, rewardXp: 9 },
          { id: "2.3.sub.02", type: "sub",  name: "해충 박멸",         reqEnergy: 6, rewardGold: 2300, rewardXp: 11 },
          { id: "2.3.sub.03", type: "sub",  name: "신성한 올리브 나무", reqEnergy: 8, rewardGold: 2600, rewardXp: 15 },
          { id: "2.3.sub.04", type: "sub",  name: "값진 전투 훈련",     reqEnergy: 9, rewardGold: 3000, rewardXp: 17 },
          { id: "2.3.main.01", type: "main", name: "목숨을 건 실전",     reqEnergy: 15, rewardGold: 5000, rewardXp: 25 },
        ],
      },

      {
        zoneId: "2.4",
        zoneName: "아폴론",
        missions: [
          { id: "2.4.sub.01", type: "sub",  name: "아폴론의 감미로운 선율", reqEnergy: 8,  rewardGold: 3500, rewardXp: 15 },
          { id: "2.4.sub.02", type: "sub",  name: "성대한 만찬",            reqEnergy: 10, rewardGold: 3800, rewardXp: 19 },
          { id: "2.4.sub.03", type: "sub",  name: "태양의 노래",            reqEnergy: 13, rewardGold: 4200, rewardXp: 25 },
          { id: "2.4.sub.04", type: "sub",  name: "태양의 전사",            reqEnergy: 15, rewardGold: 4800, rewardXp: 29 },
          { id: "2.4.sub.05", type: "sub",  name: "생명의 축복",            reqEnergy: 17, rewardGold: 5100, rewardXp: 33 },
          { id: "2.4.main.01", type: "main", name: "태양의 선물",           reqEnergy: 20, rewardGold: 10000, rewardXp: 35 },
        ],
      },

      {
        zoneId: "2.5",
        zoneName: "아프로디테",
        missions: [
          { id: "2.5.sub.01", type: "sub",  name: "아름다운 아프로디테", reqEnergy: 11, rewardGold: 6000, rewardXp: 22 },
          { id: "2.5.sub.02", type: "sub",  name: "여신을 위한 선물",     reqEnergy: 14, rewardGold: 6400, rewardXp: 29 },
          { id: "2.5.sub.03", type: "sub",  name: "자외선을 차단하라",     reqEnergy: 16, rewardGold: 6900, rewardXp: 34 },
          { id: "2.5.sub.04", type: "sub",  name: "여신의 밀회",           reqEnergy: 19, rewardGold: 7200, rewardXp: 41 },
          { id: "2.5.sub.05", type: "sub",  name: "휴식의 시간",           reqEnergy: 21, rewardGold: 7600, rewardXp: 46 },
          { id: "2.5.sub.06", type: "sub",  name: "숲속의 물청객",         reqEnergy: 22, rewardGold: 8000, rewardXp: 49 },
          { id: "2.5.main.01", type: "main", name: "파파라치 퇴치",        reqEnergy: 30, rewardGold: 20000, rewardXp: 55 },
        ],
      },

      {
        zoneId: "2.6",
        zoneName: "헤라클레스",
        missions: [
          { id: "2.6.sub.01", type: "sub",  name: "영웅 헤라클레스",     reqEnergy: 15, rewardGold: 9500,  rewardXp: 34 },
          { id: "2.6.sub.02", type: "sub",  name: "네메아의 사자",       reqEnergy: 18, rewardGold: 10200, rewardXp: 41 },
          { id: "2.6.sub.03", type: "sub",  name: "호수의 히드라",       reqEnergy: 22, rewardGold: 10500, rewardXp: 51 },
          { id: "2.6.sub.04", type: "sub",  name: "바람보다 빠른 사슴",  reqEnergy: 25, rewardGold: 11600, rewardXp: 58 },
          { id: "2.6.sub.05", type: "sub",  name: "외양간 청소",         reqEnergy: 27, rewardGold: 12000, rewardXp: 63 },
          { id: "2.6.sub.06", type: "sub",  name: "크레타의 황소",       reqEnergy: 31, rewardGold: 12800, rewardXp: 73 },
          { id: "2.6.sub.07", type: "sub",  name: "히폴리테스의 허리띠", reqEnergy: 35, rewardGold: 13400, rewardXp: 83 },
          { id: "2.6.main.01", type: "main", name: "하데스의 케르베로스", reqEnergy: 40, rewardGold: 30000, rewardXp: 80 },
        ],
      },

      {
        zoneId: "2.7",
        zoneName: "그리스 여신",
        missions: [
          { id: "2.7.sub.01", type: "sub",  name: "헤라의 질투",         reqEnergy: 25, rewardGold: 14000, rewardXp: 60 },
          { id: "2.7.sub.02", type: "sub",  name: "데메테르의 부탁",     reqEnergy: 28, rewardGold: 15000, rewardXp: 68 },
          { id: "2.7.sub.03", type: "sub",  name: "아르테미스",          reqEnergy: 31, rewardGold: 16500, rewardXp: 76 },
          { id: "2.7.sub.04", type: "sub",  name: "헤스티아의 화덕",     reqEnergy: 35, rewardGold: 17200, rewardXp: 86 },
          { id: "2.7.sub.05", type: "sub",  name: "페르세포네의 눈물",   reqEnergy: 39, rewardGold: 18000, rewardXp: 96 },
          { id: "2.7.sub.06", type: "sub",  name: "에우로페이의 도피",   reqEnergy: 43, rewardGold: 19800, rewardXp: 106 },
          { id: "2.7.main.01", type: "main", name: "테미스의 예언",      reqEnergy: 50, rewardGold: 40000, rewardXp: 120 },
        ],
      },

      {
        zoneId: "2.8",
        zoneName: "페르세우스",
        missions: [
          { id: "2.8.sub.01", type: "sub",  name: "미케네의 왕 페르세우스", reqEnergy: 31, rewardGold: 20000, rewardXp: 77 },
          { id: "2.8.sub.02", type: "sub",  name: "고난의 여정",           reqEnergy: 33, rewardGold: 22000, rewardXp: 82 },
          { id: "2.8.sub.03", type: "sub",  name: "지혜의 시험",           reqEnergy: 35, rewardGold: 24500, rewardXp: 87 },
          { id: "2.8.sub.04", type: "sub",  name: "죽음의 도전",           reqEnergy: 38, rewardGold: 25200, rewardXp: 95 },
          { id: "2.8.sub.05", type: "sub",  name: "폭풍의 인내",           reqEnergy: 40, rewardGold: 26300, rewardXp: 101 },
          { id: "2.8.sub.06", type: "sub",  name: "장비의 제련",           reqEnergy: 42, rewardGold: 27000, rewardXp: 107 },
          { id: "2.8.sub.07", type: "sub",  name: "검은연기의 협곡",       reqEnergy: 45, rewardGold: 28500, rewardXp: 115 },
          { id: "2.8.main.01", type: "main", name: "메두사",               reqEnergy: 60, rewardGold: 70000, rewardXp: 150 },
        ],
      },

      {
        zoneId: "2.9",
        zoneName: "트로이",
        missions: [
          { id: "2.9.sub.01", type: "sub",  name: "트로이 전쟁",           reqEnergy: 35, rewardGold: 30000, rewardXp: 88 },
          { id: "2.9.sub.02", type: "sub",  name: "에리스의 황금사과",     reqEnergy: 37, rewardGold: 31200, rewardXp: 94 },
          { id: "2.9.sub.03", type: "sub",  name: "파리스와 헬레네",       reqEnergy: 40, rewardGold: 32000, rewardXp: 102 },
          { id: "2.9.sub.04", type: "sub",  name: "전쟁 발발",             reqEnergy: 42, rewardGold: 33500, rewardXp: 108 },
          { id: "2.9.sub.05", type: "sub",  name: "트로이 장군 헥토르",    reqEnergy: 45, rewardGold: 34000, rewardXp: 117 },
          { id: "2.9.sub.06", type: "sub",  name: "아킬레우스의 분노",     reqEnergy: 47, rewardGold: 35000, rewardXp: 123 },
          { id: "2.9.sub.07", type: "sub",  name: "오디세우스의 지혜",     reqEnergy: 51, rewardGold: 36400, rewardXp: 134 },
          { id: "2.9.sub.08", type: "sub",  name: "트로이 목마",           reqEnergy: 54, rewardGold: 37800, rewardXp: 143 },
          { id: "2.9.main.01", type: "main", name: "영웅의 귀환",          reqEnergy: 70, rewardGold: 100000, rewardXp: 180 },
        ],
      },

      {
        zoneId: "2.10",
        zoneName: "이아손",
        missions: [
          { id: "2.10.sub.01", type: "sub",  name: "그리스의 영웅",        reqEnergy: 60, rewardGold: 33500, rewardXp: 145 },
          { id: "2.10.sub.02", type: "sub",  name: "한쪽의 샌들",          reqEnergy: 62, rewardGold: 34000, rewardXp: 155 },
          { id: "2.10.sub.03", type: "sub",  name: "샌들을 가져간 노파",  reqEnergy: 64, rewardGold: 34500, rewardXp: 165 },
          { id: "2.10.sub.04", type: "sub",  name: "제우스의 부름",        reqEnergy: 66, rewardGold: 35000, rewardXp: 175 },
          { id: "2.10.sub.05", type: "sub",  name: "이아손의 향기",        reqEnergy: 68, rewardGold: 36000, rewardXp: 185 },
          { id: "2.10.sub.06", type: "sub",  name: "여행을 떠난 영웅",     reqEnergy: 70, rewardGold: 37000, rewardXp: 195 },
          { id: "2.10.main.01", type: "main", name: "빠드릉니 레드드래곤", reqEnergy: 85, rewardGold: 45000, rewardXp: 220 },
        ],
      },

      {
        zoneId: "2.11",
        zoneName: "메디아",
        missions: [
          { id: "2.11.sub.01", type: "sub",  name: "바다위의 아르고호",      reqEnergy: 65, rewardGold: 35000, rewardXp: 170 },
          { id: "2.11.sub.02", type: "sub",  name: "신탁의 영웅들",          reqEnergy: 67, rewardGold: 36000, rewardXp: 180 },
          { id: "2.11.sub.03", type: "sub",  name: "동방의 황무지 콜키스",   reqEnergy: 69, rewardGold: 37000, rewardXp: 190 },
          { id: "2.11.sub.04", type: "sub",  name: "입에서 불을 뿜는 황소",  reqEnergy: 71, rewardGold: 38000, rewardXp: 200 },
          { id: "2.11.sub.05", type: "sub",  name: "마녀 메디아",            reqEnergy: 73, rewardGold: 39000, rewardXp: 210 },
          { id: "2.11.sub.06", type: "sub",  name: "사랑에 빠지다",          reqEnergy: 75, rewardGold: 40000, rewardXp: 220 },
          { id: "2.11.main.01", type: "main", name: "신기한 털",             reqEnergy: 90, rewardGold: 220000, rewardXp: 230 },
        ],
      },
    ],
  },

  {
    chapterId: "3",
    chapterName: "동방의 비밀을 찾아서 - 한국",
    zones: [
      {
        zoneId: "3.1",
        zoneName: "홍익인간",
        missions: [
          { id: "3.1.sub.01", type: "sub",  name: "개천 - 하늘의 열림", reqEnergy: 15, rewardGold: 30000, rewardXp: 30 },
          { id: "3.1.sub.02", type: "sub",  name: "동방의 빛과 신단수", reqEnergy: 17, rewardGold: 32000, rewardXp: 34 },
          { id: "3.1.sub.03", type: "sub",  name: "환웅과의 만남",       reqEnergy: 17, rewardGold: 34000, rewardXp: 34 },
          { id: "3.1.sub.04", type: "sub",  name: "호족과 웅족",         reqEnergy: 20, rewardGold: 36000, rewardXp: 40 },
          { id: "3.1.sub.05", type: "sub",  name: "시험의 시간",         reqEnergy: 21, rewardGold: 37500, rewardXp: 42 },
          { id: "3.1.sub.06", type: "sub",  name: "약속한 100일",        reqEnergy: 23, rewardGold: 39000, rewardXp: 46 },
          { id: "3.1.sub.07", type: "sub",  name: "환웅의 약속",         reqEnergy: 23, rewardGold: 40000, rewardXp: 46 },
          { id: "3.1.main.01", type: "main", name: "홍익인간",            reqEnergy: 50, rewardGold: 50000, rewardXp: 100 },
        ],
      },

      {
        zoneId: "3.2",
        zoneName: "전래동화",
        missions: [
          { id: "3.2.sub.01", type: "sub",  name: "은혜갚은 까치", reqEnergy: 20, rewardGold: 40000, rewardXp: 46 },
          { id: "3.2.sub.02", type: "sub",  name: "도깨비 감투",   reqEnergy: 21, rewardGold: 41000, rewardXp: 48 },
          { id: "3.2.sub.03", type: "sub",  name: "우렁각시",      reqEnergy: 22, rewardGold: 43500, rewardXp: 50 },
          { id: "3.2.sub.04", type: "sub",  name: "흑부리 영감",   reqEnergy: 23, rewardGold: 45000, rewardXp: 52 },
          { id: "3.2.sub.05", type: "sub",  name: "나무꾼과 선녀", reqEnergy: 24, rewardGold: 46000, rewardXp: 55 },
          { id: "3.2.sub.06", type: "sub",  name: "신기한 맷돌",   reqEnergy: 25, rewardGold: 48000, rewardXp: 57 },
          { id: "3.2.sub.07", type: "sub",  name: "햇님달님",      reqEnergy: 26, rewardGold: 48500, rewardXp: 59 },
          { id: "3.2.sub.08", type: "sub",  name: "호랑이와 곶감", reqEnergy: 27, rewardGold: 49000, rewardXp: 62 },
          { id: "3.2.sub.09", type: "sub",  name: "구미호",        reqEnergy: 28, rewardGold: 50000, rewardXp: 64 },
          { id: "3.2.main.01", type: "main", name: "전래 동화",     reqEnergy: 50, rewardGold: 80000, rewardXp: 120 },
        ],
      },

      {
        zoneId: "3.3",
        zoneName: "역사 이야기",
        missions: [
          { id: "3.3.sub.01", type: "sub",  name: "광개토대왕", reqEnergy: 25, rewardGold: 50000, rewardXp: 62 },
          { id: "3.3.sub.02", type: "sub",  name: "을지문덕",   reqEnergy: 26, rewardGold: 52000, rewardXp: 65 },
          { id: "3.3.sub.03", type: "sub",  name: "왕만춘",     reqEnergy: 27, rewardGold: 52500, rewardXp: 67 },
          { id: "3.3.sub.04", type: "sub",  name: "연개소문",   reqEnergy: 28, rewardGold: 53000, rewardXp: 70 },
          { id: "3.3.sub.05", type: "sub",  name: "계백",       reqEnergy: 29, rewardGold: 54000, rewardXp: 72 },
          { id: "3.3.sub.06", type: "sub",  name: "김유신",     reqEnergy: 30, rewardGold: 55000, rewardXp: 75 },
          { id: "3.3.sub.07", type: "sub",  name: "대조영",     reqEnergy: 31, rewardGold: 57000, rewardXp: 77 },
          { id: "3.3.sub.08", type: "sub",  name: "이사부",     reqEnergy: 32, rewardGold: 59000, rewardXp: 80 },
          { id: "3.3.sub.09", type: "sub",  name: "장보고",     reqEnergy: 33, rewardGold: 60000, rewardXp: 82 },
          { id: "3.3.main.01", type: "main", name: "역사의 이야기", reqEnergy: 50, rewardGold: 100000, rewardXp: 140 },
        ],
      },

      {
        zoneId: "3.4",
        zoneName: "충무공",
        missions: [
          { id: "3.4.sub.01", type: "sub",  name: "무과 합격",   reqEnergy: 30, rewardGold: 60000, rewardXp: 81 },
          { id: "3.4.sub.02", type: "sub",  name: "임진왜란",   reqEnergy: 31, rewardGold: 61000, rewardXp: 83 },
          { id: "3.4.sub.03", type: "sub",  name: "거북선",     reqEnergy: 32, rewardGold: 63000, rewardXp: 86 },
          { id: "3.4.sub.04", type: "sub",  name: "거짓 모함",  reqEnergy: 33, rewardGold: 63500, rewardXp: 89 },
          { id: "3.4.sub.05", type: "sub",  name: "백의종군",   reqEnergy: 34, rewardGold: 64000, rewardXp: 91 },
          { id: "3.4.sub.06", type: "sub",  name: "사모곡",     reqEnergy: 35, rewardGold: 66000, rewardXp: 94 },
          { id: "3.4.sub.07", type: "sub",  name: "원균의 대패", reqEnergy: 36, rewardGold: 67000, rewardXp: 97 },
          { id: "3.4.sub.08", type: "sub",  name: "명량해전",   reqEnergy: 37, rewardGold: 69000, rewardXp: 99 },
          { id: "3.4.sub.09", type: "sub",  name: "노량해전",   reqEnergy: 38, rewardGold: 70000, rewardXp: 102 },
          { id: "3.4.main.01", type: "main", name: "충무공",     reqEnergy: 50, rewardGold: 150000, rewardXp: 160 },
        ],
      },

      {
        zoneId: "3.5",
        zoneName: "불가살이",
        missions: [
          { id: "3.5.sub.01", type: "sub",  name: "크나큰 성과",     reqEnergy: 35, rewardGold: 63000, rewardXp: 94 },
          { id: "3.5.sub.02", type: "sub",  name: "대왕의 도장",     reqEnergy: 37, rewardGold: 64000, rewardXp: 100 },
          { id: "3.5.sub.03", type: "sub",  name: "만수무강성",      reqEnergy: 39, rewardGold: 65000, rewardXp: 110 },
          { id: "3.5.sub.04", type: "sub",  name: "미끼",            reqEnergy: 41, rewardGold: 66000, rewardXp: 120 },
          { id: "3.5.sub.05", type: "sub",  name: "운무에 가린 성",  reqEnergy: 43, rewardGold: 67000, rewardXp: 130 },
          { id: "3.5.sub.06", type: "sub",  name: "구로산맥",        reqEnergy: 45, rewardGold: 68000, rewardXp: 140 },
          { id: "3.5.sub.07", type: "sub",  name: "완성된 탑",       reqEnergy: 47, rewardGold: 69000, rewardXp: 150 },
          { id: "3.5.main.01", type: "main", name: "결전 불가살이",   reqEnergy: 50, rewardGold: 70000, rewardXp: 160 },
        ],
      },

      {
        zoneId: "3.6",
        zoneName: "구미호",
        missions: [
          { id: "3.6.sub.01", type: "sub",  name: "풀려난 신수",       reqEnergy: 40, rewardGold: 65000, rewardXp: 110 },
          { id: "3.6.sub.02", type: "sub",  name: "귀여운 소녀",       reqEnergy: 42, rewardGold: 66000, rewardXp: 115 },
          { id: "3.6.sub.03", type: "sub",  name: "영웅의 보람",       reqEnergy: 44, rewardGold: 67000, rewardXp: 120 },
          { id: "3.6.sub.04", type: "sub",  name: "작은 소녀의 보답",   reqEnergy: 46, rewardGold: 68000, rewardXp: 160 },
          { id: "3.6.sub.05", type: "sub",  name: "구슬안에 있는 것",   reqEnergy: 48, rewardGold: 69000, rewardXp: 170 },
          { id: "3.6.sub.06", type: "sub",  name: "폭포수에서",         reqEnergy: 50, rewardGold: 70000, rewardXp: 180 },
          { id: "3.6.sub.07", type: "sub",  name: "사람 되는 방법",     reqEnergy: 52, rewardGold: 71000, rewardXp: 190 },
          { id: "3.6.main.01", type: "main", name: "잘못된 레시피",      reqEnergy: 55, rewardGold: 72000, rewardXp: 200 },
        ],
      },
    ],
  },

  // 4.* 북유럽 (이미지에 나온 구간만)
  {
    chapterId: "4",
    chapterName: "북유럽의 평화를 지켜라 - 북유럽",
    zones: [
      {
        zoneId: "4.1",
        zoneName: "토르",
        missions: [
          { id: "4.1.sub.01", type: "sub",  name: "돈상자를 찾아서", reqEnergy: 55, rewardGold: 40000, rewardXp: 160 },
          { id: "4.1.sub.02", type: "sub",  name: "거인의 발자국",   reqEnergy: 60, rewardGold: 42000, rewardXp: 180 },
          { id: "4.1.sub.03", type: "sub",  name: "토르의 부탁",     reqEnergy: 65, rewardGold: 44000, rewardXp: 200 },
          { id: "4.1.sub.04", type: "sub",  name: "끈질긴 추격",     reqEnergy: 55, rewardGold: 40000, rewardXp: 190 },
          { id: "4.1.sub.05", type: "sub",  name: "매머드 사냥",     reqEnergy: 57, rewardGold: 41500, rewardXp: 200 },
          { id: "4.1.main.01", type: "main", name: "늑대사냥도 식후경", reqEnergy: 90, rewardGold: 200000, rewardXp: 345 },
        ],
      },
      {
        zoneId: "4.2",
        zoneName: "히미르",
        missions: [
          { id: "4.2.sub.01", type: "sub",  name: "재앙의 징조들",           reqEnergy: 58, rewardGold: 48000, rewardXp: 200 },
          { id: "4.2.sub.02", type: "sub",  name: "티르의 아버지 히미르",   reqEnergy: 59, rewardGold: 49000, rewardXp: 210 },
          { id: "4.2.sub.03", type: "sub",  name: "불길한 뱀껍질",           reqEnergy: 60, rewardGold: 50000, rewardXp: 220 },
          { id: "4.2.sub.04", type: "sub",  name: "뱀을 뭘로 낚더냐",        reqEnergy: 61, rewardGold: 51000, rewardXp: 230 },
          { id: "4.2.sub.05", type: "sub",  name: "바다 개구리를 잡아라",   reqEnergy: 62, rewardGold: 52000, rewardXp: 235 },
          { id: "4.2.sub.06", type: "sub",  name: "미식가 개구리",           reqEnergy: 63, rewardGold: 53000, rewardXp: 240 },
          { id: "4.2.main.01", type: "main", name: "개구리 낚시대",          reqEnergy: 98, rewardGold: 220000, rewardXp: 400 },
        ],
      },
      {
        zoneId: "4.3",
        zoneName: "오딘",
        missions: [
          { id: "4.3.sub.01", type: "sub",  name: "오딘의 부름",           reqEnergy: 70, rewardGold: 54000, rewardXp: 270 },
          { id: "4.3.sub.02", type: "sub",  name: "날려버린 기회",         reqEnergy: 71, rewardGold: 55000, rewardXp: 275 },
          { id: "4.3.sub.03", type: "sub",  name: "멸망의 전조",           reqEnergy: 72, rewardGold: 56000, rewardXp: 280 },
          { id: "4.3.sub.04", type: "sub",  name: "라그나로크 흔적 찾기",  reqEnergy: 73, rewardGold: 57000, rewardXp: 285 },
          { id: "4.3.sub.05", type: "sub",  name: "사라진 태양",           reqEnergy: 74, rewardGold: 58000, rewardXp: 290 },
          { id: "4.3.sub.06", type: "sub",  name: "첫번째 징조",           reqEnergy: 75, rewardGold: 59000, rewardXp: 300 },
          { id: "4.3.main.01", type: "main", name: "거인 등장",            reqEnergy: 110, rewardGold: 230000, rewardXp: 435 },
        ],
      },
      {
        zoneId: "4.4",
        zoneName: "울르",
        missions: [
          { id: "4.4.sub.01", type: "sub",  name: "멀고먼 아스가르드",     reqEnergy: 80, rewardGold: 60000, rewardXp: 310 },
          { id: "4.4.sub.02", type: "sub",  name: "스키를 배우다",         reqEnergy: 81, rewardGold: 61000, rewardXp: 315 },
          { id: "4.4.sub.03", type: "sub",  name: "잔혹한 멸계령",         reqEnergy: 82, rewardGold: 62000, rewardXp: 320 },
          { id: "4.4.sub.04", type: "sub",  name: "닭쫓다 지붕위를 본다", reqEnergy: 83, rewardGold: 63000, rewardXp: 325 },
          { id: "4.4.sub.05", type: "sub",  name: "황금알을 낳는 닭",      reqEnergy: 84, rewardGold: 64000, rewardXp: 335 },
          { id: "4.4.main.01", type: "main", name: "두번째 재앙의 징조",    reqEnergy: 110, rewardGold: 240000, rewardXp: 455 },
        ],
      },
      {
        zoneId: "4.5",
        zoneName: "엘룬",
        missions: [
          { id: "4.5.sub.01", type: "sub",  name: "오딘의 분노",       reqEnergy: 83, rewardGold: 60000, rewardXp: 320 },
          { id: "4.5.sub.02", type: "sub",  name: "반성문 5000장",     reqEnergy: 40, rewardGold: 35000, rewardXp: 155 },
          { id: "4.5.sub.03", type: "sub",  name: "화가 풀린 오딘",    reqEnergy: 85, rewardGold: 62000, rewardXp: 340 },
          { id: "4.5.sub.04", type: "sub",  name: "오딘의 딸 사랑",    reqEnergy: 86, rewardGold: 63000, rewardXp: 350 },
          { id: "4.5.sub.05", type: "sub",  name: "브레이다 블리크",   reqEnergy: 87, rewardGold: 64000, rewardXp: 360 },
          { id: "4.5.sub.06", type: "sub",  name: "엘룬께 영광을",     reqEnergy: 88, rewardGold: 65000, rewardXp: 370 },
          { id: "4.5.main.01", type: "main", name: "황금의 사과나무",   reqEnergy: 95, rewardGold: 120000, rewardXp: 370 },
        ],
      },
      {
        zoneId: "4.6",
        zoneName: "해임달",
        missions: [
          { id: "4.6.sub.01", type: "sub",  name: "작전상 후퇴",         reqEnergy: 87, rewardGold: 63000, rewardXp: 350 },
          { id: "4.6.sub.02", type: "sub",  name: "역시 안되는군",       reqEnergy: 88, rewardGold: 64000, rewardXp: 360 },
          { id: "4.6.sub.03", type: "sub",  name: "해임달의 과제",       reqEnergy: 89, rewardGold: 65000, rewardXp: 370 },
          { id: "4.6.sub.04", type: "sub",  name: "드루이드의 부탁",     reqEnergy: 90, rewardGold: 66000, rewardXp: 380 },
          { id: "4.6.sub.05", type: "sub",  name: "세 여신의 부탁",      reqEnergy: 91, rewardGold: 67000, rewardXp: 390 },
          { id: "4.6.sub.06", type: "sub",  name: "노래하는 다리",       reqEnergy: 92, rewardGold: 68000, rewardXp: 400 },
          { id: "4.6.sub.07", type: "sub",  name: "거대한 산이 움직인다", reqEnergy: 93, rewardGold: 69000, rewardXp: 410 },
          { id: "4.6.main.01", type: "main", name: "불타버린 대장장이집", reqEnergy: 45, rewardGold: 70000, rewardXp: 190 },
        ],
      },
      {
        zoneId: "4.7",
        zoneName: "라그나로크",
        missions: [
          { id: "4.7.sub.01", type: "sub",  name: "세번째 닭이 울다",     reqEnergy: 91, rewardGold: 65000, rewardXp: 380 },
          { id: "4.7.sub.02", type: "sub",  name: "펜리르의 봉인",        reqEnergy: 92, rewardGold: 66000, rewardXp: 390 },
          { id: "4.7.sub.03", type: "sub",  name: "티르의 지나친 요구",   reqEnergy: 93, rewardGold: 67000, rewardXp: 400 },
          { id: "4.7.sub.04", type: "sub",  name: "선공필승",             reqEnergy: 94, rewardGold: 68000, rewardXp: 410 },
          { id: "4.7.sub.05", type: "sub",  name: "펜리르를 아군으로",    reqEnergy: 95, rewardGold: 69000, rewardXp: 420 },
          { id: "4.7.sub.06", type: "sub",  name: "거인족의 침공",        reqEnergy: 96, rewardGold: 70000, rewardXp: 430 },
          { id: "4.7.main.01", type: "main", name: "요르문간드",          reqEnergy: 120, rewardGold: 80000, rewardXp: 520 },
        ],
      },
    ],
  },

  {
    chapterId: "5",
    chapterName: "풍요로운 황금의 신화 - 이집트",
    zones: [
      {
        zoneId: "5.1",
        zoneName: "오시리스",
        missions: [
          { id: "5.1.sub.01", type: "sub",  name: "이시스의 편지",   reqEnergy: 100, rewardGold: 90000,  rewardXp: 350 },
          { id: "5.1.sub.02", type: "sub",  name: "실종된 오시리스", reqEnergy: 102, rewardGold: 100000, rewardXp: 360 },
          { id: "5.1.sub.03", type: "sub",  name: "단서를 모으다",   reqEnergy: 105, rewardGold: 110000, rewardXp: 380 },
          { id: "5.1.sub.04", type: "sub",  name: "설마 그런 바보가", reqEnergy: 107, rewardGold: 120000, rewardXp: 390 },
          { id: "5.1.sub.05", type: "sub",  name: "농어와의 사투",   reqEnergy: 108, rewardGold: 130000, rewardXp: 400 },
          { id: "5.1.sub.06", type: "sub",  name: "뷔블로스의 왕",   reqEnergy: 110, rewardGold: 140000, rewardXp: 420 },
          { id: "5.1.main.01", type: "main", name: "건방진 기둥뿌리", reqEnergy: 120, rewardGold: 150000, rewardXp: 480 },
        ],
      },
      {
        zoneId: "5.2",
        zoneName: "호루스",
        missions: [
          { id: "5.2.sub.01", type: "sub",  name: "조각난 오시리스", reqEnergy: 108, rewardGold: 110000, rewardXp: 400 },
          { id: "5.2.sub.02", type: "sub",  name: "농어의 먹이",     reqEnergy: 112, rewardGold: 120000, rewardXp: 430 },
          { id: "5.2.sub.03", type: "sub",  name: "부족한 옥수수",   reqEnergy: 116, rewardGold: 130000, rewardXp: 450 },
          { id: "5.2.sub.04", type: "sub",  name: "무서운 괴수",     reqEnergy: 120, rewardGold: 140000, rewardXp: 470 },
          { id: "5.2.sub.05", type: "sub",  name: "약점을 찾다",     reqEnergy: 124, rewardGold: 150000, rewardXp: 490 },
          { id: "5.2.sub.06", type: "sub",  name: "바나나와 야자",   reqEnergy: 128, rewardGold: 160000, rewardXp: 500 },
          { id: "5.2.sub.07", type: "sub",  name: "노인의 질문",     reqEnergy: 132, rewardGold: 170000, rewardXp: 520 },
          { id: "5.2.main.01", type: "main", name: "정체를 드러내라", reqEnergy: 150, rewardGold: 200000, rewardXp: 600 },
        ],
      },
      {
        zoneId: "5.3",
        zoneName: "세트",
        missions: [
          { id: "5.3.sub.01", type: "sub",  name: "오시리스의 영혼",         reqEnergy: 120, rewardGold: 150000, rewardXp: 450 },
          { id: "5.3.sub.02", type: "sub",  name: "사제",                   reqEnergy: 126, rewardGold: 160000, rewardXp: 480 },
          { id: "5.3.sub.03", type: "sub",  name: "호루스 기준! 해쳐모여!",  reqEnergy: 132, rewardGold: 170000, rewardXp: 510 },
          { id: "5.3.sub.04", type: "sub",  name: "뜻밖의 시험",             reqEnergy: 138, rewardGold: 180000, rewardXp: 540 },
          { id: "5.3.sub.05", type: "sub",  name: "세기의 대결",             reqEnergy: 144, rewardGold: 190000, rewardXp: 570 },
          { id: "5.3.sub.06", type: "sub",  name: "진정 강한 것은",          reqEnergy: 150, rewardGold: 200000, rewardXp: 600 },
          { id: "5.3.sub.07", type: "sub",  name: "어디서 많이 본 드라마",   reqEnergy: 156, rewardGold: 210000, rewardXp: 630 },
          { id: "5.3.main.01", type: "main", name: "세트와의 만남",          reqEnergy: 200, rewardGold: 250000, rewardXp: 800 },
        ],
      },
      {
        zoneId: "5.4",
        zoneName: "토트",
        missions: [
          { id: "5.4.sub.01", type: "sub",  name: "세트의 미소",     reqEnergy: 138, rewardGold: 150000, rewardXp: 540 },
          { id: "5.4.sub.02", type: "sub",  name: "현자 토트",       reqEnergy: 144, rewardGold: 160000, rewardXp: 570 },
          { id: "5.4.sub.03", type: "sub",  name: "영웅의 선택",     reqEnergy: 150, rewardGold: 170000, rewardXp: 600 },
          { id: "5.4.sub.04", type: "sub",  name: "스승의 조언",     reqEnergy: 156, rewardGold: 180000, rewardXp: 630 },
          { id: "5.4.sub.05", type: "sub",  name: "분노한 오시리스", reqEnergy: 162, rewardGold: 190000, rewardXp: 660 },
          { id: "5.4.sub.06", type: "sub",  name: "금지된 봉인",     reqEnergy: 168, rewardGold: 200000, rewardXp: 690 },
          { id: "5.4.sub.07", type: "sub",  name: "재앙의 시작",     reqEnergy: 174, rewardGold: 200000, rewardXp: 720 },
          { id: "5.4.sub.08", type: "sub",  name: "막혀버린 계곡",   reqEnergy: 180, rewardGold: 210000, rewardXp: 750 },
          { id: "5.4.main.01", type: "main", name: "스핑크스의 제안", reqEnergy: 250, rewardGold: 250000, rewardXp: 1000 },
        ],
      },
    ],
  },

  {
    chapterId: "6",
    chapterName: "신비로운 황금 도시 - 아즈텍",
    zones: [
      {
        zoneId: "6.1",
        zoneName: "태양의 도시",
        missions: [
          { id: "6.1.sub.01", type: "sub",  name: "도움의 편지",         reqEnergy: 110, rewardGold: 100000, rewardXp: 420 },
          { id: "6.1.sub.02", type: "sub",  name: "황금과 태양의 도시",   reqEnergy: 116, rewardGold: 110000, rewardXp: 450 },
          { id: "6.1.sub.03", type: "sub",  name: "한방에 태양신",        reqEnergy: 123, rewardGold: 120000, rewardXp: 480 },
          { id: "6.1.sub.04", type: "sub",  name: "태양신이 둘? 셋?",     reqEnergy: 129, rewardGold: 130000, rewardXp: 510 },
          { id: "6.1.sub.05", type: "sub",  name: "진정한 태양의 도시",   reqEnergy: 136, rewardGold: 140000, rewardXp: 540 },
          { id: "6.1.main.01", type: "main", name: "사랑과 정의의 이름",   reqEnergy: 150, rewardGold: 150000, rewardXp: 570 },
        ],
      },
      {
        zoneId: "6.2",
        zoneName: "아즈텍의 마녀",
        missions: [
          { id: "6.2.sub.01", type: "sub",  name: "비밀 통로",       reqEnergy: 117, rewardGold: 160000, rewardXp: 460 },
          { id: "6.2.sub.02", type: "sub",  name: "그렇게 될 것이다", reqEnergy: 123, rewardGold: 170000, rewardXp: 490 },
          { id: "6.2.sub.03", type: "sub",  name: "마녀의 저주",     reqEnergy: 130, rewardGold: 180000, rewardXp: 520 },
          { id: "6.2.sub.04", type: "sub",  name: "끝장 나는 축",    reqEnergy: 136, rewardGold: 190000, rewardXp: 550 },
          { id: "6.2.sub.05", type: "sub",  name: "언덕위의 동굴",   reqEnergy: 143, rewardGold: 200000, rewardXp: 580 },
          { id: "6.2.sub.06", type: "sub",  name: "한잔만 마시고",   reqEnergy: 149, rewardGold: 210000, rewardXp: 610 },
          { id: "6.2.sub.07", type: "sub",  name: "그녀를 섬기자~",  reqEnergy: 156, rewardGold: 220000, rewardXp: 640 },
          { id: "6.2.main.01", type: "main", name: "저주의 손길",     reqEnergy: 170, rewardGold: 230000, rewardXp: 700 },
        ],
      },
    ],
  },
];

window.MISSIONS = MISSIONS;
