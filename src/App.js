import React, { useState, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  // 1. 기본 회원 및 트레이너 정보
  const [memberName, setMemberName] = useState('김준우 회원님');
  const [trainerName, setTrainerName] = useState('황승준');
  const [date, setDate] = useState('2024.05.23 (목)');

  // 2. 운동 요약 데이터 (심박수 추가)
  const [calories, setCalories] = useState('420');
  const [duration, setDuration] = useState('60');
  const [avgHeartRate, setAvgHeartRate] = useState('126'); // 🔥 심박수 (bpm)
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

  // 🔥 기능 1: 카카오톡/스마트폰 전송 대상(회원 선택) 팝업 열기
  const handleShareToKakao = async () => {
    const shareData = {
      title: `${memberName} PT 운동 일지`,
      text: `[PREMIUM PT 일지]\n👤 회원명: ${memberName}\n📅 날짜: ${date}\n🔥 칼로리: ${calories}kcal\n🕒 시간: ${duration}분\n❤️ 평균 심박수: ${avgHeartRate}bpm\n📊 강도: ${intensity}\n\n오늘도 수고하셨습니다! 👍`
    };

    if (navigator.share) {
      try {
        // 스마트폰 공유 창(카카오톡 친구, 채팅방 선택창)이 뜸
        await navigator.share(shareData);
      } catch (err) {
        console.log('공유 취소 또는 에러:', err);
      }
    } else {
      // 시스템 공유를 지원하지 않는 브라우저일 경우 클립보드 복사
      navigator.clipboard.writeText(shareData.text);
      alert('일지 내용이 복사되었습니다! 카카오톡 채팅창에 붙여넣어 보내세요.');
    }
  };

  // 🔥 기능 2: 순수 Canvas 기반 PNG 이미지 자동 생성 및 저장
  const handleGenerateAndDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 540;
    canvas.height = 780;

    // 크림색 배경
    ctx.fillStyle = '#f2efea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 헤더 타이틀
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText(`🏋️‍♂️ ${memberName} PT 리포트`, 28, 48);

    ctx.fillStyle = '#666666';
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillText(`담당: ${trainerName} 트레이너 | 일자: ${date}`, 28, 72);

    ctx.strokeStyle = '#d5d1ca';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, 88);
    ctx.lineTo(512, 88);
    ctx.stroke();

    // 요약 카드
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(28, 105, 484, 95, 10);
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText('오늘의 운동 요약', 44, 132);

    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.fillText(`🔥 칼로리: ${calories} kcal`, 44, 165);
    ctx.fillText(`🕒 시간: ${duration} 분`, 170, 165);

    // 심박수 텍스트
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText(`❤️ 심박수: ${avgHeartRate} bpm`, 280, 165);

    ctx.fillStyle = '#333333';
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillText(`📊 강도: ${intensity}`, 415, 165);

    // 세부 운동
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.fillText('세부 운동 기록', 28, 230);

    let startY = 250;
    exercises.forEach((ex) => {
      const cardHeight = 35 + ex.sets.length * 24;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(28, startY, 484, cardHeight, 8);
      ctx.fill();

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.fillText(ex.name, 42, startY + 22);

      ex.sets.forEach((s, i) => {
        const lineY = startY + 44 + i * 22;
        ctx.fillStyle = '#555555';
        ctx.font = '12px -apple-system, sans-serif';
        ctx.fillText(
          `${s.set}세트  |  ${s.weight} kg  |  ${s.reps} 회  |  RPE ${s.rpe}`,
          52,
          lineY
        );
      });

      startY += cardHeight + 12;
    });

    // 다운로드 실행
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = `${memberName}_운동일지.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: '#1c1c1c', borderRadius: '16px', padding: '20px' }}>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* 상단 헤더 */}
        <div style={{ borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '800' }}>PREMIUM PT</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>회원 운동 일지</h1>
        </div>

        {/* 메인 크림색 카드 리포트 */}
        <div style={{ backgroundColor: '#f2efea', borderRadius: '14px', padding: '20px', color: '#111111' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>🏋️‍♂️ {memberName} PT 리포트</h2>
          
          {/* 심박수 포함 요약 박스 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>오늘의 운동 요약</div>
            <div style={{ fontSize: '12px', color: '#444' }}>
              🔥 {calories} kcal | 🕒 {duration}분 | ❤️ <span style={{ color: '#d97706', fontWeight: 'bold' }}>{avgHeartRate} bpm</span> | 📊 {intensity}
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>세부 운동 기록</div>
          {exercises.map((ex, idx) => (
            <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px', marginBottom: '8px', fontSize: '12px' }}>
              <strong>{ex.name}</strong>
              {ex.sets.map((s, sIdx) => (
                <div key={sIdx} style={{ color: '#666', marginTop: '2px' }}>
                  {s.set}세트: {s.weight}kg / {s.reps}회 / RPE {s.rpe}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 수업 중 실시간 입력창 (심박수 입력 가능) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', marginTop: '20px', color: '#111' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 10px 0', color: '#2563eb' }}>📱 수업 중 수치 변경</h4>
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
              <label style={{ fontSize: '10px', color: '#d97706', fontWeight: 'bold' }}>심박수(bpm)</label>
              <input type="number" value={avgHeartRate} onChange={(e) => setAvgHeartRate(e.target.value)} style={{...inputStyle, borderColor: '#f59e0b', fontWeight: 'bold'}} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#666' }}>강도</label>
              <input type="text" value={intensity} onChange={(e) => setIntensity(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 💬 버튼 1: 카카오톡 보내기 (대상 선택창 팝업) */}
        <button 
          type="button" 
          onClick={handleShareToKakao}
          style={{ width: '100%', marginTop: '16px', padding: '16px', backgroundColor: '#fee500', color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
        >
          💬 카카오톡 대상 선택해서 전송하기
        </button>

        {/* 📂 버튼 2: PNG 이미지 생성 및 바로 다운로드 */}
        <button 
          type="button" 
          onClick={handleGenerateAndDownloadPng}
          style={{ width: '100%', marginTop: '10px', padding: '14px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
        >
          📂 일지 PNG 이미지 저장
        </button>

      </div>
    </div>
  );
}

export default App;