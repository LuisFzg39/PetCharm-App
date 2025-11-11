import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login/Login'
import SignUp from './components/login/SignUp'
import Profile from './components/profile/Profile'
import Landing from './components/landing/Landing'
import NavBarHome from "./components/navigation/NavBarHome";
import HomeFeed from "./pages/HomeFeed";

function App() {
  return (
    <Router>
      <Routes>
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
