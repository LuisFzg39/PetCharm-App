import './App.css'
import Profile from './components/profile/Profile'
import "./App.css";
import NavBarHome from "./components/navigation/NavBarHome";
import HomeFeed from "./pages/HomeFeed";

function App() {
  return (
    <>
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
