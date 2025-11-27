import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import type { User } from '../../utils/types/Type';
import {
  signInWithAuth,
  signUpWithAuth,
  signOut as signOutAuth,
  getCurrentUserProfile,
  checkEmailExists,
  checkUsernameExists,
  updateUserInDB,
} from '../../services/supabaseService';

// Estado inicial del slice de autenticación
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Thunk para verificar sesión existente al cargar la app
 */
export const checkAuthSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const userProfile = await getCurrentUserProfile();
      if (!userProfile || !userProfile.profile) {
        // No hay sesión o perfil, esto es normal si el usuario no está autenticado
        return null;
      }

      // Convertir a formato User
      const authUser: User = {
        id: userProfile.profile.id,
        userName: userProfile.profile.username, // Columna real: username
        userPfp: userProfile.profile.pfp_url, // Columna real: pfp_url
        userStatus: userProfile.profile.status, // Columna real: status
        bio: undefined, // bio no existe
        postsCount: 0, // Se puede calcular desde posts
        followersCount: userProfile.profile.followers_count || 0,
        followingCount: userProfile.profile.following_count || 0,
      };

      return authUser;
    } catch (error: any) {
      // Si es un error de sesión faltante, no es un error real
      if (error?.message?.includes('session') || error?.message?.includes('Auth session missing')) {
        return null;
      }
      // Solo rechazar si es un error real
      return rejectWithValue(error.message || 'Error al verificar sesión');
    }
  }
);

/**
 * Thunk para login de usuario con Supabase Auth
 */
export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await signInWithAuth(email, password);
      
      if (!result.userProfile) {
        return rejectWithValue('No se pudo obtener el perfil del usuario');
      }

      // Convertir a formato User
      const authUser: User = {
        id: result.userProfile.id,
        userName: result.userProfile.username, // Columna real: username
        userPfp: result.userProfile.pfp_url, // Columna real: pfp_url
        userStatus: result.userProfile.status, // Columna real: status
        bio: undefined, // bio no existe
        postsCount: 0, // Se puede calcular desde posts
        followersCount: result.userProfile.followers_count || 0,
        followingCount: result.userProfile.following_count || 0,
      };

      return authUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Credenciales inválidas');
    }
  }
);

/**
 * Thunk para registro de usuario con Supabase Auth
 */
export const registerUserAsync = createAsyncThunk(
  'auth/registerUser',
  async (
    {
      email,
      password,
      userName,
      userPfp,
      userStatus,
      bio,
    }: {
      email: string;
      password: string;
      userName: string;
      userPfp: string;
      userStatus: string;
      bio?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Verificar si el email ya existe
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return rejectWithValue('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const usernameExists = await checkUsernameExists(userName);
      if (usernameExists) {
        return rejectWithValue('El nombre de usuario ya está en uso');
      }

      const result = await signUpWithAuth(email, password, {
        userName,
        userPfp,
        userStatus,
        bio,
      });

      if (!result.userProfile) {
        return rejectWithValue('No se pudo crear el perfil del usuario');
      }

      // Convertir a formato User
      const authUser: User = {
        id: result.userProfile.id,
        userName: result.userProfile.username, // Columna real: username
        userPfp: result.userProfile.pfp_url, // Columna real: pfp_url
        userStatus: result.userProfile.status, // Columna real: status
        bio: undefined, // bio no existe
        postsCount: 0,
        followersCount: result.userProfile.followers_count || 0,
        followingCount: result.userProfile.following_count || 0,
      };

      return authUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al registrar el usuario');
    }
  }
);

/**
 * Thunk para logout
 */
export const logoutUserAsync = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOutAuth();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

/**
 * Thunk para actualizar perfil del usuario
 */
export const updateUserProfileAsync = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    { userId, updates }: { userId: string; updates: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      // Convertir User updates a RegisteredUser format (que updateUserInDB espera)
      const dbUpdates: any = {};
      if (updates.userName !== undefined) dbUpdates.userName = updates.userName;
      if (updates.userPfp !== undefined) dbUpdates.userPfp = updates.userPfp;
      if (updates.userStatus !== undefined) dbUpdates.userStatus = updates.userStatus;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.followersCount !== undefined) dbUpdates.followersCount = updates.followersCount;
      if (updates.followingCount !== undefined) dbUpdates.followingCount = updates.followingCount;
      
      await updateUserInDB(userId, dbUpdates);
      return updates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar el perfil');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout de usuario (sincrónico, para usar con logoutUserAsync)
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    
    // Restaurar sesión desde persist (se llama automáticamente por redux-persist)
    // Este reducer se ejecuta cuando REHYDRATE restaura el estado
    
    // Actualizar status del usuario (optimistic update)
    updateUserStatus: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.userStatus = action.payload;
      }
    },
    
    // Incrementar contador de posts del usuario (optimistic update)
    incrementUserPostsCount: (state) => {
      if (state.currentUser && state.currentUser.postsCount !== undefined) {
        state.currentUser.postsCount += 1;
      }
    },
    
    // Incrementar/decrementar contador de following del usuario (optimistic update)
    updateUserFollowingCount: (state, action: PayloadAction<boolean>) => {
      if (state.currentUser) {
        const increment = action.payload;
        state.currentUser.followingCount = increment
          ? (state.currentUser.followingCount || 0) + 1
          : Math.max(0, (state.currentUser.followingCount || 0) - 1);
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
      .addCase(REHYDRATE, (state, action: any) => {
        // Restaurar el estado de auth desde localStorage
        if (action.payload?.auth) {
          const persistedAuth = action.payload.auth;
          // Solo restaurar si hay un usuario guardado
          if (persistedAuth.currentUser && persistedAuth.isAuthenticated) {
            state.currentUser = persistedAuth.currentUser;
            state.isAuthenticated = persistedAuth.isAuthenticated;
          }
        }
        // La verificación real de la sesión se hará en checkAuthSession
      })
      
      // Check Auth Session
      .addCase(checkAuthSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Actualizar con los datos más recientes de Supabase
          state.currentUser = action.payload;
          state.isAuthenticated = true;
        } else {
          // Si no hay sesión válida en Supabase, limpiar el estado
          state.currentUser = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(checkAuthSession.rejected, (state, action) => {
        state.loading = false;
        // No limpiar el estado si es un error de sesión faltante
        // Solo limpiar si es un error real
        if (!action.payload?.toString().includes('session')) {
          state.error = action.payload as string;
          state.isAuthenticated = false;
          state.currentUser = null;
        }
      })
      
      // Login User
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Register User
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Logout User
      .addCase(logoutUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update User Profile
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload,
          };
        }
        state.error = null;
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  logoutUser, 
  updateUserStatus,
  incrementUserPostsCount,
  updateUserFollowingCount,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

