import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage por defecto
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import interactionsReducer from './slices/interactionsSlice';
import usersReducer from './slices/usersSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Qué slices queremos persistir
  // auth: para mantener la sesión
  // interactions: para mantener likes/saves del usuario
  // users: para mantener la lista de usuarios
  // posts: se carga desde Supabase, pero se persiste como cache
  whitelist: ['auth', 'posts', 'interactions', 'users'],
};

// Combinar reducers
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  interactions: interactionsReducer,
  users: usersReducer,
});

// Crear reducer con persistencia
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuración del store principal
export const store = configureStore({
  reducer: persistedReducer,
  // Middleware para redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones de redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor para PersistGate
export const persistor = persistStore(store);

// Tipos inferidos del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

