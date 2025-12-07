import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { userStore } from './services/userStore'
import { useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

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
    return <Navigate to="/login" />;
  }

  // If user exists but no profile, and we are NOT on onboarding, force onboarding
  // We handle this redirect in the routes below to avoid infinite loops here if possible,
  // OR we just say PrivateRoute requires PROFILE too?
  // Let's keep it simple: PrivateRoute ensures AUTH.
  // Profile check can be done inside specific pages or here.

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Check if user is already onboarded to redirect from /
  useEffect(() => {
    async function fetch() {
      if (user) {
        const p = await userStore.get();
        setProfile(p);
      }
      setFetchingProfile(false);
    }
    if (!loading) fetch();
  }, [user, loading]);

  if (loading || (user && fetchingProfile)) return <LoadingScreen />;

  return (
    <div className="container">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={profile ? "/dashboard" : "/onboarding"} />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/onboarding" />} />

        <Route path="/onboarding" element={
          <PrivateRoute>
            {/* Provide user so Onboarding knows we are auth'd but maybe no profile yet */}
            <Onboarding />
          </PrivateRoute>
        } />

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
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to={user ? (profile ? "/dashboard" : "/onboarding") : "/login"} />} />
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
