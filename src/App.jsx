import { Routes, Route, Navigate } from 'react-router-dom'
import { userStore } from './services/userStore'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

import FeedTracker from './pages/FeedTracker'
import PoopTracker from './pages/PoopTracker'
import PoopAnalysis from './pages/PoopAnalysis'
import UpdateStats from './pages/UpdateStats'
import Reports from './pages/Reports'

function PrivateRoute({ children }) {
  const user = userStore.get();
  return user ? children : <Navigate to="/onboarding" />;
}

function App() {
  const user = userStore.get();

  return (
    <div className="container">
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/tracker/feed" element={
          <PrivateRoute>
            <FeedTracker />
          </PrivateRoute>
        } />
        <Route path="/tracker/poop" element={
          <PrivateRoute>
            <PoopTracker />
          </PrivateRoute>
        } />
        <Route path="/analysis" element={
          <PrivateRoute>
            <PoopAnalysis />
          </PrivateRoute>
        } />
        <Route path="/update-stats" element={
          <PrivateRoute>
            <UpdateStats />
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/onboarding"} />} />
      </Routes>
    </div>
  )
}

export default App
