import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, List, ChevronDown, Plus, 
  MapPin, Star, DollarSign, Clock, Check, Info
} from 'lucide-react';

const DiscoveryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('cities'); // 'cities' or 'activities'
  const [addedItems, setAddedItems] = useState([]);

  const cities = [
    { id: 'c1', name: 'Paris', country: 'France', cost: '$$$', popularity: 4.9, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 'c2', name: 'Tokyo', country: 'Japan', cost: '$$$', popularity: 4.8, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 'c3', name: 'Bali', country: 'Indonesia', cost: '$', popularity: 4.7, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 'c4', name: 'Rome', country: 'Italy', cost: '$$', popularity: 4.9, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400&h=250' },
  ];

  const activities = [
    { id: 'a1', name: 'Paragliding in Swiss Alps', type: 'Adventure', cost: '$$', duration: '3 hrs', popularity: 4.9, img: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 'a2', name: 'Sushi Making Workshop', type: 'Food', cost: '$', duration: '2 hrs', popularity: 4.6, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 'a3', name: 'Eiffel Tower Night Tour', type: 'Sightseeing', cost: '$$', duration: '1.5 hrs', popularity: 4.8, img: 'https://images.unsplash.com/photo-1543349689-9a4d426bee87?auto=format&fit=crop&q=80&w=400&h=250' },
    { id: 'a4', name: 'Desert Safari', type: 'Adventure', cost: '$$', duration: '6 hrs', popularity: 4.7, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=250' },
  ];

  const handleAddItem = (id) => {
    if (!addedItems.includes(id)) {
      setAddedItems([...addedItems, id]);
    } else {
      setAddedItems(addedItems.filter(item => item !== id));
    }
  };

  const filteredItems = (activeTab === 'cities' ? cities : activities).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.country && item.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '40px 0', minHeight: 'calc(100vh - 80px)', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Search Header */}
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder={activeTab === 'cities' ? "Search for cities (e.g. Paris, Tokyo)..." : "Search for activities (e.g. Paragliding)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '16px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
              />
            </div>
            <button className="btn-secondary" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <List size={18} /> Group by <ChevronDown size={14} />
            </button>
            <button className="btn-secondary" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <Filter size={18} /> Filter <ChevronDown size={14} />
            </button>
            <button className="btn-secondary" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              Sort by <ChevronDown size={14} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', width: 'fit-content' }}>
            <button 
              onClick={() => setActiveTab('cities')}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '8px', 
                fontWeight: '600',
                background: activeTab === 'cities' ? 'white' : 'transparent',
                boxShadow: activeTab === 'cities' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                color: activeTab === 'cities' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              Cities
            </button>
            <button 
              onClick={() => setActiveTab('activities')}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '8px', 
                fontWeight: '600',
                background: activeTab === 'activities' ? 'white' : 'transparent',
                boxShadow: activeTab === 'activities' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                color: activeTab === 'activities' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              Activities
            </button>
          </div>
        </header>

        {/* Results Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px' }}>Results ({filteredItems.length})</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="card"
                  style={{ padding: '0', overflow: 'hidden', position: 'relative' }}
                >
                  <div style={{ height: '180px', position: 'relative' }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700' }}>
                      <Star size={14} fill="orange" stroke="orange" /> {item.popularity}
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '18px' }}>{item.name}</h4>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Info size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                      </div>
                    </div>
                    
                    {activeTab === 'cities' ? (
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {item.country}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> Cost: {item.cost}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><List size={14} /> {item.type}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {item.duration}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> {item.cost}</span>
                      </div>
                    )}

                    <button 
                      onClick={() => handleAddItem(item.id)}
                      className={addedItems.includes(item.id) ? "" : "btn-primary"}
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center',
                        background: addedItems.includes(item.id) ? 'var(--bg-main)' : '',
                        color: addedItems.includes(item.id) ? 'var(--text-main)' : '',
                        border: addedItems.includes(item.id) ? '1px solid var(--border)' : '',
                        padding: '12px',
                        borderRadius: '99px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {addedItems.includes(item.id) ? <Check size={18} /> : <Plus size={18} />}
                      {addedItems.includes(item.id) ? 'Added to Trip' : 'Add to Trip'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>No results found for "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} style={{ color: 'var(--primary)', background: 'transparent', fontWeight: '600', marginTop: '12px' }}>Clear search</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiscoveryPage;
