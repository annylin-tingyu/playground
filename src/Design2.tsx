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

const Design2 = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState('5/19');
  const [showPeriodSummary, setShowPeriodSummary] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<{ row: number; col: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dailyData = dailyDataMap[selectedDay] || dailyDataMap['5/19'];
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');

  // --- SYNCHRONIZED RANDOM DATA FOR MONTHLY VIEW ---
  // Structure: [{ day: 1, periods: [{label, customers, groups}, ...] }, ...]
  const [monthlyPeriodData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => {
      const periods = [
        { label: '午餐', customers: Math.floor(Math.random() * 20) + 5, groups: Math.floor(Math.random() * 5) + 1 },
        { label: '晚餐', customers: Math.floor(Math.random() * 20) + 5, groups: Math.floor(Math.random() * 5) + 1 },
        { label: '宵夜', customers: Math.floor(Math.random() * 10) + 1, groups: Math.floor(Math.random() * 3) + 1 },
      ];
      return { day: i + 1, periods };
    })
  );

  // Helper to check if a slot is selected
  const isSlotSelected = (row: number, col: number) => selectedSlots.some(s => s.row === row && s.col === col);

  // Handle slot selection
  const handleSlotClick = (row: number, col: number) => {
    if (!selectMode) return;
    setSelectedSlots(prev => {
      if (isSlotSelected(row, col)) {
        return prev.filter(s => !(s.row === row && s.col === col));
      } else {
        return [...prev, { row, col }];
      }
    });
  };

  // Handle drag selection
  const handleSlotMouseDown = (row: number, col: number) => {
    if (!selectMode) return;
    setIsDragging(true);
    setSelectedSlots(prev => isSlotSelected(row, col) ? prev : [...prev, { row, col }]);
  };
  const handleSlotMouseEnter = (row: number, col: number) => {
    if (!selectMode || !isDragging) return;
    setSelectedSlots(prev => isSlotSelected(row, col) ? prev : [...prev, { row, col }]);
  };
  const handleMouseUp = () => setIsDragging(false);

  // Clear selection and exit select mode
  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedSlots([]);
  };

  React.useEffect(() => {
    if (selectMode) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [selectMode]);

  // Calculate total people and groups for selected slots
  let totalPeople = 0;
  let totalGroups = 0;
  selectedSlots.forEach(({ row, col }) => {
    // Use the same logic as the cell for demo
    const customers = Math.floor(((row + 1) * (col + 2)) % 5) * 4 + 1; // deterministic demo value
    const groups = Math.floor(customers / 4) + 1;
    totalPeople += customers;
    totalGroups += groups;
  });

  return (
    <div style={{ height: '100vh', background: '#f5f5f5', padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Reservation Panel (left) */}
        <div style={{ marginRight: 24 }}><ReservationPanel /></div>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Date picker and view dropdown in a single row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <input type="date" value={selectedDate.format('YYYY-MM-DD')} onChange={e => setSelectedDate(dayjs(e.target.value))} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 180 }} />
            <label style={{ color: '#888', fontWeight: 600, marginLeft: 8 }}>檢視：</label>
            <select value={calendarView} onChange={e => setCalendarView(e.target.value as 'week' | 'month')} style={{ border: '1px solid #ccc', borderRadius: 6, padding: '4px 12px', fontSize: 15, color: '#333' }}>
              <option value="week">週</option>
              <option value="month">月</option>
            </select>
          </div>
          {/* Daily Summary Bar (now at the top) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', borderRadius: 6, padding: '6px 0', marginBottom: 16 }}>
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
          {/* Select Mode Button and Selected Info Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            {selectMode ? (
              <button onClick={exitSelectMode} style={{ padding: '8px 16px', background: '#888', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>離開選取模式</button>
            ) : (
              <button onClick={() => setSelectMode(true)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>進入選取模式</button>
            )}
            {selectMode && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px #f4433622',
                padding: '12px 32px',
                fontWeight: 'bold',
                fontSize: 18,
                color: '#f44336',
                border: '1px solid #bbb',
                width: 'fit-content',
                minWidth: 320
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 22 }}>🟦</span>
                  <span style={{ color: '#333', fontWeight: 600 }}>已選取</span>
                  <span style={{ fontSize: 22, color: '#d32f2f', margin: '0 2px' }}>{selectedSlots.length}</span>
                  <span style={{ color: '#333', fontWeight: 600 }}>格</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 22 }}>👤</span>
                  <span style={{ color: '#333', fontWeight: 600 }}>人數</span>
                  <span style={{ fontSize: 22, color: '#1976d2', margin: '0 2px' }}>{totalPeople}</span>
                  <span style={{ color: '#333', fontWeight: 600 }}>人</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 22 }}>👥</span>
                  <span style={{ color: '#333', fontWeight: 600 }}>組數</span>
                  <span style={{ fontSize: 22, color: '#9c27b0', margin: '0 2px' }}>{totalGroups}</span>
                  <span style={{ color: '#333', fontWeight: 600 }}>組</span>
                </span>
              </div>
            )}
          </div>
          {/* Divider below select mode section */}
          <div style={{ height: 1, background: '#eee', margin: '0 0 16px 0' }} />
          {/* Calendar Grid with Time Column (Weekly View) */}
          {calendarView === 'week' && (
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
                        const isSelected = isSlotSelected(rowIdx, colIdx);
                        const cellStyle: React.CSSProperties = {
                          flex: 1,
                          border: isSelected ? '2px solid #f44336' : '1px solid #e0e0e0',
                          background: isSelected ? '#fff5f5' : '#fff',
                          padding: 4,
                          overflow: 'auto',
                          height: '100%',
                          position: 'relative',
                          cursor: selectMode ? 'pointer' : 'default',
                          boxShadow: isSelected ? '0 0 0 2px #f4433633' : undefined,
                        };
                        return (
                          <div
                            key={colIdx + '-' + rowIdx}
                            style={cellStyle}
                            onClick={() => handleSlotClick(rowIdx, colIdx)}
                            onMouseDown={() => handleSlotMouseDown(rowIdx, colIdx)}
                            onMouseEnter={() => handleSlotMouseEnter(rowIdx, colIdx)}
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
          )}
          {/* Monthly View */}
          {calendarView === 'month' && (() => {
            // Prepare monthly chart data by summing business period customers for each day
            const monthlyChartData = monthlyPeriodData.map(d => ({
              day: d.day,
              totalCustomers: d.periods.reduce((sum, p) => sum + p.customers, 0)
            }));
            const maxCustomers = Math.max(...monthlyChartData.map(d => d.totalCustomers), 0);
            // Y-axis ticks: every 50 up to maxCustomers rounded up to next 50
            const yMax = Math.ceil((maxCustomers + 10) / 50) * 50;
            const yTicks = Array.from({ length: Math.floor(yMax / 50) + 1 }, (_, i) => i * 50);
            return (
              <div style={{ fontSize: 12, background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0', padding: 8, display: 'flex', flexDirection: 'column' }}>
                {/* Month weekday headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e0e0e0', marginBottom: 4 }}>
                  {['週日', '週一', '週二', '週三', '週四', '週五', '週六'].map((d, i) => (
                    <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', padding: 6, background: '#fafafa', color: '#333' }}>{d}</div>
                  ))}
                </div>
                {/* Month grid: 6 rows x 7 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: 2, maxHeight: 520, overflowY: 'auto' }}>
                  {Array.from({ length: 42 }).map((_, idx) => {
                    const day = idx + 1 <= 30 ? idx + 1 : '';
                    const periodData = typeof day === 'number' ? monthlyPeriodData[day - 1] : null;
                    const periods = periodData ? periodData.periods : [
                      { label: '午餐', customers: 0, groups: 0 },
                      { label: '晚餐', customers: 0, groups: 0 },
                      { label: '宵夜', customers: 0, groups: 0 },
                    ];
                    // Demo: random available tables, total = 5
                    const totalTables = 5;
                    const availableTables = day ? Math.floor(Math.random() * (totalTables + 1)) : 0;
                    const isFull = availableTables === 0 && day;
                    return (
                      <div key={idx} style={{ minHeight: 80, border: '1px solid #e0e0e0', background: '#fff', borderRadius: 4, padding: 6, position: 'relative', opacity: day ? 1 : 0.3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                        {/* Date and table availability on the same line */}
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontWeight: 'bold', color: '#888', fontSize: 14 }}>{day}</span>
                          {day && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span style={{ fontWeight: 'bold', fontSize: 15, color: isFull ? '#f44336' : '#888' }}>{availableTables}/{totalTables}</span>
                              <span style={{ color: isFull ? '#f44336' : '#888', fontWeight: 'bold', fontSize: 14, border: isFull ? '1px solid #f44336' : '1px solid #bbb', borderRadius: 4, padding: '0 4px', background: isFull ? '#fff0f0' : '#fafafa' }}>{isFull ? '滿' : '可'}</span>
                            </span>
                          )}
                        </div>
                        {/* Business period info */}
                        {day && (
                          <div style={{ width: '100%', marginTop: 2 }}>
                            {periods.map((p, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#555', marginBottom: 1, justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600, color: '#888', minWidth: 32 }}>{p.label}</span>
                                <span style={{ color: '#1976d2', fontWeight: 600 }}>{p.customers}人</span>
                                <span style={{ color: '#9c27b0', fontWeight: 600 }}>{p.groups}組</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Design2; 