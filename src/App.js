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

  // 🖼️ 사진 비율 및 동적 높이 계산 PNG 이미지 생성
  const handleGeneratePngImage = async () => {
    if (!member) {
      alert('회원 이름을 입력해 주세요.');
      return;
    }

    // 1. 첨부된 이미지 사전 로드 및 원본 비율(높이) 계산
    const loadedImages = [];
    const imageWidth = 540;

    for (let i = 0; i < mediaList.length; i++) {
      const media = mediaList[i];
      if (media.type === 'image') {
        try {
          const img = new Image();
          img.src = media.url;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });

          const aspectRatio = img.naturalHeight / img.naturalWidth || 0.75;
          const calculatedHeight = Math.round(imageWidth * aspectRatio);

          loadedImages.push({
            imgElement: img,
            width: imageWidth,
            height: calculatedHeight,
            caption: media.caption
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 2. 전체 캔버스 높이 동적 계산 (마무리 멘트 영역 포함)
    const width = 600;
    const validExercises = exercises.filter((e) => e.name);
    
    let totalMediaHeight = 0;
    loadedImages.forEach((item) => {
      totalMediaHeight += item.height + (item.caption ? 45 : 25);
    });

    const height = 540 
      + (validExercises.length * 40) 
      + (memo ? 90 : 0) 
      + (dietFeedback ? 90 : 0)
      + (monthlyChecklist ? 90 : 0)
      + totalMediaHeight 
      + 40;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // 배경 채우기
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // 헤더 배지 & 타이틀
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 80, 24, 160, 24, 12);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PREMIUM PT REPORT', width / 2, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('VIP 퍼스널 트레이닝 리포트', width / 2, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('단일 회당 100,000원 상당의 맞춤형 케어 서비스', width / 2, 100);

    // 구분선
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 120);
    ctx.lineTo(width - 30, 120);
    ctx.stroke();

    // 회원 정보
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`👤 회원명: ${member}님 (${sessionCount}회차)`, 30, 150);

    // 월간 달성률
    const progressPercent = Math.min(Math.round((completedSessions / monthlyTarget) * 100), 100);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, 170, width - 60, 60);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`📊 월간 목표 달성률: ${completedSessions}/${monthlyTarget}회 (${progressPercent}%)`, 45, 195);

    ctx.fillStyle = '#334155';
    ctx.fillRect(45, 205, width - 90, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(45, 205, ((width - 90) * progressPercent) / 100, 10);

    let currentY = 260;

    // 📋 월간 점검표
    if (monthlyChecklist) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('📋 월간 종합 점검표', 30, currentY);

      currentY += 15;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, currentY, width - 60, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      ctx.fillText(monthlyChecklist, 40, currentY + 30);
      currentY += 70;
    }

    // 운동 세부 기록
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('🏋️‍♂️ 오늘의 세부 운동 기록', 30, currentY);

    if (validExercises.length === 0) {
      currentY += 30;
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      ctx.fillText('• 등록된 운동 기록이 없습니다.', 40, currentY);
    } else {
      validExercises.forEach((item) => {
        currentY += 35;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(30, currentY - 22, width - 60, 32);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.fillText(`• ${item.name}`, 40, currentY);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`${item.weight}kg / ${item.reps}회 / ${item.sets}세트`, width - 200, currentY);
      });
    }

    // 🥗 식단 피드백
    if (dietFeedback) {
      currentY += 45;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('🥗 식단 관리 및 피드백', 30, currentY);

      currentY += 15;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, currentY, width - 60, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      ctx.fillText(dietFeedback, 40, currentY + 30);
      currentY += 70;
    }

    // 수업 총평
    if (memo) {
      currentY += 45;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('📝 수업 총평 및 코칭 피드백', 30, currentY);

      currentY += 15;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, currentY, width - 60, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      ctx.fillText(memo, 40, currentY + 30);
      currentY += 70;
    }

    // 이미지 그리기 (비율 유지)
    if (loadedImages.length > 0) {
      currentY += 15;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('📷 운동 사진 및 영상 갤러리', 30, currentY);

      loadedImages.forEach((item) => {
        currentY += 15;
        ctx.drawImage(item.imgElement, 30, currentY, item.width, item.height);
        currentY += item.height;

        if (item.caption) {
          currentY += 20;
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '12px sans-serif';
          ctx.fillText(`💬 ${item.caption}`, 35, currentY);
          currentY += 10;
        } else {
          currentY += 10;
        }
      });
    }

    // ✨ 마무리 멘트 추가
    currentY += 35;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('오늘도 정말 고생하셨어요 ^^', width / 2, currentY);

    // PNG 다운로드 및 공유
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const fileName = `${member}_PT리포트_${sessionCount}회차.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${member}님 PT 리포트`,
            text: `${member}님의 VIP PT 리포트입니다.`
          });
          return;
        } catch (err) {
          console.log('공유 취소:', err);
        }
      }

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      alert('PNG 이미지 파일이 정상 생성되었습니다! 카카오톡에 이미지를 첨부해 주세요.');
    }, 'image/png');
  };

  const progressPercentage = Math.min(Math.round((completedSessions / monthlyTarget) * 100), 100);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '28px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <span style={{ backgroundColor: '#f59e0b', color: '#000', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '12px', letterSpacing: '1px' }}>PREMIUM PT REPORT</span>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginTop: '8px', color: '#ffffff' }}>VIP 퍼스널 트레이닝 리포트</h1>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>단일 회당 100,000원 상당의 맞춤형 케어 서비스</p>
        </div>

        {/* 회원 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>회원명</label>
            <input 
              type="text" 
              placeholder="예: 김준우 회원님" 
              value={member}
              onChange={(e) => setMember(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>수업 회차</label>
            <input 
              type="number" 
              value={sessionCount}
              onChange={(e) => setSessionCount(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', textAlign: 'center' }}
            />
          </div>
        </div>

        {/* 월간 목표 진행률 */}
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: '600' }}>📊 월간 출석 및 목표 달성률</span>
            <span style={{ color: '#38bdf8', fontWeight: '700' }}>{completedSessions} / {monthlyTarget}회 ({progressPercentage}%)</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#334155', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, backgroundColor: '#38bdf8', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input 
              type="number" 
              placeholder="진행회수" 
              value={completedSessions} 
              onChange={(e) => setCompletedSessions(Number(e.target.value))}
              style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px' }}
            />
            <input 
              type="number" 
              placeholder="목표회수" 
              value={monthlyTarget} 
              onChange={(e) => setMonthlyTarget(Number(e.target.value))}
              style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px' }}
            />
          </div>
        </div>

        {/* 📋 월간 종합 점검표 입력 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'block', marginBottom: '8px' }}>📋 월간 종합 점검표</label>
          <input 
            type="text" 
            placeholder="예: 컨디션 양호 / 수면 7시간 / 수분 섭취 우수" 
            value={monthlyChecklist}
            onChange={(e) => setMonthlyChecklist(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        {/* 운동 상세 기록 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>🏋️‍♂️ 세부 운동 기록</label>
            <button 
              type="button" 
              onClick={handleAddExercise}
              style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
            >
              + 종목 추가
            </button>
          </div>

          {exercises.map((item, index) => (
            <div key={index} style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px' }}>
              <input 
                type="text" 
                placeholder="운동 종목 이름" 
                value={item.name} 
                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', marginBottom: '8px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '6px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="무게(kg)" 
                  value={item.weight} 
                  onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px', textAlign: 'center' }}
                />
                <input 
                  type="text" 
                  placeholder="횟수(회)" 
                  value={item.reps} 
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px', textAlign: 'center' }}
                />
                <input 
                  type="text" 
                  placeholder="세트" 
                  value={item.sets} 
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px', textAlign: 'center' }}
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveExercise(index)}
                  style={{ padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🥗 식단 관리 및 피드백 입력 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'block', marginBottom: '8px' }}>🥗 식단 관리 및 피드백</label>
          <textarea 
            rows="2" 
            placeholder="단백질 섭취량 유지, 야식 제한 피드백 등" 
            value={dietFeedback}
            onChange={(e) => setDietFeedback(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        {/* 수업 총평 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'block', marginBottom: '8px' }}>📝 수업 총평 및 코칭 피드백</label>
          <textarea 
            rows="2" 
            placeholder="자세 보정 포인트나 트레이너 코멘트" 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        {/* 미디어 첨부 */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'block', marginBottom: '8px' }}>📷 운동 미디어 첨부 (여러 장 가능)</label>
          <label 
            htmlFor="multi-media-upload" 
            style={{
              padding: '14px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              display: 'block',
              textAlign: 'center',
              boxSizing: 'border-box',
              border: '1px dashed #60a5fa'
            }}
          >
            + 앨범에서 사진/동영상 여러 개 선택
          </label>
          <input 
            id="multi-media-upload"
            type="file" 
            multiple
            onChange={handleMediaUpload}
            style={{ display: 'none' }}
          />

          {mediaList.map((media) => (
            <div key={media.id} style={{ marginTop: '16px', backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              {media.type === 'image' ? (
                <img src={media.url} alt="첨부 사진" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '6px' }} />
              ) : (
                <video src={media.url} controls style={{ width: '100%', maxHeight: '220px', borderRadius: '6px' }} />
              )}
              <input 
                type="text" 
                placeholder="이 사진/동영상에 대한 설명을 적어주세요" 
                value={media.caption}
                onChange={(e) => handleCaptionChange(media.id, e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', boxSizing: 'border-box', fontSize: '12px' }}
              />
              <button 
                type="button" 
                onClick={() => handleRemoveMedia(media.id)}
                style={{ marginTop: '8px', width: '100%', padding: '6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 💬 PNG 이미지 생성 및 카카오톡 전송 버튼 */}
        <button 
          type="button" 
          onClick={handleGeneratePngImage}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#fee500',
            color: '#000000',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(254, 229, 0, 0.3)'
          }}
        >
          💬 PNG 이미지 생성 및 카카오톡 전송
        </button>

      </div>
    </div>
  );
}

export default App;