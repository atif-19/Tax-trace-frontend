import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/NavBar';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/protectedRoute'; // Import the guard
function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar /> {/* This stays visible on every page */}
      <main className="container mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* PROTECTED ROUTES */}
          <Route path="/scanner" element={
            <ProtectedRoute>
              <Scanner />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}
export default App;