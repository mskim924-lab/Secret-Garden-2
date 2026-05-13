'use client';

import { useState, useEffect } from 'react';

// ─── 8가지 감정 ──────────────────────────────────────
const MOODS = [
  { id: 'happy',      label: '기쁨',   color: '#F5C518' },
  { id: 'hopeful',    label: '희망',   color: '#FFC1D0' },
  { id: 'passionate', label: '열정',   color: '#D32F2F' },
  { id: 'tired',      label: '지침',   color: '#9E7BC4' },
  { id: 'lonely',     label: '외로움', color: '#F0F0F5' },
  { id: 'anxious',    label: '불안',   color: '#7B8FB0' },
  { id: 'calm',       label: '평온',   color: '#A8D4C8' },
  { id: 'excited',    label: '설렘',   color: '#FF8FAB' },
];

// ─── 감정별 꽃 목록 (각 20종) ─────────────────────────
const FLOWERS = {
  happy: ['해바라기','금잔화','데이지','노란 튤립','코스모스','프리지아','메리골드','거베라','백일홍','수레국화','노란 장미','히아신스','민들레','팬지','리시안셔스','칼렌듈라','유채꽃','금어초','노랑 국화','스위트피'],
  hopeful: ['벚꽃','프리지아','수선화','흰 튤립','은방울꽃','목련','복숭아꽃','라넌큘러스','자스민','안개꽃','아이리스','블루벨','스노우드롭','라일락','클레마티스','백합','매화','흰 장미','작약','아네모네'],
  passionate: ['붉은 장미','동백','양귀비','붉은 튤립','칸나','다알리아','글라디올러스','진달래','붉은 작약','제라늄','카네이션','히비스커스','베고니아','아마릴리스','붉은 국화','부겐빌레아','카멜리아','알스트로메리아','로벨리아','석류꽃'],
  tired: ['라벤더','수국','카모마일','안개꽃','블루벨','세이지꽃','아이비꽃','보라 팬지','은은한 백합','유칼립투스꽃','들국화','자운영','미모사','히더','델피니움','플록스','수레국화','바이올렛','로즈마리꽃','마가렛'],
  lonely: ['달맞이꽃','물망초','보라 팬지','흰 장미','자스민','블루 아이리스','은방울꽃','라일락','아네모네','백합','코스모스','수선화','안개꽃','동백','목련','흰 작약','수국','데이지','클레마티스','스노우드롭'],
  anxious: ['라벤더','카모마일','백합','아이리스','수국','자스민','목련','히더','바이올렛','블루벨','세이지꽃','흰 장미','로즈마리꽃','은방울꽃','안개꽃','델피니움','아네모네','라일락','유칼립투스꽃','수레국화'],
  calm: ['연꽃','흰 국화','목련','하얀 데이지','올리브꽃','백합','은방울꽃','수련','라벤더','자스민','카모마일','스노우드롭','안개꽃','클로버꽃','흰 장미','블루벨','세이지꽃','미모사','라일락','프리지아'],
  excited: ['작약','분홍 튤립','프리지아','복숭아꽃','라넌큘러스','벚꽃','핑크 장미','스위트피','거베라','카네이션','히아신스','팬지','자스민','블러쉬 로즈','수국','아네모네','블루밍 매화','금어초','클레마티스','리시안셔스'],
};

// 꽃 이름 → 이모지 (이름의 키워드로 자동 선택)
function getEmoji(name) {
  if (name.includes('해바라기') || name.includes('금잔화') || name.includes('메리골드') || name.includes('칼렌듈라')) return '🌻';
  if (name.includes('튤립')) return '🌷';
  if (name.includes('장미')) return '🌹';
  if (name.includes('동백') || name.includes('양귀비') || name.includes('히비스커스') || name.includes('칸나') || name.includes('다알리아') || name.includes('붉은 작약') || name.includes('아마릴리스') || name.includes('석류') || name.includes('카멜리아') || name.includes('제라늄')) return '🌺';
  if (name.includes('연꽃') || name.includes('수련')) return '🪷';
  if (name.includes('히아신스') || name.includes('라일락') || name.includes('블루벨') || name.includes('아이리스') || name.includes('델피니움') || name.includes('세이지') || name.includes('히더')) return '🪻';
  if (name.includes('데이지') || name.includes('국화') || name.includes('수선화') || name.includes('마가렛') || name.includes('민들레') || name.includes('백합') || name.includes('카모마일') || name.includes('프리지아') || name.includes('미모사') || name.includes('금어초') || name.includes('은방울') || name.includes('스노우드롭') || name.includes('유채') || name.includes('자스민') || name.includes('올리브') || name.includes('유칼립투스') || name.includes('아이비') || name.includes('클로버') || name.includes('들국화')) return '🌼';
  return '🌸';
}

