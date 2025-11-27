import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { checkAuthSession, logoutUser } from '../../store/slices/authSlice';
import { fetchUserInteractions, resetInteractions } from '../../store/slices/interactionsSlice';
import { useAuth } from '../../store/hooks';
import { supabase } from '../../store/store';

/**
 * Componente que verifica la sesión de Supabase al iniciar la app
 * y escucha cambios en la autenticación
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    dispatch(checkAuthSession());

    // Escuchar cambios en la sesión de Supabase Auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Usuario inició sesión - verificar sesión
        dispatch(checkAuthSession());
      } else if (event === 'SIGNED_OUT') {
        // Usuario cerró sesión - limpiar estado
        dispatch(logoutUser());
        dispatch(resetInteractions());
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refrescado - verificar sesión
        dispatch(checkAuthSession());
      }
    });

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // Cargar interacciones cuando el usuario esté autenticado
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserInteractions());
    }
  }, [dispatch, currentUser]);

  return <>{children}</>;
}

export default AuthInitializer;

