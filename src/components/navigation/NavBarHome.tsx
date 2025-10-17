import React from "react";

function NavBarHome() {
    return (
    <header className="w-full h-[80px] bg-[#fdfbff] flex items-center justify-between shadow-[0_4px_8px_0_rgba(0,0,0,0.25)]">
      {/* Logo */}
        <div className="flex items-center h-full">
        <img
            src="/assets/vectors/logos/Logo-navbar.svg"
            alt="PetC Logo"
            className="h-[40%] w-auto px-[80px]"
        />
        </div>

      {/* Search Bar */}
        <div className="flex items-center gap-[10px] w-[300px] h-[40px] rounded-[30px] px-4 bg-white border-2 border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#5054DB_0%,#C06DFF_66.83%)_border-box]">
        <img
            src="/assets/icons/Search-icon.svg"
            alt="Search"
            className="w-6 h-6"
        />
        <input
            type="text"
            placeholder="Search..."
            className="w-full border-none outline-none bg-transparent text-[16px] text-[#555] placeholder:text-[#aaa]"
        />
        </div>

      {/* Profile Section */}
        <div className="h-full w-[260px] rounded-l-[50px] flex items-center justify-start pl-[30px] gap-[15px] text-white bg-gradient-to-r from-[#5054DB] to-[#6E72ED]">
        <img
          src="/assets/vectors/img/profile-pics/Pfp1.jpg" // replace later with profile picture
            alt="Profile"
            className="rounded-full h-[55px] w-[55px] object-cover"
        />
        <div className="flex flex-col">
            <h2 className="text-[18px] font-semibold leading-tight">valxcicat</h2>
            <p className="text-[13px] font-light leading-tight">meowing 😸</p>
        </div>
        </div>
    </header>
    )
}

export default NavBarHome;
