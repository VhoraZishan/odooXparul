import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, ArrowDown, MapPin, 
  Calendar, List, Grid, ChevronRight,
  TrendingUp, DollarSign
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const ItineraryViewPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const itineraryData = [
    {
      day: 1,
      city: 'Paris, France',
      title: 'Arrival & First Impressions',
      activities: [
        { id: 1, time: '09:00 AM', activity: 'Flight Arrival & Pickup', expense: '$45', category: 'Transport' },
        { id: 2, time: '01:00 PM', activity: 'Hotel Check-in at Plaza', expense: '$120', category: 'Stay' },
        { id: 3, time: '04:00 PM', activity: 'Local Market Exploration', expense: '$30', category: 'Physical Activity' },
      ]
    },
    {
      day: 2,
      city: 'Paris, France',
      title: 'Cultural Deep Dive',
      activities: [
        { id: 4, time: '10:00 AM', activity: 'Museum Guided Tour', expense: '$55', category: 'Physical Activity' },
        { id: 5, time: '02:00 PM', activity: 'Traditional Lunch', expense: '$40', category: 'Food' },
        { id: 6, time: '06:00 PM', activity: 'City Center Walk', expense: '$10', category: 'Physical Activity' },
      ]
    }
  ];

  return (
    <div className="itinerary-view-container" style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px 0' }}>
      <div className="container">
        
        {/* Top Control Bar */}
        <div className="card" style={{ 
          padding: '16px 24px', 
          marginBottom: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '20px',
          borderRadius: '99px'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search itinerary..." 
              style={{ width: '100%', paddingLeft: '48px', border: 'none', background: 'var(--bg-main)', borderRadius: '99px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid var(--border)', borderRadius: '99px', fontSize: '14px', fontWeight: '600' }}>
              <Filter size={16} /> Group by
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid var(--border)', borderRadius: '99px', fontSize: '14px', fontWeight: '600' }}>
              Sort by...
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '40px', fontWeight: '800', marginBottom: '12px' }}
          >
            Itinerary for <span className="text-gradient">Paris, France</span>
          </motion.h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Your curated day-by-day journey and expense tracker.</p>
        </div>


        {/* Itinerary List */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {itineraryData.map((day, i) => (
            <div key={day.day} style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '20px', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(255, 87, 51, 0.2)'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.8 }}>Day</span>
                  <span style={{ fontSize: '28px', fontWeight: '800' }}>{day.day}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '4px' }}>
                    <MapPin size={16} />
                    <span style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{day.city}</span>
                  </div>
                  <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{day.title}</h2>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={14} /> Total Daily Expense: $195</span>
                  </div>
                </div>
              </div>

              {/* Activity Blocks with Expenses */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {day.activities.map((act, index) => (
                  <React.Fragment key={act.id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '20px', alignItems: 'center' }}>
                      <motion.div 
                        whileHover={{ x: 10 }}
                        className="card" 
                        style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ minWidth: '80px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '14px', display: 'block' }}>{act.time}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{act.category}</span>
                          </div>
                          <span style={{ fontWeight: '600', fontSize: '16px' }}>{act.activity}</span>
                        </div>
                        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                      </motion.div>
                      
                      <div className="card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                        <span style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Expense</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>{act.expense}</span>
                      </div>
                    </div>
                    
                    {index < day.activities.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', width: 'calc(100% - 220px)', margin: '12px 0' }}>
                        <ArrowDown size={24} style={{ color: 'var(--border)' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ItineraryViewPage;
