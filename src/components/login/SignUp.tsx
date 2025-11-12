import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useUsers } from '../../store/hooks';
import { registerUser } from '../../store/slices/usersSlice';
import { loginUser } from '../../store/slices/authSlice';

// Avatares predeterminados para nuevos usuarios
const DEFAULT_AVATARS = [
    '/assets/vectors/img/profile-pics/Pfp2.jpg',
    '/assets/vectors/img/profile-pics/Pfp3.jpg',
    '/assets/vectors/img/profile-pics/Pfp4.jpg',
    '/assets/vectors/img/profile-pics/Pfp5.jpg',
    '/assets/vectors/img/profile-pics/Pfp6.jpg',
];

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { registeredUsers } = useUsers();
    
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields');
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

        // Verificar si el email ya está registrado
        const emailExists = registeredUsers.some(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
            setError('Email already registered');
            return;
        }

        // Verificar si el username ya existe
        const userNameExists = registeredUsers.some(
            u => u.userName.toLowerCase() === userName.toLowerCase()
        );

        if (userNameExists) {
            setError('Username already taken');
            return;
        }

        // Seleccionar avatar aleatorio
        const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];

        // Crear nuevo usuario
        const newUser = {
            email: email.trim(),
            password: password,
            userName: userName.trim(),
            userPfp: randomAvatar,
            userStatus: '🐾 New member',
            bio: `Hi! I'm ${userName}`,
            followersCount: 0,
            followingCount: 0,
        };

        // Registrar usuario
        dispatch(registerUser(newUser));

        // Auto-login después del registro
        dispatch(loginUser({
            id: '', // Se generará en el slice
            userName: newUser.userName,
            userPfp: newUser.userPfp,
            userStatus: newUser.userStatus,
            bio: newUser.bio,
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
        }));

        // Redirigir al home
        navigate('/home');
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
                            className="w-full text-white font-medium py-3 px-4 transition-colors hover:opacity-90 rounded-lg"
                            style={{ 
                                backgroundColor: '#FCB43E',
                            }}
                        >
                            Sign up
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
                            className="w-64 text-white font-medium py-3 px-4 transition-colors hover:opacity-90"
                            style={{ 
                                backgroundColor: '#FCB43E',
                                borderRadius: '50px'
                            }}
                        >
                            Sign Up
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
