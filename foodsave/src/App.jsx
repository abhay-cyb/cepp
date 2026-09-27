import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ExpiryTracker from './pages/ExpiryTracker';
import Leftovers from './pages/Leftovers';
import MealPlanner from './pages/MealPlanner';
import Reports from './pages/Reports';
import Tips from './pages/Tips';
import { getCurrentUser } from './utils/db';

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tips" element={<Tips />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/expiry-tracker" element={<ProtectedRoute><ExpiryTracker /></ProtectedRoute>} />
          <Route path="/leftovers" element={<ProtectedRoute><Leftovers /></ProtectedRoute>} />
          <Route path="/meal-planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
