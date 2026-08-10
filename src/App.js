import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  // 1. 회원 기본 정보
  const [member, setMember] = useState({
    name: '김헬스',
    weight: '75.5',
    targetWeight: '70.0',
    bodyFat: '22.0',
    muscleMass: '32.5',
    directMemo: '스쿼트 시 무릎 안정성 주의. 척추 중립 잘 유지됨.',
    diet: '아침: 사과 1개, 계란 2개\n점심: 닭가슴살 볶음밥\n저녁: 연어 샐러드',
  });

  // 2. 오늘 수행한 PT 운동
  const [workouts, setWorkouts] = useState([
    { id: 1, exercise: '바벨 스쿼트', set: '5', rep: '12', weight: '80' },
    { id: 2, exercise: '레그 프레스', set: '4', rep: '15', weight: '120' },
  ]);

  // 3. 사진 & 피드 목록
  const [photoList, setPhotoList] = useState([]);
  const [photoFeedback, setPhotoFeedback] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // 4. 월간 점검표
  const [monthlyCheck, setMonthlyCheck] = useState({
    attendance: '12회 / 12회',
    weightChange: '-2.5kg',
    evalNote: '출석 및 식단 준수 상태 매우 양호함!',
  });

  // 운동 입력용 State
  const [exName, setExName] = useState('');
  const [exWeight, setExWeight] = useState('');
  const [exSet, setExSet] = useState('');
  const [exRep, setExRep] = useState('');

  const reportRef = useRef();

  // 모바일 카메라 촬영 / 앨범 사진 선택
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // 사진 피드 추가
  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('사진을 촬영하거나 앨범에서 선택해 주세요!');
      return;
    }
    setPhotoList([
      ...photoList,
      {
        id: Date.now(),
        url: selectedImage,
        comment: photoFeedback || '등록된 피드백이 없습니다.',
      },
    ]);
    setSelectedImage(null);
    setPhotoFeedback('');
  };

  // 사진 삭제
  const handleDeletePhoto = (id) => {
    setPhotoList(photoList.filter((p) => p.id !== id));
  };

  // 운동 추가
  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!exName) return;
    setWorkouts([...workouts, { id: Date.now(), exercise: exName, weight: exWeight, set: exSet, rep: exRep }]);
    setExName(''); setExWeight(''); setExSet(''); setExRep('');
  };

  // 📲 휴대폰에서 원클릭 카톡 공유 (핵심 기능)
  const shareToKakaoMobile = async () => {
    if (!reportRef.current) return;

    try {
      // 리포트 캡처
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0f172a', scale: 2 });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${member.name}_PT리포트.png`, { type: 'image/png' });

        // 스마트폰 자체 공유 창 호출 (카카오톡, 문자, 에어드랍 등)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${member.name} 회원님 PT 리포트`,
            text: `${member.name} 회원님의 오늘 수업 리포트입니다!`,
          });
        } else {
          // PC 브라우저 등 미지원 환경에서는 이미지 저장 처리
          const link = document.createElement('a');
          link.download = `${member.name}_PT리포트.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }, 'image/png');
    } catch (error) {
      alert('공유 창을 열 수 없습니다. 이미지를 길게 눌러 저장하거나 다시 시도해 주세요.');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '12px 8px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* 상단 고정: 카톡 즉시 보내기 버튼 */}
        <div style={{ position: 'sticky', top: '10px', zIndex: 100, marginBottom: '15px' }}>
          <button onClick={shareToKakaoMobile} style={mobileShareBtnStyle}>
            🚀 카톡으로 회원에게 즉시 전송하기
          </button>
        </div>

        {/* ==================== 회원 전송용 리포트 카드 ==================== */}
        <div ref={reportRef} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
          
          {/* 헤더 */}
          <div style={{ borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '18px', margin: 0, color: '#f8fafc' }}>
              {member.name} <span style={{ fontSize: '12px', color: '#94a3b8' }}>회원님 PT 리포트</span>
            </h1>
            <span style={{ backgroundColor: '#0284c7', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>DAILY</span>
          </div>

          {/* 1. 신체 기록 요약 */}
          <div style={{ ...cardBoxStyle, marginBottom: '14px' }}>
            <h3 style={titleStyle}>📊 현재 신체 기록표</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px', textAlign: 'center' }}>
              <div style={statBoxStyle}>
                <span style={statLabelStyle}>체중</span>
                <span style={statValueStyle}>{member.weight}k</span>
              </div>
              <div style={statBoxStyle}>
                <span style={statLabelStyle}>목표</span>
                <span style={statValueStyle}>{member.targetWeight}k</span>
              </div>
              <div style={statBoxStyle}>
                <span style={statLabelStyle}>체지방</span>
                <span style={statValueStyle}>{member.bodyFat}%</span>
              </div>
              <div style={statBoxStyle}>
                <span style={statLabelStyle}>골격근</span>
                <span style={statValueStyle}>{member.muscleMass}k</span>
              </div>
            </div>
          </div>

          {/* 🔥 2. 세로 피드: 사진 & 바로 밑 피드백 */}
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ ...titleStyle, color: '#38bdf8', marginBottom: '8px' }}>📸 사진 & 1:1 피드백 ({photoList.length}건)</h3>

            {photoList.length === 0 ? (
              <div style={{ ...cardBoxStyle, textAlign: 'center', padding: '15px', color: '#64748b', fontSize: '12px' }}>
                하단에서 사진을 찍어 등록해 주세요.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {photoList.map((photo, index) => (
                  <div key={photo.id} style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <img src={photo.url} alt={`사진 ${index + 1}`} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000', display: 'block' }} />
                    <div style={{ padding: '10px 12px', backgroundColor: '#0f172a', borderTop: '1px solid #334155' }}>
                      <span style={{ fontSize: '11px', color: '#facc15', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>💬 피드백 #{index + 1}</span>
                      <p style={{ margin: 0, color: '#f1f5f9', fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{photo.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. 메모 & 식단 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            <div style={cardBoxStyle}>
              <h3 style={titleStyle}>✍️ 트레이너 메모</h3>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '12px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{member.directMemo}</p>
            </div>
            <div style={cardBoxStyle}>
              <h3 style={titleStyle}>🥗 식단 피드백</h3>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '12px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{member.diet}</p>
            </div>
          </div>

          {/* 4. 오늘 PT 운동 */}
          <div style={{ ...cardBoxStyle, marginBottom: '14px' }}>
            <h3 style={titleStyle}>🏋️‍♂️ 오늘 수행한 운동</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
              <tbody>
                {workouts.map((w) => (
                  <tr key={w.id} style={{ borderBottom: '1px solid #334155', color: '#f1f5f9', fontSize: '12px' }}>
                    <td style={{ padding: '6px 0', fontWeight: 'bold', color: '#38bdf8' }}>{w.exercise}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right' }}>{w.weight ? `${w.weight}kg / ` : ''}{w.set}세트 {w.rep}회</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. 월간 점검표 */}
          <div style={cardBoxStyle}>
            <h3 style={titleStyle}>📅 월간 점검표</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#cbd5e1' }}>• 출석: {monthlyCheck.attendance} | 체중: {monthlyCheck.weightChange}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#38bdf8' }}>💡 {monthlyCheck.evalNote}</p>
          </div>

        </div>

        {/* ==================== 📱 수업 중 스마트폰 전용 입력 제어판 ==================== */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '16px' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f8fafc' }}>📱 수업 중 즉시 입력 (스마트폰)</h2>

          {/* 1. 카메라로 즉시 찍기 / 앨범 사진 피드 추가 */}
          <form onSubmit={handleAddPhoto} style={{ marginBottom: '16px', backgroundColor: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #0284c7' }}>
            <h4 style={{ ...subTitleStyle, color: '#38bdf8' }}>📷 1. 바로 사진 찍기 / 앨범 추가</h4>
            <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ color: '#cbd5e1', fontSize: '12px', width: '100%', marginBottom: '8px' }} />
            <textarea
              placeholder="사진 피드백 입력 (예: 골반 불균형 보정 필요)"
              value={photoFeedback}
              onChange={(e) => setPhotoFeedback(e.target.value)}
              style={{ ...inputStyle, width: '100%', height: '50px', marginBottom: '8px' }}
            />
            <button type="submit" style={{ ...addBtnStyle, backgroundColor: '#0284c7', width: '100%', padding: '10px' }}>+ 사진 및 피드백 추가</button>
          </form>

          {/* 사진 목록 관리 */}
          {photoList.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={subTitleStyle}>🗑️ 등록된 사진 삭제 관리</h4>
              {photoList.map((photo, i) => (
                <div key={photo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '6px 10px', borderRadius: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>사진 #{i + 1}</span>
                  <button onClick={() => handleDeletePhoto(photo.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>삭제</button>
                </div>
              ))}
            </div>
          )}

          {/* 2. 회원 정보 수정 */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={subTitleStyle}>2. 회원 수치 변경</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
              <input type="text" placeholder="이름" value={member.name} onChange={(e) => setMember({...member, name: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="체중" value={member.weight} onChange={(e) => setMember({...member, weight: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="목표" value={member.targetWeight} onChange={(e) => setMember({...member, targetWeight: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <input type="text" placeholder="체지방" value={member.bodyFat} onChange={(e) => setMember({...member, bodyFat: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="골격근" value={member.muscleMass} onChange={(e) => setMember({...member, muscleMass: e.target.value})} style={inputStyle} />
            </div>
          </div>

          {/* 3. 메모 및 식단 */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={subTitleStyle}>3. 메모 & 식단 작성</h4>
            <textarea placeholder="메모" value={member.directMemo} onChange={(e) => setMember({...member, directMemo: e.target.value})} style={{ ...inputStyle, width: '100%', height: '40px', marginBottom: '4px' }} />
            <textarea placeholder="식단" value={member.diet} onChange={(e) => setMember({...member, diet: e.target.value})} style={{ ...inputStyle, width: '100%', height: '40px' }} />
          </div>

          {/* 4. 운동 추가 */}
          <form onSubmit={handleAddWorkout} style={{ marginBottom: '12px' }}>
            <h4 style={subTitleStyle}>4. 오늘 PT 운동 추가</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
              <input type="text" placeholder="운동명" value={exName} onChange={(e) => setExName(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="kg" value={exWeight} onChange={(e) => setExWeight(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="세트" value={exSet} onChange={(e) => setExSet(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="회" value={exRep} onChange={(e) => setExRep(e.target.value)} style={inputStyle} />
            </div>
            <button type="submit" style={{ ...addBtnStyle, width: '100%' }}>+ 운동 추가</button>
          </form>

          {/* 5. 월간 점검 */}
          <div>
            <h4 style={subTitleStyle}>5. 월간 점검표</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
              <input type="text" placeholder="출석" value={monthlyCheck.attendance} onChange={(e) => setMonthlyCheck({...monthlyCheck, attendance: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="체중변화" value={monthlyCheck.weightChange} onChange={(e) => setMonthlyCheck({...monthlyCheck, weightChange: e.target.value})} style={inputStyle} />
            </div>
            <input type="text" placeholder="종합 평가" value={monthlyCheck.evalNote} onChange={(e) => setMonthlyCheck({...monthlyCheck, evalNote: e.target.value})} style={{ ...inputStyle, width: '100%' }} />
          </div>

        </div>

      </div>
    </div>
  );
}

// 모바일 상단 카톡 전송 버튼 스타일
const mobileShareBtnStyle = {
  backgroundColor: '#facc15',
  color: '#0f172a',
  border: 'none',
  padding: '14px',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: '15px',
  cursor: 'pointer',
  width: '100%',
  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
};

const cardBoxStyle = {
  backgroundColor: '#0f172a',
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid #334155',
};

const titleStyle = { margin: '0 0 6px 0', fontSize: '12px', color: '#38bdf8' };
const subTitleStyle = { margin: '0 0 4px 0', fontSize: '11px', color: '#cbd5e1' };

const statBoxStyle = {
  backgroundColor: '#1e293b',
  padding: '4px 2px',
  borderRadius: '6px',
  display: 'flex',
  flexDirection: 'column',
};

const statLabelStyle = { fontSize: '9px', color: '#94a3b8' };
const statValueStyle = { fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' };

const inputStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  color: '#fff',
  padding: '6px 8px',
  borderRadius: '6px',
  outline: 'none',
  fontSize: '12px',
  boxSizing: 'border-box',
};

const addBtnStyle = {
  backgroundColor: '#10b981',
  color: '#fff',
  border: 'none',
  padding: '8px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '12px',
};

export default App;