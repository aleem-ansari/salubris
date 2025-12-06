import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { userStore } from './services/userStore'
import { useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

import FeedTracker from './pages/FeedTracker'
import PoopTracker from './pages/PoopTracker'
import PoopAnalysis from './pages/PoopAnalysis'
import UpdateStats from './pages/UpdateStats'
import Reports from './pages/Reports'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (user) {
        // We have a user, check if they completed onboarding (have a profile)
        const p = await userStore.get();
        setProfile(p);
      }
      setCheckingProfile(false);
    }
    if (!loading) {
      checkProfile();
    }
  }, [user, loading]);

  if (loading || checkingProfile) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/onboarding" />;
  }

  // If user exists but no profile, they might need to onboard, 
  // BUT we are protecting dashboard routes here.
  // Ideally, /onboarding creates the profile.
  // So if no profile, redirect to onboarding?
  // Let's assume if they are authenticated they "should" have a profile, 
  // OR they are currently anonymous and need to create one.

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);

  // Check if user is already onboarded to redirect from /
  useEffect(() => {
    if (user) {
      userStore.get().then(p => setProfile(p));
    }
  }, [user]);

  if (loading) return <LoadingScreen />;

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
        <Route path="/" element={<Navigate to={user && profile ? "/dashboard" : "/onboarding"} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
