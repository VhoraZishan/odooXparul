import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login success
    navigate('/');
  };

  return (
    <div className="auth-container" style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at top right, rgba(255, 87, 51, 0.05), transparent), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.05), transparent)'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ width: '100%', maxWidth: '480px', padding: '48px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin 
              ? 'Enter your details to access your travel plans.' 
              : 'Join Wanderly to start organizing your personalized trips.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <>
              <div className="input-group" style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Full Name" style={{ width: '100%', paddingLeft: '48px' }} required />
              </div>
              <div className="input-group" style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="tel" placeholder="Phone Number" style={{ width: '100%', paddingLeft: '48px' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="City" style={{ width: '100%', paddingLeft: '48px' }} required />
                </div>
                <div className="input-group" style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Country" style={{ width: '100%', paddingLeft: '48px' }} required />
                </div>
              </div>
            </>
          )}

          <div className="input-group" style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="email" placeholder="Email Address" style={{ width: '100%', paddingLeft: '48px' }} required />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="password" placeholder="Password" style={{ width: '100%', paddingLeft: '48px' }} required />
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '500' }}>Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '16px', fontSize: '16px', width: '100%', marginTop: '10px' }}>
            {isLogin ? 'Login' : 'Sign Up'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', color: 'var(--primary)', fontWeight: '600', padding: 0 }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
