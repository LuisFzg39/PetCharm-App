import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsers as fetchUsersFromDB,
  registerUserInDB,
  updateUserInDB,
  updateUserFollowers,
} from '../../services/supabaseService';

// Tipo para usuario registrado (credenciales + info)
export interface RegisteredUser {
  id: string;
  email: string;
  password: string; // En producción esto NO debería guardarse así, usar hash
  userName: string;
  userPfp: string;
  userStatus: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}

interface UsersState {
  registeredUsers: RegisteredUser[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  registeredUsers: [],
  loading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Thunk para obtener todos los usuarios desde Supabase
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchUsersFromDB();
      return users;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los usuarios');
    }
  }
);

/**
 * Thunk para registrar un nuevo usuario
 */
export const registerUserAsync = createAsyncThunk(
  'users/registerUser',
  async (userData: Omit<RegisteredUser, 'id'>, { rejectWithValue }) => {
    try {
      const newUser = await registerUserInDB(userData);
      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al registrar el usuario');
    }
  }
);

/**
 * Thunk para actualizar datos de un usuario
 */
export const updateRegisteredUserAsync = createAsyncThunk(
  'users/updateRegisteredUser',
  async (
    { userId, updates }: { userId: string; updates: Partial<RegisteredUser> },
    { rejectWithValue }
  ) => {
    try {
      await updateUserInDB(userId, updates);
      return { userId, updates };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar el usuario');
    }
  }
);

/**
 * Thunk para incrementar/decrementar followers
 */
export const updateUserFollowersAsync = createAsyncThunk(
  'users/updateUserFollowers',
  async (
    { userName, increment }: { userName: string; increment: boolean },
    { rejectWithValue }
  ) => {
    try {
      await updateUserFollowers(userName, increment);
      return { userName, increment };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar los seguidores');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register User
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredUsers.push(action.payload);
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Registered User
      .addCase(updateRegisteredUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegisteredUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const user = state.registeredUsers.find(u => u.id === action.payload.userId);
        if (user) {
          Object.assign(user, action.payload.updates);
        }
        state.error = null;
      })
      .addCase(updateRegisteredUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update User Followers
      .addCase(updateUserFollowersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserFollowersAsync.fulfilled, (state, action) => {
        state.loading = false;
        const user = state.registeredUsers.find(u => u.userName === action.payload.userName);
        if (user) {
          if (action.payload.increment) {
            user.followersCount = (user.followersCount || 0) + 1;
          } else {
            user.followersCount = Math.max(0, (user.followersCount || 0) - 1);
          }
        }
        state.error = null;
      })
      .addCase(updateUserFollowersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;

