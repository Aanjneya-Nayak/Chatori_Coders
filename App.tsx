
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyPantry from './pages/MyPantry';
import TasteMap from './pages/TasteMap';

// Explicitly type ProtectedRoute to accept children correctly
const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pantry" 
            element={
              <ProtectedRoute>
                <MyPantry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/taste-map" 
            element={
              <ProtectedRoute>
                <TasteMap />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
