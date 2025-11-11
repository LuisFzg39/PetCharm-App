import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../utils/types/Type';

// Estado inicial del slice de autenticación
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login de usuario (setea el usuario actual)
    loginUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    
    // Logout de usuario
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    
    // Actualizar perfil del usuario
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
    
    // Actualizar status del usuario
    updateUserStatus: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.userStatus = action.payload;
      }
    },
    
    // Incrementar contador de posts del usuario
    incrementUserPostsCount: (state) => {
      if (state.currentUser && state.currentUser.postsCount !== undefined) {
        state.currentUser.postsCount += 1;
      }
    },
  },
});

export const { 
  loginUser, 
  logoutUser, 
  updateUserProfile, 
  updateUserStatus,
  incrementUserPostsCount,
} = authSlice.actions;

export default authSlice.reducer;

