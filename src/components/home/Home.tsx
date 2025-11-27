import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import HomeFeed from "../../pages/HomeFeed";
import CreatePost from "./CreatePost";
import MobileNavBar from "../navigation/MobileNavBar";

function Home() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isHomePage = location.pathname === "/home";
  
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Detectar si se debe mostrar CreatePost desde la URL
  useEffect(() => {
    const showCreate = searchParams.get('create') === 'true';
    if (showCreate && isHomePage) {
      setShowCreatePost(true);
      // Limpiar el parámetro después de activarlo
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, isHomePage, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col relative">
      {/* Desktop: NavBarHome se muestra arriba */}
      <div className="hidden lg:block">
        {/* NavBarHome se renderiza desde App.tsx */}
      </div>

      {/* Mobile: Navbars (superior e inferior) */}
      <MobileNavBar onAddPostClick={() => setShowCreatePost(!showCreatePost)} />

      {/* Contenido principal */}
      <div className="flex-1 pb-20 lg:pb-0">
        {showCreatePost && isHomePage && (
          <div className="w-full px-5 lg:px-0 mb-4">
            <CreatePost />
          </div>
        )}
        <HomeFeed />
      </div>
    </div>
  );
}

export default Home;

