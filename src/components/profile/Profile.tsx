import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth, usePosts } from "../../store/hooks";
import { logoutUser } from "../../store/slices/authSlice";
import { resetInteractions } from "../../store/slices/interactionsSlice";
import Post from "../home/Post";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { posts } = usePosts();
  
  // Filtrar posts del usuario actual
  const userPosts = posts.filter(post => post.userName === currentUser?.userName);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetInteractions());
    navigate('/login');
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f9f5f2] font-sans">
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
        <div className="gap-[600px] mt-12 flex items-center justify-between w-full max-w-[1200px] px-4">
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

        {/* Posts Column - matching home feed layout */}
        <div className="w-full flex flex-col items-center pb-12 mt-8">
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
  );
}

export default Profile;  