import React from 'react';

interface ReservationPanelProps {
  mode?: 'create' | 'view';
  selectedInfo?: {
    day?: string;
    date?: string;
    time?: string;
  };
}

const ReservationPanel: React.FC<ReservationPanelProps> = ({ mode = 'view', selectedInfo }) => {
  return (
    <div style={{ width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top action bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <button style={{ background: mode === 'create' ? '#f44336' : '#eee', color: mode === 'create' ? '#fff' : '#333', border: 'none', borderRadius: 16, padding: '4px 16px', fontWeight: 600, fontSize: 15 }}>新增訂位</button>
        <button style={{ background: mode === 'view' ? '#f44336' : '#eee', color: mode === 'view' ? '#fff' : '#333', border: 'none', borderRadius: 16, padding: '4px 16px', fontWeight: 600, fontSize: 15 }}>查看訂位</button>
        <span style={{ marginLeft: 'auto', color: '#888', fontSize: 20, cursor: 'pointer' }}>🔍</span>
      </div>
      {/* Create New Reservation Section */}
      {mode === 'create' && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#f44336', marginBottom: 6 }}>建立新訂位</div>
          {selectedInfo && (
            <div style={{ color: '#333', fontSize: 15, marginBottom: 2 }}>
              {selectedInfo.day && <span style={{ marginRight: 8 }}>{selectedInfo.day}</span>}
              {selectedInfo.date && <span style={{ marginRight: 8 }}>{selectedInfo.date}</span>}
              {selectedInfo.time && <span>{selectedInfo.time}</span>}
            </div>
          )}
        </div>
      )}
      {/* Reservation info */}
      {mode === 'view' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, marginBottom: 2 }}>
            <span>2024年7月14日 (二) 17:30</span>
            <span style={{ color: '#f44336', fontSize: 16, cursor: 'pointer' }}>✎</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ background: '#4caf50', color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>已保留 <span style={{ fontSize: 16 }}>💰</span></span>
            <span style={{ color: '#888', fontSize: 15, marginLeft: 8 }}>已付款</span>
            <span style={{ marginLeft: 'auto', color: '#888', fontSize: 15 }}>120 分</span>
          </div>
          {/* Customer info */}
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>正朔方 <span style={{ fontWeight: 400, fontSize: 15 }}>先生</span> <span style={{ fontWeight: 700, fontSize: 18 }}>• 20</span></div>
          <div style={{ color: '#333', fontSize: 15, marginBottom: 2 }}>+886 912 345 678</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>Eatsy.lein@gmail.com</div>
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
            <span style={{ background: '#ffd600', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>VIP</span>
            <span style={{ background: '#b2dfdb', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>熟客</span>
            <span style={{ background: '#90caf9', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>愛吃芋頭</span>
            <span style={{ background: '#f8bbd0', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>減糖要求</span>
            <span style={{ background: '#c8e6c9', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>靠窗座位</span>
          </div>
          {/* Icons row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2, color: '#888', fontSize: 18 }}>
            <span>🌤️</span>
            <span>🧑‍🦱</span>
            <span>👶</span>
            <span>1</span>
            <span>0</span>
          </div>
          {/* Table assignment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, marginBottom: 2 }}>
            <span style={{ color: '#888', fontSize: 18 }}>🪑</span>
            <span>B2, B3...</span>
            <span style={{ color: '#f44336', fontWeight: 700 }}>(10)</span>
          </div>
          {/* Purpose tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
            <span style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>慶生</span>
            <span style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>週年慶</span>
            <span style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>約會</span>
            <span style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>朋友聚餐</span>
            <span style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>家庭聚餐</span>
            <span style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>商務</span>
          </div>
          {/* Order mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ color: '#888', fontSize: 16 }}>訂位狀態</span>
            <select style={{ border: '1px solid #ccc', borderRadius: 6, padding: '2px 8px', fontSize: 15, color: '#333' }}>
              <option>代客修改</option>
            </select>
          </div>
          {/* Notes */}
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#f44336', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>查看備註</div>
            <div style={{ background: '#fff', border: '1.5px solid #f44336', borderRadius: 8, padding: 10, color: '#d32f2f', fontSize: 14, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>顧客備註</div>
              <div>我上次來用餐時，餐點太鹹，這次希望廚房能格外留意。另外飲料請無糖、少冰，若有餐巾可多給幾張。</div>
            </div>
            <div style={{ display: 'flex', gap: 12, color: '#f44336', fontSize: 22 }}>
              <span style={{ cursor: 'pointer' }}>📝</span>
              <span style={{ cursor: 'pointer' }}>📋</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationPanel; 