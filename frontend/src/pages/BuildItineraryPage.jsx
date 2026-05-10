import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, DollarSign, Info, Save, MapPin, Clock } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const ACTIVITY_TYPES = ['sightseeing', 'food', 'transport', 'accommodation', 'adventure', 'shopping', 'cultural', 'other'];

const BuildItineraryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sections, setSections] = useState([
    { id: Date.now(), name: '', description: '', activity_type: 'sightseeing', start_time: '', end_time: '', location_address: '', cost_amount: '', cost_currency: 'USD' }
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addSection = () => {
    setSections([...sections, {
      id: Date.now(),
      name: '',
      description: '',
      activity_type: 'sightseeing',
      start_time: '',
      end_time: '',
      location_address: '',
      cost_amount: '',
      cost_currency: 'USD'
    }]);
  };

  const removeSection = (sectionId) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  const updateSection = (sectionId, field, value) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/auth');

    const invalid = sections.find(s => !s.name.trim());
    if (invalid) {
      setError('Each section must have a name.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const results = await Promise.all(
        sections.map(section => {
          const payload = {
            name: section.name,
            description: section.description || null,
            activity_type: section.activity_type || null,
            start_time: section.start_time ? new Date(section.start_time).toISOString() : null,
            end_time: section.end_time ? new Date(section.end_time).toISOString() : null,
            location_address: section.location_address || null,
            cost_amount: section.cost_amount ? parseFloat(section.cost_amount) : null,
            cost_currency: section.cost_currency || 'USD',
          };
          return fetch(`http://localhost:8000/trips/${id}/itinerary/activities`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
        })
      );

      const allOk = results.every(r => r.ok);
      if (allOk) {
        navigate(`/trip/${id}`);
      } else {
        setError('One or more activities could not be saved. Check your trip access.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '60px 0' }}>
      <div className="container">

        <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link to={`/trip/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>
              Back to Trip
            </Link>
            <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Build Your <span className="text-gradient">Itinerary</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Add activities, events, and stops to your trip.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate(`/trip/${id}`)} style={{ background: 'white', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '99px', fontWeight: '600' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '12px 32px' }}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </header>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', color: '#DC2626', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card"
                style={{ padding: '32px', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>
                      {index + 1}
                    </div>
                    <h3 style={{ fontSize: '20px' }}>Activity {index + 1}</h3>
                  </div>
                  {sections.length > 1 && (
                    <button onClick={() => removeSection(section.id)} style={{ background: 'none', color: '#EF4444', padding: '8px' }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Activity Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Info size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="e.g. Eiffel Tower Visit, Hotel Check-in, Lunch at Le Jules Verne"
                        style={{ width: '100%', paddingLeft: '48px' }}
                        value={section.name}
                        onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Type */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Type
                      </label>
                      <select
                        style={{ width: '100%', padding: '14px 20px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '16px' }}
                        value={section.activity_type}
                        onChange={(e) => updateSection(section.id, 'activity_type', e.target.value)}
                      >
                        {ACTIVITY_TYPES.map(t => (
                          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Location
                      </label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="e.g. Champ de Mars, Paris"
                          style={{ width: '100%', paddingLeft: '48px' }}
                          value={section.location_address}
                          onChange={(e) => updateSection(section.id, 'location_address', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Start Time */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Start Time
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Clock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="datetime-local"
                          style={{ width: '100%', paddingLeft: '48px' }}
                          value={section.start_time}
                          onChange={(e) => updateSection(section.id, 'start_time', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* End Time */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        End Time
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Clock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="datetime-local"
                          style={{ width: '100%', paddingLeft: '48px' }}
                          value={section.end_time}
                          onChange={(e) => updateSection(section.id, 'end_time', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                    {/* Cost */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Estimated Cost (Optional)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g. 45"
                          style={{ width: '100%', paddingLeft: '48px' }}
                          value={section.cost_amount}
                          onChange={(e) => updateSection(section.id, 'cost_amount', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Currency
                      </label>
                      <select
                        style={{ padding: '14px 20px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '16px', minWidth: '90px' }}
                        value={section.cost_currency}
                        onChange={(e) => updateSection(section.id, 'cost_currency', e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                        <option value="JPY">JPY</option>
                        <option value="AUD">AUD</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Any additional notes about this activity..."
                      style={{ width: '100%', minHeight: '80px', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical' }}
                      value={section.description}
                      onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addSection}
            style={{
              width: '100%',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--border)',
              background: 'white',
              color: 'var(--text-muted)',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '18px',
              marginTop: '12px'
            }}
          >
            <Plus size={24} /> Add Another Activity
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BuildItineraryPage;
