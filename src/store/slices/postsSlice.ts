import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import type { Post, Comment, CreatePostPayload, CreateCommentPayload } from '../../utils/types/Type';
import {
  fetchPosts as fetchPostsFromDB,
  createPostInDB,
  deletePostFromDB,
  updatePostCaptionInDB,
  addCommentToDB,
  deleteCommentFromDB,
  getCurrentUser,
} from '../../services/supabaseService';

// Estado inicial del slice de posts
interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Thunk para obtener todos los posts desde Supabase
 */
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const posts = await fetchPostsFromDB();
      return posts;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los posts');
    }
  }
);

/**
 * Thunk para crear un nuevo post
 */
export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (
    postData: CreatePostPayload,
    { rejectWithValue }
  ) => {
    try {
      // Obtener el userId del usuario actual
      const user = await getCurrentUser();
      if (!user) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      const newPost = await createPostInDB({
        ...postData,
        userId: user.id,
      });
      return newPost;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al crear el post');
    }
  }
);

/**
 * Thunk para eliminar un post
 */
export const deletePostAsync = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await deletePostFromDB(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar el post');
    }
  }
);

/**
 * Thunk para actualizar el caption de un post
 */
export const updatePostCaptionAsync = createAsyncThunk(
  'posts/updatePostCaption',
  async (
    { postId, caption }: { postId: string; caption: string },
    { rejectWithValue }
  ) => {
    try {
      await updatePostCaptionInDB(postId, caption);
      return { postId, caption };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar el post');
    }
  }
);

/**
 * Thunk para agregar un comentario
 */
export const addCommentAsync = createAsyncThunk(
  'posts/addComment',
  async (
    commentData: CreateCommentPayload,
    { rejectWithValue }
  ) => {
    try {
      // Obtener el userId del usuario actual
      const user = await getCurrentUser();
      if (!user) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      const newComment = await addCommentToDB({
        ...commentData,
        userId: user.id,
      });
      return { postId: commentData.postId, comment: newComment };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al agregar el comentario');
    }
  }
);

/**
 * Thunk para eliminar un comentario
 */
export const deleteCommentAsync = createAsyncThunk(
  'posts/deleteComment',
  async (
    { postId, commentId }: { postId: string; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      await deleteCommentFromDB(commentId);
      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar el comentario');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Incrementar likes de un post (optimistic update)
    incrementPostLikes: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    },
    
    // Decrementar likes de un post (optimistic update)
    decrementPostLikes: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post && post.likes > 0) {
        post.likes -= 1;
      }
    },
    
    // Incrementar likes de un comentario (optimistic update)
    incrementCommentLikes: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.likes += 1;
        }
      }
    },
    
    // Decrementar likes de un comentario (optimistic update)
    decrementCommentLikes: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment && comment.likes > 0) {
          comment.likes -= 1;
        }
      }
    },
    
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REHYDRATE: Cuando se restaura el estado desde localStorage
      // No sobrescribimos los posts aquí, los cargaremos desde Supabase después
      .addCase(REHYDRATE, (state, action: any) => {
        // Mantener los posts que vienen de localStorage como fallback
        // pero se recargarán desde Supabase en DataInitializer
        if (action.payload?.posts?.posts) {
          state.posts = action.payload.posts.posts;
        }
      })
      
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Siempre actualizar con los datos más recientes de Supabase
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Si falla, mantener los posts del localStorage si existen
      })
      
      // Create Post
      .addCase(createPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Post
      .addCase(deletePostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Post Caption
      .addCase(updatePostCaptionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostCaptionAsync.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.postCaption = action.payload.caption;
        }
        state.error = null;
      })
      .addCase(updatePostCaptionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add Comment
      .addCase(addCommentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments.push(action.payload.comment);
          post.commentsCount = post.comments.length;
        }
        state.error = null;
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Comment
      .addCase(deleteCommentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments = post.comments.filter(c => c.id !== action.payload.commentId);
          post.commentsCount = post.comments.length;
        }
        state.error = null;
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  incrementPostLikes,
  decrementPostLikes,
  incrementCommentLikes,
  decrementCommentLikes,
  clearError,
} = postsSlice.actions;

export default postsSlice.reducer;

