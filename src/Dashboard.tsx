import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import ReservationPanel from './ReservationPanel';

const weeklyData = [
  { day: '5/19', value: 5 },
  { day: '5/20', value: 8 },
  { day: '5/21', value: 12 },
  { day: '5/22', value: 7 },
  { day: '5/23', value: 10 },
  { day: '5/24', value: 3 },
  { day: '5/25', value: 6 },
];
const monthlyData = Array.from({ length: 30 }, (_, i) => ({ day: `${i + 1}`, value: Math.floor(Math.random() * 10) + 1 }));
const dailyDataMap: { [key: string]: { left: number; right: number; list: { label: string; value: number }[] } } = {
  '5/19': { left: 12, right: 26, list: [ { label: '派車完成', value: 14 }, { label: '派車異常', value: 2 }, { label: '現場完成', value: 8 }, { label: '現場異常', value: 4 }, { label: '異常完成', value: 2 }, { label: '異常未完成', value: 12 } ] },
  '5/20': { left: 8, right: 18, list: [ { label: '派車完成', value: 10 }, { label: '派車異常', value: 1 }, { label: '現場完成', value: 5 }, { label: '現場異常', value: 2 }, { label: '異常完成', value: 1 }, { label: '異常未完成', value: 8 } ] },
  '5/21': { left: 15, right: 22, list: [ { label: '派車完成', value: 12 }, { label: '派車異常', value: 2 }, { label: '現場完成', value: 6 }, { label: '現場異常', value: 2 }, { label: '異常完成', value: 2 }, { label: '異常未完成', value: 10 } ] },
  '5/22': { left: 7, right: 14, list: [ { label: '派車完成', value: 8 }, { label: '派車異常', value: 1 }, { label: '現場完成', value: 4 }, { label: '現場異常', value: 1 }, { label: '異常完成', value: 1 }, { label: '異常未完成', value: 6 } ] },
  '5/23': { left: 10, right: 20, list: [ { label: '派車完成', value: 11 }, { label: '派車異常', value: 2 }, { label: '現場完成', value: 7 }, { label: '現場異常', value: 2 }, { label: '異常完成', value: 2 }, { label: '異常未完成', value: 9 } ] },
  '5/24': { left: 3, right: 8, list: [ { label: '派車完成', value: 4 }, { label: '派車異常', value: 0 }, { label: '現場完成', value: 2 }, { label: '現場異常', value: 1 }, { label: '異常完成', value: 0 }, { label: '異常未完成', value: 3 } ] },
  '5/25': { left: 6, right: 12, list: [ { label: '派車完成', value: 7 }, { label: '派車異常', value: 1 }, { label: '現場完成', value: 3 }, { label: '現場異常', value: 1 }, { label: '異常完成', value: 1 }, { label: '異常未完成', value: 5 } ] },
};

