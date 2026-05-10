import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Image as ImageIcon, Save, ArrowLeft, Video, MapPin, DollarSign } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    place: '',
    description: '',
    budgetAmount: '',
    currency: 'USD',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/auth');

    try {
      const response = await fetch('http://localhost:8000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description + (formData.place ? `\n\nIntended Destination: ${formData.place}` : ''),
          start_date: formData.startDate,
          end_date: formData.endDate,
          currency: formData.currency,
          budget_amount: formData.budgetAmount ? parseFloat(formData.budgetAmount) : null,
        })
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/trip/${data.id}`);
      } else {
        console.error("Failed to create trip");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-trip-container" style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Hero Banner Section */}
      <div style={{ 
        height: '400px', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("/images/banner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Placeholder for "Video" feel as requested */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '99px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(4px)' }}>
                <Video size={14} /> 4K Cinematic Background
            </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            Start Your Next Adventure
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Fill in the details below to create a personalized itinerary tailored to your dreams.
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="container" style={{ marginTop: '-80px', paddingBottom: '100px', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card" 
          style={{ maxWidth: '800px', margin: '0 auto', padding: '48px' }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Trip Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Trip Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer in Santorini" 
                  style={{ width: '100%', fontSize: '18px', padding: '16px 20px' }}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              {/* Select Place */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Select Place
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select 
                    style={{ 
                      width: '100%', 
                      fontSize: '16px', 
                      padding: '16px 20px 16px 48px',
                      appearance: 'none',
                      background: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                    value={formData.place}
                    onChange={(e) => setFormData({...formData, place: e.target.value})}
                    required
                  >
                    <option value="" disabled>Choose a destination...</option>
                    <option value="Paris, France">Paris, France</option>
                    <option value="Tokyo, Japan">Tokyo, Japan</option>
                    <option value="Bali, Indonesia">Bali, Indonesia</option>
                    <option value="New York, USA">New York, USA</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Santorini, Greece">Santorini, Greece</option>
                  </select>
                </div>
              </div>

              {/* Travel Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Start Date
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="date" 
                      style={{ width: '100%', paddingLeft: '48px' }}
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    End Date
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="date" 
                      style={{ width: '100%', paddingLeft: '48px' }}
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Budget */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Estimated Budget (Optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 2500"
                      style={{ width: '100%', paddingLeft: '48px', fontSize: '16px', padding: '16px 20px 16px 48px' }}
                      value={formData.budgetAmount}
                      onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})}
                    />
                  </div>
                  <select
                    style={{
                      fontSize: '16px',
                      padding: '16px 20px',
                      appearance: 'none',
                      background: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      minWidth: '90px'
                    }}
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="JPY">JPY</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                    <option value="SGD">SGD</option>
                  </select>
                </div>
              </div>


              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Trip Description
                </label>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: 'var(--text-muted)' }} />
                  <textarea 
                    placeholder="Tell us about your trip goals, places you want to visit, and what you're looking forward to most..." 
                    style={{ 
                      width: '100%', 
                      minHeight: '150px', 
                      padding: '16px 20px 16px 48px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      fontFamily: 'inherit',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Cover Photo (Optional)
                </label>
                <div style={{ 
                  border: '2px dashed var(--border)', 
                  borderRadius: '12px', 
                  padding: '40px', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <ImageIcon size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Drag and drop an image here, or <span style={{ color: 'var(--primary)', fontWeight: '600' }}>browse files</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <Link to="/" style={{ flex: 1 }}>
                  <button type="button" className="btn-secondary" style={{ width: '100%', background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '16px' }}>
                    Cancel
                  </button>
                </Link>
                <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '16px' }}>
                  <Save size={20} />
                  Save Trip
                </button>
              </div>

            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTripPage;
