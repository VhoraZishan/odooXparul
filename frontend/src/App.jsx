import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import BuildItineraryPage from './pages/BuildItineraryPage';
import ItineraryViewPage from './pages/ItineraryViewPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/trip/:id" element={<TripDetailsPage />} />
        <Route path="/build-itinerary/:id" element={<BuildItineraryPage />} />
        <Route path="/itinerary-view/:id" element={<ItineraryViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
