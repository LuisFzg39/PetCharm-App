import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { Post, Comment, CreatePostPayload, CreateCommentPayload } from '../../utils/types/Type';
import usersData from '../../data/users.json';

// Estado inicial del slice de posts
interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

// Función helper para agregar IDs a los datos existentes
const addIdsToInitialData = (): Post[] => {
  return usersData.map((post) => ({
    ...post,
    id: nanoid(),
    comments: post.comments.map((comment) => ({
      ...comment,
      id: nanoid(),
    })),
  }));
};

const initialState: PostsState = {
  posts: addIdsToInitialData(),
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Crear un nuevo post
    createPost: (state, action: PayloadAction<CreatePostPayload & { user: { userName: string; userPfp: string; userStatus: string } }>) => {
      const newPost: Post = {
        id: nanoid(),
        userName: action.payload.user.userName,
        userPfp: action.payload.user.userPfp,
        userStatus: action.payload.user.userStatus,
        postImg: action.payload.imageUrl,
        postCaption: action.payload.caption,
        likes: 0,
        commentsCount: 0,
        comments: [],
      };
      
      // Agregar al inicio del array (más reciente primero)
      state.posts.unshift(newPost);
    },
    
    // Eliminar un post
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    
    // Actualizar caption de un post
    updatePostCaption: (state, action: PayloadAction<{ postId: string; caption: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.postCaption = action.payload.caption;
      }
    },
    
    // Agregar un comentario a un post
    addComment: (state, action: PayloadAction<CreateCommentPayload & { user: { userName: string; userPfp: string; userStatus: string } }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const newComment: Comment = {
          id: nanoid(),
          userName: action.payload.user.userName,
          userPfp: action.payload.user.userPfp,
          userStatus: action.payload.user.userStatus,
          commentTxt: action.payload.commentTxt,
          likes: 0,
        };
        
        post.comments.push(newComment);
        post.commentsCount = post.comments.length;
      }
    },
    
    // Eliminar un comentario
    deleteComment: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments = post.comments.filter(c => c.id !== action.payload.commentId);
        post.commentsCount = post.comments.length;
      }
    },
    
    // Incrementar likes de un post
    incrementPostLikes: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    },
    
    // Decrementar likes de un post
    decrementPostLikes: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post && post.likes > 0) {
        post.likes -= 1;
      }
    },
    
    // Incrementar likes de un comentario
    incrementCommentLikes: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.likes += 1;
        }
      }
    },
    
    // Decrementar likes de un comentario
    decrementCommentLikes: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment && comment.likes > 0) {
          comment.likes -= 1;
        }
      }
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  createPost,
  deletePost,
  updatePostCaption,
  addComment,
  deleteComment,
  incrementPostLikes,
  decrementPostLikes,
  incrementCommentLikes,
  decrementCommentLikes,
  setLoading,
  setError,
} = postsSlice.actions;

export default postsSlice.reducer;

