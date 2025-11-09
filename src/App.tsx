import './App.css'
import Login from './components/login/Login'
import SignUp from './components/login/SignUp'
import Profile from './components/profile/Profile'
import "./App.css";
import NavBarHome from "./components/navigation/NavBarHome";
import HomeFeed from "./pages/HomeFeed";

function App() {
  return (
    <>
      <Login />
      <SignUp />
      <Profile />
    </>
  )
    <div>
      <NavBarHome />
      <HomeFeed />
    </div>
  );
}

export default App;
