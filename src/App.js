import React, { useState, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  // 1. 기본 회원 정보
  const [memberName, setMemberName] = useState('김준우 회원님');
  const [trainerName, setTrainerName] = useState('황승준');
  const [date, setDate] = useState('2024.05.23 (목)');

  // 2. 신체 수치 & 운동 요약
  const [weight, setWeight] = useState('75.5');
  const [targetWeight, setTargetWeight] = useState('70.0');
  const [bodyFat, setBodyFat] = useState('22.0');
  const [muscle, setMuscle] = useState('32.5');
  const [calories, setCalories] = useState('420');
  const [duration, setDuration] = useState('60');
  const [avgHeartRate, setAvgHeartRate] = useState('126');
  const [intensity, setIntensity] = useState('중상');

  // 3. 메모 및 식단 피드백
  const [trainerMemo, setTrainerMemo] = useState('스쿼트 시 무릎 안정성 주의. 척추 중립 잘 유지됨.');
  const [dietMemo, setDietMemo] = useState('아침: 사과 1개, 계란 2개\n점심: 닭가슴살 볶음밥\n저녁: 연어 샐러드');

  // 4. 운동 종목 목록
  const [exercises, setExercises] = useState([
    { name: '바벨 스쿼트', weight: '80', sets: '5', reps: '12' },
    { name: '레그 프레스', weight: '120', sets: '4', reps: '15' }
  ]);
  const [newExName, setNewExName] = useState('');
  const [newExWeight, setNewExWeight] = useState('');
  const [newExSets, setNewExSets] = useState('');
  const [newExReps, setNewExReps] = useState('');

  // 5. 사진 및 사진별 피드백
  const [photoList, setPhotoList] = useState([]);

  // 운동 종목 추가/삭제
  const handleAddExercise = () => {
    if (!newExName) return;
    setExercises([...exercises, { name: newExName, weight: newExWeight, sets: newExSets, reps: newExReps }]);
    setNewExName(''); setNewExWeight(''); setNewExSets(''); setNewExReps('');
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // 사진 추가
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoList(prev => [...prev, { url: reader.result, feedback: '' }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 사진별 피드백 수정
  const handlePhotoFeedbackChange = (index, value) => {
    const updated = [...photoList];
    updated[index].feedback = value;
    setPhotoList(updated);
  };

  // 사진 삭제
  const handleRemovePhoto = (index) => {
    setPhotoList(photoList.filter((_, i) => i !== index));
  };

  // 🎨 Canvas로 PNG 이미지 렌더링 함수
  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    const dynamicHeight = 650 + (exercises.length * 35) + (photoList.length * 160);
    canvas.width = 540;
    canvas.height = Math.max(800, dynamicHeight);

    // 배경
    ctx.fillStyle = '#f2efea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 헤더
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText(`🏋️‍♂️ ${memberName} PT 리포트`, 24, 45);

    ctx.fillStyle = '#666666';
    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillText(`담당: ${trainerName} 트레이너 | 일자: ${date}`, 24, 68);

    // 신체 수치 박스
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(24, 85, 492, 45, 8); ctx.fill();
    ctx.fillStyle = '#111111'; ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.fillText(`체중: ${weight}kg (목표: ${targetWeight}kg) | 체지방: ${bodyFat}% | 골격근: ${muscle}kg`, 36, 112);

    // 운동 요약 박스
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(24, 140, 492, 45, 8); ctx.fill();
    ctx.fillStyle = '#111111'; ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.fillText(`🔥 ${calories} kcal  |  🕒 ${duration} 분  |  ❤️ 심박수: ${avgHeartRate} bpm  |  강도: ${intensity}`, 36, 167);

    // 수행 운동
    ctx.fillStyle = '#111111'; ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText('오늘 수행한 운동', 24, 210);

    let startY = 222;
    exercises.forEach((ex) => {
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(24, startY, 492, 30, 6); ctx.fill();
      ctx.fillStyle = '#111111'; ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText(`• ${ex.name} - ${ex.weight}kg / ${ex.sets}세트 ${ex.reps}회`, 36, startY + 19);
      startY += 35;
    });

    // 사진 첨부 및 사진별 피드백 그리기
    if (photoList.length > 0) {
      startY += 10;
      ctx.fillStyle = '#111111'; ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.fillText('운동 사진 및 개별 피드백', 24, startY);
      startY += 12;

      for (let i = 0; i < photoList.length; i++) {
        const item = photoList[i];
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.roundRect(24, startY, 492, 140, 8); ctx.fill();

        // 이미지 로딩 후 그려넣기
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(36, startY + 15, 110, 110, 6);
            ctx.clip();
            ctx.drawImage(img, 36, startY + 15, 110, 110);
            ctx.restore();
            resolve();
          };
          img.onerror = resolve;
          img.src = item.url;
        });

        // 사진 텍스트 및 피드백 내용
        ctx.fillStyle = '#2563eb'; ctx.font = 'bold 12px -apple-system, sans-serif';
        ctx.fillText(`사진 ${i + 1} 피드백`, 160, startY + 35);

        ctx.fillStyle = '#333333'; ctx.font = '12px -apple-system, sans-serif';
        const feedbackText = item.feedback || '피드백 미입력';
        ctx.fillText(feedbackText, 160, startY + 60);

        startY += 150;
      }
    }

    // 메모 & 식단
    startY += 10;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(24, startY, 492, 50, 8); ctx.fill();
    ctx.fillStyle = '#111111'; ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.fillText(`✍️ 메모: ${trainerMemo}`, 36, startY + 30);

    return canvas;
  };

  // 💬 PNG 이미지로 변환하여 카카오톡 / 모바일 공유
  const handleShareToKakao = async () => {
    const canvas = await drawCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `${memberName}_PT리포트.png`, { type: 'image/png' });

      // 모바일 브라우저 이미지 직접 공유 지원 확인
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${memberName} PT 리포트`,
            files: [file]
          });
        } catch (e) {
          console.log('공유 취소:', e);
        }
      } else {
        // 모바일 웹/PC에서 파일 다운로드로 전환
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${memberName}_PT리포트.png`;
        link.click();
        alert('PNG 이미지 파일이 생성되었습니다! 다운로드된 이미지를 카카오톡으로 전송해 주세요.');
      }
    }, 'image/png');
  };

  // 📂 PNG 이미지 파일 다운로드
  const handleGenerateAndDownloadPng = async () => {
    const canvas = await drawCanvas();
    if (!canvas) return;

    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = `${memberName}_PT리포트.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #dcdcdc', fontSize: '12px', boxSizing: 'border-box' };

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', padding: '20px 10px', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: '#1c1c1c', borderRadius: '16px', padding: '20px' }}>
        
        {/* 숨겨진 캔버스 (PNG 이미지 변환용) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* 헤더 */}
        <div style={{ borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '800' }}>PREMIUM PT REPORT</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>VIP 퍼스널 트레이닝 리포트</h1>
        </div>

        {/* 메인 리포트 카드 (크림색 테마) */}
        <div style={{ backgroundColor: '#f2efea', borderRadius: '14px', padding: '20px', color: '#111111' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>🏋️‍♂️ {memberName} PT 리포트</h2>
            <span style={{ fontSize: '11px', color: '#666' }}>{date} | {trainerName} 트레이너</span>
          </div>
          
          {/* 신체 기록 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>📊 현재 신체 기록표</div>
            <div style={{ fontSize: '12px', color: '#444' }}>
              체중 <strong>{weight}kg</strong> (목표 {targetWeight}kg) | 체지방 <strong>{bodyFat}%</strong> | 골격근 <strong>{muscle}kg</strong>
            </div>
          </div>

          {/* 운동 요약 */}
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

          {/* 첨부 사진 및 개별 사진 피드백 */}
          {photoList.length > 0 && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>📸 첨부 운동 사진 및 개별 피드백</div>
              {photoList.map((photo, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '8px' }}>
                  <img src={photo.url} alt={`운동사진 ${idx + 1}`} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1, fontSize: '12px', color: '#333' }}>
                    <strong style={{ color: '#2563eb' }}>사진 {idx + 1} 피드백:</strong>
                    <div style={{ color: '#444', marginTop: '2px', wordBreak: 'break-all' }}>
                      {photo.feedback || '등록된 피드백이 없습니다.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 메모 & 식단 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', marginBottom: '10px', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>✍️ 트레이너 메모</div>
            <div style={{ color: '#555', whitespace: 'pre-wrap' }}>{trainerMemo}</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🥗 식단 피드백</div>
            <div style={{ color: '#555', whitespace: 'pre-wrap' }}>{dietMemo}</div>
          </div>
        </div>

        {/* 하단 수정/입력 Form */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', marginTop: '20px', color: '#111' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 10px 0', color: '#2563eb' }}>📱 수업 중 실시간 입력 / 변경</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
            <div><label style={{ fontSize: '10px', color: '#666' }}>회원명</label><input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>트레이너</label><input type="text" value={trainerName} onChange={(e) => setTrainerName(e.target.value)} style={inputStyle} /></div>
            <div><label style={{ fontSize: '10px', color: '#666' }}>날짜</label><input type="text" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} /></div>
          </div>

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

          {/* 종목 추가 */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#111' }}>🏋️‍♂️ 오늘 PT 운동 종목 추가</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6px', marginTop: '4px' }}>
              <input type="text" placeholder="종목명" value={newExName} onChange={(e) => setNewExName(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="kg" value={newExWeight} onChange={(e) => setNewExWeight(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="세트" value={newExSets} onChange={(e) => setNewExSets(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="회" value={newExReps} onChange={(e) => setNewExReps(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={handleAddExercise} style={{ width: '100%', marginTop: '6px', padding: '6px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>+ 운동 추가하기</button>
            
            <div style={{ marginTop: '8px' }}>
              {exercises.map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#555', padding: '2px 0' }}>
                  <span>• {ex.name} ({ex.weight}kg / {ex.sets}세트 {ex.reps}회)</span>
                  <button onClick={() => handleRemoveExercise(i)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px' }}>삭제</button>
                </div>
              ))}
            </div>
          </div>

          {/* 사진 첨부 및 각 사진 밑 피드백 작성 칸 */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#111' }}>📷 운동 사진 첨부 및 개별 피드백 입력</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ ...inputStyle, marginTop: '4px', marginBottom: '8px' }} />

            {photoList.map((photo, i) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px', marginBottom: '8px', backgroundColor: '#fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <img src={photo.url} alt={`사진 ${i + 1}`} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>사진 {i + 1} 피드백 입력란</span>
                  <button onClick={() => handleRemovePhoto(i)} style={{ marginLeft: 'auto', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px' }}>삭제</button>
                </div>
                <input 
                  type="text" 
                  placeholder="이 사진 밑에 들어갈 피드백을 적어주세요 (예: 무릎 위치 주의)" 
                  value={photo.feedback} 
                  onChange={(e) => handlePhotoFeedbackChange(i, e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            ))}
          </div>

          {/* 메모 및 식단 작성 */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#111' }}>✍️ 전체 메모 & 식단 피드백 입력</label>
            <textarea value={trainerMemo} onChange={(e) => setTrainerMemo(e.target.value)} placeholder="트레이너 메모" style={{ ...inputStyle, height: '40px', marginTop: '4px', marginBottom: '6px' }} />
            <textarea value={dietMemo} onChange={(e) => setDietMemo(e.target.value)} placeholder="식단 피드백" style={{ ...inputStyle, height: '40px' }} />
          </div>
        </div>

        {/* 전송 및 다운로드 버튼 */}
        <button 
          type="button" 
          onClick={handleShareToKakao}
          style={{ width: '100%', marginTop: '16px', padding: '16px', backgroundColor: '#fee500', color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
        >
          💬 카카오톡으로 PNG 이미지 리포트 바로 보내기
        </button>

        <button 
          type="button" 
          onClick={handleGenerateAndDownloadPng}
          style={{ width: '100%', marginTop: '10px', padding: '14px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
        >
          📂 PNG 이미지 파일로 저장
        </button>

      </div>
    </div>
  );
}

export default App;