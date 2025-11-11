import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook personalizado para dispatch con tipos
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook personalizado para selector con tipos
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hooks de conveniencia para acceder a diferentes partes del estado
export const useAuth = () => useAppSelector(state => state.auth);
export const usePosts = () => useAppSelector(state => state.posts);
export const useInteractions = () => useAppSelector(state => state.interactions);
export const useUsers = () => useAppSelector(state => state.users);

