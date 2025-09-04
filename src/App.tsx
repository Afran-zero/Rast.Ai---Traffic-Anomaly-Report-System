import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Layout/Navigation';
import { UserProvider } from './context/UserContext';
import { Home } from './pages/Home';
import { ReportIncident } from './pages/ReportIncident';
import { ReportMap } from './components/Map/ReportMap';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/map" element={<ReportMap />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;