import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth, usePosts } from "../../store/hooks";
import { logoutUserAsync, updateUserProfileAsync } from "../../store/slices/authSlice";
import { resetInteractions } from "../../store/slices/interactionsSlice";
import { fetchPosts } from "../../store/slices/postsSlice";
import Post from "../home/Post";
import MobileNavBar from "../navigation/MobileNavBar";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { posts } = usePosts();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(currentUser?.userName || "");
  const [editStatus, setEditStatus] = useState(currentUser?.userStatus || "");
  
  // Filtrar posts del usuario actual
  const userPosts = posts.filter(post => post.userName === currentUser?.userName);
  
  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    dispatch(resetInteractions());
    navigate('/login');
  };

  const handleOpenEditModal = () => {
    if (currentUser) {
      setEditName(currentUser.userName);
      setEditStatus(currentUser.userStatus);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      const result = await dispatch(updateUserProfileAsync({
        userId: currentUser.id,
        updates: {
          userName: editName.trim(),
          userStatus: editStatus.trim(),
        }
      }));
      
      if (updateUserProfileAsync.fulfilled.match(result)) {
        setShowEditModal(false);
        // Recargar posts para actualizar los nombres en los posts
        await dispatch(fetchPosts());
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f9f5f2] font-sans relative overflow-x-hidden">
      {/* Mobile: Navbars */}
      <MobileNavBar />
      
      {/* Desktop: NavBarHome se renderiza desde App.tsx */}
      {/* Header con fondo de ilustración */}
      <div className="w-full h-80 bg-[url('/assets/vectors/img/ProfileBanner.svg')] bg-cover bg-center flex items-end justify-center">
        <div className="relative -mb-12">
          <div className="relative inline-flex rounded-full bg-gradient-to-r from-[#5054DB] to-[#C06DFF] p-[4px]">
                    <div className="rounded-full overflow-hidden">
                         <img
                                src={currentUser.userPfp}
                                alt="Profile"
                                className="block w-[180px] h-[180px] object-cover"
                            />
                    </div>
            </div>

            <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-[#5054DB] to-[#C06DFF] p-[2.5px]">
                <button 
                    onClick={handleOpenEditModal}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition"
                >
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
      <div className="mt-16 w-full">
        <div className="text-center">
          <h1 className="text-[40px] font-semibold text-gray-800">
            Hey, <span className="text-black font-bold">{currentUser.userName}!</span>
          </h1>
          <p className="text-[20px] text-gray-600 mt-1 flex items-center justify-center gap-1">
            {currentUser.userStatus}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4 text-gray-700">
            <div className="text-center">
              <p className="font-semibold text-indigo-600 text-[25px]">{userPosts.length}</p>
              <p className="text-[20px]">Post</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-indigo-600 text-[25px]">{currentUser.followersCount || 0}</p>
              <p className="text-[20px]">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-indigo-600 text-[25px]">{currentUser.followingCount || 0}</p>
              <p className="text-[20px]">Following</p>
            </div>
          </div>

          {/* Subtítulo + Botón Log out */}
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-center sm:justify-between w-full max-w-[1200px] px-4 mx-auto gap-4 sm:gap-0">
              <h2 className="text-[32px] font-bold">
               Your <span className="text-pink-600">Posts</span>
           </h2>

              <button 
                onClick={handleLogout}
                className="relative inline-flex rounded-full p-[1.5px] bg-gradient-to-r from-[#4f46e5] via-[#b48cff] to-[#ff66cc] hover:opacity-90 transition cursor-pointer">
                  <span className="inline-flex items-center justify-center px-9 py-1.5 rounded-full bg-[#f9f5f2] text-sm font-medium">
                      Log out
                  </span>
              </button>
          </div>
        </div>

        {/* Posts Column - matching home feed layout exactly */}
        <div className="w-full flex flex-col items-center pb-20 lg:pb-12 mt-8">
          <div className="w-full lg:w-auto px-5 lg:px-0">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  userName={post.userName}
                  userPfp={post.userPfp}
                  userStatus={post.userStatus}
                  postImg={post.postImg}
                  postCaption={post.postCaption}
                  likes={post.likes}
                  commentsCount={post.commentsCount}
                  comments={post.comments}
                />
              ))
            ) : (
              <div className="mt-12 text-center">
                <p className="text-gray-500 text-lg">No posts yet. Start sharing your pet moments!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseEditModal}
        >
          <div 
            className="bg-white rounded-[20px] w-full max-w-[500px] p-6 lg:p-8 relative border border-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>

            {/* Título con iconos */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <img
                src="/assets/icons/Cat-icon.svg"
                alt="cat"
                className="w-8 h-8"
              />
              <h2 className="text-2xl font-bold text-[#825CFF]">
                Edit Profile
              </h2>
              <img
                src="/assets/icons/Dog-icon.svg"
                alt="dog"
                className="w-8 h-8"
              />
            </div>

            {/* Campo Name */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-base">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="username..."
                className="w-full px-4 py-3 rounded-lg border-2 border-[#825CFF] outline-none focus:border-[#825CFF] focus:ring-2 focus:ring-[#825CFF]/20 text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Campo Status */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-base">
                Status
              </label>
              <input
                type="text"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                placeholder="status..."
                className="w-full px-4 py-3 rounded-lg border-2 border-[#825CFF] outline-none focus:border-[#825CFF] focus:ring-2 focus:ring-[#825CFF]/20 text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Botón de guardar */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 rounded-full bg-[#825CFF] text-white font-medium hover:bg-[#6b4dd4] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;  