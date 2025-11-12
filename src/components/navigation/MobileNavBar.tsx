import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, usePosts, useUsers } from "../../store/hooks";

type MobileNavBarProps = {
  onAddPostClick?: () => void;
};

function MobileNavBar({ onAddPostClick }: MobileNavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts } = usePosts();
  const { registeredUsers } = useUsers();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isHomePage = location.pathname === "/home";

  // Función helper para normalizar rutas de imágenes
  const normalizeImagePath = (path: string): string => {
    if (!path) return path;
    if (path.startsWith('./assets')) {
      return path.replace('./assets', '/assets');
    }
    if (path.startsWith('assets') && !path.startsWith('/assets')) {
      return '/' + path;
    }
    return path;
  };

  // Obtener todos los usuarios únicos
  const allUsers = useMemo(() => {
    const userMap = new Map<string, { userName: string; userPfp: string; userStatus: string }>();
    
    registeredUsers.forEach(user => {
      if (user.userName) {
        userMap.set(user.userName, {
          userName: user.userName,
          userPfp: normalizeImagePath(user.userPfp || ''),
          userStatus: user.userStatus || '',
        });
      }
    });
    
    posts.forEach(post => {
      if (post.userName && !userMap.has(post.userName)) {
        userMap.set(post.userName, {
          userName: post.userName,
          userPfp: normalizeImagePath(post.userPfp || ''),
          userStatus: post.userStatus || '',
        });
      }
    });
    
    return Array.from(userMap.values());
  }, [registeredUsers, posts]);

  // Filtrar usuarios basado en el input de búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchInput.trim()) return [];
    
    const searchLower = searchInput.toLowerCase().trim();
    return allUsers
      .filter(user => 
        user.userName &&
        user.userName.toLowerCase().includes(searchLower) &&
        user.userName !== currentUser?.userName
      )
      .slice(0, 5);
  }, [searchInput, allUsers, currentUser]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = (userName: string) => {
    setSearchInput("");
    setShowSuggestions(false);
    setShowSearch(false);
    navigate(`/profile/${userName}`);
  };

  const handleHomeClick = () => {
    navigate('/home');
    setShowSearch(false);
  };

  const handleAddPostClick = () => {
    if (!isHomePage) {
      navigate('/home?create=true');
    } else {
      // Si estamos en home, llamar al callback si existe
      if (onAddPostClick) {
        onAddPostClick();
      }
    }
    setShowSearch(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setShowSuggestions(true);
    }
  };

  return (
    <>
      {/* Navbar superior móvil */}
      <div className="lg:hidden w-full bg-[#fdfbff] shadow-[0_4px_8px_0_rgba(0,0,0,0.25)] px-4 py-3 flex items-center justify-between">
        {/* Logo a la izquierda */}
        <Link to="/home" className="flex items-center">
          <img
            src="/assets/vectors/logos/Logo-navbar.svg"
            alt="PetC Logo"
            className="h-[24px] w-auto"
          />
        </Link>
        
        {/* Perfil a la derecha - funcional */}
        <Link to="/profile" className="flex items-center gap-2">
          <img
            src={currentUser?.userPfp || '/assets/icons/Profile-icon.svg'}
            alt="Profile"
            className="rounded-full h-[40px] w-[40px] object-cover"
          />
        </Link>
      </div>

      {/* Navbar inferior móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#6366f1] rounded-t-[30px] shadow-[0_-4px_8px_0_rgba(0,0,0,0.25)] z-50">
        <div className="flex items-center justify-around px-4 py-4 relative">
          {/* Botón Home */}
          <button
            onClick={handleHomeClick}
            className={`flex flex-col items-center justify-center gap-1 ${isHomePage ? 'text-white' : 'text-white/70'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Botón Add Post */}
          <button
            onClick={handleAddPostClick}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FCB43E] text-white shadow-lg hover:bg-[#eaa02b] transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          {/* Botón Search con input desplegable */}
          <div ref={searchRef} className="relative">
            <button
              onClick={handleSearchClick}
              className={`flex flex-col items-center justify-center gap-1 ${showSearch ? 'text-white' : 'text-white/70'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="text-xs font-medium">Search</span>
            </button>

            {/* Input de búsqueda desplegable */}
            {showSearch && (
              <div className="absolute bottom-full right-0 mb-2 w-[280px] bg-white rounded-[15px] shadow-lg border-2 border-purple-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="/assets/icons/Search-icon.svg"
                    alt="Search"
                    className="w-5 h-5"
                  />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="flex-1 border-none outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400"
                    autoFocus
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredUsers.length > 0 && (
                  <div className="max-h-[200px] overflow-y-auto border-t border-gray-200 mt-2 pt-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.userName}
                        onClick={() => handleUserClick(user.userName)}
                        className="flex items-center gap-3 px-2 py-2 hover:bg-purple-50 cursor-pointer transition-colors rounded-lg"
                      >
                        <img
                          src={user.userPfp}
                          alt={user.userName}
                          className="w-[35px] h-[35px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">{user.userName}</span>
                          <span className="text-xs text-gray-500">{user.userStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileNavBar;

