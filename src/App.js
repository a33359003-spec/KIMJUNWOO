import React, { useState } from 'react';

function App() {
  // 기본 헤더 & 회원 정보
  const [memberName, setMemberName] = useState('김회원');
  const [trainerName, setTrainerName] = useState('황승준');
  const [date, setDate] = useState('2024.05.23 (목)');
  const [workoutTime, setWorkoutTime] = useState('19:00 - 20:00 (60분)');

  // 요약 정보
  const [calories, setCalories] = useState('420');
  const [duration, setDuration] = useState('60');
  const [avgHeartRate, setAvgHeartRate] = useState('126');
  const [intensity, setIntensity] = useState('중상');

  // 오늘의 컨디션 & 목표
  const [condition, setCondition] = useState('좋음');
  const [sleepTime, setSleepTime] = useState('7시간');
  const [fatigue, setFatigue] = useState('3'); // 1~5
  const [soreness, setSoreness] = useState('어깨, 하체');
  const [targets, setTargets] = useState([
    '등과 어깨 자극 집중',
    '자세 유지 및 가동범위 향상',
    '운동 후 스트레칭 및 회복'
  ]);

  // 운동 기록 목록
  const [exercises, setExercises] = useState([
    {
      name: '1. 덤벨 로우 (Dumbbell Row)',
      note: '등 중부 자극 / 상체 안정성 강화',
      img1: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
      img2: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
      sets: [
        { set: 1, weight: '14', reps: '12', rpe: '6' },
        { set: 2, weight: '16', reps: '10', rpe: '7' },
        { set: 3, weight: '18', reps: '8', rpe: '8' },
        { set: 4, weight: '16', reps: '10', rpe: '7' }
      ]
    },
    {
      name: '2. 랫 풀다운 (Lat Pulldown)',
      note: '광배근 자극 / 등 하부 확장',
      img1: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
      img2: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
      sets: [
        { set: 1, weight: '40', reps: '12', rpe: '6' },
        { set: 2, weight: '45', reps: '10', rpe: '7' },
        { set: 3, weight: '50', reps: '8', rpe: '8' },
        { set: 4, weight: '45', reps: '10', rpe: '7' }
      ]
    },
    {
      name: '3. 숄더 프레스 (Shoulder Press)',
      note: '삼각근 전·중부 자극 / 어깨 강화',
      img1: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
      img2: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500',
      sets: [
        { set: 1, weight: '20', reps: '12', rpe: '6' },
        { set: 2, weight: '24', reps: '10', rpe: '7' },
        { set: 3, weight: '28', reps: '8', rpe: '8' },
        { set: 4, weight: '24', reps: '10', rpe: '7' }
      ]
    }
  ]);

  // 운동 총평 및 트레이너 코멘트
  const [summary, setSummary] = useState([
    '전체적으로 집중도 높게 잘 수행하셨어요.',
    '등, 어깨 자극 좋은 편이며, 자세 유지 훌륭했습니다.',
    '후면 체인 활성화를 더 신경 써주시면 좋아요!'
  ]);
  const [trainerComment, setTrainerComment] = useState(
    '오늘도 수고 많으셨어요!\n자세 점점 좋아지고 있어요👍\n꾸준함이 변화로 이어집니다!'
  );

  // 다음 계획 및 일정
  const [nextPlan, setNextPlan] = useState('상체 (가슴, 등, 어깨) + 복복 집중');
  const [nextSchedule, setNextSchedule] = useState('2024.05.25 (토) 19:00');

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', padding: '20px 10px', color: '#ffffff', fontFamily: '"Noto Sans KR", -apple-system, sans-serif' }}>
      {/* 이미지 스타일 카드를 담는 메인 컨테이너 */}
      <div style={{ maxWidth: '680px', margin: '0 auto', backgroundColor: '#1c1c1c', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
        
        {/* 상단 텍스트 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '800', letterSpacing: '1px' }}>PREMIUM PT</span>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '6px 0 4px 0', letterSpacing: '-0.5px' }}>회원 운동 일지</h1>
            <p style={{ fontSize: '12px', color: '#aaaaaa', margin: 0 }}>오늘도 좋은 변화, 함께 만들어가요!</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#cccccc', lineHeight: '1.6' }}>
            <div><span style={{ color: '#888' }}>회원명</span> &nbsp; <strong style={{ color: '#fff' }}>{memberName}</strong></div>
            <div><span style={{ color: '#888' }}>담당 트레이너</span> &nbsp; <strong style={{ color: '#fff' }}>{trainerName}</strong></div>
            <div><span style={{ color: '#888' }}>날짜</span> &nbsp; {date}</div>
            <div><span style={{ color: '#888' }}>운동시간</span> &nbsp; {workoutTime}</div>
          </div>
        </div>

        {/* 내지 라이트 크림색 메인 영역 */}
        <div style={{ backgroundColor: '#f2efea', borderRadius: '14px', padding: '20px', color: '#111111' }}>
          
          {/* 1. 오늘의 운동 요약 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px' }}>오늘의 운동 요약</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '18px' }}>🔥</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>총 운동 칼로리</div>
                <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{calories} <span style={{ fontSize: '10px', fontWeight: 'normal' }}>kcal</span></div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '18px' }}>🕒</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>운동 시간</div>
                <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{duration} <span style={{ fontSize: '10px', fontWeight: 'normal' }}>min</span></div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '18px' }}>🫶</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>평균 심박수</div>
                <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{avgHeartRate} <span style={{ fontSize: '10px', fontWeight: 'normal' }}>bpm</span></div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '18px' }}>📋</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>운동 강도</div>
                <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{intensity}</div>
              </div>

            </div>
          </div>

          {/* 2. 컨디션 & 목표 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>오늘의 컨디션</h4>
              <div style={{ fontSize: '11px', display: 'grid', gridTemplateColumns: '70px 1fr', gap: '6px', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>컨디션</span>
                <span>😊 {condition}</span>
                <span style={{ color: '#666' }}>수면 시간</span>
                <span>{sleepTime}</span>
                <span style={{ color: '#666' }}>피로도</span>
                <span style={{ color: '#f59e0b' }}>●●●○○</span>
                <span style={{ color: '#666' }}>근육통 부위</span>
                <span>{soreness}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>오늘의 목표</h4>
              <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '11px', lineHeight: '1.8', color: '#222' }}>
                {targets.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. 오늘의 운동 기록 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px' }}>오늘의 운동 기록</h3>

            {exercises.map((ex, exIdx) => (
              <div key={exIdx} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', marginBottom: '12px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '12px', alignItems: 'center' }}>
                {/* 좌측: 이름 & 이미지 2장 */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', margin: '0 0 8px 0' }}>{ex.name}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <img src={ex.img1} alt="운동사진1" style={{ width: '100%', height: '85px', objectFit: 'cover', borderRadius: '6px' }} />
                    <img src={ex.img2} alt="운동사진2" style={{ width: '100%', height: '85px', objectFit: 'cover', borderRadius: '6px' }} />
                  </div>
                  <p style={{ fontSize: '10px', color: '#666', marginTop: '6px', margin: '6px 0 0 0' }}>{ex.note}</p>
                </div>

                {/* 우측: 세트별 수치 표 */}
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#666' }}>
                        <th style={{ paddingBottom: '6px' }}>세트</th>
                        <th style={{ paddingBottom: '6px' }}>중량(kg)</th>
                        <th style={{ paddingBottom: '6px' }}>반복</th>
                        <th style={{ paddingBottom: '6px' }}>RPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ex.sets.map((s, sIdx) => (
                        <tr key={sIdx} style={{ height: '22px' }}>
                          <td><strong>{s.set}</strong></td>
                          <td>{s.weight}</td>
                          <td>{s.reps}</td>
                          <td>{s.rpe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* 4. 운동 총평 & 미디어 갤러리 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>운동 총평</h4>
              <ul style={{ paddingLeft: '12px', margin: '0 0 12px 0', fontSize: '11px', lineHeight: '1.6', color: '#333' }}>
                {summary.map((sum, i) => (
                  <li key={i}>{sum}</li>
                ))}
              </ul>

              <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>트레이너 코멘트</h4>
              <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#444', lineHeight: '1.6', backgroundColor: '#fcfbf9', padding: '8px', borderRadius: '6px', whiteSpace: 'pre-line' }}>
                {trainerComment}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>운동 사진 및 영상</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500" alt="영상미리보기1" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px' }} />
                  <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px' }}>▶</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500" alt="영상미리보기2" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px' }} />
                  <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px' }}>▶</span>
                </div>
              </div>
              <p style={{ fontSize: '10px', color: '#888', marginTop: '8px', textAlign: 'center', margin: '8px 0 0 0' }}>동작 영상은 카카오톡으로 전송드립니다.</p>
            </div>
          </div>

          {/* 5. 다음 계획 & 일정 바 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <div>🏆 <strong>다음 운동 계획</strong> &nbsp; <span style={{ color: '#555' }}>{nextPlan}</span></div>
            <div>🗓️ <strong>다음 일정</strong> &nbsp; <span style={{ color: '#555' }}>{nextSchedule}</span></div>
          </div>

        </div>

        {/* 하단 브랜드 푸터 */}
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#aaaaaa', fontSize: '11px' }}>
          <div>꾸준함이 최고의 결과를 만듭니다.</div>
          <div style={{ color: '#d4af37', fontWeight: '800', marginTop: '2px' }}>THANK YOU!</div>
        </div>

      </div>
    </div>
  );
}

export default App;