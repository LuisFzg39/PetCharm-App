import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAuth, usePosts, useUsers, useInteractions } from "../../store/hooks";
import { toggleFollowAsync, fetchUserInteractions, toggleFollow } from "../../store/slices/interactionsSlice";
import { fetchUsers } from "../../store/slices/usersSlice";
import { checkAuthSession, updateUserFollowingCount } from "../../store/slices/authSlice";
import Post from "../home/Post";
import MobileNavBar from "../navigation/MobileNavBar";

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
  
  // Cargar usuarios e interacciones al montar
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserInteractions());
  }, [dispatch]);

  // No intentar registrar usuarios automáticamente
  // Los usuarios ya deben existir en la base de datos desde que crearon posts
  // Si no existe, se mostrará un mensaje de error

  // Verificar si el usuario actual sigue al usuario del perfil (igual que isLiked)
  const isFollowing = profileUser ? (following[profileUser.userName] || false) : false;
  
  const handleFollowToggle = async () => {
    if (!profileUser || !username || !currentUser) return;
    
    // Guardar el estado actual ANTES del toggle optimista
    const currentFollowingState = isFollowing;
    
    // Actualización optimista: actualizar el estado inmediatamente
    dispatch(toggleFollow(profileUser.userName));
    // Actualizar optimísticamente el contador de following del usuario actual
    dispatch(updateUserFollowingCount(!currentFollowingState)); // true = incrementar, false = decrementar
    
    try {
      // Toggle follow state y actualizar contadores en Supabase
      // Pasar el estado anterior para que el thunk use el valor correcto
      const result = await dispatch(toggleFollowAsync({ 
        userName: profileUser.userName,
        currentIsFollowing: currentFollowingState 
      }));
      
      // Si falló, el reducer revertirá el cambio automáticamente
      if (toggleFollowAsync.rejected.match(result)) {
        // Revertir el cambio optimista del contador
        dispatch(updateUserFollowingCount(currentFollowingState)); // Revertir al estado anterior
        // El reducer ya revertirá el cambio, solo loguear el error
        const errorMessage = result.payload as string;
        if (errorMessage?.includes('RLS') || errorMessage?.includes('row-level security')) {
          console.warn('Error de permisos RLS. Por favor, configura las políticas de seguridad en Supabase para la tabla "follows".');
        } else {
          console.warn('Error al hacer follow/unfollow:', errorMessage);
        }
      } else if (toggleFollowAsync.fulfilled.match(result)) {
        // Si fue exitoso, recargar usuarios, interacciones y perfil del usuario actual
        // para actualizar todos los contadores (esto sincronizará el contador optimista con la DB)
        // IMPORTANTE: Recargar interacciones para sincronizar el estado con la DB
        Promise.all([
          dispatch(fetchUsers()),
          dispatch(fetchUserInteractions()), // Esto sincronizará el estado following con la DB
          dispatch(checkAuthSession()), // Recargar perfil del usuario actual para actualizar followingCount
        ]).catch(err => console.warn('Error recargando datos después de follow:', err));
      }
    } catch (error) {
      // Si hay un error, revertir el cambio optimista
      dispatch(toggleFollow(profileUser.userName));
      dispatch(updateUserFollowingCount(currentFollowingState)); // Revertir el contador
      console.warn('Error en handleFollowToggle:', error);
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
            <p className="font-semibold text-indigo-600 text-[25px]">
              {(() => {
                const latestUser = registeredUsers.find(u => u.userName === username);
                return latestUser?.followingCount ?? 0;
              })()}
            </p>
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
                <p className="text-gray-500 text-lg">No posts yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

