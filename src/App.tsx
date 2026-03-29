import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import NewListing from './pages/NewListing'
import AILab from './pages/AILab'
import LandingPage from './pages/LandingPage'
import MyListings from './pages/MyListings'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          theme="dark"
        />
        <Routes>
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/signup" element={
            <GuestRoute>
              <SignUp />
            </GuestRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/new-listing" element={
            <ProtectedRoute>
              <NewListing />
            </ProtectedRoute>
          } />
          <Route path="/ai-lab" element={
            <ProtectedRoute>
              <AILab />
            </ProtectedRoute>
          } />
          <Route path="/listings" element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App