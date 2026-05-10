import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    checkAuth();
    navigate('/auth');
  };

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
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', fontWeight: '500' }}>
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create-trip" style={{ color: 'var(--primary)' }}>Plan Trip</Link>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                color: 'var(--primary)'
              }}>
                <User size={18} />
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px', cursor: 'pointer', border: 'none' }}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
