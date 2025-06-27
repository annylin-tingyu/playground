import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Design1 from './Dashboard';
import Design2 from './Design2';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route path="/design1" element={<Design1 />} />
            <Route path="/design2" element={<Design2 />} />
            <Route path="*" element={<Navigate to="/design1" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
