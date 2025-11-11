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
          <div className="max-w-[1250px] mt-50 relative">
            {/* Pattern Background - Diagonal */}
            <div className="absolute left-[60%] bottom-0 translate-x-[-50%] w-[1300px] h-[1300px] pointer-events-none opacity-40" style={{ transform: 'translateX(-50%) rotate(-35deg)' }}>
              <img
                src="/assets/vectors/patterns/CreatePostPattern.svg"
                alt="Pattern"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Laptop */}
            <img
              src="/assets/vectors/img/mockups/Laptop-mockup.svg"
              alt="Laptop Mockup"
              className="w-full h-auto relative z-10"
            />
          </div>

          {/* Right - Feature Cards */}
          <div className="flex flex-col gap-6 max-w-[450px]">
            {/* Pet Profiles Card */}
            <div className="bg-[#FFF4FD] rounded-[40px] p-8 border-2 border-[#5054DB] flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-[32px] font-bold text-[#5054DB] mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Pet profiles</h4>
                <p className="text-[#4D3D3D] text-[20px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>Put your pet on the spotlight</p>
              </div>
              <div className="w-[120px] h-[120px] bg-[#FFF4E6] rounded-full flex items-center justify-center text-5xl relative overflow-hidden">
                🐱
              </div>
            </div>

            {/* Community Card */}
            <div className="bg-[#FFF4FD] rounded-[40px] p-8 border-2 border-[#5054DB] flex items-center gap-4 relative overflow-hidden">
              <div className="flex-1">
                <h4 className="text-[32px] font-bold text-[#5054DB] mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Community</h4>
                <p className="text-[#4D3D3D] text-[20px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>Connect with pet lovers everywhere.</p>
              </div>
              <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                <div className="flex gap-2">
                  <span className="text-6xl">🐶</span>
                  <span className="text-6xl">🐱</span>
                </div>
              </div>
            </div>

            {/* Charms Card */}
            <div className="bg-[#FFF4FD] rounded-[40px] p-8 border-2 border-[#5054DB] flex items-center gap-4 relative overflow-hidden">
              <div className="flex-1">
                <h4 className="text-[32px] font-bold text-[#5054DB] mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Charms</h4>
                <p className="text-[#4D3D3D] text-[20px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>Give and get "Charms" on your posts</p>
              </div>
              <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-5xl">🐾</span>
                  <span className="text-3xl">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Cards Section */}
      <section className="w-full bg-[#f5f0f0] py-20 px-20 relative">
        <div className="flex items-center justify-center gap-16 max-w-[1400px] mx-auto">
          {/* Log In Card */}
          <div className="relative">
            {/* Cat illustration - bottom left */}
            <div className="absolute -bottom-10 -left-10 z-10 text-7xl">
              🐱
            </div>
            
            {/* Dog illustration - top right */}
            <div className="absolute -top-6 -right-6 z-10 text-7xl">
              🐶
            </div>

            <div className="bg-[#CAACFF] rounded-[20px] shadow-[0px_3.279px_8.197px_3.279px_rgba(0,0,0,0.25)] w-[490px] h-[305px] flex flex-col items-center justify-center relative z-0">
              <h3 className="text-[36px] font-bold text-[#1D1D1B] mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Log In
              </h3>
              <p className="text-[20px] text-[#1D1D1B] mb-8 text-center max-w-[270px]" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                Welcome back—your pet's world is waiting!
              </p>
              <Link to="/login">
                <button className="bg-[#FF43A1] text-[#FFF4FD] px-10 py-3 rounded-[20px] text-[16px] font-medium hover:bg-[#e63a8f] transition-colors" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Access now
                </button>
              </Link>
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="relative">
            {/* Cat illustration - bottom right */}
            <div className="absolute -bottom-10 -right-10 z-10 text-7xl">
              🐱
            </div>
            
            {/* Dog illustration - top left */}
            <div className="absolute -top-6 -left-6 z-10 text-7xl">
              🐶
            </div>

            <div className="bg-[#FCB43E] rounded-[20px] shadow-[0px_3.279px_8.197px_3.279px_rgba(0,0,0,0.25)] w-[490px] h-[305px] flex flex-col items-center justify-center relative z-0">
              <h3 className="text-[36px] font-bold text-[#1D1D1B] mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Sign Up
              </h3>
              <p className="text-[20px] text-[#1D1D1B] mb-8 text-center max-w-[270px]" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                Join PetCharm and let your pet shine!
              </p>
              <Link to="/signup">
                <button className="bg-[#4A67DB] text-[#FFF4FD] px-10 py-3 rounded-[20px] text-[16px] font-medium hover:bg-[#3d57c4] transition-colors" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Register now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interact Section */}
      <section className="w-full bg-[#f5f0f0] py-20 px-20 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -left-20 top-32 w-[217px] h-[217px] rounded-full bg-[#E5D9FF] opacity-50"></div>
        <div className="absolute -right-12 bottom-12 w-[143px] h-[143px] rounded-full bg-[#FFE5F5] opacity-50"></div>
        <div className="absolute right-1/4 bottom-12 w-[46px] h-[46px] rounded-full bg-[#FFE5D9] opacity-50"></div>
        <div className="absolute left-24 bottom-4 w-[46px] h-[46px] rounded-full bg-[#FFF4D9] opacity-50"></div>

        <div className="text-center mb-16">
          <h2 className="text-[70px] font-bold leading-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            <span className="text-[#5054DB]">Interact with</span>
            <br />
            <span className="text-[#FF43A1]">others!</span>
          </h2>
        </div>

        <div className="flex items-center justify-center relative min-h-[600px]">
          {/* Left Testimonial */}
          <div className="bg-white rounded-[20px] p-6 shadow-lg max-w-[280px] absolute left-12 top-32 z-20">
            <p className="text-[#5054DB] text-[15px] leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              "This is honestly one of the funniest and cutest things I've seen today."
            </p>
          </div>

          {/* Center - Devices Mockup */}
          <div className="relative z-10">
            {/* Laptop */}
            <img
              src="/assets/vectors/img/mockups/MacBook-mockup.svg"
              alt="Laptop Mockup"
              className="w-[679px] h-auto relative z-10"
            />
            {/* Phone */}
            <img
              src="/assets/vectors/img/mockups/Phones-mockup.svg"
              alt="Phone Mockup"
              className="w-[350px] h-auto absolute -left-32 bottom-8 z-20"
            />
            
            {/* Decorative Stars/Sparkles */}
            <div className="absolute top-12 -left-16 text-[88px] z-0">✨</div>
            <div className="absolute -bottom-4 left-48 text-[88px] z-0">✨</div>
          </div>

          {/* Right Testimonial */}
          <div className="bg-white rounded-[20px] p-6 shadow-lg max-w-[233px] absolute right-32 top-48 z-20">
            <p className="text-[#5054DB] text-[15px] leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              "Mario & Luigi never looked this good!."
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full relative min-h-[431px]">
        {/* Footer Background */}
        <div className="absolute inset-0 w-full h-full bg-[#5054DB]">
          <img
            src="/assets/vectors/img/mockups/footer_azul.svg"
            alt="Footer Background"
            className="w-full h-full object-fill"
          />
        </div>

        <div className="relative z-10 py-16">
          <div className="max-w-[1263px] mx-auto px-11 flex justify-between text-white">
            {/* Exclusive */}
            <div className="flex flex-col">
              <h4 className="text-[25px] font-medium mb-[67px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Exclusive
              </h4>
              <p className="text-[15px] mb-6 max-w-[146px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Subscribe to our newsletter
              </p>
              <div className="relative w-[225px]">
                <input
                  type="email"
                  placeholder="Enter you email..."
                  className="w-full px-3 py-2 rounded-[4px] bg-transparent border border-white text-white text-[15px] placeholder:text-white/70 placeholder:text-center outline-none"
                  style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl">
                  ➤
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <h4 className="text-[25px] font-medium mb-[65px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Contact
              </h4>
              <p className="text-[15px] mb-[38px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Cra. 7 #78-96, Bogotá
              </p>
              <p className="text-[15px] mb-[38px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                petcharm@gmail.com
              </p>
              <p className="text-[15px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                +57-301-6414482
              </p>
            </div>

            {/* Account */}
            <div className="flex flex-col">
              <h4 className="text-[25px] font-medium mb-[65px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Account
              </h4>
              <Link to="/profile" className="text-[15px] mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                My Account
              </Link>
              <Link to="/login" className="text-[15px] mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Login / Register
              </Link>
              <Link to="/" className="text-[15px] mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Cart
              </Link>
              <Link to="/" className="text-[15px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Shop
              </Link>
            </div>

            {/* Quick Link */}
            <div className="flex flex-col">
              <h4 className="text-[25px] font-medium mb-[65px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Quick Link
              </h4>
              <a href="#" className="text-[15px] mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Privacy Policy
              </a>
              <a href="#" className="text-[15px] mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Terms Of Use
              </a>
              <a href="#" className="text-[15px] mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                FAQ
              </a>
              <a href="#" className="text-[15px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Contact
              </a>
            </div>

            {/* Logo */}
            <div className="flex items-end relative">
              <img
                src="/assets/vectors/logos/Logo-navbar.svg"
                alt="PetCharm Logo"
                className="w-[155px] h-auto"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

