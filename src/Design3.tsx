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

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

// Responsive styles
const getResponsiveStyles = () => {
  const isMobile = window.innerWidth < BREAKPOINTS.mobile;
  const isTablet = window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet;
  
  return {
    container: {
      height: '100vh',
      background: '#f5f5f5',
      padding: isMobile ? 8 : 16,
      fontFamily: 'sans-serif',
      overflow: 'hidden'
    },
    mainLayout: {
      display: 'flex',
      height: '100%',
      flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row'
    },
    reservationPanel: {
      marginRight: isMobile ? 0 : 24,
      marginBottom: isMobile ? 16 : 0,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'flex-start',
      width: isMobile ? '100%' : 'auto'
    },
    mainContent: {
      flex: 1,
      minWidth: 0, // Prevent flex item from overflowing
      overflow: 'hidden'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 8 : 12,
      marginBottom: 16,
      flexWrap: isMobile ? 'wrap' : 'nowrap' as 'wrap' | 'nowrap'
    },
    dateInput: {
      padding: 8,
      borderRadius: 4,
      border: '1px solid #ccc',
      width: isMobile ? '100%' : 180,
      fontSize: isMobile ? 14 : 15
    },
    viewSelect: {
      border: '1px solid #ccc',
      borderRadius: 6,
      padding: isMobile ? '6px 8px' : '4px 12px',
      fontSize: isMobile ? 14 : 15,
      color: '#333',
      minWidth: isMobile ? 80 : 'auto'
    },
    selectModeButton: {
      padding: isMobile ? '6px 12px' : '8px 16px',
      border: 'none',
      borderRadius: 4,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: isMobile ? 13 : 14,
      whiteSpace: 'nowrap' as 'nowrap'
    },
    summaryCards: {
      display: 'flex',
      gap: isMobile ? 8 : 12,
      marginBottom: 12,
      flexWrap: isMobile ? 'wrap' : 'nowrap' as 'wrap' | 'nowrap'
    },
    summaryCard: {
      background: '#fff',
      border: '1px solid #eee',
      borderRadius: 6,
      padding: isMobile ? '6px 12px' : '4px 18px',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      minWidth: isMobile ? 'calc(50% - 4px)' : 80,
      flex: isMobile ? '1 1 calc(50% - 4px)' : '0 0 auto'
    },
         calendarContainer: {
       display: 'flex',
       fontSize: isMobile ? 10 : 12,
       minHeight: 0,
       height: isMobile ? 'calc(100vh - 400px)' : 'calc(100vh - 260px)',
       overflowY: 'auto' as 'auto',
       background: '#fff',
       borderRadius: 8,
       border: '1px solid #e0e0e0'
     },
    timeColumn: {
      width: isMobile ? 48 : 64,
      minWidth: isMobile ? 48 : 64
    },
    weekdayHeader: {
      flex: 1,
      textAlign: 'center' as 'center',
      fontWeight: 'bold',
      padding: isMobile ? 1 : 2,
      fontSize: isMobile ? 11 : 12
    },
    summaryRow: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      background: '#fafafa',
      borderBottom: '1px solid #e0e0e0',
      fontSize: isMobile ? 11 : 13
    },
    summaryCell: {
      flex: 1,
      textAlign: 'center' as 'center',
      display: 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? 8 : 16,
      padding: isMobile ? '1px 0' : '2px 0',
      minHeight: isMobile ? 24 : 32
    },
    timeRow: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      height: isMobile ? 60 : 100,
      minHeight: isMobile ? 60 : 100
    },
    timeLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      borderRight: '1px solid #e0e0e0',
      height: '100%',
      fontSize: isMobile ? 10 : 12
    },
    calendarCell: {
      flex: 1,
      border: '1px solid #e0e0e0',
      padding: isMobile ? 2 : 4,
      overflow: 'auto',
      height: '100%',
      position: 'relative' as 'relative',
      cursor: 'pointer',
      fontSize: isMobile ? 10 : 12
    }
  };
};

