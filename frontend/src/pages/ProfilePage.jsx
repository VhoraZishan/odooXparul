import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Globe, Trash2, Camera, 
  MapPin, Calendar, ArrowRight, Save, LogOut 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: 'Alex Wanderer',
    email: 'alex.wanderer@example.com',
    phone: '+1 (555) 000-0000',
    language: 'English',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
  });

  const [isEditing, setIsEditing] = useState(false);

  const preplannedTrips = [
    { id: 1, destination: 'Santorini, Greece', date: 'July 2025', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 2, destination: 'Kyoto, Japan', date: 'Oct 2025', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400&h=250' },
  ];

  const previousTrips = [
    { id: 3, destination: 'Paris, France', date: 'Dec 2023', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 4, destination: 'Bali, Indonesia', date: 'May 2023', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400&h=250' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save data would go here
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 80px)', background: 'var(--bg-main)' }}>
      <div className="container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}
        >
          {/* Sidebar: Profile Summary & Settings */}
          <aside>
            <motion.div variants={itemVariants} className="card" style={{ textAlign: 'center', position: 'relative', marginBottom: '32px' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: 'var(--shadow)' }}>
                <img src={userData.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  right: '0', 
                  left: '0', 
                  background: 'rgba(0,0,0,0.5)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  <Camera size={14} style={{ display: 'block', margin: '0 auto' }} />
                </button>
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{userData.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{userData.email}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isEditing ? <Save size={18} /> : <User size={18} />}
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
                <button style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '99px', 
                  background: 'transparent', 
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Language</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select style={{ 
                      width: '100%', 
                      padding: '10px 12px 10px 36px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border)',
                      fontSize: '14px',
                      background: 'white',
                      appearance: 'none'
                    }}>
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: '#EF4444', 
                  background: 'transparent', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </motion.div>
          </aside>

          {/* Main Content: Info & Trips */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Personal Information */}
            <motion.div variants={itemVariants} className="card">
              <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      value={userData.name} 
                      disabled={!isEditing}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      style={{ width: '100%', paddingLeft: '36px', background: isEditing ? 'white' : 'var(--bg-main)' }} 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      value={userData.email} 
                      disabled={!isEditing}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      style={{ width: '100%', paddingLeft: '36px', background: isEditing ? 'white' : 'var(--bg-main)' }} 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      value={userData.phone} 
                      disabled={!isEditing}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      style={{ width: '100%', paddingLeft: '36px', background: isEditing ? 'white' : 'var(--bg-main)' }} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Saved Destinations / Preplanned Trips */}
            <motion.div variants={itemVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px' }}>Preplanned Trips</h3>
                <Link to="/" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>Explore More</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {preplannedTrips.map(trip => (
                  <div key={trip.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ height: '150px', position: 'relative' }}>
                      <img src={trip.img} alt={trip.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
                        Saved
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{trip.destination}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                        <Calendar size={14} /> {trip.date}
                      </p>
                      <Link to={`/trip/${trip.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Previous Trips */}
            <motion.div variants={itemVariants}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Previous Trips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {previousTrips.map(trip => (
                  <div key={trip.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={trip.img} alt={trip.destination} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', marginBottom: '2px' }}>{trip.destination}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{trip.date}</p>
                    </div>
                    <Link to={`/trip/${trip.id}`} style={{ padding: '8px 16px', borderRadius: '99px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: '600' }}>
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </main>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
