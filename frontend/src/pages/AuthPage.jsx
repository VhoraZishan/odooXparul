import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { fetchAPI } from '../api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    city: '',
    country: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            email: formData.email, 
            password: formData.password,
            full_name: formData.full_name,
            phone: formData.phone || undefined,
            city: formData.city || undefined,
            country: formData.country || undefined
          };

      const data = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Save token to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user_id);
      
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          {!isLogin && (
            <>
              <div className="input-group" style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} style={{ width: '100%', paddingLeft: '48px' }} required />
              </div>
              <div className="input-group" style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', paddingLeft: '48px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} style={{ width: '100%', paddingLeft: '48px' }} />
                </div>
                <div className="input-group" style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} style={{ width: '100%', paddingLeft: '48px' }} />
                </div>
              </div>
            </>
          )}

          <div className="input-group" style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} style={{ width: '100%', paddingLeft: '48px' }} required />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} style={{ width: '100%', paddingLeft: '48px' }} required />
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '500' }}>Forgot Password?</a>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '16px', fontSize: '16px', width: '100%', marginTop: '10px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
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
