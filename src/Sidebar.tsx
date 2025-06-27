import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  return (
    <div style={{ width: 72, background: '#f7f7f7', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, borderRight: '1px solid #e0e0e0' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f44336', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: 24 }}>E.</div>
      <Link to="/design1" style={{ textDecoration: 'none', marginBottom: 16, width: '100%' }}>
        <div style={{ color: location.pathname === '/design1' ? '#f44336' : '#888', background: location.pathname === '/design1' ? '#fff' : 'none', borderRadius: 8, padding: '8px 0', textAlign: 'center', fontWeight: location.pathname === '/design1' ? 'bold' : 'normal', fontSize: 15 }}>Design 1</div>
      </Link>
      <Link to="/design2" style={{ textDecoration: 'none', marginBottom: 16, width: '100%' }}>
        <div style={{ color: location.pathname === '/design2' ? '#f44336' : '#888', background: location.pathname === '/design2' ? '#fff' : 'none', borderRadius: 8, padding: '8px 0', textAlign: 'center', fontWeight: location.pathname === '/design2' ? 'bold' : 'normal', fontSize: 15 }}>Design 2</div>
      </Link>
    </div>
  );
};

export default Sidebar; 