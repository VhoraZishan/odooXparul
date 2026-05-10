import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    country: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateInput = () => {
    if (!formData.email.includes('@')) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin && formData.fullName.trim() === '') return 'Full name is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            phone: formData.phone || null,
            city: formData.city || null,
            country: formData.country || null
          };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Save session to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      
      // Dispatch event so other components (like Navbar) can update immediately
      window.dispatchEvent(new Event('auth-change'));
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ fullName: '', phone: '', city: '', country: '', email: '', password: '' });
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin 
              ? 'Enter your details to access your travel plans.' 
              : 'Join Wanderly to start organizing your personalized trips.'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <>
              <div className="input-group" style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" style={{ width: '100%', paddingLeft: '48px' }} required={!isLogin} />
              </div>
              <div className="input-group" style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" style={{ width: '100%', paddingLeft: '48px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" style={{ width: '100%', paddingLeft: '48px' }} />
                </div>
                <div className="input-group" style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" style={{ width: '100%', paddingLeft: '48px' }} />
                </div>
              </div>
            </>
          )}

          <div className="input-group" style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" style={{ width: '100%', paddingLeft: '48px' }} required />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" style={{ width: '100%', paddingLeft: '48px' }} required minLength="6" />
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '500' }}>Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ justifyContent: 'center', padding: '16px', fontSize: '16px', width: '100%', marginTop: '10px', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={toggleMode}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', padding: 0, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
