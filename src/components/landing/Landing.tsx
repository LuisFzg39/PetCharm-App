import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f0f0]">
      {/* Navbar */}
      <nav className="w-full h-[70px] bg-[#f5f0f0] flex items-center justify-between px-12 shadow-[0_4px_8px_0_rgba(0,0,0,0.25)]">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/assets/vectors/logos/Logo-navbar.svg"
            alt="PetCharm Logo"
            className="h-[35px] w-auto"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="relative px-8 py-2 rounded-full bg-white border-2 border-transparent font-medium transition-all hover:opacity-80 [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#5054DB_0%,#C06DFF_100%)_border-box]">
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
      <section className="w-full min-h-[calc(100vh-70px)] flex items-center justify-between px-20 py-16">
        {/* Left Side - Logo & CTA */}
        <div className="flex flex-col items-start max-w-[500px]">
          {/* Pet Icon */}
          <div className="mb-6">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 110C87.614 110 110 87.614 110 60C110 32.386 87.614 10 60 10C32.386 10 10 32.386 10 32.386C10 60 32.386 110 60 110Z" fill="#FCB43E"/>
              <ellipse cx="45" cy="50" rx="8" ry="12" fill="#1a1a1a"/>
              <ellipse cx="75" cy="50" rx="8" ry="12" fill="#1a1a1a"/>
              <rect x="54" y="60" width="12" height="15" rx="2" fill="#1a1a1a"/>
              <path d="M35 35L45 25L50 35H35Z" fill="#FCB43E" stroke="#FCB43E" strokeWidth="2"/>
              <path d="M85 35L75 25L70 35H85Z" fill="#FCB43E" stroke="#FCB43E" strokeWidth="2"/>
            </svg>
          </div>

          {/* PetCharm Logo Text */}
          <div className="mb-8">
            <h1 className="text-7xl font-bold">
              <span className="text-[#FCB43E]">Pet</span>
              <span className="text-[#6366f1]">Charm</span>
            </h1>
            <p className="text-[#6366f1] text-2xl mt-2 font-light">Where pets shine</p>
          </div>

          {/* CTA Button */}
          <Link to="/signup">
            <button className="px-12 py-3.5 rounded-full bg-[#6366f1] text-white text-lg font-semibold hover:bg-[#5558e3] transition-colors shadow-lg">
              Join Now
            </button>
          </Link>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex items-center justify-center max-w-[600px]">
          <img
            src="/assets/vectors/Collage.svg"
            alt="Pet Collage"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* What is PetCharm Section */}
      <section className="w-full min-h-screen bg-[#6366f1] relative overflow-hidden rounded-t-[80px] px-20 py-20">
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full h-[200px]">
          <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 100C240 50 480 150 720 100C960 50 1200 150 1440 100V200H0V100Z" fill="white" fillOpacity="0.1"/>
          </svg>
        </div>

        <div className="relative z-10 flex items-start justify-between">
          {/* Left Content */}
          <div className="max-w-[500px] text-white">
            <h2 className="text-5xl font-bold mb-6">
              What is <span className="text-[#FCB43E]">PetCharm</span>?
            </h2>
            <p className="text-lg leading-relaxed mb-8">
              The social network where pets shine. Share your furry friend's best moments, collect charms, and join forums where pet lovers connect, ask questions, and celebrate the joy of pets together.
            </p>

            {/* Mockup Phones */}
            <div className="mt-12">
              <img
                src="/assets/vectors/img/mockups/Celulares mockup.svg"
                alt="App Mockup"
                className="w-[450px] h-auto"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-end max-w-[450px] mt-20">
            {/* Decorative Pets */}
            <div className="flex gap-6 mb-8">
              <img
                src="/assets/vectors/graphic-elements/PostDog.svg"
                alt="Dog"
                className="w-[100px] h-[100px]"
              />
              <img
                src="/assets/vectors/graphic-elements/PostCat2.svg"
                alt="Cat"
                className="w-[100px] h-[100px]"
              />
            </div>

            {/* Social Network Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
              <h3 className="text-4xl font-bold mb-4">
                <span className="text-[#FF43A1]">Social network</span>
                <br />
                <span className="text-[#6366f1]">for your pet</span> 🥰
              </h3>
              <p className="text-gray-700 mb-6">
                Don't miss the opportunity to see adorable pets. Register now!
              </p>
              <Link to="/signup">
                <button className="px-10 py-3 rounded-full bg-[#FCB43E] text-white text-lg font-semibold hover:bg-[#eaa02b] transition-colors shadow-lg">
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;