const Design3 = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState('5/19');
  const [showPeriodSummary, setShowPeriodSummary] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<{ row: number; col: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dailyData = dailyDataMap[selectedDay] || dailyDataMap['5/19'];
  const [calendarView, setCalendarView] = useState<'week' | 'month' | 'day'>('week');
  const [reservationPanelOpen, setReservationPanelOpen] = useState(false);
  const [reservationPanelMode, setReservationPanelMode] = useState<'create' | 'view'>('view');
  const [reservationSelectedInfo, setReservationSelectedInfo] = useState<{ day?: string; date?: string; time?: string }>({});

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

  // Synchronized weekly data: 7 days x 13 time slots, each with a customer count
  const [weeklyCustomerData] = useState(() =>
    Array.from({ length: 13 }, () =>
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 27))
    )
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

  // Handle row (time slot) selection
  const handleRowClick = (row: number) => {
    if (!selectMode) return;
    const allSlotsInRow = Array.from({ length: 7 }, (_, col) => ({ row, col }));
    const isRowSelected = allSlotsInRow.every(slot => isSlotSelected(slot.row, slot.col));
    
    setSelectedSlots(prev => {
      if (isRowSelected) {
        // Remove all slots in this row
        return prev.filter(s => s.row !== row);
      } else {
        // Add all slots in this row (remove existing ones first to avoid duplicates)
        const withoutRow = prev.filter(s => s.row !== row);
        return [...withoutRow, ...allSlotsInRow];
      }
    });
  };

  // Handle column (day) selection
  const handleColumnClick = (col: number) => {
    if (!selectMode) return;
    const allSlotsInColumn = Array.from({ length: 13 }, (_, row) => ({ row, col }));
    const isColumnSelected = allSlotsInColumn.every(slot => isSlotSelected(slot.row, slot.col));
    
    setSelectedSlots(prev => {
      if (isColumnSelected) {
        // Remove all slots in this column
        return prev.filter(s => s.col !== col);
      } else {
        // Add all slots in this column (remove existing ones first to avoid duplicates)
        const withoutColumn = prev.filter(s => s.col !== col);
        return [...withoutColumn, ...allSlotsInColumn];
      }
    });
  };

  // Check if entire row is selected
  const isRowSelected = (row: number) => {
    return Array.from({ length: 7 }, (_, col) => ({ row, col })).every(slot => isSlotSelected(slot.row, slot.col));
  };

  // Check if entire column is selected
  const isColumnSelected = (col: number) => {
    return Array.from({ length: 13 }, (_, row) => ({ row, col })).every(slot => isSlotSelected(slot.row, slot.col));
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

  // State for pre-order popup
  const [preOrderOpen, setPreOrderOpen] = useState(false);
  const [preOrderPeriod, setPreOrderPeriod] = useState('全天');

  const mealPeriods = [
    { label: '午餐', value: 'lunch', time: '11:00-14:00' },
    { label: '晚餐', value: 'dinner', time: '17:30-20:00' },
    { label: '宵夜', value: 'late', time: '20:00-22:00' },
    { label: '全天', value: 'all', time: '' },
  ];
  // Mock data: each meal has a qty for each period
  const preOrderMeals = [
    { name: '炙燒干貝', lunch: 4, dinner: 6, late: 2 },
    { name: '低溫雞胸', lunch: 2, dinner: 3, late: 3 },
    { name: '無酒精紅酒', lunch: 1, dinner: 2, late: 2 },
    { name: '香煎鮑魚', lunch: 8, dinner: 7, late: 5 },
    { name: '蒜香義大利麵', lunch: 4, dinner: 5, late: 3 },
    { name: '焗烤蘑菇', lunch: 2, dinner: 3, late: 2 },
  ];

  // Floating summary for selection mode
  const [showPreOrderDetail, setShowPreOrderDetail] = useState(false);
  // Mock menu items
  const mockMenuItems = [
    { name: '炙りホタテ', key: 'scallop' },
    { name: '低温調理鶏胸肉', key: 'chicken' },
    { name: 'ノンアルコール赤ワイン', key: 'wine' },
    { name: 'アワビのソテー', key: 'abalone' },
    { name: 'ガーリックパスタ', key: 'pasta' },
    { name: 'マッシュルームのグラタン', key: 'mushroom' },
  ];
  // Mock function to get random pre-order meal counts for a cell
  function getMockPreOrderForCell(row: number, col: number): Record<string, number> {
    // Use row and col to generate deterministic mock data
    return {
      scallop: ((row + 1) * (col + 2)) % 3,
      chicken: ((row + 2) * (col + 1)) % 2,
      wine: ((row + 3) * (col + 1)) % 2,
      abalone: ((row + 2) * (col + 3)) % 4,
      pasta: ((row + 1) * (col + 4)) % 3,
      mushroom: ((row + 2) * (col + 2)) % 2,
    };
  }
  // Calculate summary for selected cells
  let statTotalCustomers = 0;
  let statTotalGroups = 0;
  let statTotalPreOrder = 0;
  let statMenuItemTotals: { [key: string]: number } = { scallop: 0, chicken: 0, wine: 0, abalone: 0, pasta: 0, mushroom: 0 };
  selectedSlots.forEach(({ row, col }) => {
    // Mock: customers/groups
    const customers = Math.floor(((row + 1) * (col + 2)) % 5) * 4 + 1;
    const groups = Math.floor(customers / 4) + 1;
    statTotalCustomers += customers;
    statTotalGroups += groups;
    // Mock: pre-order meals
    const preOrder: Record<string, number> = getMockPreOrderForCell(row, col);
    Object.keys(preOrder).forEach((key: string) => {
      statMenuItemTotals[key] += preOrder[key];
      statTotalPreOrder += preOrder[key];
    });
  });

  // Replace weekNotes and notesModalOpen with editable state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState([
    'Sunday: Prep for brunch event',
    'Monday: Deep clean kitchen',
    'Tuesday: Staff meeting at 3pm',
    'Wednesday: New menu trial',
    'Thursday: Inventory check',
    'Friday: Birthday party reservation',
    'Saturday: Live music night',
  ]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValue(notes[idx]);
  };
  const handleSave = () => {
    if (editIdx !== null) {
      setNotes(prev => prev.map((n, i) => i === editIdx ? editValue : n));
      setEditIdx(null);
      setEditValue('');
    }
  };
  const handleCancel = () => {
    setEditIdx(null);
    setEditValue('');
  };
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div style={getResponsiveStyles().container}>
      <div style={getResponsiveStyles().mainLayout}>
        {/* Reservation Panel (left) */}
        <div style={getResponsiveStyles().reservationPanel}>
          <button
            onClick={() => setReservationPanelOpen(v => !v)}
            style={{ marginBottom: 8, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6, padding: '6px 18px', fontWeight: 600, color: '#f44336', cursor: 'pointer', fontSize: 15 }}
          >
            {reservationPanelOpen ? '隱藏預約面板 ◀' : '顯示預約面板 ▶'}
          </button>
          {reservationPanelOpen && (
            <ReservationPanel 
              mode={reservationPanelMode}
              selectedInfo={reservationSelectedInfo}
            />
          )}
        </div>
        {/* Main Content */}
        <div style={getResponsiveStyles().mainContent}>
          {/* Date picker and view dropdown in a single row */}
          <div style={getResponsiveStyles().controlsRow}>
            <input type="date" value={selectedDate.format('YYYY-MM-DD')} onChange={e => setSelectedDate(dayjs(e.target.value))} style={getResponsiveStyles().dateInput} />
            {/* Notes icon button beside datepicker */}
            <button
              onClick={() => setNotesModalOpen(true)}
              style={{
                marginLeft: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: '#1976d2',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
              }}
              title="View All Notes"
            >
              📝
            </button>
            <label style={{ color: '#888', fontWeight: 600, marginLeft: 8 }}>檢視：</label>
            <select value={calendarView} onChange={e => setCalendarView(e.target.value as 'week' | 'month' | 'day')} style={getResponsiveStyles().viewSelect}>
              <option value="week">週</option>
              <option value="month">月</option>
              <option value="day">日</option>
            </select>
          </div>
          {/* Select Mode Button and Selected Info Section */}
          <div style={getResponsiveStyles().controlsRow}>
            {selectMode ? (
              <button onClick={exitSelectMode} style={getResponsiveStyles().selectModeButton}>離開統計模式</button>
            ) : (
              <button onClick={() => setSelectMode(true)} style={getResponsiveStyles().selectModeButton}>進入統計模式</button>
            )}
          </div>
          {/* Divider below select mode section */}
          <div style={{ height: 1, background: '#eee', margin: '0 0 16px 0' }} />
          {/* Summary for selection mode as a list */}
          {selectMode && (
            <div style={getResponsiveStyles().summaryCards}>
              <div style={getResponsiveStyles().summaryCard}>
                <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>總人數</span>
                <span style={{ color: '#f44336', fontWeight: 700, fontSize: 20 }}>{selectedSlots.length > 0 ? statTotalCustomers : '-'}</span>
              </div>
              <div style={getResponsiveStyles().summaryCard}>
                <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>總組數</span>
                <span style={{ color: '#f44336', fontWeight: 700, fontSize: 20 }}>{selectedSlots.length > 0 ? statTotalGroups : '-'}</span>
              </div>
              <div 
                style={{
                  ...getResponsiveStyles().summaryCard,
                  cursor: 'pointer',
                  position: 'relative' as 'relative'
                }}
                onClick={() => setShowPreOrderDetail(v => !v)}
              >
                <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>預點餐</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#f44336', fontWeight: 700, fontSize: 20 }}>{selectedSlots.length > 0 ? statTotalPreOrder : '-'}</span>
                  {selectedSlots.length > 0 && (
                    <span style={{ color: '#888', fontSize: 16 }}>{showPreOrderDetail ? '▲' : '▼'}</span>
                  )}
                </div>
                {showPreOrderDetail && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff', 
                    border: '1px solid #eee', 
                    borderRadius: 6, 
                    padding: '8px 12px', 
                    marginTop: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: 200
                  }}>
                    <span style={{ color: '#888', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>預點餐明細</span>
                    {mockMenuItems.map(item => (
                      <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', borderBottom: '1px solid #eee' }}>
                        <span>{item.name}</span>
                        <span style={{ fontWeight: 700, color: '#f44336' }}>{statMenuItemTotals[item.key]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Calendar Grid with Time Column (Weekly View) */}
          {calendarView === 'week' && (
            <div style={getResponsiveStyles().calendarContainer}>
              {/* Time + Grid Container */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Weekday Headers Row */}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: 64, background: '#fafafa', borderBottom: '1px solid #e0e0e0' }}></div> {/* Empty cell for time column */}
                  {["週日", "週一", "週二", "週三", "週四", "週五", "週六"].map((d, i) => {
                    const isColSelected = isColumnSelected(i);
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          flex: 1, 
                          textAlign: 'center', 
                          fontWeight: 'bold', 
                          padding: 2, 
                          background: isColSelected ? '#fff5f5' : '#fafafa', 
                          color: isColSelected ? '#f44336' : '#333',
                          cursor: selectMode ? 'pointer' : 'default',
                          borderRight: i < 6 ? '1px solid #e0e0e0' : 'none',
                          borderLeft: isColSelected ? '2px solid #f44336' : 'none',
                          borderTop: isColSelected ? '2px solid #f44336' : 'none',
                          borderBottom: isColSelected ? '2px solid #f44336' : '1px solid #e0e0e0',
                          transition: 'all 0.2s ease',
                          position: 'relative' as 'relative'
                        }}
                        onClick={() => selectMode && handleColumnClick(i)}
                        onMouseEnter={(e) => {
                          if (selectMode) {
                            e.currentTarget.style.background = isColSelected ? '#ffe8e8' : '#f0f0f0';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectMode) {
                            e.currentTarget.style.background = isColSelected ? '#fff5f5' : '#fafafa';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                        title={selectMode ? `點擊選擇 ${d}` : undefined}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative' }}>
                          {d}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Summary Row: Customers, Groups, Pre-orders */}
                <div style={getResponsiveStyles().summaryRow}>
                  <div style={{ width: 64 }}></div>
                  {[0,1,2,3,4,5,6].map((i) => {
                    // Mock data for demo
                    const customers = [26, 9, 0, 5, 9, 6, 6][i];
                    const groups = [4, 4, 0, 1, 4, 4, 4][i];
                    const preOrders = [3, 1, 0, 2, 2, 1, 2][i];
                    return (
                      <div key={i} style={getResponsiveStyles().summaryCell}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1976d2' }}><span style={{ fontSize: 16 }}>👤</span>{customers}<span style={{ fontSize: 13, color: '#888' }}>人</span></span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9c27b0' }}><span style={{ fontSize: 16 }}>👥</span>{groups}<span style={{ fontSize: 13, color: '#888' }}>組</span></span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ff9800' }}>
                          <span style={{ fontSize: 16 }}>��</span>{preOrders}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Time + Grid Rows */}
                {Array.from({ length: 13 }).map((_, rowIdx) => {
                  const hour = 8 + rowIdx;
                  const time = `${hour.toString().padStart(2, '0')}:00`;
                  // Block 14:00, 15:00, 16:00, 17:00 as non-business hours
                  const isBlocked = hour >= 14 && hour <= 17;
                  return (
                    <div key={time} style={getResponsiveStyles().timeRow}>
                      {/* Time Label */}
                      <div 
                        style={{ 
                          width: 64, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: isBlocked ? '#bbb' : (isRowSelected(rowIdx) ? '#f44336' : '#888'), 
                          fontWeight: 500, 
                          borderRight: '1px solid #e0e0e0', 
                          background: isBlocked ? '#f7f7f7' : (isRowSelected(rowIdx) ? '#fff5f5' : '#fafafa'), 
                          height: '100%', 
                          opacity: isBlocked ? 0.7 : 1,
                          cursor: selectMode && !isBlocked ? 'pointer' : 'default',
                          borderTop: isRowSelected(rowIdx) ? '2px solid #f44336' : 'none',
                          borderBottom: isRowSelected(rowIdx) ? '2px solid #f44336' : 'none',
                          borderLeft: isRowSelected(rowIdx) ? '2px solid #f44336' : 'none',
                          transition: 'all 0.2s ease',
                          position: 'relative' as 'relative'
                        }}
                        onClick={() => selectMode && !isBlocked && handleRowClick(rowIdx)}
                        onMouseEnter={(e) => {
                          if (selectMode && !isBlocked) {
                            e.currentTarget.style.background = isRowSelected(rowIdx) ? '#ffe8e8' : '#f0f0f0';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectMode && !isBlocked) {
                            e.currentTarget.style.background = isRowSelected(rowIdx) ? '#fff5f5' : '#fafafa';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                        title={selectMode && !isBlocked ? `點擊選擇 ${time} 時段` : undefined}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexDirection: 'column' as 'column' }}>
                          <span>{time}</span>
                          {selectMode && !isBlocked && (
                            <input 
                              type="checkbox" 
                              checked={isRowSelected(rowIdx)}
                              readOnly
                              style={{ 
                                width: 10, 
                                height: 10, 
                                margin: 0,
                                cursor: 'pointer',
                                accentColor: '#f44336'
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {/* Grid Cells */}
                      {Array.from({ length: 7 }).map((_, colIdx) => {
                        if (isBlocked) {
                          return (
                            <div key={colIdx + '-' + rowIdx} style={{ flex: 1, border: '1px solid #e0e0e0', background: 'repeating-linear-gradient(135deg, #fafafa, #fafafa 8px, #e0e0e0 8px, #e0e0e0 16px)', opacity: 0.7, position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#bbb', fontWeight: 'bold', fontSize: 14, pointerEvents: 'none' }}>非營業時間</span>
                            </div>
                          );
                        }
                        const maxCustomers = 26;
                        // Mock event data for demonstration
                        const eventColors = ['#673ab7', '#ff9800', '#4caf50', '#f44336']; // purple, orange, green, red
                        const eventOptions = [
                          { people: 2, groups: 2 },
                          { people: 3, groups: 1 },
                          { people: 4, groups: 4 },
                        ];
                        const randomEventLabel = () => {
                          const opt = eventOptions[Math.floor(Math.random() * eventOptions.length)];
                          return `${time} ${opt.people}人 ${opt.groups}組`;
                        };
                        // For every cell: generate up to 4 events, but only keep one per unique people count
                        let generated: { color: string; label: string }[] = [];
                        if (Math.random() > 0.5 || (rowIdx === 1 && colIdx === 0)) {
                          generated = [
                            { color: eventColors[0], label: randomEventLabel() },
                            { color: eventColors[1], label: randomEventLabel() },
                            { color: eventColors[2], label: randomEventLabel() },
                            { color: eventColors[3], label: randomEventLabel() },
                          ];
                        }
                        const seen = new Set();
                        let events: { color: string; label: string }[] = generated.filter(ev => {
                          const match = ev.label.match(/\d+人/);
                          if (!match) return true;
                          if (seen.has(match[0])) return false;
                          seen.add(match[0]);
                          return true;
                        });
                        // Calculate customers as the sum of people in the events
                        let customers = 0;
                        if (events.length > 0) {
                          if (Math.random() < 0.15) {
                            customers = maxCustomers; // 15% chance to show full
                          } else {
                            customers = events.reduce((sum, ev) => {
                              const match = ev.label.match(/(\d+)人/);
                              return sum + (match ? parseInt(match[1], 10) : 0);
                            }, 0);
                          }
                        }
                        const isFull = customers === maxCustomers;
                        const isSelected = isSlotSelected(rowIdx, colIdx);
                        const cellStyle: React.CSSProperties = {
                          flex: 1,
                          border: isSelected ? '2px solid #f44336' : '1px solid #e0e0e0',
                          background: isSelected ? '#fff5f5' : '#fff',
                          padding: 4,
                          overflow: 'auto',
                          height: '100%',
                          position: 'relative',
                          cursor: selectMode ? 'pointer' : 'pointer',
                          boxShadow: isSelected ? '0 0 0 2px #f4433633' : undefined,
                        };
                        // Day and date calculation
                        const weekDays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
                        const dayLabel = weekDays[colIdx];
                        const baseDate = selectedDate.startOf('week');
                        const cellDate = baseDate.add(colIdx, 'day');
                        const dateStr = cellDate.format('YYYY-MM-DD');
                        return (
                          <div
                            key={colIdx + '-' + rowIdx}
                            style={cellStyle}
                            onClick={() => {
                              if (selectMode) {
                                handleSlotClick(rowIdx, colIdx);
                              } else {
                                setReservationPanelOpen(true);
                                setReservationPanelMode('create');
                                setReservationSelectedInfo({
                                  day: dayLabel,
                                  date: dateStr,
                                  time: time
                                });
                              }
                            }}
                            onMouseDown={() => handleSlotMouseDown(rowIdx, colIdx)}
                            onMouseEnter={() => handleSlotMouseEnter(rowIdx, colIdx)}
                          >
                            {/* Table availability info on its own line */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 2 }}>
                              <span style={{ fontWeight: 'bold', fontSize: 15, color: isFull ? '#f44336' : '#888' }}>{customers}/{maxCustomers}</span>
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
                    // Calculate total customers for the day
                    let totalCustomers = periods.reduce((sum, p) => sum + p.customers, 0);
                    if (day && Math.random() < 0.15) {
                      totalCustomers = 26 * 3; // 3 periods x 26
                    }
                    const isFull = totalCustomers === 26 * 3 && day;
                    // Selection logic for monthly view
                    const isSelected = selectedSlots.some(s => s.row === 0 && s.col === idx);
                    return (
                      <div
                        key={idx}
                        style={{ minHeight: 80, border: isSelected ? '2px solid #f44336' : '1px solid #e0e0e0', background: isSelected ? '#fff5f5' : '#fff', borderRadius: 4, padding: 6, position: 'relative', opacity: day ? 1 : 0.3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', cursor: 'pointer' }}
                        onClick={() => {
                          if (!day) return;
                          if (selectMode) {
                            // Use row:0, col:idx for monthly selection
                            const already = selectedSlots.some(s => s.row === 0 && s.col === idx);
                            setSelectedSlots(prev => already ? prev.filter(s => !(s.row === 0 && s.col === idx)) : [...prev, { row: 0, col: idx }]);
                          } else {
                            // Open reservation panel for this day
                            setReservationPanelOpen(true);
                            setReservationPanelMode('create');
                            // Calculate the date for this cell
                            const firstOfMonth = selectedDate.startOf('month');
                            const cellDate = firstOfMonth.add(day - 1, 'day');
                            setReservationSelectedInfo({
                              day: cellDate.format('dddd'),
                              date: cellDate.format('YYYY-MM-DD'),
                              time: undefined
                            });
                          }
                        }}
                      >
                        {/* Date and customer count on the same line */}
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontWeight: 'bold', color: '#888', fontSize: 14 }}>{day}</span>
                          {day && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span style={{ fontWeight: 'bold', fontSize: 15, color: isFull ? '#f44336' : '#888' }}>{totalCustomers}/{26 * 3}</span>
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
                                <span style={{ color: '#9c27b0', fontWeight: 600 }}>{Math.floor(p.customers / 4) + 1}組</span>
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
          {/* Daily View */}
          {calendarView === 'day' && (() => {
            // Mock summary numbers
            const totalPeople = 26;
            const totalGroups = 12;
            const preOrder = 27;
            // Mock pre-order meal data
            const mealPeriods = [
              { label: '午餐', value: 'lunch', time: '11:00-14:00' },
              { label: '晚餐', value: 'dinner', time: '17:30-20:00' },
              { label: '宵夜', value: 'late', time: '20:00-22:00' },
              { label: '全天', value: 'all', time: '' },
            ];
            // Mock data: each meal has a qty for each period
            const preOrderMeals = [
              { name: '炙燒干貝', lunch: 4, dinner: 6, late: 2 },
              { name: '低溫雞胸', lunch: 2, dinner: 3, late: 3 },
              { name: '無酒精紅酒', lunch: 1, dinner: 2, late: 2 },
              { name: '香煎鮑魚', lunch: 8, dinner: 7, late: 5 },
              { name: '蒜香義大利麵', lunch: 4, dinner: 5, late: 3 },
              { name: '焗烤蘑菇', lunch: 2, dinner: 3, late: 2 },
            ];
            // Mock data for tables and hours
            const tables = [
              { label: 'B1', capacity: '1-2' },
              { label: 'B2', capacity: '1-2' },
              { label: 'B3', capacity: '1-2' },
              { label: 'B4', capacity: '1-2' },
              { label: 'B5', capacity: '3-4' },
              { label: 'B6', capacity: '3-4' },
            ];
            const hours = [14, 15, 16, 17, 18, 19];
            // Mock reservations: each is { tableIdx, hourIdx, content }
            const reservations = [
              { tableIdx: 2, hourIdx: 0, content: 'Cindy 小姐\n+886 912 345 678\n2' },
              { tableIdx: 2, hourIdx: 2, content: 'Cindy 小姐\n已保留\n2' },
              { tableIdx: 2, hourIdx: 4, content: 'Terry 小姐\n+886 912 345 678\n2' },
              { tableIdx: 3, hourIdx: 2, content: 'Cindy 小姐\n已保留\n2' },
            ];
            return (
              <>
                {/* Overall summary bar - hidden in selection mode */}
                {!selectMode && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '4px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                      <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>總人數</span>
                      <span style={{ color: '#f44336', fontWeight: 700, fontSize: 20 }}>{totalPeople}</span>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '4px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                      <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>總組數</span>
                      <span style={{ color: '#f44336', fontWeight: 700, fontSize: 20 }}>{totalGroups}</span>
                    </div>
                    <button onClick={() => setPreOrderOpen(true)} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '4px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80, cursor: 'pointer' }}>
                      <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>預點餐</span>
                      <span style={{ color: '#f44336', fontWeight: 700, fontSize: 20 }}>{preOrder}</span>
                    </button>
                  </div>
                )}
                {/* Pre-order popup/modal */}
                {preOrderOpen && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPreOrderOpen(false)}>
                    <div style={{ background: '#fff', borderRadius: 12, border: '2px solid #bbb', minWidth: 480, minHeight: 320, padding: 24, position: 'relative', boxShadow: '0 4px 24px #0002' }} onClick={e => e.stopPropagation()}>
                      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>預點餐清單</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1.5px solid #bbb' }}>
                        <thead>
                          <tr style={{ background: '#f8f8f8' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 700, fontSize: 15, borderBottom: '1.5px solid #bbb' }}>餐點名稱</th>
                            {mealPeriods.map((p, idx) => (
                              <th key={p.value} style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 700, fontSize: 15, borderBottom: '1.5px solid #bbb' }}>
                                <div style={{ lineHeight: 1.2 }}>
                                  <div>{p.label}</div>
                                  {p.time && <div style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>{p.time}</div>}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preOrderMeals.map((item, idx) => {
                            const all = (item.lunch || 0) + (item.dinner || 0) + (item.late || 0);
                            return (
                              <tr key={idx} style={{ borderBottom: idx < preOrderMeals.length - 1 ? '1px solid #eee' : 'none' }}>
                                <td style={{ padding: '8px 12px', fontSize: 15 }}>{item.name}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 15 }}>{item.lunch || 0}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 15 }}>{item.dinner || 0}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 15 }}>{item.late || 0}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 15 }}>{all}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <button onClick={() => setPreOrderOpen(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
                    </div>
                  </div>
                )}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0', padding: 8, marginTop: 8 }}>
                  {/* Hours header row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', borderBottom: '1px solid #e0e0e0', minHeight: 40 }}>
                    <div></div>
                    {hours.map((h, i) => {
                      const isColSelected = isColumnSelected(i);
                      return (
                        <div 
                          key={i} 
                          style={{ 
                            textAlign: 'center', 
                            fontWeight: 'bold', 
                            fontSize: 15, 
                            padding: 8,
                            background: isColSelected ? '#fff5f5' : '#fafafa',
                            color: isColSelected ? '#f44336' : '#333',
                            cursor: selectMode ? 'pointer' : 'default',
                            borderLeft: isColSelected ? '2px solid #f44336' : 'none',
                            borderTop: isColSelected ? '2px solid #f44336' : 'none',
                            borderRight: isColSelected ? '2px solid #f44336' : 'none',
                            transition: 'all 0.2s ease',
                            position: 'relative' as 'relative'
                          }}
                          onClick={() => selectMode && handleColumnClick(i)}
                          onMouseEnter={(e) => {
                            if (selectMode) {
                              e.currentTarget.style.background = isColSelected ? '#ffe8e8' : '#f0f0f0';
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectMode) {
                              e.currentTarget.style.background = isColSelected ? '#fff5f5' : '#fafafa';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                          title={selectMode ? `點擊選擇 ${h}:00 時段` : undefined}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            {h}:00
                            {selectMode && (
                              <input 
                                type="checkbox" 
                                checked={isColSelected}
                                readOnly
                                style={{ 
                                  width: 12, 
                                  height: 12, 
                                  margin: 0,
                                  cursor: 'pointer',
                                  accentColor: '#f44336'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Table rows */}
                  {tables.map((table, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', borderBottom: rowIdx < tables.length - 1 ? '1px solid #e0e0e0' : 'none', minHeight: 80 }}>
                      {/* Table label and capacity */}
                      <div 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          background: isRowSelected(rowIdx) ? '#fff5f5' : '#fafafa', 
                          borderRight: '1px solid #e0e0e0', 
                          fontWeight: 'bold', 
                          fontSize: 15, 
                          color: isRowSelected(rowIdx) ? '#f44336' : '#333', 
                          height: '100%',
                          cursor: selectMode ? 'pointer' : 'default',
                          borderTop: isRowSelected(rowIdx) ? '2px solid #f44336' : 'none',
                          borderBottom: isRowSelected(rowIdx) ? '2px solid #f44336' : 'none',
                          borderLeft: isRowSelected(rowIdx) ? '2px solid #f44336' : 'none',
                          transition: 'all 0.2s ease',
                          position: 'relative' as 'relative'
                        }}
                        onClick={() => selectMode && handleRowClick(rowIdx)}
                        onMouseEnter={(e) => {
                          if (selectMode) {
                            e.currentTarget.style.background = isRowSelected(rowIdx) ? '#ffe8e8' : '#f0f0f0';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectMode) {
                            e.currentTarget.style.background = isRowSelected(rowIdx) ? '#fff5f5' : '#fafafa';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                        title={selectMode ? `點擊選擇 ${table.label} 桌` : undefined}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexDirection: 'column' as 'column' }}>
                          <span>{table.label}</span>
                          <span style={{ fontWeight: 400, fontSize: 13, color: '#888' }}>{table.capacity}</span>
                          {selectMode && (
                            <input 
                              type="checkbox" 
                              checked={isRowSelected(rowIdx)}
                              readOnly
                              style={{ 
                                width: 10, 
                                height: 10, 
                                margin: 0,
                                cursor: 'pointer',
                                accentColor: '#f44336'
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {/* Reservation cells */}
                      {hours.map((_, colIdx) => {
                        const res = reservations.find(r => r.tableIdx === rowIdx && r.hourIdx === colIdx);
                        const hourTime = hours[colIdx] + ':00';
                        return (
                          <div
                            key={colIdx}
                            style={{ 
                              borderRight: colIdx < hours.length - 1 ? '1px solid #e0e0e0' : 'none', 
                              minHeight: 80, 
                              position: 'relative', 
                              background: isSlotSelected(rowIdx, colIdx) ? '#fff5f5' : '#fff', 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              justifyContent: 'flex-start', 
                              padding: 4, 
                              cursor: 'pointer',
                              border: isSlotSelected(rowIdx, colIdx) ? '2px solid #f44336' : '1px solid #e0e0e0',
                              boxShadow: isSlotSelected(rowIdx, colIdx) ? '0 0 0 2px #f4433633' : undefined
                            }}
                            onClick={() => {
                              if (selectMode) {
                                handleSlotClick(rowIdx, colIdx);
                              } else {
                                setReservationPanelOpen(true);
                                setReservationPanelMode('create');
                                setReservationSelectedInfo({
                                  day: selectedDate.format('dddd'),
                                  date: selectedDate.format('YYYY-MM-DD'),
                                  time: hourTime + ' ' + table.label
                                });
                              }
                            }}
                            onMouseDown={() => handleSlotMouseDown(rowIdx, colIdx)}
                            onMouseEnter={() => handleSlotMouseEnter(rowIdx, colIdx)}
                          >
                            {res && (
                              <div style={{ background: '#f5f5f5', borderRadius: 8, border: '1.5px solid #4caf50', boxShadow: '0 2px 8px #0001', padding: 8, minWidth: 120, fontSize: 14, color: '#222', fontWeight: 500, whiteSpace: 'pre-line' }}>
                                {res.content}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
      {/* Notes Modal */}
      {notesModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setNotesModalOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 12, border: '2px solid #bbb', minWidth: 640, maxWidth: '90vw', maxHeight: '90vh', padding: 16, position: 'relative', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Weekly Notes</span>
              <button onClick={() => setNotesModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: '#888', cursor: 'pointer', marginLeft: 8 }} title="Close">&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: 400 }}>
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fafafa',
                    border: editIdx === idx ? '2px solid #f44336' : '1px solid #eee',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #0001',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    transition: 'border 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 4 }}>{weekDays[idx]}</div>
                  {editIdx === idx ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, color: '#1976d2' }}>{weekDays[idx]}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={handleSave} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 16px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                          <button onClick={handleCancel} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '4px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                      <textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        style={{ 
                          width: '100%', 
                          minHeight: 48, 
                          fontSize: 15, 
                          borderRadius: 4, 
                          border: '1px solid #ccc', 
                          padding: 8, 
                          resize: 'vertical',
                          outline: 'none'
                        }}
                        autoFocus
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 4 }}>{weekDays[idx]}</div>
                      <div style={{ fontSize: 15, color: '#333', whiteSpace: 'pre-line', minHeight: 32 }}>{note}</div>
                    </>
                  )}
                  {editIdx !== idx && (
                    <button
                      onClick={() => handleEdit(idx)}
                      style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: 16, fontWeight: 600, marginTop: 4 }}
                      title="Edit Note"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Design3; 