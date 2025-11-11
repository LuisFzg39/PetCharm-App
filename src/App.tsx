import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login/Login'
import SignUp from './components/login/SignUp'
import Profile from './components/profile/Profile'
import Landing from './components/landing/Landing'
import NavBarHome from "./components/navigation/NavBarHome";
import HomeFeed from "./pages/HomeFeed";
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './store/hooks';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <div>
                <NavBarHome />
                <HomeFeed />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <div>
                <NavBarHome />
                <Profile />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <div>
            <NavBarHome />
            <HomeFeed />
          </div>
        } />
        <Route path="/profile" element={
          <div>
            <NavBarHome />
            <Profile />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
