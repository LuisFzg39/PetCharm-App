import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAuth } from '../../store/hooks';
import { loginUserAsync } from '../../store/slices/authSlice';
import { fetchUserInteractions } from '../../store/slices/interactionsSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser, error: authError, loading } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (currentUser) {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    // Mostrar errores de autenticación
    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones básicas
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            // Login con Supabase
            const result = await dispatch(loginUserAsync({ email, password }));
            
            if (loginUserAsync.fulfilled.match(result)) {
                // Cargar interacciones del usuario
                if (result.payload.userName) {
                    await dispatch(fetchUserInteractions());
                }
                // Redirigir al home
                navigate('/home');
            } else {
                setError(result.payload as string || 'Invalid email or password');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row relative">
            {/* Background para desktop */}
            <div
                className="hidden lg:block fixed inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/background/login.svg)' }}
            />
            
            {/* Mobile: Sección superior con patrón de animales */}
            <div className="lg:hidden relative w-full h-[33vh] min-h-[250px] overflow-hidden">
                <img 
                    src="/assets/vectors/Collage.svg" 
                    alt="Pet Pattern"
                    className="w-full h-full object-cover"
                />
                {/* Borde curvo inferior */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-[#6366f1] rounded-t-[30px]"></div>
            </div>

            {/* Mobile: Sección inferior con formulario en fondo morado */}
            <div className="lg:hidden flex-1 bg-[#6366f1] -mt-8 rounded-t-[30px] flex items-start justify-center px-6 pt-8 pb-8">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Welcome back</h1>
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-full text-center text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-white text-base sm:text-lg mb-2 text-left">Email</label>
                            <input 
                                type="email" 
                                placeholder="Type your email..." 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-white bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-base sm:text-lg mb-2 text-left">Password</label>
                            <input 
                                type="password" 
                                placeholder="Type your password..." 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-white bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div className="flex justify-end">
                            <a href="#" className="text-white underline text-xs sm:text-sm hover:text-orange-400 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full text-white font-medium py-3 px-4 transition-colors hover:opacity-90 rounded-lg disabled:opacity-50"
                            style={{ 
                                backgroundColor: '#FCB43E',
                            }}
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                        
                        <div className="text-center">
                            <span className="text-white text-xs sm:text-sm">Don't have an account? </span>
                            <Link to="/signup" className="text-white underline hover:text-orange-400 transition-colors text-xs sm:text-sm">
                                Sign up
                            </Link>
                        </div>
                    </form>
                    
                    {/* Credenciales de prueba - Mobile */}
                    <div className="mt-6 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-white text-xs text-center font-semibold mb-1">Test Account:</p>
                        <p className="text-white text-[10px] text-center">Email: valxcicat@petcharm.com</p>
                        <p className="text-white text-[10px] text-center">Password: 123456</p>
                    </div>
                </div>
            </div>

            {/* Desktop: Lado izquierdo - Formulario */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-white mb-8">Welcome back</h1>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-full text-center">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Email</label>
                            <input 
                                type="email" 
                                placeholder="Type your email..." 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Password</label>
                            <input 
                                type="password" 
                                placeholder="Type your password..." 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div className="flex justify-end">
                            <a href="#" className="text-white underline text-sm hover:text-orange-400 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-64 text-white font-medium py-3 px-4 transition-colors hover:opacity-90 disabled:opacity-50"
                            style={{ 
                                backgroundColor: '#FCB43E',
                                borderRadius: '50px'
                            }}
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                        
                        <div className="text-center">
                            <span className="text-white text-sm">Don't have an account? </span>
                            <Link to="/signup" className="text-white underline hover:text-orange-400 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </form>
                    
                    {/* Credenciales de prueba - Desktop */}
                    <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-white text-sm text-center font-semibold mb-2">Test Account:</p>
                        <p className="text-white text-xs text-center">Email: valxcicat@petcharm.com</p>
                        <p className="text-white text-xs text-center">Password: 123456</p>
                    </div>
                </div>
            </div>
            
            {/* Desktop: Lado derecho - Imagen */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
                <div className="w-full h-full max-w-lg">
                    <img 
                        src="/assets/vectors/Collage.svg" 
                        alt="Pet Collage"
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            </div>
        </div>
    )
}

export default Login;
