import React, { useState } from 'react';

function App() {
  // 수업 입력 데이터 상태
  const [member, setMember] = useState('');
  const [exercise, setExercise] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');

  // 사진 및 동영상 파일 선택 처리
  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedMedia(url);

      if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('수업 내용이 성공적으로 기록되었습니다!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🏋️‍♂️ PT 리포트 관리</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* 회원 선택 */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>회원명</label>
          <input 
            type="text" 
            placeholder="회원 이름을 입력하세요" 
            value={member}
            onChange={(e) => setMember(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        {/* 운동 내용 */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>수업/운동 내용</label>
          <input 
            type="text" 
            placeholder="예: 스쿼트 5세트, 데드리프트 3세트" 
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        {/* 특이사항 메모 */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>수업 메모 및 특이사항</label>
          <textarea 
            rows="3" 
            placeholder="자세 피드백 및 특이사항을 기록하세요" 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        {/* 수업 사진 및 동영상 첨부 (앨범 호환) */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>수업 결과 (사진/동영상 첨부)</label>
          <label 
            htmlFor="media-upload" 
            style={{
              padding: '10px 15px',
              backgroundColor: '#0070f3',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'inline-block',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            앨범에서 사진/동영상 선택
          </label>
          <input 
            id="media-upload"
            type="file" 
            onChange={handleMediaChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* 미디어 미리보기 */}
        {selectedMedia && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {mediaType === 'image' ? (
              <img 
                src={selectedMedia} 
                alt="수업 결과 사진" 
                style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '6px' }} 
              />
            ) : (
              <video 
                src={selectedMedia} 
                controls 
                style={{ width: '100%', maxHeight: '250px', borderRadius: '6px' }} 
              />
            )}
            <button 
              type="button"
              onClick={() => { setSelectedMedia(null); setMediaType(''); }}
              style={{
                marginTop: '8px',
                padding: '5px 10px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              첨부 삭제
            </button>
          </div>
        )}

        {/* 저장 버튼 */}
        <button 
          type="submit" 
          style={{
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          수업 리포트 저장하기
        </button>
      </form>
    </div>
  );
}

export default App;
