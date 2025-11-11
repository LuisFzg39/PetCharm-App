import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f0f0]">
      {/* Navbar */}
      <nav className="w-full h-[85px] bg-[#f5f0f0] flex items-center justify-between px-12 shadow-[0_4px_8px_0_rgba(0,0,0,0.25)]">
        {/* Logo */}
        <div className="flex items-center ml-8">
          <img
            src="/assets/vectors/logos/Logo-navbar.svg"
            alt="PetCharm Logo"
            className="h-[28px] w-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mr-8">
          <Link to="/login">
            <button className="relative px-8 py-2 rounded-full border-2 border-transparent font-medium transition-all hover:opacity-80 [background:linear-gradient(#F6F2F9,#F6F2F9)_padding-box,linear-gradient(90deg,#5054DB_0%,#C06DFF_100%)_border-box]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              <span className="bg-gradient-to-r from-[#5054DB] to-[#C06DFF] bg-clip-text text-transparent font-medium">
                Log in
              </span>
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-8 py-2 rounded-full bg-[#6366f1] text-white font-medium hover:bg-[#5558e3] transition-colors">
              Sign up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-85px)] flex items-center justify-center px-2 py-16 gap-36">
        {/* Left Side - Pet Charm Logo */}
        <div className="flex flex-col items-center justify-center max-w-[680px]">
          <img
            src="/assets/vectors/graphic-elements/Pet-charm.svg"
            alt="PetCharm Logo"
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105 hover:-rotate-2 cursor-pointer"
          />
          
          {/* Join Now Button */}
          <Link to="/signup">
            <button 
              className="mt-8 px-12 py-3.5 rounded-full bg-[#6366f1] text-white text-lg hover:bg-[#5558e3] transition-colors shadow-lg"
              style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 'bold' }}
            >
              Join Now
            </button>
          </Link>
        </div>

        {/* Right Side - Animal Illustration */}
        <div className="flex items-center justify-center max-w-[680px]">
          <img
            src="/assets/vectors/graphic-elements/Trazos-animales.svg"
            alt="Pets Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* What is PetCharm Section */}
      <section className="w-full relative min-h-[620px] overflow-hidden rounded-tr-[230px]">
        {/* Blue Background with Wave */}
        <img
          src="/assets/vectors/img/mockups/Rectangle-blue.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 flex items-start justify-between px-20 pt-25 pb-20">
          {/* Left Content */}
          <div className="max-w-[550px] text-white">
            <h2 className="text-6xl font-bold mb-6 whitespace-nowrap">
              What is <span className="text-[#FCB43E]">PetCharm</span>?
            </h2>
            <p className="text-xl leading-relaxed">
              The social network where pets shine. Share your furry friend's best moments, collect charms, and join forums where pet lovers connect, ask questions, and celebrate the joy of pets together.
            </p>
          </div>

          {/* Right Content */}
          <div className="flex items-start justify-end max-w-[1000px] -mt-30">
            {/* Pets Illustration */}
            <img
              src="/assets/vectors/img/mockups/pets-petcharm.svg"
              alt="Pets"
              className="w-[700px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* Social Network Section */}
      <section className="w-full bg-[#f5f0f0] pt-8 pb-20 px-20 -mt-85">
        <div className="flex items-center justify-center gap-32">
          {/* Mockups - Large and overlapping with blue section */}
          <div className="relative z-20 -ml-10">
            <img
              src="/assets/vectors/img/mockups/Phones-mockup.svg"
              alt="Phone Mockups"
              className="w-[620px] h-auto"
            />
          </div>

          {/* Content */}
          <div className="text-left max-w-[600px] mt-16 ml-12">
            <h3 className="text-6xl font-bold mb-6 text-[#6366f1]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              <span className="relative inline-block">
                Social network
                <span className="absolute bottom-0 left-0 w-full h-16" style={{ background: 'linear-gradient(90deg, rgba(255, 67, 161, 0.52) 0%, rgba(255, 67, 161, 0.00) 100%)' }}></span>
              </span>
              <br />
              for your pet
            </h3>
            <p className="text-gray-700 mb-8 text-xl">
              Don't miss the opportunity to see adorable pets. Register now!
            </p>
            <div className="flex justify-center">
              <Link to="/signup">
                <button className="px-12 py-3 rounded-full bg-[#FCB43E] text-white text-lg font-semibold hover:bg-[#eaa02b] transition-colors shadow-lg">
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Purple Background */}
      <section className="w-full relative overflow-hidden">
        {/* Purple Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/assets/vectors/img/mockups/fondo-morado.svg"
            alt="Background"
            className="w-full h-full object-fill"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between px-20 py-16 min-h-[1500px]">
          {/* Left - Laptop Mockup */}
          <div className="max-w-[550px]">
            <img
              src="/assets/vectors/img/mockups/Laptop-mockup.svg"
              alt="Laptop Mockup"
              className="w-full h-auto"
            />
          </div>

          {/* Right - Feature Cards */}
          <div className="flex flex-col gap-6 max-w-[450px]">
            {/* Pet Profiles Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-[#6366f1] mb-2">Pet profiles</h4>
                <p className="text-gray-700">Put your pet on the spotlight</p>
              </div>
              <div className="w-20 h-20 bg-[#FFF4E6] rounded-2xl flex items-center justify-center text-4xl">
                🐱
              </div>
            </div>

            {/* Community Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-[#6366f1] mb-2">Community</h4>
                <p className="text-gray-700">Connect with pet lovers everywhere.</p>
              </div>
              <div className="w-20 h-20 bg-[#F0E6FF] rounded-2xl flex items-center justify-center">
                <div className="flex gap-1">
                  <span className="text-2xl">🐶</span>
                  <span className="text-2xl">🐱</span>
                </div>
              </div>
            </div>

            {/* Charms Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-[#6366f1] mb-2">Charms</h4>
                <p className="text-gray-700">Give and get "Charms" on your posts</p>
              </div>
              <div className="w-20 h-20 bg-[#E6F0FF] rounded-2xl flex items-center justify-center text-4xl">
                🐾
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Cards Section */}
      <section className="w-full bg-[#f5f0f0] py-20 px-20">
        <div className="flex items-center justify-center gap-12">
          {/* Log In Card */}
          <div className="bg-[#B794FF] rounded-3xl p-10 shadow-xl text-center max-w-[380px] relative">
            <div className="absolute -bottom-10 -left-10">
              <div className="w-24 h-24 text-6xl">🐱</div>
            </div>
            <div className="absolute -top-10 -right-10">
              <div className="w-24 h-24 text-6xl">🐶</div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">Log In</h3>
            <p className="text-white mb-6">Welcome back—your pet's world is waiting!</p>
            <Link to="/login">
              <button className="px-10 py-3 rounded-full bg-[#FF43A1] text-white text-lg font-semibold hover:bg-[#e63a8f] transition-colors shadow-lg">
                Access now
              </button>
            </Link>
          </div>

          {/* Sign Up Card */}
          <div className="bg-[#FCB43E] rounded-3xl p-10 shadow-xl text-center max-w-[380px] relative">
            <div className="absolute -bottom-10 -right-10">
              <div className="w-24 h-24 text-6xl">🐶</div>
            </div>
            <div className="absolute -top-10 -left-10">
              <div className="w-24 h-24 text-6xl">🐱</div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">Sign Up</h3>
            <p className="text-white mb-6">Join PetCharm and let your pet shine!</p>
            <Link to="/signup">
              <button className="px-10 py-3 rounded-full bg-[#6366f1] text-white text-lg font-semibold hover:bg-[#5558e3] transition-colors shadow-lg">
                Register now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interact Section */}
      <section className="w-full bg-[#f5f0f0] py-20 px-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold">
            <span className="text-[#6366f1]">Interact with</span>{" "}
            <span className="text-[#FF43A1]">others!</span>
          </h2>
        </div>

        <div className="flex items-center justify-center gap-12 relative">
          {/* Left Testimonial */}
          <div className="bg-white border-2 border-[#6366f1] rounded-2xl p-4 shadow-lg max-w-[250px] absolute left-32 top-20">
            <p className="text-[#6366f1] italic">"This is honestly one of the funniest and cutest things I've seen today"</p>
          </div>

          {/* Center - Devices Mockup */}
          <div className="relative">
            <img
              src="/assets/vectors/img/mockups/MacBook-mockup.svg"
              alt="Devices Mockup"
              className="w-[700px] h-auto"
            />
            <div className="absolute -top-8 -left-8 text-4xl">⭐</div>
            <div className="absolute -bottom-8 left-12 text-4xl">✨</div>
          </div>

          {/* Right Testimonial */}
          <div className="bg-white border-2 border-[#6366f1] rounded-2xl p-4 shadow-lg max-w-[250px] absolute right-32 top-32">
            <p className="text-[#6366f1] italic">"Mario & Luigi never looked this good.!"</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full relative min-h-[400px]">
        {/* Footer Background */}
        <img
          src="/assets/vectors/img/mockups/footer_azul.svg"
          alt="Footer Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 px-20 py-16">
          <div className="flex justify-between text-white">
            {/* Exclusive */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold mb-4">Exclusive</h4>
              <p className="mb-4">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="px-4 py-2 rounded-full bg-transparent border-2 border-white text-white placeholder:text-white/70 outline-none"
                />
                <button className="px-4 py-2 rounded-full bg-white text-[#6366f1] font-semibold hover:bg-gray-100 transition-colors">
                  →
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="mb-2">Cra. 7 #78-90, Bogotá</p>
              <p className="mb-2">petcharm@gmail.com</p>
              <p>+57-301-6414482</p>
            </div>

            {/* Account */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold mb-4">Account</h4>
              <Link to="/profile" className="mb-2 hover:underline">My Account</Link>
              <Link to="/login" className="mb-2 hover:underline">Login / Register</Link>
              <Link to="/" className="mb-2 hover:underline">Cart</Link>
              <Link to="/" className="hover:underline">Shop</Link>
            </div>

            {/* Quick Link */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold mb-4">Quick Link</h4>
              <a href="#" className="mb-2 hover:underline">Privacy Policy</a>
              <a href="#" className="mb-2 hover:underline">Terms Of Use</a>
              <a href="#" className="mb-2 hover:underline">FAQ</a>
              <a href="#" className="hover:underline">Contact</a>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/assets/vectors/logos/Logo-navbar.svg"
                alt="PetCharm Logo"
                className="h-[60px] w-auto"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

