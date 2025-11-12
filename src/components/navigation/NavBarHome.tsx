import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, usePosts, useUsers } from "../../store/hooks";

function NavBarHome() {
    const { currentUser } = useAuth();
    const { posts } = usePosts();
    const { registeredUsers } = useUsers();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    
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
    
    // Obtener todos los usuarios únicos (de registeredUsers y de posts)
    const allUsers = useMemo(() => {
        const userMap = new Map<string, { userName: string; userPfp: string; userStatus: string }>();
        
        // Agregar usuarios registrados
        registeredUsers.forEach(user => {
            if (user.userName) {
                userMap.set(user.userName, {
                    userName: user.userName,
                    userPfp: normalizeImagePath(user.userPfp || ''),
                    userStatus: user.userStatus || '',
                });
            }
        });
        
        // Agregar usuarios de posts
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
                user.userName !== currentUser?.userName // Excluir el usuario actual
            )
            .slice(0, 5); // Limitar a 5 sugerencias
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
        navigate(`/profile/${userName}`);
    };
    
    return (
    <header className="w-full h-[80px] bg-[#fdfbff] flex items-center justify-between shadow-[0_4px_8px_0_rgba(0,0,0,0.25)] relative z-50">
      {/* Logo */}
        <Link to="/home" className="flex items-center h-full cursor-pointer">
        <img
            src="/assets/vectors/logos/Logo-navbar.svg"
            alt="PetC Logo"
            className="h-[40%] w-auto px-[80px]"
        />
        </Link>

      {/* Search Bar */}
        <div ref={searchRef} className="relative">
        <div className="flex items-center gap-[10px] w-[300px] h-[40px] rounded-[30px] px-4 bg-white border-2 border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#5054DB_0%,#C06DFF_66.83%)_border-box]">
            <img
                src="/assets/icons/Search-icon.svg"
                alt="Search"
                className="w-6 h-6"
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
                className="w-full border-none outline-none bg-transparent text-[16px] text-[#555] placeholder:text-[#aaa]"
            />
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && filteredUsers.length > 0 && (
            <div className="absolute top-[45px] left-0 w-[300px] bg-white rounded-[15px] shadow-lg border-2 border-purple-200 max-h-[300px] overflow-y-auto z-50">
                {filteredUsers.map((user) => (
                    <div
                        key={user.userName}
                        onClick={() => handleUserClick(user.userName)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                        <img
                            src={user.userPfp}
                            alt={user.userName}
                            className="w-[40px] h-[40px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="text-[16px] font-semibold text-gray-800">{user.userName}</span>
                            <span className="text-[12px] text-gray-500">{user.userStatus}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
        </div>

      {/* Profile Section */}
        <Link to="/profile" className="h-full w-[260px] rounded-l-[50px] flex items-center justify-start pl-[30px] gap-[15px] text-white bg-gradient-to-r from-[#5054DB] to-[#6E72ED] cursor-pointer hover:opacity-90 transition">
        <img
          src={currentUser?.userPfp || '/assets/icons/Profile-icon.svg'}
            alt="Profile"
            className="rounded-full h-[55px] w-[55px] object-cover"
        />
        <div className="flex flex-col">
            <h2 className="text-[18px] font-semibold leading-tight">{currentUser?.userName || 'Guest'}</h2>
            <p className="text-[13px] font-light leading-tight">{currentUser?.userStatus || 'Welcome!'}</p>
        </div>
        </Link>
    </header>
    )
}

export default NavBarHome;
