import React, { useState, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  // 1. 기본 회원 정보
  const [memberName, setMemberName] = useState('김준우 회원님');
  const [trainerName, setTrainerName] = useState('황승준');
  const [date, setDate] = useState('2024.05.23 (목)');

  // 2. 신체 수치 & 운동 요약 (심박수 포함)
  const [weight, setWeight] = useState('75.5');
  const [targetWeight, setTargetWeight] = useState('70.0');
  const [bodyFat, setBodyFat] = useState('22.0');
  const [muscle, setMuscle] = useState('32.5');
  const [calories, setCalories] = useState('420');
  const [duration, setDuration] = useState('60');
  const [avgHeartRate, setAvgHeartRate] = useState('126');
  const [intensity, setIntensity] = useState('중상');

  // 3. 메모 및 식단
  const [trainerMemo, setTrainerMemo] = useState('스쿼트 시 무릎 안정성 주의. 척추 중립 잘 유지됨.');
  const [dietMemo, setDietMemo] = useState('아침: 사과 1개, 계란 2개\n점심: 닭가슴살 볶음밥\n저녁: 연어 샐러드');
  const [monthlyCheck, setMonthlyCheck] = useState('출석 및 식단 준수 상태 매우 양호함!');

  // 4. 운동 종목 목록
  const [exercises, setExercises] = useState([
    { name: '바벨 스쿼트', weight: '80', sets: '5', reps: '12' },
    { name: '레그 프레스', weight: '120', sets: '4', reps: '15' }
  ]);
  const [newExName, setNewExName] = useState('');
  const [newExWeight, setNewExWeight] = useState('');
  const [newExSets, setNewExSets] = useState('');
  const [newExReps, setNewExReps] = useState('');

  // 5. 사진 첨부
  const [images, setImages] = useState([]);

  // 운동 종목 추가/삭제
  const handleAddExercise = () => {
    if (!newExName) return;
    setExercises([...exercises, { name: newExName, weight: newExWeight, sets: newExSets, reps: newExReps }]);
    setNewExName(''); setNewExWeight(''); setNewExSets(''); setNewExReps('');
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // 사진 업로드
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 💬 카카오톡 공유 (수치, 종목, 메모 포함 전송)
  const handleShareToKakao = async () => {
    const exText = exercises.map(ex => `• ${ex.name}: ${ex.weight}kg / ${ex.sets}세트 ${ex.reps}회`).join('\n');
    const shareData = {
      title: `${memberName} PT 리포트`,
      text: `[PREMIUM PT 리포트]\n👤 회원명: ${memberName}\n📅 날짜: ${date}\n\n📊 [운동 요약]\n🔥 ${calories}kcal | 🕒 ${duration}분 | ❤️ 심박수: ${avgHeartRate}bpm | 강도: ${intensity}\n\n🏋️‍♂️ [수행 운동]\n${exText}\n\n✍️ [트레이너 메모]\n${trainerMemo}\n\n오늘도 수고하셨습니다! 👍`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('공유 취소:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert('일지 내용이 복사되었습니다! 카카오톡 채팅창에 붙여넣어 보내세요.');
    }
  };

  // 📂 PNG 이미지 생성 및 저장
  const handleGenerateAndDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 540;
    canvas.height = 850;

    ctx.fillStyle = '#f2efea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText(`🏋️‍♂️ ${memberName} PT 리포트`, 28, 48);

    ctx.fillStyle = '#666666';
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillText(`담당: ${trainerName} 트레이너 | 일자: ${date}`, 28, 72);

    // 신체 수치 카드
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(28, 90, 484, 70, 10); ctx.fill();
    ctx.fillStyle = '#111111'; ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText(`체중: ${weight}kg (목표: ${targetWeight}kg) | 체지방: ${bodyFat}% | 골격근: ${muscle}kg`, 42, 130);

    // 운동 요약 박스
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(28, 170, 484, 60, 10); ctx.fill();
    ctx.fillStyle = '#111111'; ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText(`🔥 ${calories} kcal  |  🕒 ${duration} 분  |  ❤️ 심박수: ${avgHeartRate} bpm  |  📊 강도: ${intensity}`, 42, 205);

    // 운동 기록
    ctx.fillStyle = '#111111'; ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.fillText('오늘 수행한 운동', 28, 260);

    let startY = 280;
    exercises.forEach((ex) => {
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(28, startY, 484, 40, 8); ctx.fill();
      ctx.fillStyle = '#111111'; ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.fillText(`• ${ex.name} - ${ex.weight}kg / ${ex.sets}세트 ${ex.reps}회`, 42, startY + 25);
      startY += 50;
    });

    // 다운로드
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = `${memberName}_PT일지.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #dcdcdc', fontSize: '12px', boxSizing: 'border-box' };

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', padding: '20px 10px', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: '#1c1c1c', borderRadius: '16px', padding: '20px' }}>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* 상단 타이틀 */}
        <div style={{ borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '800' }}>PREMIUM PT REPORT</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>VIP 퍼스널 트레이닝 리포트</h1>
        </div>

        {/* 메인 리포트 카드 (크림색 테마) */}
        <div style={{ backgroundColor: '#f2efea', borderRadius: '14px', padding: '20px', color: '#111111' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>🏋️‍♂️ {memberName} PT 리포트</h2>
          
          {/* 신체 기록표 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>📊 현재 신체 기록표</div>
            <div style={{ fontSize: '12px', color: '#444' }}>
              체중 <strong>{weight}kg</strong> (목표 {targetWeight}kg) | 체지방 <strong>{bodyFat}%</strong> | 골격근 <strong>{muscle}kg</strong>
            </div>
          </div>

          {/* 오늘의 운동 요약 (심박수 포함) */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>🔥 오늘의 운동 요약</div>
            <div style={{ fontSize: '12px', color: '#444' }}>
              🔥 {calories} kcal | 🕒 {duration}분 | ❤️ <span style={{ color: '#d97706', fontWeight: 'bold' }}>{avgHeartRate} bpm</span> | 📊 {intensity}
            </div>
          </div>

          {/* 수행 운동 목록 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>🏋️‍♂️ 오늘 수행한 운동</div>
            {exercises.map((ex, idx) => (
              <div key={idx} style={{ fontSize: '12px', color: '#333', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                • <strong>{ex.name}</strong> : {ex.weight}kg / {ex.sets}세트 / {ex.reps}회
              </div>
            ))}
          </div>

          {/* 사진 목록 */}
          {images.length > 0 && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>📸 첨부된 운동 사진</div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <img key={idx} src={img} alt="운동사진" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                ))}
              </div>
            </div>
          )}

          {/* 트레이너 메모 & 식단 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>✍️ 트레이너 메모</div>
            <div style={{ color: '#555', whitespace: 'pre-wrap' }}>{trainerMemo}</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🥗 식단 피드백</div>
            <div style={{ color: '#555', whitespace: 'pre-wrap' }}>{dietMemo}</div>
          </div>
        </div>

        {/* 📱 수업 중 실시간 입력창 (모든 기능 탑재) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', marginTop: '20px', color: '#111' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 10px 0', color: '#2563eb' }}>📱 수업 중 즉시 입력 / 수정</h4>
          
          {/* 1. 기본 정보 수정 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#666' }}>회원명</label>
              <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#666' }}>담당 트레이너</label>
              <input type="text" value={trainerName} onChange={(e) => setTrainerName(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* 2. 신체 수치 & 운동 수치 (심박수 포함) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
            <div><label style={{ fontSize: '10px', color: '#666' }}>체중</label><input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>목표</label><input type="text" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>체지방</label><input type="text" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>골격근</label><input type="text" value={muscle} onChange={(e) => setMuscle(e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
            <div><label style={{ fontSize: '10px', color: '#666' }}>칼로리</label><input type="text" value={calories} onChange={(e) => setCalories(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>시간(분)</label><input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#d97706', fontWeight: 'bold' }}>심박수</label><input type="text" value={avgHeartRate} onChange={(e) => setAvgHeartRate(e.target.value)} style={{...inputStyle, borderColor: '#f59e0b'}} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>강도</label><input type="text" value={intensity} onChange={(e) => setIntensity(e.target.value)} style={inputStyle} /></div>
          </div>

          {/* 3. 종목 추가하기 */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#111' }}>🏋️‍♂️ 오늘 PT 운동 추가</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6px', marginTop: '4px' }}>
              <input type="text" placeholder="종목명" value={newExName} onChange={(e) => setNewExName(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="kg" value={newExWeight} onChange={(e) => setNewExWeight(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="세트" value={newExSets} onChange={(e) => setNewExSets(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="회" value={newExReps} onChange={(e) => setNewExReps(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={handleAddExercise} style={{ width: '100%', marginTop: '6px', padding: '6px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>+ 종목 추가하기</button>
            
            {/* 현재 등록된 종목 삭제 리스트 */}
            <div style={{ marginTop: '8px' }}>
              {exercises.map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#555', padding: '2px 0' }}>
                  <span>• {ex.name} ({ex.weight}kg / {ex.sets}세트 {ex.reps}회)</span>
                  <button onClick={() => handleRemoveExercise(i)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px' }}>삭제</button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 사진 추가 */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#111' }}>📷 운동 사진/미디어 첨부</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ ...inputStyle, marginTop: '4px' }} />
          </div>

          {/* 5. 메모 작성 */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#111' }}>✍️ 메모 & 식단 피드백</label>
            <textarea value={trainerMemo} onChange={(e) => setTrainerMemo(e.target.value)} placeholder="트레이너 메모" style={{ ...inputStyle, height: '40px', marginTop: '4px', marginBottom: '6px' }} />
            <textarea value={dietMemo} onChange={(e) => setDietMemo(e.target.value)} placeholder="식단 피드백" style={{ ...inputStyle, height: '40px' }} />
          </div>
        </div>

        {/* 전송 및 저장 버튼 */}
        <button 
          type="button" 
          onClick={handleShareToKakao}
          style={{ width: '100%', marginTop: '16px', padding: '16px', backgroundColor: '#fee500', color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
        >
          💬 카카오톡 대상 선택해서 전송하기
        </button>

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