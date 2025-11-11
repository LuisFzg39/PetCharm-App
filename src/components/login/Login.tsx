import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useUsers } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { registeredUsers } = useUsers();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones básicas
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        // Buscar usuario en la lista de registrados
        const user = registeredUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            setError('Invalid email or password');
            return;
        }

        // Login exitoso - dispatch del usuario
        dispatch(loginUser({
            id: user.id,
            userName: user.userName,
            userPfp: user.userPfp,
            userStatus: user.userStatus,
            bio: user.bio,
            postsCount: 0,
            followersCount: user.followersCount || 0,
            followingCount: user.followingCount || 0,
        }));

        // Redirigir al home
        navigate('/home');
    };

    return (
        <div className="min-h-screen flex relative">
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/background/login.svg)' }}
            />
            {/* Lado izquierdo - Formulario */}
            <div className="flex-1 flex items-center justify-center px-8">
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
                            className="w-64 text-white font-medium py-3 px-4 transition-colors hover:opacity-90"
                            style={{ 
                                backgroundColor: '#FCB43E',
                                borderRadius: '50px'
                            }}
                        >
                            Log in
                        </button>
                        
                        <div className="text-center">
                            <span className="text-white text-sm">Don't have an account? </span>
                            <Link to="/signup" className="text-white underline hover:text-orange-400 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </form>
                    
                    {/* Credenciales de prueba */}
                    <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-white text-sm text-center font-semibold mb-2">Test Account:</p>
                        <p className="text-white text-xs text-center">Email: valxcicat@petcharm.com</p>
                        <p className="text-white text-xs text-center">Password: 123456</p>
                    </div>
                </div>
            </div>
            
            {/* Lado derecho - Imagen */}
            <div className="flex-1 flex items-center justify-center">
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
