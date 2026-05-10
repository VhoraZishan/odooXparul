import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, DollarSign, Clock, ArrowLeft, 
  ChevronRight, Utensils, Hotel, Car, Camera, Info,
  TrendingUp, Wallet, PieChart
} from 'lucide-react';

const TripDetailsPage = () => {
  const { id } = useParams();

  // Mock data for the specific trip
  const trip = {
    title: 'Summer in Europe',
    location: 'France & Italy',
    startDate: 'June 01, 2025',
    endDate: 'June 15, 2025',
    banner: '/images/paris.png',
    budget: {
      total: 2500,
      spent: 1200,
      categories: [
        { name: 'Stay', spent: 600, color: '#FF5733' },
        { name: 'Food', spent: 300, color: '#EC4899' },
        { name: 'Travel', spent: 200, color: '#0EA5E9' },
        { name: 'Fun', spent: 100, color: '#F59E0B' },
      ]
    },
    itinerary: [
      {
        day: 1,
        date: 'June 01',
        events: [
          { time: '10:00 AM', title: 'Arrival at CDG Airport', icon: <Car size={18} />, type: 'transport' },
          { time: '02:00 PM', title: 'Check-in at Hotel Plaza', icon: <Hotel size={18} />, type: 'stay' },
          { time: '07:00 PM', title: 'Dinner at Le Jules Verne', icon: <Utensils size={18} />, type: 'food' },
        ]
      },
      {
        day: 2,
        date: 'June 02',
        events: [
          { time: '09:00 AM', title: 'Eiffel Tower Tour', icon: <Camera size={18} />, type: 'activity' },
          { time: '01:00 PM', title: 'Louvre Museum Visit', icon: <Info size={18} />, type: 'activity' },
        ]
      }
    ]
  };

  return (
    <div className="trip-details-container" style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '100px' }}>
      
      {/* Dynamic Header */}
      <div style={{ 
        height: '350px', 
        position: 'relative', 
        background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url("${trip.banner}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px 0'
      }}>
        <div className="container" style={{ position: 'relative' }}>
          <Link to="/" style={{ position: 'absolute', top: '-180px', left: '0', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '600', fontSize: '14px', background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '99px', backdropFilter: 'blur(4px)' }}>
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', opacity: 0.9 }}>
              <MapPin size={18} />
              <span style={{ fontSize: '18px', fontWeight: '500' }}>{trip.location}</span>
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>{trip.title}</h1>
            <div style={{ display: 'flex', gap: '24px', opacity: 0.9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} /> {trip.startDate} - {trip.endDate}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          
          {/* Itinerary Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px' }}>Itinerary</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Day view</button>
                <button style={{ padding: '8px 16px', fontSize: '13px', background: 'white', border: '1px solid var(--border)', borderRadius: '99px' }}>List view</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {trip.itinerary.map((day, i) => (
                <motion.div 
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Day</span>
                      <span style={{ fontSize: '20px', fontWeight: '800' }}>{day.day}</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px' }}>{day.date}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Paris Arrival & Exploration</p>
                    </div>
                  </div>

                  <div style={{ borderLeft: '2px dashed var(--border)', marginLeft: '25px', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {day.events.map((event, j) => (
                      <div key={j} className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', boxShadow: 'none' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ color: 'var(--primary)', background: 'rgba(255, 87, 51, 0.1)', padding: '10px', borderRadius: '10px' }}>
                            {event.icon}
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{event.time}</p>
                            <p style={{ fontWeight: '700' }}>{event.title}</p>
                          </div>
                        </div>
                        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar / Budget & Map */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Budget Analytics */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px' }}>Budget Analysis</h3>
                <PieChart size={20} style={{ color: 'var(--text-muted)' }} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Remaining</p>
                <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>${trip.budget.total - trip.budget.spent}</p>
                <p style={{ fontSize: '12px', fontWeight: '600', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', padding: '4px 12px', borderRadius: '99px', display: 'inline-block', marginTop: '12px' }}>
                  On track to save $200
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {trip.budget.categories.map((cat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ fontWeight: '600' }}>{cat.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>${cat.spent}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.spent / trip.budget.total) * 100 * 4}%` }}
                        style={{ height: '100%', background: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: '32px', justifyContent: 'center' }}>
                <Wallet size={18} /> Add Expense
              </button>
            </div>

            {/* Travel Map Placeholder */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', height: '300px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/4.3,48.8,12,0/800x600?access_token=placeholder")',
                backgroundSize: 'cover'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)' }} />
              </div>
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: '700', fontSize: '14px' }}>Paris, France</span>
              </div>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '10px 20px', borderRadius: '99px', fontWeight: '600', fontSize: '13px', boxShadow: 'var(--shadow)' }}>
                View Full Map
              </button>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
