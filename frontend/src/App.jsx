import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotificationSubscriber from './components/NotificationSubscriber'

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <div>
      <Navbar />
      <NotificationSubscriber />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/customer-dashboard" element={
            <PrivateRoute roles={['CUSTOMER']}>
              <CustomerDashboard />
            </PrivateRoute>
          } />
          <Route path="/provider-dashboard" element={
            <PrivateRoute roles={['SERVICE_PROVIDER']}>
              <ProviderDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin-dashboard" element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
