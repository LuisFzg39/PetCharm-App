import { useEffect } from "react";
import CreatePost from "../components/home/CreatePost";
import Post from "../components/home/Post";
import { useAppDispatch, usePosts, useAuth } from "../store/hooks";
import { fetchPosts } from "../store/slices/postsSlice";
import { fetchUserInteractions } from "../store/slices/interactionsSlice";

function HomeFeed() {
  const dispatch = useAppDispatch();
  const { posts, loading } = usePosts();
  const { currentUser } = useAuth();

  // Cargar posts al montar el componente
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Cargar interacciones del usuario si está autenticado
  useEffect(() => {
    if (currentUser?.userName) {
      dispatch(fetchUserInteractions());
    }
  }, [dispatch, currentUser]);

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center">
        <p className="text-lg text-gray-600">Cargando posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center pb-4 lg:pb-12">
      {/* Component to create a post - Solo en desktop */}
      <div className="hidden lg:block w-full">
        <CreatePost />
      </div>

      {/* Render all posts - filter duplicates by ID to prevent React key warnings */}
      <div className="w-full lg:w-auto px-5 lg:px-0">
        {posts
          .filter((post, index, self) => 
            // Mantener solo la primera ocurrencia de cada ID
            index === self.findIndex(p => p.id === post.id)
          )
          .map((post) => (
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
          ))}
      </div>
    </div>
  );
}

export default HomeFeed;
