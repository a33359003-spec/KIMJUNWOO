import React, { useState, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  // 1. 기본 정보
  const [memberName, setMemberName] = useState('김준우 회원님');
  const [trainerName, setTrainerName] = useState('황승준');
  const [date, setDate] = useState('2024.05.23 (목)');

  // 2. 운동 요약
  const [calories, setCalories] = useState('420');
  const [duration, setDuration] = useState('60');
  const [avgHeartRate, setAvgHeartRate] = useState('126');
  const [intensity, setIntensity] = useState('중상');

  // 3. 운동 세부 기록
  const [exercises, setExercises] = useState([
    {
      name: '1. 덤벨 로우 (Dumbbell Row)',
      sets: [
        { set: 1, weight: '14', reps: '12', rpe: '6' },
        { set: 2, weight: '16', reps: '10', rpe: '7' },
        { set: 3, weight: '18', reps: '8', rpe: '8' }
      ]
    },
    {
      name: '2. 랫 풀다운 (Lat Pulldown)',
      sets: [
        { set: 1, weight: '40', reps: '12', rpe: '6' },
        { set: 2, weight: '45', reps: '10', rpe: '7' }
      ]
    }
  ]);

  // 4. 순수 브라우저 Canvas API로 PNG 생성 및 다운로드
  const handleGeneratePngImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 캔버스 크기 지정
    canvas.width = 500;
    canvas.height = 750;

    // 1) 크림색 배경 칠하기
    ctx.fillStyle = '#f2efea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2) 타이틀 영역
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`🏋️‍♂️ ${memberName} PT 리포트`, 24, 45);

    ctx.fillStyle = '#666666';
    ctx.font = '12px sans-serif';
    ctx.fillText(`트레이너: ${trainerName} | 날짜: ${date}`, 24, 68);

    // 구분선
    ctx.strokeStyle = '#d0ccc6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 85);
    ctx.lineTo(476, 85);
    ctx.stroke();

    // 3) 오늘 운동 요약 카드 박스
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(24, 100, 452, 90, 10);
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('오늘의 운동 요약', 40, 125);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#444444';
    ctx.fillText(`🔥 칼로리: ${calories} kcal`, 40, 155);
    ctx.fillText(`🕒 시간: ${duration} 분`, 160, 155);
    ctx.fillStyle = '#d97706';
    ctx.fillText(`❤️ 심박수: ${avgHeartRate} bpm`, 270, 155);
    ctx.fillStyle = '#444444';
    ctx.fillText(`📊 강도: ${intensity}`, 390, 155);

    // 4) 세부 운동 기록
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('세부 운동 기록', 24, 220);

    let startY = 240;

    exercises.forEach((ex) => {
      // 운동 종목 카드
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(24, startY, 452, 30 + ex.sets.length * 22, 8);
      ctx.fill();

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(ex.name, 36, startY + 20);

      // 세트 정보
      ex.sets.forEach((s, i) => {
        const lineY = startY + 40 + i * 20;
        ctx.fillStyle = '#555555';
        ctx.font = '11px sans-serif';
        ctx.fillText(
          `${s.set}세트 :  ${s.weight}kg  /  ${s.reps}회  /  RPE ${s.rpe}`,
          46,
          lineY
        );
      });

      startY += 40 + ex.sets.length * 22 + 12;
    });

    // 5) 이미지 다운로드 실행
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = `${memberName}_운동일지_${date}.png`;
    link.click();
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #dcdcdc',
    fontSize: '12px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', padding: '20px 10px', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', backgroundColor: '#1c1c1c', borderRadius: '16px', padding: '20px' }}>
        
        {/* 숨겨진 이미지 생성용 캔버스 */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* 상단 헤더 */}
        <div style={{ borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '800' }}>PREMIUM PT</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>회원 운동 일지</h1>
        </div>

        {/* 크림색 리포트 카카오 미리보기 영역 */}
        <div style={{ backgroundColor: '#f2efea', borderRadius: '14px', padding: '20px', color: '#111111' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>🏋️‍♂️ {memberName} PT 리포트</h2>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>오늘의 운동 요약</div>
            <div style={{ fontSize: '11px', color: '#444' }}>
              🔥 {calories} kcal | 🕒 {duration}분 | ❤️ <span style={{ color: '#d97706', fontWeight: 'bold' }}>{avgHeartRate} bpm</span> | 📊 {intensity}
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>세부 운동 기록</div>
          {exercises.map((ex, idx) => (
            <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px', marginBottom: '8px', fontSize: '11px' }}>
              <strong>{ex.name}</strong>
              {ex.sets.map((s, sIdx) => (
                <div key={sIdx} style={{ color: '#666', marginTop: '2px' }}>
                  {s.set}세트: {s.weight}kg / {s.reps}회 / RPE {s.rpe}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 하단 스마트폰 입력창 */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', marginTop: '20px', color: '#111' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 10px 0', color: '#2563eb' }}>📱 수업 중 즉시 입력</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#666' }}>칼로리</label>
              <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#666' }}>시간(분)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#d97706', fontWeight: 'bold' }}>심박수</label>
              <input type="number" value={avgHeartRate} onChange={(e) => setAvgHeartRate(e.target.value)} style={{...inputStyle, borderColor: '#f59e0b', fontWeight: 'bold'}} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#666' }}>강도</label>
              <input type="text" value={intensity} onChange={(e) => setIntensity(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 전송용 이미지 다운로드 버튼 */}
        <button 
          type="button" 
          onClick={handleGeneratePngImage}
          style={{ width: '100%', marginTop: '16px', padding: '16px', backgroundColor: '#fee500', color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
        >
          💬 PNG 이미지 생성 및 다운로드 (카톡 전송용)
        </button>

      </div>
    </div>
  );
}

export default App;