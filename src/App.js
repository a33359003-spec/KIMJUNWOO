import React, { useState } from 'react';

function App() {
  const [member, setMember] = useState('');
  const [sessionCount, setSessionCount] = useState(1);
  const [monthlyTarget, setMonthlyTarget] = useState(12);
  const [completedSessions, setCompletedSessions] = useState(5);
  
  const [exercises, setExercises] = useState([
    { name: '바벨 스쿼트', weight: '80', reps: '10', sets: '4' },
    { name: '루마니안 데드리프트', weight: '100', reps: '8', sets: '3' }
  ]);

  const [memo, setMemo] = useState('');
  const [dietFeedback, setDietFeedback] = useState(''); 
  const [monthlyChecklist, setMonthlyChecklist] = useState('컨디션 양호 / 수면 시간 유지 / 수분 섭취 2L 이상 달성 중'); 
  const [mediaList, setMediaList] = useState([]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', weight: '', reps: '', sets: '' }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleMediaUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newMediaItems = filesArray.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        caption: ''
      }));
      setMediaList((prev) => [...prev, ...newMediaItems]);
    }
  };

  const handleCaptionChange = (id, text) => {
    setMediaList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption: text } : item))
    );
  };

  const handleRemoveMedia = (id) => {
    setMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGeneratePngImage = async () => {
    // PNG 생성 로직은 이전과 동일 (생략)
    alert('PNG 이미지 생성 및 전송 기능이 실행됩니다!');
  };

  const progressPercentage = Math.min(Math.round((completedSessions / monthlyTarget) * 100), 100);

  // 입력 필드 공통 스타일
  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    backgroundColor: '#ffffff', // 화이트 입력창
    color: '#111111',
    boxSizing: 'border-box',
    fontSize: '13px'
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#666666', // 그레이 라벨
    display: 'block',
    marginBottom: '6px'
  };

  return (
    // 1. 최외곽 배경 (어두운 색 유지)
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', color: '#f8fafc', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 2. 메인 크림색 카드 컨테이너 (고객 전송 리포트 영역) */}
      <div style={{ maxWidth: '520px', margin: '0 auto', backgroundColor: '#f2efea', borderRadius: '16px', border: '1px solid #e0ddda', padding: '24px', color: '#111111', boxShadow: '0 15px 30px rgba(0,0,0,0.5)' }}>
        
        {/* 상단 블랙 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#1c1c1c', borderRadius: '12px', padding: '16px', marginBottom: '20px', color: '#ffffff' }}>
          <div>
            <span style={{ backgroundColor: '#f59e0b', color: '#000', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '12px', letterSpacing: '1px' }}>PREMIUM PT REPORT</span>
            <h1 style={{ fontSize: '22px', fontWeight: '700', marginTop: '8px', color: '#ffffff', margin: '8px 0 0' }}>VIP 퍼스널 트레이닝 리포트</h1>
            <p style={{ color: '#aaaaaa', fontSize: '12px', marginTop: '4px', margin: '4px 0 0' }}>단일 회당 100,000원 상당의 맞춤형 케어 서비스</p>
          </div>
        </div>

        {/* --- 여기부터 하단 입력 화면까지 크림색 테마 적용 --- */}

        {/* 회원 정보 & 수업 회차 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>회원명</label>
            <input 
              type="text" 
              placeholder="예: 김준우 회원님" 
              value={member}
              onChange={(e) => setMember(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>수업 회차</label>
            <input 
              type="number" 
              value={sessionCount}
              onChange={(e) => setSessionCount(e.target.value)}
              style={{...inputStyle, textAlign: 'center'}}
            />
          </div>
        </div>

        {/* 월간 목표 진행률 */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#333' }}>
            <span style={{ fontWeight: '600' }}>📊 월간 출석 및 목표 달성률</span>
            <span style={{ color: '#38bdf8', fontWeight: '700' }}>{completedSessions} / {monthlyTarget}회 ({progressPercentage}%)</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#eee', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, backgroundColor: '#38bdf8', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input 
              type="number" 
              placeholder="진행" 
              value={completedSessions} 
              onChange={(e) => setCompletedSessions(Number(e.target.value))}
              style={{...inputStyle, padding: '8px', width: '50%'}}
            />
            <input 
              type="number" 
              placeholder="목표" 
              value={monthlyTarget} 
              onChange={(e) => setMonthlyTarget(Number(e.target.value))}
              style={{...inputStyle, padding: '8px', width: '50%'}}
            />
          </div>
        </div>

        {/* 📋 월간 종합 점검표 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#111', display: 'block', marginBottom: '8px' }}>📋 월간 종합 점검표</label>
          <input 
            type="text" 
            placeholder="컨디션/수면/수분 등" 
            value={monthlyChecklist}
            onChange={(e) => setMonthlyChecklist(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* 🏋️‍♂️ 세부 운동 기록 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>🏋️‍♂️ 세부 운동 기록</label>
            <button 
              type="button" 
              onClick={handleAddExercise}
              style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
            >
              + 종목 추가
            </button>
          </div>

          {exercises.map((item, index) => (
            <div key={index} style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '10px' }}>
              <input 
                type="text" 
                placeholder="운동 종목 이름" 
                value={item.name} 
                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                style={{...inputStyle, marginBottom: '8px', padding: '8px'}}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '6px', alignItems: 'center' }}>
                <input type="text" placeholder="kg" value={item.weight} onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)} style={{...inputStyle, padding: '8px', textAlign: 'center'}} />
                <input type="text" placeholder="회" value={item.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} style={{...inputStyle, padding: '8px', textAlign: 'center'}} />
                <input type="text" placeholder="세트" value={item.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} style={{...inputStyle, padding: '8px', textAlign: 'center'}} />
                <button type="button" onClick={() => handleRemoveExercise(index)} style={{ padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* 🥗 식단 관리 및 피드백 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#111', display: 'block', marginBottom: '8px' }}>🥗 식단 관리 및 피드백</label>
          <textarea 
            rows="2" 
            placeholder="단백질 섭취 유지 등" 
            value={dietFeedback}
            onChange={(e) => setDietFeedback(e.target.value)}
            style={{...inputStyle, height: 'auto'}}
          />
        </div>

        {/* 📝 수업 총평 및 코칭 피드백 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#111', display: 'block', marginBottom: '8px' }}>📝 수업 총평 및 코칭 피드백</label>
          <textarea 
            rows="2" 
            placeholder="자세 보정 포인트 등" 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{...inputStyle, height: 'auto'}}
          />
        </div>

        {/* 📷 운동 미디어 첨부 */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#111', display: 'block', marginBottom: '8px' }}>📷 운동 미디어 첨부 (여러 장 가능)</label>
          <label htmlFor="multi-media-upload" style={{ padding: '14px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', display: 'block', textAlign: 'center', boxSizing: 'border-box', border: '1px dashed #60a5fa' }}>
            + 앨범에서 사진/동영상 선택
          </label>
          <input id="multi-media-upload" type="file" multiple onChange={handleMediaUpload} style={{ display: 'none' }} />

          {mediaList.map((media) => (
            <div key={media.id} style={{ marginTop: '16px', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
              {media.type === 'image' ? <img src={media.url} alt="첨부" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '6px' }} /> : <video src={media.url} controls style={{ width: '100%', maxHeight: '200px', borderRadius: '6px' }} />}
              <input type="text" placeholder="설명 입력" value={media.caption} onChange={(e) => handleCaptionChange(media.id, e.target.value)} style={{...inputStyle, padding: '8px', marginTop: '8px'}} />
              <button type="button" onClick={() => handleRemoveMedia(media.id)} style={{ marginTop: '8px', width: '100%', padding: '6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
            </div>
          ))}
        </div>

        {/* 전송 버튼 */}
        <button 
          type="button" 
          onClick={handleGeneratePngImage}
          style={{ width: '100%', padding: '16px', backgroundColor: '#fee500', color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(254, 229, 0, 0.3)' }}
        >
          💬 PNG 이미지 생성 및 카카오톡 전송
        </button>

      </div>
    </div>
  );
}

export default App;