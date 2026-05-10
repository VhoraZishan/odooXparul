import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, DollarSign, Info, ArrowRight, Save, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const BuildItineraryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sections, setSections] = useState([
    { id: 1, info: '', dateRange: '', budget: '' }
  ]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), info: '', dateRange: '', budget: '' }]);
  };

  const removeSection = (sectionId) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  const updateSection = (sectionId, field, value) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    // Simulate save
    navigate(`/trip/${id || 1}`);
  };

  return (
    <div className="build-itinerary-container" style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '60px 0' }}>
      <div className="container">
        
        <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Build Your <span className="text-gradient">Itinerary</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Break down your trip into manageable sections, stops, or chapters.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '99px', fontWeight: '600' }}>Cancel</button>
            <button onClick={handleSave} className="btn-primary" style={{ padding: '12px 32px' }}>
              <Save size={18} /> Save Plan
            </button>
          </div>
        </header>

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
                    <h3 style={{ fontSize: '20px' }}>Section {index + 1}</h3>
                  </div>
                  {sections.length > 1 && (
                    <button 
                      onClick={() => removeSection(section.id)}
                      style={{ background: 'none', color: '#EF4444', padding: '8px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Info / Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Information & Activities
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Info size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                      <textarea 
                        placeholder="Detail the necessary information about this section. E.g. travel, hotels, or specific activities..."
                        style={{ width: '100%', minHeight: '100px', padding: '16px 16px 16px 48px', borderRadius: '12px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                        value={section.info}
                        onChange={(e) => updateSection(section.id, 'info', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Date Range */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Date Range
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="e.g. June 1 - June 5"
                          style={{ width: '100%', paddingLeft: '48px' }}
                          value={section.dateRange}
                          onChange={(e) => updateSection(section.id, 'dateRange', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Section Budget
                      </label>
                      <div style={{ position: 'relative' }}>
                        <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="e.g. $800"
                          style={{ width: '100%', paddingLeft: '48px' }}
                          value={section.budget}
                          onChange={(e) => updateSection(section.id, 'budget', e.target.value)}
                        />
                      </div>
                    </div>
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
            <Plus size={24} />
            Add another Section
          </motion.button>

        </div>
      </div>
    </div>
  );
};

export default BuildItineraryPage;
