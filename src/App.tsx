import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login/Login'
import SignUp from './components/login/SignUp'
import Profile from './components/profile/Profile'
import UserProfile from './components/profile/UserProfile'
import Landing from './components/landing/Landing'
import NavBarHome from "./components/navigation/NavBarHome";
import Home from "./components/home/Home";
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthInitializer from './components/auth/AuthInitializer';
import DataInitializer from './components/auth/DataInitializer';
import { useAuth } from './store/hooks';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthInitializer>
      <DataInitializer>
        <Router>
      <Routes>
        {/* Ruta predeterminada - Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />

        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />} 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <div className="lg:flex lg:flex-col">
                <div className="hidden lg:block">
                  <NavBarHome />
                </div>
                <Home />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:username" 
          element={
            <ProtectedRoute>
              <div className="lg:flex lg:flex-col">
                <div className="hidden lg:block">
                  <NavBarHome />
                </div>
                <UserProfile />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <div className="lg:flex lg:flex-col">
                <div className="hidden lg:block">
                  <NavBarHome />
                </div>
                <Profile />
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
    </DataInitializer>
    </AuthInitializer>
  );
}

export default App;
