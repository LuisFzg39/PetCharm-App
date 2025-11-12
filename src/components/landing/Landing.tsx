import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f0f0]">
      {/* Navbar */}
      <nav className="w-full h-[85px] bg-[#f5f0f0] flex items-center justify-between px-4 sm:px-8 lg:px-12 shadow-[0_4px_8px_0_rgba(0,0,0,0.25)]">
        {/* Logo */}
        <div className="flex items-center ml-2 sm:ml-4 lg:ml-8">
          <img
            src="/assets/vectors/logos/Logo-navbar.svg"
            alt="PetCharm Logo"
            className="h-[20px] sm:h-[24px] lg:h-[28px] w-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mr-2 sm:mr-4 lg:mr-8">
          <Link to="/login">
            <button className="relative px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 rounded-full border-2 border-transparent font-medium transition-all hover:opacity-80 text-xs sm:text-sm lg:text-base [background:linear-gradient(#F6F2F9,#F6F2F9)_padding-box,linear-gradient(90deg,#5054DB_0%,#C06DFF_100%)_border-box]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              <span className="bg-gradient-to-r from-[#5054DB] to-[#C06DFF] bg-clip-text text-transparent font-medium">
                Log in
              </span>
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 rounded-full bg-[#6366f1] text-white font-medium hover:bg-[#5558e3] transition-colors text-xs sm:text-sm lg:text-base">
              Sign up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-85px)] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-2 py-8 sm:py-12 lg:py-16 gap-8 sm:gap-12 lg:gap-36">
        {/* Left Side - Pet Charm Logo */}
        <div className="flex flex-col items-center justify-center w-full lg:max-w-[680px] order-2 lg:order-1">
          <img
            src="/assets/vectors/graphic-elements/Pet-charm.svg"
            alt="PetCharm Logo"
            className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-none h-auto object-contain transition-transform duration-300 hover:scale-105 hover:-rotate-2 cursor-pointer"
          />
          
          {/* Join Now Button */}
          <Link to="/signup">
            <button 
              className="mt-6 sm:mt-8 px-8 sm:px-10 lg:px-12 py-2.5 sm:py-3 lg:py-3.5 rounded-full bg-[#6366f1] text-white text-sm sm:text-base lg:text-lg hover:bg-[#5558e3] transition-colors shadow-lg"
              style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 'bold' }}
            >
              Join Now
            </button>
          </Link>
        </div>

        {/* Right Side - Animal Illustration */}
        <div className="flex items-center justify-center w-full lg:max-w-[680px] order-1 lg:order-2">
          <img
            src="/assets/vectors/graphic-elements/Trazos-animales.svg"
            alt="Pets Illustration"
            className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-none h-auto object-contain"
          />
        </div>
      </section>

      {/* What is PetCharm Section */}
      <section className="w-full relative min-h-[400px] sm:min-h-[500px] lg:min-h-[620px] overflow-hidden rounded-tr-[50px] sm:rounded-tr-[100px] lg:rounded-tr-[230px]">
        {/* Blue Background with Wave */}
        <img
          src="/assets/vectors/img/mockups/Rectangle-blue.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-4 sm:px-8 lg:px-20 pt-8 sm:pt-12 lg:pt-25 pb-8 sm:pb-12 lg:pb-20">
          {/* Left Content */}
          <div className="w-full lg:max-w-[550px] text-white mb-6 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              What is <span className="text-[#FCB43E]">PetCharm</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
              The social network where pets shine. Share your furry friend's best moments, collect charms, and join forums where pet lovers connect, ask questions, and celebrate the joy of pets together.
            </p>
          </div>

          {/* Right Content */}
          <div className="flex items-start justify-end w-full lg:max-w-[1000px] lg:-mt-30">
            {/* Pets Illustration */}
            <img
              src="/assets/vectors/img/mockups/pets-petcharm.svg"
              alt="Pets"
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* Social Network Section */}
      <section className="w-full bg-[#f5f0f0] pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-8 lg:px-20 -mt-20 sm:-mt-40 lg:-mt-85">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-32">
          {/* Mockups - Large and overlapping with blue section */}
          <div className="relative z-20 lg:-ml-10 order-2 lg:order-1">
            <img
              src="/assets/vectors/img/mockups/Phones-mockup.svg"
              alt="Phone Mockups"
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[620px] h-auto"
            />
          </div>

          {/* Content */}
          <div className="text-center lg:text-left w-full lg:max-w-[600px] mt-4 lg:mt-16 lg:ml-12 order-1 lg:order-2">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#6366f1]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              <span className="relative inline-block">
                Social network
                <span className="absolute bottom-0 left-0 w-full h-8 sm:h-12 lg:h-16" style={{ background: 'linear-gradient(90deg, rgba(255, 67, 161, 0.52) 0%, rgba(255, 67, 161, 0.00) 100%)' }}></span>
              </span>
              <br />
              for your pet
            </h3>
            <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl">
              Don't miss the opportunity to see adorable pets. Register now!
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link to="/signup">
                <button className="px-8 sm:px-10 lg:px-12 py-2.5 sm:py-3 rounded-full bg-[#FCB43E] text-white text-sm sm:text-base lg:text-lg font-semibold hover:bg-[#eaa02b] transition-colors shadow-lg">
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

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-16 min-h-[800px] sm:min-h-[1000px] lg:min-h-[1500px]">
          {/* Left - Laptop Mockup */}
          <div className="w-full lg:max-w-[1250px] lg:mt-50 relative mb-8 lg:mb-0">
            {/* Pattern Background - Diagonal */}
            <div className="hidden lg:block absolute left-[60%] bottom-0 translate-x-[-50%] w-[1300px] h-[1300px] pointer-events-none opacity-40" style={{ transform: 'translateX(-50%) rotate(-35deg)' }}>
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
              className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-none h-auto relative z-10 mx-auto lg:mx-0"
            />
          </div>

          {/* Right - Feature Cards */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-[500px]">
            {/* Pet Profiles Card */}
            <div className="bg-[#FFF4FD] rounded-[30px] sm:rounded-[40px] p-4 sm:p-6 lg:p-8 border-2 border-[#5054DB] flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#5054DB] mb-2 sm:mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Pet profiles</h4>
                <p className="text-[#4D3D3D] text-base sm:text-lg lg:text-[20px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>Put your pet on the spotlight</p>
              </div>
                <img src="/assets/vectors/graphic-elements/YelowCat.svg" alt="Cat Profile" className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] flex-shrink-0" />
            </div>

            {/* Community Card */}
            <div className="bg-[#FFF4FD] rounded-[30px] sm:rounded-[40px] p-4 sm:p-6 lg:p-8 border-2 border-[#5054DB] flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#5054DB] mb-2 sm:mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Community</h4>
                <p className="text-[#4D3D3D] text-base sm:text-lg lg:text-[20px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>Connect with pet lovers everywhere.</p>
              </div>
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] flex items-center justify-center flex-shrink-0">
                <div className="flex gap-2">
                  <img src="/assets/vectors/graphic-elements/Animals.svg" alt="Dog Profile" className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Charms Card */}
            <div className="bg-[#FFF4FD] rounded-[30px] sm:rounded-[40px] p-4 sm:p-6 lg:p-8 border-2 border-[#5054DB] flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-[#5054DB] mb-2 sm:mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Charms</h4>
                <p className="text-[#4D3D3D] text-base sm:text-lg lg:text-[20px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>Give and get "Charms" on your posts</p>
              </div>
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] flex items-center justify-center flex-shrink-0">
              <img src="/assets/vectors/graphic-elements/Footprint.svg" alt="Dog Profile" className="w-full h-full" />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Cards Section */}
      <section className="w-full bg-[#f5f0f0] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-20 relative">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 max-w-[1400px] mx-auto">
          {/* Log In Card */}
          <div className="relative w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[490px]">
            {/* Cat illustration - bottom left */}
            <div className="hidden sm:block absolute -bottom-6 sm:-bottom-8 lg:-bottom-10 -left-6 sm:-left-8 lg:-left-10 z-10">
              <img src="/assets/vectors/graphic-elements/YelowCat.svg" alt="Cat Profile" className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
            </div>
            
            {/* Dog illustration - top right */}
            <div className="hidden sm:block absolute -top-4 sm:-top-5 lg:-top-6 -right-4 sm:-right-5 lg:-right-6 z-10">
              <img src="/assets/vectors/graphic-elements/PostDog.svg" alt="Dog Profile" className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
            </div>

            <div className="bg-[#CAACFF] rounded-[20px] shadow-[0px_3.279px_8.197px_3.279px_rgba(0,0,0,0.25)] w-full h-auto min-h-[250px] sm:min-h-[280px] lg:h-[305px] flex flex-col items-center justify-center relative z-0 p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#1D1D1B] mb-3 sm:mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Log In
              </h3>
              <p className="text-base sm:text-lg lg:text-[20px] text-[#1D1D1B] mb-6 sm:mb-8 text-center max-w-[270px]" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                Welcome back—your pet's world is waiting!
              </p>
              <Link to="/login">
                <button className="bg-[#FF43A1] text-[#FFF4FD] px-8 sm:px-10 py-2.5 sm:py-3 rounded-[20px] text-sm sm:text-base lg:text-[16px] font-medium hover:bg-[#e63a8f] transition-colors" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Access now
                </button>
              </Link>
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="relative w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[490px]">
            {/* Cat illustration - bottom right */}
            <div className="hidden sm:block absolute -bottom-6 sm:-bottom-8 lg:-bottom-10 -right-6 sm:-right-8 lg:-right-10 z-10">
            <img src="/assets/vectors/graphic-elements/Dog2.svg" alt="Cat Profile" className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
            </div>
            
            {/* Dog illustration - top left */}
            <div className="hidden sm:block absolute -top-4 sm:-top-5 lg:-top-6 -left-4 sm:-left-5 lg:-left-6 z-10">
            <img src="/assets/vectors/graphic-elements/Cat2.svg" alt="Dog Profile" className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
            </div>

            <div className="bg-[#FCB43E] rounded-[20px] shadow-[0px_3.279px_8.197px_3.279px_rgba(0,0,0,0.25)] w-full h-auto min-h-[250px] sm:min-h-[280px] lg:h-[305px] flex flex-col items-center justify-center relative z-0 p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#1D1D1B] mb-3 sm:mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Sign Up
              </h3>
              <p className="text-base sm:text-lg lg:text-[20px] text-[#1D1D1B] mb-6 sm:mb-8 text-center max-w-[270px]" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}>
                Join PetCharm and let your pet shine!
              </p>
              <Link to="/signup">
                <button className="bg-[#4A67DB] text-[#FFF4FD] px-8 sm:px-10 py-2.5 sm:py-3 rounded-[20px] text-sm sm:text-base lg:text-[16px] font-medium hover:bg-[#3d57c4] transition-colors" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Register now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interact Section */}
      <section className="w-full bg-[#f5f0f0] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-20 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="hidden lg:block absolute -left-20 top-32 w-[217px] h-[217px] rounded-full bg-[#E5D9FF] opacity-50"></div>
        <div className="hidden lg:block absolute -right-12 bottom-12 w-[143px] h-[143px] rounded-full bg-[#FFE5F5] opacity-50"></div>
        <div className="hidden lg:block absolute right-1/4 bottom-12 w-[46px] h-[46px] rounded-full bg-[#FFE5D9] opacity-50"></div>
        <div className="hidden lg:block absolute left-24 bottom-4 w-[46px] h-[46px] rounded-full bg-[#FFF4D9] opacity-50"></div>

        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold leading-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            <span className="text-[#5054DB]">Interact with</span>
            <br />
            <span className="text-[#FF43A1]">others!</span>
          </h2>
        </div>

        <div className="flex items-center justify-center relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
          {/* Left Testimonial */}
          <div className="hidden md:block bg-white rounded-[20px] p-4 sm:p-6 shadow-lg max-w-[200px] sm:max-w-[250px] lg:max-w-[280px] absolute left-4 sm:left-8 lg:left-12 top-16 sm:top-24 lg:top-32 z-20">
            <p className="text-[#5054DB] text-xs sm:text-sm lg:text-[15px] leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              "This is honestly one of the funniest and cutest things I've seen today."
            </p>
          </div>

          {/* Center - Devices Mockup */}
          <div className="relative z-10">
            {/* Laptop */}
            <img
              src="/assets/vectors/img/mockups/MacBook-mockup.svg"
              alt="Laptop Mockup"
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[679px] h-auto relative z-10"
            />
            {/* Phone */}
            <img
              src="/assets/vectors/img/mockups/Phones-mockup.svg"
              alt="Phone Mockup"
              className="hidden lg:block w-[350px] h-auto absolute -left-32 bottom-8 z-20"
            />
            
            {/* Decorative Stars/Sparkles */}
            <div className="hidden lg:block absolute top-12 -left-16 text-[88px] z-0">✨</div>
            <div className="hidden lg:block absolute -bottom-4 left-48 text-[88px] z-0">✨</div>
          </div>

          {/* Right Testimonial */}
          <div className="hidden md:block bg-white rounded-[20px] p-4 sm:p-6 shadow-lg max-w-[180px] sm:max-w-[200px] lg:max-w-[233px] absolute right-4 sm:right-8 lg:right-32 top-20 sm:top-32 lg:top-48 z-20">
            <p className="text-[#5054DB] text-xs sm:text-sm lg:text-[15px] leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
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

        <div className="relative z-10 py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1263px] mx-auto px-4 sm:px-6 lg:px-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 lg:gap-0 text-white">
            {/* Exclusive */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg sm:text-xl lg:text-[25px] font-medium mb-4 sm:mb-6 lg:mb-[67px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Exclusive
              </h4>
              <p className="text-sm sm:text-base lg:text-[15px] mb-4 sm:mb-6 max-w-[146px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Subscribe to our newsletter
              </p>
              <div className="relative w-full max-w-[225px]">
                <input
                  type="email"
                  placeholder="Enter you email..."
                  className="w-full px-3 py-2 rounded-[4px] bg-transparent border border-white text-white text-sm sm:text-base lg:text-[15px] placeholder:text-white/70 placeholder:text-center outline-none"
                  style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-lg sm:text-xl">
                  ➤
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg sm:text-xl lg:text-[25px] font-medium mb-4 sm:mb-6 lg:mb-[65px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Contact
              </h4>
              <p className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Cra. 7 #78-96, Bogotá
              </p>
              <p className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                petcharm@gmail.com
              </p>
              <p className="text-sm sm:text-base lg:text-[15px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                +57-301-6414482
              </p>
            </div>

            {/* Account */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg sm:text-xl lg:text-[25px] font-medium mb-4 sm:mb-6 lg:mb-[65px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Account
              </h4>
              <Link to="/profile" className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                My Account
              </Link>
              <Link to="/login" className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Login / Register
              </Link>
              <Link to="/" className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Cart
              </Link>
              <Link to="/" className="text-sm sm:text-base lg:text-[15px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Shop
              </Link>
            </div>

            {/* Quick Link */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg sm:text-xl lg:text-[25px] font-medium mb-4 sm:mb-6 lg:mb-[65px]" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.5px' }}>
                Quick Link
              </h4>
              <a href="#" className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Privacy Policy
              </a>
              <a href="#" className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Terms Of Use
              </a>
              <a href="#" className="text-sm sm:text-base lg:text-[15px] mb-3 sm:mb-4 lg:mb-[38px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                FAQ
              </a>
              <a href="#" className="text-sm sm:text-base lg:text-[15px] hover:underline" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.3px' }}>
                Contact
              </a>
            </div>

            {/* Logo */}
            <div className="flex items-end justify-center sm:justify-start lg:justify-end relative sm:col-span-2 lg:col-span-1">
              <img
                src="/assets/vectors/logos/Logo-navbar.svg"
                alt="PetCharm Logo"
                className="w-[100px] sm:w-[120px] lg:w-[155px] h-auto"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

