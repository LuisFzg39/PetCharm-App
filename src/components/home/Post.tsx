import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth, useInteractions } from "../../store/hooks";
import { togglePostLikeAsync, toggleCommentLikeAsync, toggleSavePost } from "../../store/slices/interactionsSlice";
import { incrementPostLikes, decrementPostLikes, addCommentAsync, incrementCommentLikes, decrementCommentLikes, fetchPosts } from "../../store/slices/postsSlice";
import type { Comment } from "../../utils/types/Type";

type PostProps = {
    postId: string;
    userName: string;
    userPfp: string;
    userStatus: string;
    postImg: string;
    postCaption: string;
    likes: number;
    commentsCount?: number;
    comments: Comment[];
};

function Post({
    postId,
    userName,
    userPfp,
    userStatus,
    postImg,
    postCaption,
    likes,
    commentsCount,
    comments,
}: PostProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser } = useAuth();
    const { likedPosts, savedPosts, likedComments } = useInteractions();
    
    const [commentInput, setCommentInput] = useState("");
    const [showComments, setShowComments] = useState(false);
    
    // Función helper para normalizar rutas de imágenes
    const normalizeImagePath = (path: string): string => {
        if (!path) return path;
        if (path.startsWith('./assets')) {
            return path.replace('./assets', '/assets');
        }
        if (path.startsWith('assets') && !path.startsWith('/assets')) {
            return '/' + path;
        }
        return path;
    };
    
    // Normalizar imágenes
    const normalizedUserPfp = normalizeImagePath(userPfp);
    const normalizedPostImg = normalizeImagePath(postImg);
    const normalizedComments = comments.map(comment => ({
        ...comment,
        userPfp: normalizeImagePath(comment.userPfp),
    }));
    
    const isLiked = likedPosts[postId] || false;
    const isSaved = savedPosts[postId] || false;
    
    const handleProfileClick = () => {
        // Si es el perfil propio, ir a /profile, sino a /profile/:username
        if (currentUser && userName === currentUser.userName) {
            navigate('/profile');
        } else {
            navigate(`/profile/${userName}`);
        }
    };
    
    const handleLikeClick = async () => {
        if (!currentUser) return;
        
        // Optimistic update
        if (isLiked) {
            dispatch(decrementPostLikes(postId));
        } else {
            dispatch(incrementPostLikes(postId));
        }
        
        // Actualizar en Supabase
        const result = await dispatch(togglePostLikeAsync({ postId }));
        
        // Recargar posts para tener los contadores actualizados desde Supabase
        if (togglePostLikeAsync.fulfilled.match(result)) {
            await dispatch(fetchPosts());
        }
    };
    
    const handleSaveClick = () => {
        dispatch(toggleSavePost(postId));
    };
    
    const handleSendComment = async () => {
        if (!commentInput.trim() || !currentUser) return;
        
        try {
            const result = await dispatch(addCommentAsync({
                postId,
                commentTxt: commentInput.trim(),
            }));
            
            if (addCommentAsync.fulfilled.match(result)) {
                // Recargar posts para actualizar el contador de comentarios
                await dispatch(fetchPosts());
                setCommentInput("");
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    
    const handleCommentLikeClick = async (commentId: string) => {
        if (!currentUser) return;
        
        const isCommentLiked = likedComments[commentId] || false;
        
        // Optimistic update
        if (isCommentLiked) {
            dispatch(decrementCommentLikes({ postId, commentId }));
        } else {
            dispatch(incrementCommentLikes({ postId, commentId }));
        }
        
        // Actualizar en Supabase
        const result = await dispatch(toggleCommentLikeAsync({ commentId }));
        
        // Recargar posts para tener los contadores actualizados desde Supabase
        if (toggleCommentLikeAsync.fulfilled.match(result)) {
            await dispatch(fetchPosts());
        }
    };

    return (
    <article
        className="
        w-full max-w-full lg:w-[600px] h-auto flex flex-col bg-white rounded-[15px] overflow-hidden justify-self-center
        mt-4 lg:mt-[90px] mb-4 lg:mb-0 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border-[3px] border-[#5054DB]
        "
    >   
      {/* Content */}
        <div className="w-full pt-4 lg:pt-[40px] pl-4 lg:pl-[50px] pr-4 lg:pr-[50px] pb-4 lg:pb-[40px] relative">
        {/* Icono Options en el extremo derecho superior */}
        <div className="absolute top-4 lg:top-[40px] right-4 lg:right-[50px]">
            <div className="post-options cursor-pointer">
            <img
                src="/assets/icons/Options-icon.svg"
                alt="options"
                className="w-6 h-6 lg:w-[30px] lg:h-[30px]"
            />
            </div>
        </div>

        {/* header */}
        <div className="post-header flex items-center w-full lg:w-[390px]">
            <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
            <img
                src={normalizedUserPfp}
                alt="pfp"
                className="h-[50px] w-[50px] lg:h-[60px] lg:w-[60px] rounded-full object-cover"
            />
            <div className="ml-3 lg:ml-[20px]">
                <h3 className="m-0 text-base lg:text-[18px] font-semibold">{userName}</h3>
                <p className="m-0 text-xs lg:text-[13px] font-light">{userStatus}</p>
            </div>
            </div>
        </div>

        {/* post image */}
        <div className="post-img w-full h-[300px] lg:h-[500px] overflow-hidden rounded-[16px] mt-3 lg:mt-[20px]">
            <img
            src={normalizedPostImg}
            alt="post"
            className="w-full h-full object-cover object-center"
            />
        </div>

        {/* icons */}
        <div className="post-icons flex items-center justify-between mt-3 lg:mt-[20px] text-lg lg:text-[22px] font-semibold">
            <div className="first-icons flex gap-6 lg:gap-[30px] items-center">
            {/* Likes */}
            <div
                className="likes flex items-center gap-2 lg:gap-[8px] cursor-pointer"
                onClick={handleLikeClick}
            >
                <img
                src={
                    isLiked
                    ? "/assets/icons/FullCharm-icon.svg"
                    : "/assets/icons/Charm-icon.svg"
                }
                alt="likes"
                className="h-7 w-7 lg:h-[35px] lg:w-auto transition-transform duration-150 hover:scale-110"
                />
                <p className="m-0">{likes}</p>
            </div>

            {/* Comments */}
            <div 
                className="comments flex items-center gap-2 lg:gap-[8px] cursor-pointer"
                onClick={() => setShowComments(true)}
            >
                <img
                src="/assets/icons/Comment-icon.svg"
                alt="comments"
                className="h-7 w-7 lg:h-[35px] lg:w-auto"
                />
                <p className="m-0">{commentsCount ?? comments.length}</p>
            </div>
            </div>

            {/* Save icon - Alineado verticalmente con Options, horizontalmente con likes/comments */}
            <div className="save cursor-pointer">
            <img
                src={
                isSaved
                    ? "/assets/icons/FullSave-icon.svg"
                    : "/assets/icons/Save-icon.svg"
                }
                alt="save"
                className="h-7 w-7 lg:h-[35px] lg:w-auto transition-transform duration-150 hover:scale-110"
                onClick={handleSaveClick}
            />
            </div>
        </div>

        {/* caption */}
        <div className="post-caption w-full mt-3 lg:mt-[20px]">
            <p className="m-0 text-sm lg:text-[16px]">
            <strong>{userName}</strong> {postCaption}
            </p>
        </div>
        </div>


      {/* Popup de comentarios para móvil y desktop */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 lg:p-8" onClick={() => setShowComments(false)}>
          <div 
            className="bg-[#825CFF] rounded-[20px] w-full max-w-[500px] lg:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del popup */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h3 className="text-white text-xl font-bold">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-white hover:text-gray-200 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Lista de comentarios */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {normalizedComments.length > 0 ? (
                normalizedComments.map((comment) => {
                  const isCommentLiked = likedComments[comment.id] || false;
                  return (
                    <div
                      className="comment text-white flex flex-col gap-3 mb-6 pb-4 border-b border-white/10 last:border-b-0"
                      key={comment.id}
                    >
                      <div className="comment-pf flex gap-3 items-center">
                        <img
                          src={comment.userPfp}
                          alt="comment-pfp"
                          className="h-[45px] w-[45px] rounded-full object-cover"
                        />
                        <div className="pf-text">
                          <h3 className="text-base font-medium m-0">
                            {comment.userName}
                          </h3>
                          <p className="text-sm font-light m-0">
                            {comment.userStatus}
                          </p>
                        </div>
                      </div>

                      <div className="comment-text text-base font-[300] text-white">
                        <p className="m-0">{comment.commentTxt}</p>
                      </div>

                      <div 
                        className="comment-likes flex gap-2 text-base font-[500] items-center cursor-pointer"
                        onClick={() => handleCommentLikeClick(comment.id)}
                      >
                        <img
                          src={
                            isCommentLiked
                              ? "/assets/icons/FullLike-icon.svg"
                              : "/assets/icons/Like-icon.svg"
                          }
                          alt="like"
                          className="w-[18px] h-[18px] transition-transform duration-150 hover:scale-110"
                        />
                        <p className="m-0">{comment.likes}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-white/70 py-8">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Input de comentario */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendComment();
                    }
                  }}
                  className="flex-1 border-none bg-white/20 rounded-[20px] outline-none text-sm lg:text-base font-[300] text-white px-4 py-2 placeholder:text-white/60"
                />
                <button 
                  onClick={handleSendComment}
                  className="w-[80px] lg:w-[100px] h-[36px] rounded-[20px] bg-[#FCB43E] text-white border-none font-[500] cursor-pointer hover:bg-[#eaa02b] transition-colors text-sm lg:text-base"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
    );
}

export default Post;
