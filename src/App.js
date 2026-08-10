import React, { useState } from 'react';

function App() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');

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

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>PT 리포트</h2>
      
      <div style={{ margin: '20px 0' }}>
        <h3 style={{ marginBottom: '10px' }}>수업 결과 업로드</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
          버튼을 누르고 <strong>'사진 보관함'</strong>을 선택해 주세요.
        </p>
        
        <label 
          htmlFor="media-upload" 
          style={{
            padding: '12px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          사진/동영상 선택 (앨범)
        </label>
        {/* accept와 capture를 모두 제거하여 iOS 기본 미디어 선택 메뉴(보관함 포함)를 호출 */}
        <input 
          id="media-upload"
          type="file" 
          onChange={handleMediaChange}
          style={{ display: 'none' }}
        />
      </div>

      {selectedMedia && (
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>선택된 미디어 미리보기</h3>
          {mediaType === 'image' ? (
            <img 
              src={selectedMedia} 
              alt="수업 결과 사진" 
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
            />
          ) : (
            <video 
              src={selectedMedia} 
              controls 
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
            />
          )}
           <div style={{marginTop: '15px'}}>
             <button 
                onClick={() => {setSelectedMedia(null); setMediaType('');}}
                style={{
                    padding: '8px 15px',
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}
             >
                삭제 후 다시 선택
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;