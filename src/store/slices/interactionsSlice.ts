import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Estado inicial del slice de interacciones
interface InteractionsState {
  likedPosts: Record<string, boolean>; // { postId: true/false }
  savedPosts: Record<string, boolean>; // { postId: true/false }
  likedComments: Record<string, boolean>; // { commentId: true/false }
}

const initialState: InteractionsState = {
  likedPosts: {},
  savedPosts: {},
  likedComments: {},
};

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    // Toggle like en un post
    toggleLikePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.likedPosts[postId] = !state.likedPosts[postId];
    },
    
    // Toggle save en un post
    toggleSavePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.savedPosts[postId] = !state.savedPosts[postId];
    },
    
    // Toggle like en un comentario
    toggleLikeComment: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      state.likedComments[commentId] = !state.likedComments[commentId];
    },
    
    // Unlike un post (útil para limpiar)
    unlikePost: (state, action: PayloadAction<string>) => {
      state.likedPosts[action.payload] = false;
    },
    
    // Unsave un post (útil para limpiar)
    unsavePost: (state, action: PayloadAction<string>) => {
      state.savedPosts[action.payload] = false;
    },
    
    // Unlike un comentario
    unlikeComment: (state, action: PayloadAction<string>) => {
      state.likedComments[action.payload] = false;
    },
    
    // Reset todas las interacciones (útil al hacer logout)
    resetInteractions: (state) => {
      state.likedPosts = {};
      state.savedPosts = {};
      state.likedComments = {};
    },
  },
});

export const {
  toggleLikePost,
  toggleSavePost,
  toggleLikeComment,
  unlikePost,
  unsavePost,
  unlikeComment,
  resetInteractions,
} = interactionsSlice.actions;

export default interactionsSlice.reducer;

