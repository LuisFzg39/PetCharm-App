import usersData from '../data/users.json';

/**
 * Extrae todas las fotos de perfil únicas del JSON
 */
export const getAvailableProfilePics = (): string[] => {
  const profilePics = new Set<string>();
  
  // Extraer de los posts principales
  usersData.forEach((post: any) => {
    if (post.userPfp) {
      // Normalizar la ruta
      const normalized = post.userPfp.startsWith('./assets')
        ? post.userPfp.replace('./assets', '/assets')
        : post.userPfp.startsWith('/assets')
        ? post.userPfp
        : `/assets/${post.userPfp}`;
      profilePics.add(normalized);
    }
    
    // Extraer de los comentarios
    if (post.comments) {
      post.comments.forEach((comment: any) => {
        if (comment.userPfp) {
          const normalized = comment.userPfp.startsWith('./assets')
            ? comment.userPfp.replace('./assets', '/assets')
            : comment.userPfp.startsWith('/assets')
            ? comment.userPfp
            : `/assets/${comment.userPfp}`;
          profilePics.add(normalized);
        }
      });
    }
  });
  
  return Array.from(profilePics);
};

/**
 * Extrae todos los estados únicos del JSON
 */
export const getAvailableUserStatuses = (): string[] => {
  const statuses = new Set<string>();
  
  // Extraer de los posts principales
  usersData.forEach((post: any) => {
    if (post.userStatus) {
      statuses.add(post.userStatus);
    }
    
    // Extraer de los comentarios
    if (post.comments) {
      post.comments.forEach((comment: any) => {
        if (comment.userStatus) {
          statuses.add(comment.userStatus);
        }
      });
    }
  });
  
  return Array.from(statuses);
};

/**
 * Obtiene una foto de perfil aleatoria
 */
export const getRandomProfilePic = (): string => {
  const pics = getAvailableProfilePics();
  if (pics.length === 0) {
    // Fallback si no hay fotos disponibles
    return '/assets/icons/Profile-icon.svg';
  }
  return pics[Math.floor(Math.random() * pics.length)];
};

/**
 * Obtiene un estado aleatorio
 */
export const getRandomUserStatus = (): string => {
  const statuses = getAvailableUserStatuses();
  if (statuses.length === 0) {
    // Fallback si no hay estados disponibles
    return '🐾 New member';
  }
  return statuses[Math.floor(Math.random() * statuses.length)];
};

