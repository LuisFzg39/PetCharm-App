import { useEffect, useState } from 'react';
import { useAppDispatch, useAuth } from '../../store/hooks';
import { fetchPosts } from '../../store/slices/postsSlice';
import { fetchUserInteractions } from '../../store/slices/interactionsSlice';
import { fetchUsers } from '../../store/slices/usersSlice';

/**
 * Componente que carga todos los datos desde Supabase al iniciar la app
 * y cuando el usuario se autentica
 */
function DataInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAuth();
  const [isRehydrated, setIsRehydrated] = useState(false);

  // Esperar a que REHYDRATE termine antes de cargar datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRehydrated(true);
    }, 100); // Pequeño delay para asegurar que REHYDRATE terminó

    return () => clearTimeout(timer);
  }, []);

  // Cargar datos iniciales cuando REHYDRATE termine y el usuario esté autenticado
  useEffect(() => {
    if (!isRehydrated) return;

    if (isAuthenticated && currentUser) {
      // Siempre recargar posts desde Supabase para tener los datos más recientes
      dispatch(fetchPosts());

      // Cargar usuarios registrados
      dispatch(fetchUsers());

      // Cargar interacciones del usuario
      if (currentUser.userName) {
        dispatch(fetchUserInteractions());
      }
    } else {
      // Cargar posts públicos incluso si no hay usuario autenticado
      dispatch(fetchPosts());
    }
  }, [dispatch, isAuthenticated, currentUser, isRehydrated]);

  return <>{children}</>;
}

export default DataInitializer;

