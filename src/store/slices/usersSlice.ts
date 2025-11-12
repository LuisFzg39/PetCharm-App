import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit';

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
}

const initialState: UsersState = {
  registeredUsers: [
    // Usuario por defecto para testing
    {
      id: '1',
      email: 'valxcicat@petcharm.com',
      password: '123456', // En producción, esto debe ser un hash
      userName: 'valxcicat',
      userPfp: '/assets/vectors/img/profile-pics/Pfp1.jpg',
      userStatus: 'meowing 😸',
      bio: 'Cat lover 🐱 | Photography enthusiast 📷',
      followersCount: 900,
      followingCount: 300,
    },
  ],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Registrar un nuevo usuario
    registerUser: (state, action: PayloadAction<Omit<RegisteredUser, 'id'>>) => {
      const newUser: RegisteredUser = {
        id: nanoid(),
        ...action.payload,
      };
      state.registeredUsers.push(newUser);
    },
    
    // Actualizar datos de un usuario registrado
    updateRegisteredUser: (state, action: PayloadAction<{ userId: string; updates: Partial<RegisteredUser> }>) => {
      const user = state.registeredUsers.find(u => u.id === action.payload.userId);
      if (user) {
        Object.assign(user, action.payload.updates);
      }
    },
    
    // Incrementar followers de un usuario por userName
    incrementUserFollowers: (state, action: PayloadAction<string>) => {
      const user = state.registeredUsers.find(u => u.userName === action.payload);
      if (user) {
        user.followersCount = (user.followersCount || 0) + 1;
      }
    },
    
    // Decrementar followers de un usuario por userName
    decrementUserFollowers: (state, action: PayloadAction<string>) => {
      const user = state.registeredUsers.find(u => u.userName === action.payload);
      if (user && user.followersCount && user.followersCount > 0) {
        user.followersCount -= 1;
      }
    },
  },
});

export const { registerUser, updateRegisteredUser, incrementUserFollowers, decrementUserFollowers } = usersSlice.actions;
export default usersSlice.reducer;