// ─── 한국어 조사: '로' / '으로' ──────────────────────
function particle(word) {
  if (!word) return '로';
  const last = word.charAt(word.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return '로';
  const jong = (code - 0xAC00) % 28;
  return jong === 0 || jong === 8 ? '로' : '으로';
}

// 배경 그라디언트
const BG = {
  background:
    'radial-gradient(ellipse at 20% 10%, rgba(45, 95, 75, 0.5) 0%, transparent 50%), ' +
    'radial-gradient(ellipse at 80% 90%, rgba(30, 80, 55, 0.6) 0%, transparent 55%), ' +
    'linear-gradient(160deg, #0a2818 0%, #102e1f 35%, #143821 65%, #0d2418 100%)',
  fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif",
};

// ─── 메인 컴포넌트 ──────────────────────────────────
export default function Page() {
  const [stage, setStage] = useState('welcome');
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [flowers, setFlowers] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState('idle');
  const [pendingBloom, setPendingBloom] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [particles, setParticles] = useState([]);

  // 반딧불 (SSR 안전을 위해 useEffect 안에서만 위치 결정)
  useEffect(() => {
    setParticles(
      Array.from({ length: 26 }, function (_, i) {
        return {
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: 1.5 + Math.random() * 2,
          duration: 8 + Math.random() * 12,
          delay: Math.random() * 8,
        };
      })
    );
  }, []);

  function enterGarden() {
    if (!tempName.trim()) return;
    setName(tempName.trim());
    setStage('garden');
  }

  function handleBloom() {
    if (!selectedMood || !message.trim() || phase !== 'idle') return;
    const pool = FLOWERS[selectedMood];
    const flowerName = pool[Math.floor(Math.random() * pool.length)];
    const emoji = getEmoji(flowerName);
    const moodObj = MOODS.find(function (m) { return m.id === selectedMood; });
    setPendingBloom({
      mood: selectedMood,
      moodLabel: moodObj.label,
      moodColor: moodObj.color,
      message: message.trim(),
      flowerName: flowerName,
      emoji: emoji,
    });
    setPhase('budding');
    setTimeout(function () { setPhase('revealing'); }, 1100);
  }

  function completeBloom() {
    if (!pendingBloom) return;
    const newFlower = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      userName: name,
      moodLabel: pendingBloom.moodLabel,
      moodColor: pendingBloom.moodColor,
      flowerName: pendingBloom.flowerName,
      emoji: pendingBloom.emoji,
      message: pendingBloom.message,
      x: 5 + Math.random() * 90,
      y: Math.random() * 35,
    };
    setFlowers(flowers.concat([newFlower]));
    setSelectedMood(null);
    setMessage('');
    setPendingBloom(null);
    setPhase('idle');
  }

  const Fireflies = (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(function (p) {
        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left + '%',
              top: p.top + '%',
              width: p.size + 'px',
              height: p.size + 'px',
              background: 'radial-gradient(circle, rgba(255, 236, 170, 0.95) 0%, transparent 70%)',
              boxShadow: '0 0 8px rgba(255, 236, 170, 0.7)',
              animation: 'fireflyFloat ' + p.duration + 's ease-in-out ' + p.delay + 's infinite',
            }}
          />
        );
      })}
    </div>
  );

  // ============================================================
  // 환영 화면
  // ============================================================
  if (stage === 'welcome') {
    const canEnter = tempName.trim().length > 0;
    return (
      <div className="min-h-screen w-full relative overflow-hidden" style={BG}>
        {Fireflies}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md" style={{ animation: 'fadeUp 1.2s ease-out' }}>
            <div className="text-center mb-10">
              <p className="italic mb-4" style={{ fontSize: '0.85rem', letterSpacing: '0.3em', color: '#a8d4a8' }}>
                어서 오세요
              </p>
              <h1 className="font-light leading-none mb-5" style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', color: '#f5f1e8' }}>
                Secret <span className="italic" style={{ color: '#e8d5a8' }}>Garden</span>
              </h1>
              <p className="italic" style={{ fontSize: '1.1rem', color: '#c8d8c0' }}>
                우리의 하루가 꽃이 됩니다.
              </p>
            </div>

            <div
              className="rounded-2xl p-7"
              style={{
                background: 'rgba(10, 30, 20, 0.55)',
                border: '1px solid rgba(168, 212, 168, 0.18)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <label className="block mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#a8c8a8' }}>
                이름을 알려주세요
              </label>
              <input
                type="text"
                value={tempName}
                onChange={function (e) { setTempName(e.target.value); }}
                onKeyDown={function (e) { if (e.key === 'Enter') enterGarden(); }}
                placeholder="이름"
                maxLength={24}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(168, 212, 168, 0.2)',
                  color: '#f5f1e8',
                  fontFamily: 'inherit',
                  fontSize: '1.05rem',
                }}
              />

              <button
                onClick={enterGarden}
                disabled={!canEnter}
                className="w-full py-3 rounded-xl mt-5"
                style={{
                  background: 'linear-gradient(135deg, #e8d5a8 0%, #d4b87a 100%)',
                  color: '#1a3a25',
                  fontFamily: 'inherit',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: canEnter ? 'pointer' : 'not-allowed',
                  opacity: canEnter ? 1 : 0.4,
                  boxShadow: '0 8px 24px -8px rgba(232, 213, 168, 0.5)',
                }}
              >
                정원에 들어가기
              </button>
            </div>

            <p className="text-center italic mt-6" style={{ fontSize: '0.9rem', color: '#8aa890' }}>
              사랑하는 이에게 꽃 한 송이를 남길 수 있는 조용한 곳.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 정원 화면
  // ============================================================
  const canBloom = selectedMood && message.trim() && phase === 'idle';

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={BG}>
      {Fireflies}

      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '45%',
          background: 'radial-gradient(ellipse at center bottom, rgba(168, 212, 168, 0.1) 0%, transparent 65%)',
        }}
      />

      {/* 헤더 */}
      <div className="relative z-20 px-6 sm:px-8 pt-7">
        <h1 className="font-light leading-none" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', color: '#f5f1e8' }}>
          Secret <span className="italic" style={{ color: '#e8d5a8' }}>Garden</span>
        </h1>
        <p className="italic mt-1" style={{ fontSize: '0.9rem', color: '#a8c8a8' }}>
          우리의 하루가 꽃이 됩니다.
        </p>
      </div>

      {/* 정원 캔버스 */}
      <div className="relative z-10 mx-auto max-w-7xl px-3 mt-6" style={{ minHeight: '50vh' }}>
        {flowers.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '40vh' }}>
            <p className="text-center italic px-6" style={{ color: '#c8d8c0', fontSize: '1.1rem', lineHeight: 1.8 }}>
              아직 정원이 고요해요.<br />
              아래에서 첫 꽃을 피워보세요.
            </p>
          </div>
        ) : (
          <div className="relative w-full" style={{ height: '50vh', minHeight: '340px' }}>
            {flowers.map(function (f, i) {
              const isActive = activeId === f.id;
              return (
                <div
                  key={f.id}
                  onClick={function () { setActiveId(isActive ? null : f.id); }}
                  className="absolute"
                  style={{
                    left: f.x + '%',
                    bottom: f.y + '%',
                    transform: 'translateX(-50%)',
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 14px ' + f.moodColor + 'cc) drop-shadow(0 0 28px ' + f.moodColor + '66)',
                    animation: 'sway ' + (4 + (i % 5) * 0.5) + 's ease-in-out ' + (i * 0.15) + 's infinite, fadeUp 1s ease-out',
                    transformOrigin: 'bottom center',
                    zIndex: isActive ? 50 : Math.floor(f.y),
                    lineHeight: 1,
                  }}
                >
                  {f.emoji}
                  {isActive && (
                    <div
                      className="absolute rounded-xl p-3"
                      style={{
                        bottom: 'calc(100% + 4px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(8, 24, 16, 0.92)',
                        border: '1px solid rgba(232, 213, 168, 0.35)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        minWidth: '220px',
                        maxWidth: '280px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
                      }}
                    >
                      <p className="italic" style={{ color: '#e8d5a8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                        {f.userName}님 · {f.moodLabel} · {f.flowerName}
                      </p>
                      <p style={{ color: '#f5f1e8', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        "{f.message}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 꽃 피우기 패널 */}
      <div className="relative z-20 px-4 sm:px-8 pb-6 pt-6 mt-4">
        <div
          className="mx-auto max-w-3xl rounded-2xl p-5 sm:p-6"
          style={{
            background: 'rgba(10, 30, 20, 0.6)',
            border: '1px solid rgba(168, 212, 168, 0.2)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div className="mb-4">
            <p className="italic" style={{ fontSize: '0.85rem', color: '#a8c8a8' }}>
              {name}님, 안녕하세요
            </p>
            <h2 className="font-light mt-1" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: '#f5f1e8' }}>
              오늘의 마음은 <span className="italic" style={{ color: '#e8d5a8' }}>어떤가요?</span>
            </h2>
          </div>

          {/* 감정 선택 (꽃 이름 안 보임) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {MOODS.map(function (m) {
              const active = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={function () { setSelectedMood(m.id); }}
                  className="py-3 px-2 rounded-xl"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, ' + m.color + '22 0%, ' + m.color + '11 100%)'
                      : 'rgba(255,255,255,0.03)',
                    border: '1px solid ' + (active ? m.color + '70' : 'rgba(168, 212, 168, 0.15)'),
                    transform: active ? 'translateY(-2px)' : 'none',
                    boxShadow: active ? '0 8px 20px -8px ' + m.color + '88' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className="flex flex-col items-center" style={{ gap: '6px' }}>
                    <div
                      style={{
                        width: '11px',
                        height: '11px',
                        borderRadius: '999px',
                        background: m.color,
                        boxShadow: '0 0 14px ' + m.color,
                      }}
                    />
                    <span style={{ color: '#f5f1e8', fontSize: '1rem' }}>{m.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <textarea
            value={message}
            onChange={function (e) { setMessage(e.target.value); }}
            placeholder="정원에 작은 메모를 남겨주세요…"
            maxLength={140}
            rows={2}
            className="w-full px-4 py-3 rounded-xl outline-none resize-none"
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(168, 212, 168, 0.2)',
              color: '#f5f1e8',
              fontFamily: 'inherit',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          />

          <div className="flex items-center justify-between mt-3" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#8aa890' }}>
              {message.length} / 140
            </span>
            <button
              onClick={handleBloom}
              disabled={!canBloom}
              className="px-8 py-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #e8d5a8 0%, #d4b87a 100%)',
                color: '#1a3a25',
                fontFamily: 'inherit',
                fontSize: '1.05rem',
                fontWeight: 500,
                border: 'none',
                cursor: canBloom ? 'pointer' : 'not-allowed',
                opacity: canBloom ? 1 : 0.4,
                boxShadow: '0 8px 24px -8px rgba(232, 213, 168, 0.5)',
              }}
            >
              ✿  꽃 피우기
            </button>
          </div>
        </div>
      </div>

      {/* ─── reveal 모달 ─────────────────── */}
      {phase !== 'idle' && pendingBloom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{
            background: 'rgba(8, 24, 16, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            animation: 'fadeUp 0.5s ease-out',
          }}
        >
          {phase === 'budding' && (
            <div className="text-center">
              <div
                style={{
                  fontSize: 'clamp(5rem, 14vw, 7rem)',
                  animation: 'budPulse 1.4s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 24px rgba(168, 212, 168, 0.6))',
                  lineHeight: 1,
                }}
              >
                🌱
              </div>
              <p
                className="italic mt-6"
                style={{
                  color: '#e8d5a8',
                  fontSize: '1.2rem',
                  letterSpacing: '0.08em',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                }}
              >
                꽃망울이 열리는 중…
              </p>
            </div>
          )}

          {phase === 'revealing' && (
            <div className="text-center flex flex-col items-center" style={{ maxWidth: '28rem', width: '100%' }}>
              <div
                style={{
                  fontSize: 'clamp(6rem, 18vw, 9rem)',
                  filter: 'drop-shadow(0 0 30px ' + pendingBloom.moodColor + 'cc) drop-shadow(0 0 60px ' + pendingBloom.moodColor + '66)',
                  animation: 'revealBloom 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  lineHeight: 1,
                }}
              >
                {pendingBloom.emoji}
              </div>

              <p
                className="mt-8"
                style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                  color: '#f5f1e8',
                  lineHeight: 1.7,
                  animation: 'fadeUp 0.8s ease-out 0.7s both',
                }}
              >
                오늘 <span style={{ color: '#a8d4a8' }}>{name}</span>님의{' '}
                <span style={{ color: '#a8d4a8' }}>{pendingBloom.moodLabel}</span>은{' '}
                <span className="italic" style={{ color: '#e8d5a8' }}>{pendingBloom.flowerName}</span>
                {particle(pendingBloom.flowerName)} 피어났어요.
              </p>

              <button
                onClick={completeBloom}
                className="mt-8 px-7 py-3 rounded-full"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(232, 213, 168, 0.6)',
                  color: '#e8d5a8',
                  fontFamily: 'inherit',
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  animation: 'fadeUp 0.8s ease-out 1.3s both',
                }}
              >
                정원에서 만나기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
