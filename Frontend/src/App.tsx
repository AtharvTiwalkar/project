import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="wallet" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Wallet - Coming Soon</h2></div>} />
          <Route path="analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Analytics - Coming Soon</h2></div>} />
          <Route path="profile" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Profile - Coming Soon</h2></div>} />
          <Route path="messages" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Messages - Coming Soon</h2></div>} />
          <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Settings - Coming Soon</h2></div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;