import React from "react";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f9f5f2] font-sans">
      {/* Header con fondo de ilustración */}
      <div className="w-full h-80 bg-[url('/assets/vectors/img/ProfileBanner.svg')] bg-cover bg-center flex items-end justify-center">
        <div className="relative -mb-12">
          <div className="relative inline-flex rounded-full bg-gradient-to-r from-[#5054DB] to-[#C06DFF] p-[4px]">
                    <div className="rounded-full overflow-hidden">
                         <img
                                src="/assets/icons/Profile-icon.svg"
                                alt="Profile"
                                className="block w-[180px] h-[180px] object-cover"
                            />
                    </div>
            </div>

            <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-[#5054DB] to-[#C06DFF] p-[2.5px]">
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition">
                    <img
                        src="/assets/icons/Pencil-icon.svg"
                        alt="Edit"
                        className="w-[50%] h-[50%] object-contain"
                    />
                </button>
            </div>

        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mt-16 text-center">
        <h1 className="text-[40px] font-semibold text-gray-800">
          Hey, <span className="text-black font-bold">valxcicat!</span>
        </h1>
        <p className="text-[20px] text-gray-600 mt-1 flex items-center justify-center gap-1">
          meowing <span className="text-xl">😺</span>
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4 text-gray-700">
          <div className="text-center">
            <p className="font-semibold text-indigo-600 text-[25px]">20</p>
            <p className="text-[20px]">Post</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-indigo-600 text-[25px]">900</p>
            <p className="text-[20px]">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-indigo-600 text-[25px]">300</p>
            <p className="text-[20px]">Following</p>
          </div>
        </div>

        {/* Subtítulo + Botón Log out */}
        <div className="gap-[600px] mt-12 flex items-center justify-between w-full mx-auto">
            <h2 className="text-[32px] font-bold">
             Your <span className="text-pink-600">Posts</span>
         </h2>

            <button className="relative inline-flex rounded-full p-[1.5px] bg-gradient-to-r from-[#4f46e5] via-[#b48cff] to-[#ff66cc] hover:opacity-90 transition">
                <span className="inline-flex items-center justify-center px-9 py-1.5 rounded-full bg-[#f9f5f2] text-sm font-medium">
                    Log out
                </span>
            </button>


        </div>

        {/* Espacio en blanco debajo */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}

export default Profile;  