const Design1 = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState('5/19');
  const [showPeriodSummary, setShowPeriodSummary] = useState(true);
  const dailyData = dailyDataMap[selectedDay] || dailyDataMap['5/19'];

  return (
    <div style={{ height: '100vh', background: '#f5f5f5', padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Reservation Panel (left) */}
        <div style={{ marginRight: 24 }}><ReservationPanel /></div>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <input type="date" value={selectedDate.format('YYYY-MM-DD')} onChange={e => setSelectedDate(dayjs(e.target.value))} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 180 }} />
            <button style={{ padding: '8px 16px', background: '#bbb', color: '#fff', border: 'none', borderRadius: 4, opacity: 0.5, cursor: 'not-allowed' }} disabled>匯出報表</button>
            <button style={{ padding: '8px 16px', background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 4, cursor: 'pointer' }}>新增紀錄</button>
          </div>
          {/* Combined Summary Section */}
          <div style={{ marginBottom: 8 }}>
            {/* Business Periods Summary Grid - Collapsible */}
            <div>
              <button onClick={() => setShowPeriodSummary(v => !v)} style={{ margin: '8px 0 4px 0', background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', color: '#666', fontSize: 14 }}>
                {showPeriodSummary ? '隱藏時段統計 ▲' : '顯示時段統計 ▼'}
              </button>
              {showPeriodSummary && (
                <div style={{ background: '#fff', borderRadius: 6, marginTop: 0, padding: '6px 0', border: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid #e0e0e0' }}>
                    <div></div>
                    {["週日", "週一", "週二", "週三", "週四", "週五", "週六"].map((d, idx) => (
                      <div key={idx} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 13, padding: '2px 0', borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none', color: '#333' }}>{d}</div>
                    ))}
                  </div>
                  {[
                    { label: '午餐', time: '11:00-14:00' },
                    { label: '晚餐', time: '17:30-20:00' },
                    { label: '宵夜', time: '20:00-22:00' },
                  ].map((period, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: rowIdx < 2 ? '1px solid #e0e0e0' : 'none' }}>
                      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 13, background: '#fafafa', borderRight: '1px solid #e0e0e0', padding: '2px 0', color: '#666' }}>{period.label}
                        <span style={{ color: '#aaa', fontWeight: 400, fontSize: 11 }}> ({period.time})</span>
                      </div>
                      {Array.from({ length: 7 }).map((_, colIdx) => {
                        // Mock data for demo
                        const customers = Math.floor(Math.random() * 20) + 5;
                        const groups = Math.floor(customers / 4) + 1;
                        return (
                          <div key={colIdx} style={{ textAlign: 'center', fontSize: 13, padding: '2px 0', borderRight: colIdx < 6 ? '1px solid #e0e0e0' : 'none', color: '#444', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 32 }}>
                            <span style={{ color: '#666', marginRight: 4 }}>{customers}人</span>
                            <span style={{ color: '#aaa' }}>{groups}組</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
                </div>
          {/* Daily Summary Bar (moved here) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', borderRadius: 6, padding: '6px 0', marginBottom: 8 }}>
            {[
              { day: '週日', customers: 12, groups: 3 },
              { day: '週一', customers: 10, groups: 2 },
              { day: '週二', customers: 8, groups: 2 },
              { day: '週三', customers: 15, groups: 4 },
              { day: '週四', customers: 9, groups: 2 },
              { day: '週五', customers: 11, groups: 3 },
              { day: '週六', customers: 7, groups: 2 },
            ].map((item, idx) => (
              <div key={idx} style={{ flex: 1, textAlign: 'center', borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none', fontSize: 13 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{item.day}</div>
                <span style={{ color: '#1976d2', marginRight: 4 }}>{item.customers}人</span>
                <span style={{ color: '#9c27b0' }}>{item.groups}組</span>
              </div>
            ))}
          </div>
          {/* Calendar Grid with Time Column */}
          <div style={{ display: 'flex', fontSize: 12, minHeight: 0, height: 'calc(100vh - 260px)', overflowY: 'auto', background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0' }}>
            {/* Time + Grid Container */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Weekday Headers Row */}
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: 64, background: '#fafafa', borderBottom: '1px solid #e0e0e0' }}></div> {/* Empty cell for time column */}
                {["週日", "週一", "週二", "週三", "週四", "週五", "週六"].map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', padding: 2, background: '#fafafa', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{d}</div>
                ))}
              </div>
              {/* Time + Grid Rows */}
              {Array.from({ length: 13 }).map((_, rowIdx) => {
                const hour = 8 + rowIdx;
                const time = `${hour.toString().padStart(2, '0')}:00`;
                // Block 14:00, 15:00, 16:00, 17:00 as non-business hours
                const isBlocked = hour >= 14 && hour <= 17;
                return (
                  <div key={time} style={{ display: 'flex', flexDirection: 'row', height: 100, minHeight: 100 }}>
                    {/* Time Label */}
                    <div style={{ width: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBlocked ? '#bbb' : '#888', fontWeight: 500, borderRight: '1px solid #e0e0e0', background: isBlocked ? '#f7f7f7' : '#fafafa', height: '100%', opacity: isBlocked ? 0.7 : 1 }}>{time}</div>
                    {/* Grid Cells */}
                    {Array.from({ length: 7 }).map((_, colIdx) => {
                      if (isBlocked) {
                        return (
                          <div key={colIdx + '-' + rowIdx} style={{ flex: 1, border: '1px solid #e0e0e0', background: 'repeating-linear-gradient(135deg, #fafafa, #fafafa 8px, #e0e0e0 8px, #e0e0e0 16px)', opacity: 0.7, position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#bbb', fontWeight: 'bold', fontSize: 14, pointerEvents: 'none' }}>非營業時間</span>
                          </div>
                        );
                      }
                      // Demo: random available tables, total = 5
                      const totalTables = 5;
                      const availableTables = Math.floor(Math.random() * (totalTables + 1));
                      const isFull = availableTables === 0;
                      // Mock event data for demonstration
                      const eventColors = ['#673ab7', '#ff9800', '#4caf50', '#f44336']; // purple, orange, green, red
                      const events = (rowIdx === 1 && colIdx === 0) ? [
                        { color: eventColors[0], label: `${time} 3人 2組` },
                        { color: eventColors[1], label: `${time} 3人 2組` },
                        { color: eventColors[2], label: `${time} 3人 2組` },
                        { color: eventColors[3], label: `${time} 3人 2組` },
                      ] : (Math.random() > 0.85 ? [
                        { color: eventColors[Math.floor(Math.random()*eventColors.length)], label: `${time} 3人 2組` }
                      ] : []);
                      const cellStyle: React.CSSProperties = {
                        flex: 1,
                        border: '1px solid #e0e0e0',
                        background: '#fff',
                        padding: 4,
                        overflow: 'auto',
                        height: '100%',
                        position: 'relative',
                      };
                      return (
                        <div
                          key={colIdx + '-' + rowIdx}
                          style={cellStyle}
                          onClick={undefined}
                        >
                          {/* Table availability info on its own line */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 2 }}>
                            <span style={{ fontWeight: 'bold', fontSize: 15, color: isFull ? '#f44336' : '#888' }}>{availableTables}/{totalTables}</span>
                            <span style={{ color: isFull ? '#f44336' : '#888', fontWeight: 'bold', fontSize: 14, border: isFull ? '1px solid #f44336' : '1px solid #bbb', borderRadius: 4, padding: '0 4px', background: isFull ? '#fff0f0' : '#fafafa' }}>{isFull ? '滿' : '可'}</span>
              </div>
                          {/* Events and other info below */}
                          {events.map((ev, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 4, fontSize: 14, color: '#222' }}>
                              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: ev.color, marginRight: 6 }}></span>
                              <span>{ev.label}</span>
            </div>
                          ))}
                          {(rowIdx === 1 && colIdx === 0) && <span style={{ color: '#f44336', fontSize: 12 }}>還有 2組</span>}
              </div>
                      );
                    })}
              </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design1; 