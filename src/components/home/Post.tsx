import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth, useInteractions } from "../../store/hooks";
import { toggleLikePost, toggleSavePost, toggleLikeComment } from "../../store/slices/interactionsSlice";
import { incrementPostLikes, decrementPostLikes, addComment, incrementCommentLikes, decrementCommentLikes } from "../../store/slices/postsSlice";
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
    
    const handleLikeClick = () => {
        dispatch(toggleLikePost(postId));
        if (isLiked) {
            dispatch(decrementPostLikes(postId));
        } else {
            dispatch(incrementPostLikes(postId));
        }
    };
    
    const handleSaveClick = () => {
        dispatch(toggleSavePost(postId));
    };
    
    const handleSendComment = () => {
        if (!commentInput.trim() || !currentUser) return;
        
        dispatch(addComment({
            postId,
            commentTxt: commentInput.trim(),
            user: {
                userName: currentUser.userName,
                userPfp: currentUser.userPfp,
                userStatus: currentUser.userStatus,
            },
        }));
        
        setCommentInput("");
    };
    
    const handleCommentLikeClick = (commentId: string) => {
        const isCommentLiked = likedComments[commentId] || false;
        dispatch(toggleLikeComment(commentId));
        if (isCommentLiked) {
            dispatch(decrementCommentLikes({ postId, commentId }));
        } else {
            dispatch(incrementCommentLikes({ postId, commentId }));
        }
    };

    return (
    <article
        className="
        w-[1050px] h-[700px] flex bg-white rounded-[15px] overflow-hidden justify-self-center
        mt-[90px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border-[3px] border-[#5054DB]
        "
    >   
      {/* LEFT */}
        <div className="post-left w-[45%] h-full pt-[40px] pl-[50px]">
        {/* header */}
        <div className="post-header flex items-center justify-between w-[390px]">
            <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
            <img
                src={normalizedUserPfp}
                alt="pfp"
                className="h-[60px] w-[60px] rounded-full object-cover"
            />
            <div className="ml-[20px]">
                <h3 className="m-0 text-[18px] font-semibold">{userName}</h3>
                <p className="m-0 text-[13px] font-light">{userStatus}</p>
            </div>
            </div>

            <div className="post-options">
            <img
                src="/assets/icons/Options-icon.svg"
                alt="options"
                className="w-[30px] h-[30px]"
            />
            </div>
        </div>

        {/* post image */}
        <div className="post-img w-[400px] h-[400px] overflow-hidden rounded-[16px] mt-[20px]">
            <img
            src={normalizedPostImg}
            alt="post"
            className="w-full h-full object-cover object-center"
            />
        </div>

        {/* icons */}
        <div className="post-icons flex items-center mt-[20px] text-[22px] font-semibold">
            <div className="first-icons flex gap-[30px] items-center">
            {/* Likes */}
            <div
                className="likes flex items-center gap-[8px] cursor-pointer"
                onClick={handleLikeClick}
            >
                <img
                src={
                    isLiked
                    ? "/assets/icons/FullCharm-icon.svg"
                    : "/assets/icons/Charm-icon.svg"
                }
                alt="likes"
                className="h-[35px] w-auto transition-transform duration-150 hover:scale-110"
                />
                <p className="m-0">{likes}</p>
            </div>

            {/* Comments */}
            <div className="comments flex items-center gap-[8px]">
                <img
                src="/assets/icons/Comment-icon.svg"
                alt="comments"
                className="h-[35px] w-auto"
                />
                <p className="m-0">{commentsCount ?? comments.length}</p>
            </div>
            </div>

          {/* Save */}
            <div className="save ml-[195px] cursor-pointer">
            <img
                src={
                isSaved
                    ? "/assets/icons/FullSave-icon.svg"
                    : "/assets/icons/Save-icon.svg"
                }
                alt="save"
                className="h-[35px] w-auto transition-transform duration-150 hover:scale-110"
                onClick={handleSaveClick}
            />
            </div>
        </div>

        {/* caption */}
        <div className="post-caption w-[370px] mt-[20px]">
            <p className="m-0 text-[16px]">
            <strong>{userName}</strong> {postCaption}
            </p>
        </div>
        </div>

      {/* RIGHT */}
        <div className="post-right bg-[#825CFF] flex flex-col items-center w-[60%] h-full ml-[50px]">
        <div className="w-full flex-1 flex flex-col items-start overflow-y-auto px-[50px]">
            {normalizedComments.slice(0, 3).map((comment) => {
                const isCommentLiked = likedComments[comment.id] || false;
                return (
                <div
                    className="comment text-white flex flex-col gap-[15px] mt-[40px] w-full"
                    key={comment.id}
                >
                    <div className="comment-pf flex gap-[10px] items-center">
                    <img
                        src={comment.userPfp}
                        alt="comment-pfp"
                        className="h-[50px] w-[50px] rounded-full object-cover"
                    />
                    <div className="pf-text">
                        <h3 className="text-[16px] font-medium m-0">
                        {comment.userName}
                        </h3>
                        <p className="text-[14px] font-light m-0">
                        {comment.userStatus}
                        </p>
                    </div>
                    </div>

                    <div className="comment-text text-[18px] font-[300] text-white w-[400px]">
                    <p className="m-0">{comment.commentTxt}</p>
                    </div>

                    <div 
                        className="comment-likes flex gap-[10px] text-[18px] font-[500] items-center cursor-pointer"
                        onClick={() => handleCommentLikeClick(comment.id)}
                    >
                    <img
                        src={
                            isCommentLiked
                                ? "/assets/icons/FullLike-icon.svg"
                                : "/assets/icons/Like-icon.svg"
                        }
                        alt="like"
                        className="w-[20px] h-[20px] transition-transform duration-150 hover:scale-110"
                    />
                    <p className="m-0">{comment.likes}</p>
                    </div>
                </div>
                );
            })}
        </div>

        {/* bottom comment input */}
        <div className="post-comment mt-auto mb-[30px] flex items-center gap-[16px]">
            <input
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            className="border-none bg-transparent outline-none text-[16px] font-[300] text-white w-[340px] placeholder:text-[#d3d3d3]"
            />
            <button 
            onClick={handleSendComment}
            className="w-[130px] h-[34px] rounded-[40px] bg-[#FCB43E] text-white border-none font-[400] cursor-pointer hover:bg-[#eaa02b] transition-colors">
            Send
            </button>
        </div>
        </div>
    </article>
    );
}

export default Post;
