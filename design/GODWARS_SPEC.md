# GOD WARS 원작 규칙 매핑 스펙

## 1) 임무 시스템 (`data_missions.js` 단일 기준)
- 데이터 소스: `data_missions.js`의 `MISSIONS` 전역만 사용.
- UI 렌더: `src/ui/godwars_overrides.js`의 `renderQuest()`.
- 실행 규칙:
  - 에너지 소모 / 골드 / XP 지급: `GodWarsSystems.runMission()`.
  - 서브 임무: Rank1~3 각 100% 진행 후 Master.
  - 존 내 서브 전체 Master 시 메인 임무 해금: `isMainUnlocked()`.
  - 메인 임무 최초 1회 완료 시 다음 챕터 해금.
  - 메인 임무 반복 가능 + 반복 보상 드랍 롤.

## 2) 4스탯 + 회복 + HP 제한
- 스탯: HP/ENG/STM/ATK/DEF (`src/state.js` 기본값 정의).
- 회복: 에너지/스태미나 3분당 1 회복 (`src/ui/ui_core.js`).
- HP 제한:
  - PVP는 HP 20 미만 불가.
  - 레이드는 HP 10 미만 불가.

## 3) PVP 시스템
- 리그/LP/명예:
  - Copper~Platinum 구간과 1일 명예 지급 구현 (`src/godwars_systems.js`).
- 소모 스태미나:
  - 상위 리그일수록 증가(1~5).
- 결과:
  - 승리: LP/골드/XP 증가.
  - 패배: LP 하락 + 소량 XP + 골드 페널티.
- 노출 거부:
  - `pvp.visible=false`면 일일 명예 미지급.

## 4) SOS 보스 레이드
- 소환: `summonRaidBoss()`.
- SOS 공유: `raidSOS()`.
- 참여: `joinRaid()`(마법참여 단계).
- 전투축: HP/Anger/Shield.
  - 공격(스태미나): 보스 피해 + 방벽 감소 + 분노 증가.
  - 방어(에너지): 방벽 회복 + 분노 감소.
- 보상: 확보데미지(`securedThreshold`) 기반 등급 롤링.

## 5) 속성/속성스킬
- 상성 규칙: 불>땅, 물>불, 바람>물, 땅>바람.
- 배율:
  - 우위: 스킬 2.0, 장비 1.5.
  - 열세: 0.5.
- 주신 속성 반영:
  - `totalCombatWithElement()`에서 main slot 신 기준으로 총 공방 계산.
- 스킬 학습:
  - UI에서 레벨20+ 조건, 스킬포인트+골드 소모.

## 6) 신 카드/카테고리/파견형 덱
- 데이터 확장: `src/data_adapter.js`
  - category/tier/mainBuff/subBuff/condition/slotConstraint/awakenTo 필드 확장.
- 파견형 모델:
  - 파견 시 보유 수량 감소 / 회수 시 복귀 (`renderUnit()` 버튼 흐름).

## 7) selfTest 커버리지
- 자동 실행: `src/app.js`의 `window.selfTest()`.
- 검증 항목:
  - 임무 실행/마스터
  - PVP 및 명예 지급/거부
  - 레이드 소환~보상
  - 속성 배율
  - 파견형 덱
  - 세이브/로드
