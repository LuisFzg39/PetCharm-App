import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  togglePostLikeInDB,
  fetchUserPostLikes,
  toggleCommentLikeInDB,
  fetchUserCommentLikes,
  getCurrentUser,
} from '../../services/supabaseService';

// Estado inicial del slice de interacciones
interface InteractionsState {
  likedPosts: Record<string, boolean>; // { postId: true/false }
  savedPosts: Record<string, boolean>; // { postId: true/false }
  likedComments: Record<string, boolean>; // { commentId: true/false }
  following: Record<string, boolean>; // { userName: true/false }
  loading: boolean;
  error: string | null;
}

const initialState: InteractionsState = {
  likedPosts: {},
  savedPosts: {},
  likedComments: {},
  following: {},
  loading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Thunk para cargar los likes del usuario desde Supabase
 */
export const fetchUserInteractions = createAsyncThunk(
  'interactions/fetchUserInteractions',
  async (_, { rejectWithValue }) => {
    try {
      // Obtener el userId del usuario actual
      const user = await getCurrentUser();
      if (!user) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      const [postLikes, commentLikes] = await Promise.all([
        fetchUserPostLikes(user.id),
        fetchUserCommentLikes(user.id),
      ]);
      
      return {
        postLikes,
        commentLikes,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar las interacciones');
    }
  }
);

/**
 * Thunk para toggle like en un post
 */
export const togglePostLikeAsync = createAsyncThunk(
  'interactions/togglePostLike',
  async (
    { postId }: { postId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      // Obtener el userId del usuario actual
      const user = await getCurrentUser();
      if (!user) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      const state = getState() as any;
      const isLiked = state.interactions.likedPosts[postId] || false;
      
      await togglePostLikeInDB(postId, user.id, isLiked);
      
      return { postId, isLiked: !isLiked };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar el like');
    }
  }
);

/**
 * Thunk para toggle like en un comentario
 */
export const toggleCommentLikeAsync = createAsyncThunk(
  'interactions/toggleCommentLike',
  async (
    { commentId }: { commentId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      // Obtener el userId del usuario actual
      const user = await getCurrentUser();
      if (!user) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      const state = getState() as any;
      const isLiked = state.interactions.likedComments[commentId] || false;
      
      await toggleCommentLikeInDB(commentId, user.id, isLiked);
      
      return { commentId, isLiked: !isLiked };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar el like del comentario');
    }
  }
);

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    // Toggle save en un post (local, no se guarda en DB por ahora)
    toggleSavePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.savedPosts[postId] = !state.savedPosts[postId];
    },
    
    // Unsave un post (útil para limpiar)
    unsavePost: (state, action: PayloadAction<string>) => {
      state.savedPosts[action.payload] = false;
    },
    
    // Toggle follow/unfollow de un usuario (local)
    toggleFollow: (state, action: PayloadAction<string>) => {
      const userName = action.payload;
      if (!state.following) {
        state.following = {};
      }
      state.following[userName] = !state.following[userName];
    },
    
    // Reset todas las interacciones (útil al hacer logout)
    resetInteractions: (state) => {
      state.likedPosts = {};
      state.savedPosts = {};
      state.likedComments = {};
      state.following = {};
      state.error = null;
    },
    
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Interactions
      .addCase(fetchUserInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.likedPosts = action.payload.postLikes;
        state.likedComments = action.payload.commentLikes;
        state.error = null;
      })
      .addCase(fetchUserInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle Post Like
      .addCase(togglePostLikeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePostLikeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.likedPosts[action.payload.postId] = action.payload.isLiked;
        state.error = null;
      })
      .addCase(togglePostLikeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Revertir el cambio si falló
        const postId = (action.meta.arg as any).postId;
        state.likedPosts[postId] = !state.likedPosts[postId];
      })
      
      // Toggle Comment Like
      .addCase(toggleCommentLikeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCommentLikeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.likedComments[action.payload.commentId] = action.payload.isLiked;
        state.error = null;
      })
      .addCase(toggleCommentLikeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Revertir el cambio si falló
        const commentId = (action.meta.arg as any).commentId;
        state.likedComments[commentId] = !state.likedComments[commentId];
      });
  },
});

export const {
  toggleSavePost,
  unsavePost,
  toggleFollow,
  resetInteractions,
  clearError,
} = interactionsSlice.actions;

export default interactionsSlice.reducer;

