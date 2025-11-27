import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  togglePostLikeInDB,
  fetchUserPostLikes,
  toggleCommentLikeInDB,
  fetchUserCommentLikes,
  getCurrentUser,
  toggleFollowInDB,
  fetchUserFollowing,
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
      
      const [postLikes, commentLikes, following] = await Promise.all([
        fetchUserPostLikes(user.id),
        fetchUserCommentLikes(user.id),
        fetchUserFollowing(user.id),
      ]);
      
      return {
        postLikes,
        commentLikes,
        following,
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
      const currentIsLiked = state.interactions.likedPosts[postId] || false;
      const newIsLiked = !currentIsLiked;
      
      // Actualizar en la base de datos
      await togglePostLikeInDB(postId, user.id, currentIsLiked);
      
      return { postId, isLiked: newIsLiked };
    } catch (error: any) {
      // Si es un error de duplicado, no es crítico, continuar
      if (error.code === '23505') {
        const state = getState() as any;
        const currentIsLiked = state.interactions.likedPosts[postId] || false;
        return { postId, isLiked: !currentIsLiked };
      }
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

/**
 * Thunk para toggle follow/unfollow de un usuario
 */
export const toggleFollowAsync = createAsyncThunk(
  'interactions/toggleFollow',
  async (
    { userName, currentIsFollowing }: { userName: string; currentIsFollowing?: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      // Obtener el userId del usuario actual
      const user = await getCurrentUser();
      if (!user) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      // Usar el estado pasado como parámetro, o leerlo del store si no se proporciona
      const state = getState() as any;
      const isFollowing = currentIsFollowing !== undefined 
        ? currentIsFollowing 
        : (state.interactions.following[userName] || false);
      
      // Guardar relación en la base de datos usando el estado CORRECTO (antes del toggle)
      await toggleFollowInDB(user.id, userName, isFollowing);
      
      // Si intentamos seguir (!isFollowing) y la operación fue exitosa (o la relación ya existía),
      // el nuevo estado es que SÍ está siguiendo
      // Si intentamos dejar de seguir (isFollowing) y la operación fue exitosa,
      // el nuevo estado es que NO está siguiendo
      const newIsFollowing = !isFollowing;
      
      // No actualizar contadores aquí - se calcularán desde la tabla follows cuando sea necesario
      // Las funciones updateUserFollowers y updateUserFollowing son opcionales
      // y solo funcionan si las columnas followers_count y following_count existen
      
      return { userName, isFollowing: newIsFollowing };
    } catch (error: any) {
      // Si el error indica que la relación ya existe, no es realmente un error
      // La relación ya existe, así que el estado debería ser que SÍ está siguiendo
      if (error.message?.includes('already exists') || error.message?.includes('out of sync')) {
        const state = getState() as any;
        const wasTryingToFollow = !(currentIsFollowing !== undefined 
          ? currentIsFollowing 
          : (state.interactions.following[userName] || false));
        
        // Si intentábamos seguir y la relación ya existe, retornar éxito con isFollowing = true
        if (wasTryingToFollow) {
          return { userName, isFollowing: true };
        }
      }
      return rejectWithValue(error.message || 'Error al actualizar el seguimiento');
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
    
    // Toggle follow/unfollow de un usuario (local, para updates optimistas)
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
        state.following = action.payload.following || {};
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
        // Actualizar el estado local con el nuevo valor
        state.likedPosts[action.payload.postId] = action.payload.isLiked;
        state.error = null;
      })
      .addCase(togglePostLikeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Revertir el cambio si falló
        const postId = (action.meta.arg as any).postId;
        if (postId) {
          state.likedPosts[postId] = !state.likedPosts[postId];
        }
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
        if (commentId) {
          state.likedComments[commentId] = !state.likedComments[commentId];
        }
      })
      
      // Toggle Follow
      .addCase(toggleFollowAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFollowAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.following[action.payload.userName] = action.payload.isFollowing;
        state.error = null;
      })
      .addCase(toggleFollowAsync.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        
        // Si el error indica que la relación ya existe, actualizar el estado para reflejar que SÍ está siguiendo
        const userName = (action.meta.arg as any).userName;
        if (userName) {
          if (errorMessage?.includes('already exists') || errorMessage?.includes('out of sync')) {
            // La relación ya existe en la DB, actualizar el estado local para reflejar que SÍ está siguiendo
            state.following[userName] = true;
            state.error = null; // No es realmente un error
          } else {
            // Para otros errores, revertir el cambio optimista
            state.following[userName] = !state.following[userName];
          }
        }
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

