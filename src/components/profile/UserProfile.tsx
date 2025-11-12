import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAuth, usePosts, useUsers, useInteractions } from "../../store/hooks";
import { toggleFollow } from "../../store/slices/interactionsSlice";
import { incrementUserFollowers, decrementUserFollowers, registerUser } from "../../store/slices/usersSlice";
import Post from "../home/Post";

function UserProfile() {
  const dispatch = useAppDispatch();
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  const { posts } = usePosts();
  const { registeredUsers } = useUsers();
  const interactions = useInteractions();
  const following = interactions?.following || {};
  
  // Filtrar posts del usuario del perfil
  const userPosts = posts.filter(post => post.userName === username);
  
  // Función helper para normalizar rutas de imágenes
  const normalizeImagePath = (path: string): string => {
    if (!path) return path;
    if (path.startsWith('./assets')) {
      return path.replace('./assets', '/assets');
    }
    if (path.startsWith('assets')) {
      return '/' + path;
    }
    return path;
  };
  
  // Buscar el usuario del perfil en registeredUsers primero (siempre buscar de nuevo para obtener updates)
  let profileUser = registeredUsers.find(u => u.userName === username);
  
  // Si no está en registeredUsers, crear un perfil desde los posts
  if (!profileUser && userPosts.length > 0) {
    const firstPost = userPosts[0];
    profileUser = {
      id: `post-user-${username}`,
      email: '',
      password: '',
      userName: firstPost.userName,
      userPfp: normalizeImagePath(firstPost.userPfp),
      userStatus: firstPost.userStatus,
      bio: undefined,
      followersCount: 0,
      followingCount: 0,
    };
  }
  
  // Normalizar la ruta de la imagen del perfil si existe (siempre)
  if (profileUser) {
    profileUser = {
      ...profileUser,
      userPfp: normalizeImagePath(profileUser.userPfp),
    };
  }
  
  // Asegurar que el usuario esté en registeredUsers ANTES de cualquier cosa
  useEffect(() => {
    if (profileUser && !registeredUsers.find(u => u.userName === username)) {
      dispatch(registerUser({
        email: `${username}@petcharm.com`,
        password: '',
        userName: profileUser.userName,
        userPfp: profileUser.userPfp,
        userStatus: profileUser.userStatus,
        bio: profileUser.bio,
        followersCount: 0,
        followingCount: 0,
      }));
    }
  }, [profileUser, username, registeredUsers, dispatch]);

  // Verificar si el usuario actual sigue al usuario del perfil (igual que isLiked)
  const isFollowing = profileUser ? (following[profileUser.userName] || false) : false;
  
  const handleFollowToggle = () => {
    if (!profileUser || !username) return;
    
    // Toggle follow state (igual que toggleLikePost)
    dispatch(toggleFollow(profileUser.userName));
    
    // Actualizar contador (igual que incrementPostLikes/decrementPostLikes)
    if (isFollowing) {
      dispatch(decrementUserFollowers(profileUser.userName));
    } else {
      dispatch(incrementUserFollowers(profileUser.userName));
    }
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please log in to view profiles.</p>
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">User not found.</p>
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
                src={profileUser.userPfp}
                alt="Profile"
                className="block w-[180px] h-[180px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mt-16 text-center">
        <h1 className="text-[40px] font-semibold text-gray-800">
          <span className="text-black font-bold">{profileUser.userName}</span>
        </h1>
        <p className="text-[20px] text-gray-600 mt-1 flex items-center justify-center gap-1">
          {profileUser.userStatus}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4 text-gray-700">
          <div className="text-center">
            <p className="font-semibold text-indigo-600 text-[25px]">{userPosts.length}</p>
            <p className="text-[20px]">Post</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-indigo-600 text-[25px]">
              {(() => {
                const latestUser = registeredUsers.find(u => u.userName === username);
                return latestUser?.followersCount ?? 0;
              })()}
            </p>
            <p className="text-[20px]">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-indigo-600 text-[25px]">{profileUser.followingCount || 0}</p>
            <p className="text-[20px]">Following</p>
          </div>
        </div>

        {/* Follow Button */}
        <div className="mt-6">
          <button
            onClick={handleFollowToggle}
            className={`px-8 py-2 rounded-full border-2 transition-colors ${
              isFollowing
                ? "bg-white border-purple-400 text-purple-600 hover:bg-purple-50"
                : "bg-purple-400 border-purple-400 text-white hover:bg-purple-500"
            } font-medium`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        {/* Subtítulo */}
        <div className="gap-[600px] mt-12 flex items-center justify-between w-full max-w-[1200px] px-4">
          <h2 className="text-[32px] font-bold">
            {profileUser.userName}'s <span className="text-pink-600">Posts</span>
          </h2>
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
              <p className="text-gray-500 text-lg">No posts yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

