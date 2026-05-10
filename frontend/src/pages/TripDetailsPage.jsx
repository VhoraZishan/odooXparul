import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, DollarSign, Clock, ArrowLeft, 
  ChevronRight, Utensils, Hotel, Car, Camera, Info,
  TrendingUp, Wallet, PieChart, Plus
} from 'lucide-react';

const TripDetailsPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'food' });

  useEffect(() => {
    const fetchTrip = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [tripRes, itineraryRes, budgetRes, expensesRes] = await Promise.all([
          fetch(`http://localhost:8000/trips/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:8000/trips/${id}/itinerary`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:8000/trips/${id}/billing/budget-insights`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:8000/trips/${id}/billing/expenses`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (tripRes.ok) {
          const tripData = await tripRes.json();
          const itineraryData = itineraryRes.ok ? await itineraryRes.json() : { accommodations: [], activities: [], flights: [], transportation: [] };
          const budgetData = budgetRes.ok ? await budgetRes.json() : { total_budget: 0, total_spent: 0, remaining: 0 };
          const expensesData = expensesRes.ok ? await expensesRes.json() : [];

          // Process itinerary into day-by-day format (mocking days based on data presence for simplicity)
          const allEvents = [
            ...(itineraryData.flights || []).map(f => ({ time: f.departure_time ? new Date(f.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD', title: `Flight: ${f.airline} ${f.flight_number}`, icon: <Camera size={18} />, type: 'flight' })),
            ...(itineraryData.transportation || []).map(t => ({ time: t.departure_time ? new Date(t.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD', title: `${t.type}: ${t.company}`, icon: <Car size={18} />, type: 'transport' })),
            ...(itineraryData.accommodations || []).map(a => ({ time: a.check_in ? new Date(a.check_in).toLocaleDateString() : 'TBD', title: `Check-in: ${a.name}`, icon: <Hotel size={18} />, type: 'stay' })),
            ...(itineraryData.activities || []).map(a => ({ time: a.start_time ? new Date(a.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD', title: a.name, icon: <Info size={18} />, type: 'activity' }))
          ];

          const formattedItinerary = allEvents.length > 0 ? [{
            day: 1,
            date: tripData.start_date || 'Day 1',
            events: allEvents
          }] : [{
            day: 1,
            date: tripData.start_date || 'Day 1',
            events: [{ time: '10:00 AM', title: 'Trip Start', icon: <Calendar size={18} />, type: 'activity' }]
          }];

          // Process expenses into categories
          const categoryTotals = expensesData.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
            return acc;
          }, {});

          const colors = ['#FF5733', '#EC4899', '#0EA5E9', '#F59E0B', '#8B5CF6'];
          const formattedCategories = Object.keys(categoryTotals).map((cat, index) => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            spent: categoryTotals[cat],
            color: colors[index % colors.length]
          }));

          setTrip({
            title: tripData.title,
            location: tripData.description && tripData.description.includes('Intended Destination: ') 
              ? tripData.description.split('Intended Destination: ')[1] 
              : 'Custom Destination',
            startDate: tripData.start_date || 'TBD',
            endDate: tripData.end_date || 'TBD',
            banner: '/images/paris.png',
            budget: {
              total: parseFloat(budgetData.total_budget) || 2500,
              spent: parseFloat(budgetData.total_spent) || 0,
              categories: formattedCategories.length > 0 ? formattedCategories : [
                { name: 'Uncategorized', spent: 0, color: '#FF5733' }
              ]
            },
            itinerary: formattedItinerary
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrip();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/trips/${id}/billing/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
          currency: 'USD',
          category: newExpense.category,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (res.ok) {
        setShowExpenseForm(false);
        setNewExpense({ title: '', amount: '', category: 'food' });
        // Refresh the page data by simply calling window.location.reload() or triggering the fetch again
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!trip) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading trip details...</div>;
  }

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '24px', opacity: 0.9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} /> {trip.startDate} - {trip.endDate}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  to={`/itinerary-view/${id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '99px', fontWeight: '600', fontSize: '14px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  View Itinerary
                </Link>
                <Link
                  to={`/build-itinerary/${id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '99px', fontWeight: '600', fontSize: '14px' }}
                >
                  Build Itinerary
                </Link>
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
                      <Link to={`/itinerary-view/${id}`} key={j} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <motion.div whileHover={{ x: 4 }} className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', boxShadow: 'none' }}>
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
                        </motion.div>
                      </Link>
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
                <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>
                  {trip.budget.total > 0 
                    ? `$${(trip.budget.total - trip.budget.spent).toLocaleString()}`
                    : 'No budget set'}
                </p>
                {trip.budget.total > 0 && (
                  <p style={{ fontSize: '12px', fontWeight: '600', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', padding: '4px 12px', borderRadius: '99px', display: 'inline-block', marginTop: '12px' }}>
                    {Math.round((trip.budget.spent / trip.budget.total) * 100)}% of budget used
                  </p>
                )}
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
                        animate={{ width: `${trip.budget.total > 0 ? Math.min((cat.spent / trip.budget.total) * 100, 100) : 0}%` }}
                        style={{ height: '100%', background: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowExpenseForm(!showExpenseForm)} 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '32px', justifyContent: 'center' }}
              >
                <Wallet size={18} /> {showExpenseForm ? 'Cancel' : 'Add Expense'}
              </button>

              {showExpenseForm && (
                <form onSubmit={handleAddExpense} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dinner at Louvre"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                      value={newExpense.title}
                      onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</label>
                      <select 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      >
                        <option value="stay">Stay</option>
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="fun">Fun</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '14px' }}>
                    Save Expense
                  </button>
                </form>
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
