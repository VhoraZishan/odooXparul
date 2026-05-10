import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, DollarSign, ArrowRight, TrendingUp, Compass, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const recentTrips = [
    { id: 1, title: 'Summer in Europe', date: 'June 2025', budget: '$2,500', status: 'Upcoming', color: '#FF5733' },
    { id: 2, title: 'Tokyo Exploration', date: 'April 2025', budget: '$3,200', status: 'Ongoing', color: '#EC4899' },
    { id: 3, title: 'Bali Relaxation', date: 'December 2024', budget: '$1,800', status: 'Completed', color: '#0EA5E9' },
  ];

  const recommendations = [
    { id: 1, city: 'Paris', country: 'France', img: '/images/paris.png', price: '$1,200+' },
    { id: 2, city: 'Tokyo', country: 'Japan', img: '/images/tokyo.png', price: '$1,500+' },
    { id: 3, city: 'Bali', country: 'Indonesia', img: '/images/bali.png', price: '$800+' },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '40px 0', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Welcome Section */}
        <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: '36px', marginBottom: '8px' }}
            >
              Welcome back, <span className="text-gradient">Traveler!</span>
            </motion.h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Where will your next adventure take you?</p>
          </div>
          <Link to="/create-trip">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary" 
              style={{ fontSize: '16px', padding: '16px 32px' }}
            >
              <Plus size={20} />
              Plan New Trip
            </motion.button>
          </Link>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Recent Trips */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px' }}>Recent Trips</h3>
                <a href="#" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View all <ArrowRight size={16} />
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {recentTrips.map((trip, i) => (
                  <Link to={`/trip/${trip.id}`} key={trip.id}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card"
                      style={{ padding: '24px', position: 'relative', overflow: 'hidden', height: '100%', cursor: 'pointer' }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: trip.color }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px', background: `${trip.color}15`, color: trip.color }}>
                          {trip.status}
                        </span>
                        <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <h4 style={{ fontSize: '20px', marginBottom: '12px' }}>{trip.title}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={14} /> {trip.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DollarSign size={14} /> {trip.budget}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recommended Destinations */}
            <section>
              <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Recommended for you</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                {recommendations.map((dest, i) => (
                  <motion.div 
                    key={dest.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ 
                      height: '200px', 
                      borderRadius: 'var(--radius)', 
                      overflow: 'hidden', 
                      marginBottom: '16px',
                      position: 'relative'
                    }}>
                      <img src={dest.img} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '12px', 
                        right: '12px', 
                        background: 'rgba(255,255,255,0.9)', 
                        padding: '4px 12px', 
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--primary)'
                      }}>
                        {dest.price}
                      </div>
                    </div>
                    <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>{dest.city}, {dest.country}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <TrendingUp size={14} /> Popular this season
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Quick Actions / Budget Highlights */}
            <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #FF5733, #EC4899)', color: 'white' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Budget Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '13px' }}>Total Saved</p>
                  <p style={{ fontSize: '28px', fontWeight: '800' }}>$12,450</p>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}>
                  <div style={{ width: '65%', height: '100%', background: 'white', borderRadius: '2px' }} />
                </div>
                <p style={{ fontSize: '13px' }}>65% of your global travel goal</p>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Inspiration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255, 87, 51, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Compass size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>Hidden Gems in Italy</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Read curated guide</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>Community Favorites</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top 10 summer spots</p>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
