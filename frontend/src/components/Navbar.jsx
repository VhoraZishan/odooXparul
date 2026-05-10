import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      borderBottom: '1px solid var(--border)',
      padding: '16px 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="logo" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
          TRAVELOOP
        </Link>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontWeight: '500' }}>
          <Link to="/">Home</Link>
          <Link to="/build-itinerary/1">Build Itinerary</Link>
          <Link to="/itinerary-view/1">View Itinerary</Link>
          <Link to="/create-trip" style={{ color: 'var(--primary)' }}>Plan Trip</Link>
          <Link to="/auth" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
