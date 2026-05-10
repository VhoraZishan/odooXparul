import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Globe, Trash2, Camera, 
  Calendar, ArrowRight, Save, LogOut, Edit2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [trips, setTrips] = useState({ upcoming: [], ongoing: [], completed: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/auth'); return; }

      try {
        const [profileRes, tripsRes] = await Promise.all([
          fetch('http://localhost:8000/users/me', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8000/users/me/trips', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUserData(profile);
          setEditData({
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
          });
        } else {
          navigate('/auth');
        }

        if (tripsRes.ok) {
          setTrips(await tripsRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        const updated = await res.json();
        setUserData(updated);
        setIsEditing(false);
      } else {
        setError('Failed to save changes.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/auth');
  };

  const allTrips = [
    ...(trips.ongoing || []).map(t => ({ ...t, statusLabel: 'Ongoing', color: '#EC4899' })),
    ...(trips.upcoming || []).map(t => ({ ...t, statusLabel: 'Upcoming', color: '#FF5733' })),
    ...(trips.completed || []).map(t => ({ ...t, statusLabel: 'Completed', color: '#0EA5E9' })),
  ];

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading profile...</div>;
  }

  if (!userData) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };
  const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 80px)', background: 'var(--bg-main)' }}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}
        >
          {/* Sidebar */}
          <aside>
            <motion.div variants={itemVariants} className="card" style={{ textAlign: 'center', position: 'relative', marginBottom: '32px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: 'var(--shadow)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {userData.avatar_url
                  ? <img src={userData.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={40} style={{ color: 'var(--text-muted)' }} />
                }
              </div>
              <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>{userData.full_name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{userData.email}</p>
              {userData.bio && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', fontStyle: 'italic' }}>{userData.bio}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={saving}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                  {saving ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{ width: '100%', padding: '12px', borderRadius: '99px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: '600' }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '12px', borderRadius: '99px', background: 'transparent', border: '1px solid var(--border)', color: '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
              {error && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px' }}>{error}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Trip Summary</h3>
              {[
                { label: 'Ongoing', count: (trips.ongoing || []).length, color: '#EC4899' },
                { label: 'Upcoming', count: (trips.upcoming || []).length, color: '#FF5733' },
                { label: 'Completed', count: (trips.completed || []).length, color: '#0EA5E9' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: s.color }}>{s.count}</span>
                </div>
              ))}
            </motion.div>
          </aside>

          {/* Main Content */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Personal Info */}
            <motion.div variants={itemVariants} className="card">
              <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={isEditing ? editData.full_name : userData.full_name}
                      disabled={!isEditing}
                      onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      style={{ width: '100%', paddingLeft: '36px', background: isEditing ? 'white' : 'var(--bg-main)' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      style={{ width: '100%', paddingLeft: '36px', background: 'var(--bg-main)', color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={isEditing ? editData.phone : (userData.phone || '')}
                      disabled={!isEditing}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      style={{ width: '100%', paddingLeft: '36px', background: isEditing ? 'white' : 'var(--bg-main)' }}
                      placeholder={isEditing ? '+1 (555) 000-0000' : 'Not set'}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Member Since</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                      disabled
                      style={{ width: '100%', paddingLeft: '36px', background: 'var(--bg-main)', color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>
              </div>
              {isEditing && (
                <div style={{ marginTop: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bio</label>
                  <textarea
                    placeholder="Tell others about your travel style..."
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    style={{ width: '100%', minHeight: '80px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical' }}
                  />
                </div>
              )}
            </motion.div>

            {/* My Trips */}
            <motion.div variants={itemVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px' }}>My Trips</h3>
                <Link to="/create-trip" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>Plan New Trip</Link>
              </div>
              {allTrips.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No trips yet. Start planning your first adventure.</p>
                  <Link to="/create-trip" className="btn-primary" style={{ display: 'inline-flex' }}>Create Trip</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {allTrips.map(trip => (
                    <div key={trip.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: trip.color }} />
                      <div style={{ flex: 1, paddingLeft: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '16px' }}>{trip.title}</h4>
                          <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: `${trip.color}18`, color: trip.color }}>{trip.statusLabel}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {trip.start_date || 'Unscheduled'}
                          {trip.end_date ? ` - ${trip.end_date}` : ''}
                        </p>
                      </div>
                      <Link to={`/trip/${trip.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '14px', fontWeight: '600', flexShrink: 0 }}>
                        View <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </main>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
