import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, ArrowDown, MapPin,
  ChevronRight, DollarSign, Calendar, Clock,
  Hotel, Car, Utensils, Camera, Info, ArrowLeft
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  sightseeing: <Camera size={16} />,
  food: <Utensils size={16} />,
  transport: <Car size={16} />,
  accommodation: <Hotel size={16} />,
  adventure: <Info size={16} />,
  shopping: <Info size={16} />,
  cultural: <Camera size={16} />,
  other: <Info size={16} />,
  flight: <Camera size={16} />,
};

const ItineraryViewPage = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [tripTitle, setTripTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [tripRes, itineraryRes] = await Promise.all([
          fetch(`http://localhost:8000/trips/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:8000/trips/${id}/itinerary`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (tripRes.ok) {
          const tripData = await tripRes.json();
          setTripTitle(tripData.title);
        }

        if (itineraryRes.ok) {
          const data = await itineraryRes.json();

          // Merge all itinerary items into a unified list with a type tag
          const allItems = [
            ...(data.flights || []).map(f => ({
              id: f.id,
              time: f.departure_time,
              title: `Flight: ${f.airline || ''} ${f.flight_number || ''}`.trim(),
              category: 'flight',
              cost: f.price_amount,
              currency: f.price_currency,
              location: null,
              notes: f.notes
            })),
            ...(data.transportation || []).map(t => ({
              id: t.id,
              time: t.pickup_time,
              title: `${t.type}: ${t.provider || ''}`.trim(),
              category: 'transport',
              cost: t.price_amount,
              currency: t.price_currency,
              location: t.origin_address,
              notes: t.notes
            })),
            ...(data.accommodations || []).map(a => ({
              id: a.id,
              time: a.check_in ? `${a.check_in}T12:00:00` : null,
              title: `Check-in: ${a.name}`,
              category: 'accommodation',
              cost: a.price_amount,
              currency: a.price_currency,
              location: a.address,
              notes: a.notes
            })),
            ...(data.activities || []).map(a => ({
              id: a.id,
              time: a.start_time,
              title: a.name,
              category: a.activity_type || 'other',
              cost: a.cost_amount,
              currency: a.cost_currency,
              location: a.location_address,
              notes: a.description
            }))
          ];

          // Sort by time, items without time go at the end
          allItems.sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return new Date(a.time) - new Date(b.time);
          });

          // Group by date
          const grouped = {};
          allItems.forEach(item => {
            const dateKey = item.time ? new Date(item.time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Unscheduled';
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(item);
          });

          setItinerary(grouped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatTime = (timeStr) => {
    if (!timeStr) return 'TBD';
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredItinerary = itinerary ? Object.fromEntries(
    Object.entries(itinerary).map(([date, items]) => [
      date,
      items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || (item.location || '').toLowerCase().includes(search.toLowerCase()))
    ]).filter(([, items]) => items.length > 0)
  ) : {};

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading itinerary...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px 0' }}>
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
              placeholder="Search activities..."
              style={{ width: '100%', paddingLeft: '48px', border: 'none', background: 'var(--bg-main)', borderRadius: '99px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            to={`/build-itinerary/${id}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '99px', fontSize: '14px', fontWeight: '600' }}
          >
            Add Activities
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '48px' }}>
          <Link to={`/trip/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>
            <ArrowLeft size={14} /> Back to Trip
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '40px', fontWeight: '800', marginBottom: '8px' }}
          >
            Itinerary for <span className="text-gradient">{tripTitle || 'Your Trip'}</span>
          </motion.h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Your day-by-day activities and events.</p>
        </div>

        {/* Itinerary List */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {Object.keys(filteredItinerary).length === 0 ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>No activities yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Start building your itinerary to see your schedule here.</p>
              <Link to={`/build-itinerary/${id}`} className="btn-primary" style={{ display: 'inline-flex' }}>
                Build Itinerary
              </Link>
            </div>
          ) : (
            Object.entries(filteredItinerary).map(([date, items], dayIndex) => (
              <div key={date} style={{ marginBottom: '60px' }}>
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
                    boxShadow: '0 8px 16px rgba(255, 87, 51, 0.2)',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.8 }}>Day</span>
                    <span style={{ fontSize: '28px', fontWeight: '800' }}>{dayIndex + 1}</span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>{date}</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{items.length} {items.length === 1 ? 'activity' : 'activities'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '16px', alignItems: 'center' }}>
                        <motion.div
                          whileHover={{ x: 8 }}
                          className="card"
                          style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'none', border: '1px solid var(--border)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--primary)', background: 'rgba(255, 87, 51, 0.08)', padding: '10px', borderRadius: '10px' }}>
                              {CATEGORY_ICONS[item.category] || <Info size={16} />}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '13px' }}>{formatTime(item.time)}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '99px' }}>{item.category}</span>
                              </div>
                              <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: item.location ? '2px' : 0 }}>{item.title}</p>
                              {item.location && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={12} /> {item.location}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        </motion.div>

                        <div className="card" style={{ padding: '20px', textAlign: 'center', background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.1)', boxShadow: 'none' }}>
                          <span style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Cost</span>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                            {item.cost ? `${item.currency || 'USD'} ${parseFloat(item.cost).toLocaleString()}` : '--'}
                          </span>
                        </div>
                      </div>

                      {index < items.length - 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', width: 'calc(100% - 176px)', margin: '10px 0' }}>
                          <ArrowDown size={20} style={{ color: 'var(--border)' }} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ItineraryViewPage;
