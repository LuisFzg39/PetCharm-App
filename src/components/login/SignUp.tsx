function SignUp() {
    return (
        <div className="min-h-screen flex">
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/background/login.svg)' }}
            />
            {/* Lado izquierdo - Imagen */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-full max-w-lg">
                    <img 
                        src="/assets/vectors/Collage.svg" 
                        alt="Pet Collage" 
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            </div>
            
            {/* Lado derecho - Formulario */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-white mb-8">Create Account</h1>
                    
                    <form className="space-y-6">
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="Type your full name..." 
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Email</label>
                            <input 
                                type="email" 
                                placeholder="Type your email..." 
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Password</label>
                            <input 
                                type="password" 
                                placeholder="Type your password..." 
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-white text-lg mb-2 text-left">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="Confirm your password..." 
                                className="w-full px-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-64 text-white font-medium py-3 px-4 transition-colors"
                            style={{ 
                                backgroundColor: '#FCB43E',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#E6A237'}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#FCB43E'}
                        >
                            Sign Up
                        </button>
                        
                        <div className="text-center">
                            <span className="text-white text-sm">Already have an account? </span>
                            <a href="#" className="text-white underline hover:text-orange-400 transition-colors">
                                Log in
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
