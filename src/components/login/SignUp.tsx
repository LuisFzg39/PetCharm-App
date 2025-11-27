import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAuth } from '../../store/hooks';
import { registerUserAsync } from '../../store/slices/authSlice';
import { fetchUserInteractions } from '../../store/slices/interactionsSlice';
import { getRandomProfilePic, getRandomUserStatus } from '../../utils/userDefaults';

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser, error: authError, loading: authLoading } = useAuth();
    
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        // Validaciones
        if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Validar que el username no tenga espacios
        if (userName.trim().includes(' ')) {
            setError('Username cannot contain spaces');
            return;
        }

        try {
            // Obtener foto de perfil y estado aleatorios del JSON
            const randomAvatar = getRandomProfilePic();
            const randomStatus = getRandomUserStatus();

            // Registrar usuario con Supabase Auth (esto también crea el perfil en la tabla users)
            const registerResult = await dispatch(registerUserAsync({
                email: email.trim(),
                password: password,
                userName: userName.trim(),
                userPfp: randomAvatar,
                userStatus: randomStatus,
                bio: `Hi! I'm ${userName}`,
            }));
            
            if (registerUserAsync.fulfilled.match(registerResult)) {
                // Cargar interacciones del usuario
                if (registerResult.payload.userName) {
                    await dispatch(fetchUserInteractions());
                }
                // Redirigir al home
                navigate('/home');
            } else {
                setError(registerResult.payload as string || 'Error al registrar el usuario');
            }
        } catch (err: any) {
            setError(err.message || 'Error al crear la cuenta');
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Create account</h1>
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-full text-center text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-white text-base sm:text-lg mb-2 text-left">Username</label>
                            <input 
                                type="text" 
                                placeholder="Type a username..." 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-white bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-base sm:text-lg mb-2 text-left">Email Adress</label>
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
                                placeholder="Type a password..." 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-white bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-base sm:text-lg mb-2 text-left">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="Confirm your password..." 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-white bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={authLoading}
                            className="w-full text-white font-medium py-3 px-4 transition-colors hover:opacity-90 rounded-lg disabled:opacity-50"
                            style={{ 
                                backgroundColor: '#FCB43E',
                            }}
                        >
                            {authLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                        
                        <div className="text-center">
                            <span className="text-white text-xs sm:text-sm">Already have an account? </span>
                            <Link to="/login" className="text-white underline hover:text-orange-400 transition-colors text-xs sm:text-sm">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Desktop: Lado izquierdo - Imagen */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
                <div className="w-full h-full max-w-lg">
                    <img 
                        src="/assets/vectors/Collage.svg" 
                        alt="Pet Collage" 
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            </div>
            
            {/* Desktop: Lado derecho - Formulario */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-white mb-8">Create Account</h1>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-full text-center text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Username</label>
                            <input 
                                type="text" 
                                placeholder="Type your username..." 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
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
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="Confirm your password..." 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={authLoading}
                            className="w-64 text-white font-medium py-3 px-4 transition-colors hover:opacity-90 disabled:opacity-50"
                            style={{ 
                                backgroundColor: '#FCB43E',
                                borderRadius: '50px'
                            }}
                        >
                            {authLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                        
                        <div className="text-center">
                            <span className="text-white text-sm">Already have an account? </span>
                            <Link to="/login" className="text-white underline hover:text-orange-400 transition-colors">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
