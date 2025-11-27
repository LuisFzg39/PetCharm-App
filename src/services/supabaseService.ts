import { supabase } from '../store/store';
import type { Post, Comment, User, CreatePostPayload, CreateCommentPayload } from '../utils/types/Type';
import type { RegisteredUser } from '../store/slices/usersSlice';

// ==================== POSTS ====================

/**
 * Obtener todos los posts desde Supabase
 * Hace consultas separadas y hace el join manualmente
 */
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    // Obtener posts (sin created_at ya que no existe en la tabla)
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('id, image_url, caption, user_id');

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      // Loggear el error completo para depuración
      if (postsError.message) {
        console.error('Posts error message:', postsError.message);
      }
      if (postsError.details) {
        console.error('Posts error details:', postsError.details);
      }
      return [];
    }
    if (!postsData || postsData.length === 0) return [];

    // Obtener todos los user_ids únicos de posts y comentarios
    const userIds = new Set<string>();
    postsData.forEach(post => {
      if (post.user_id) userIds.add(post.user_id);
    });

    // Obtener datos de usuarios
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, username, pfp_url, status')
      .in('id', Array.from(userIds));

    if (usersError) {
      console.warn('Error fetching users for posts:', usersError);
    }

    // Crear mapa de usuarios por id
    const usersMap = new Map<string, any>();
    usersData?.forEach(user => {
      usersMap.set(user.id, user);
    });

    // Obtener comentarios (sin created_at ya que no existe en la tabla)
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('id, post_id, text, user_id');

    if (commentsError) {
      console.warn('Error fetching comments:', commentsError);
    }

    // Obtener user_ids de comentarios
    commentsData?.forEach(comment => {
      if (comment.user_id) userIds.add(comment.user_id);
    });

    // Si hay nuevos user_ids en comentarios, obtener esos usuarios también
    if (commentsData && commentsData.length > 0) {
      const commentUserIds = commentsData
        .map(c => c.user_id)
        .filter(id => id && !usersMap.has(id));
      
      if (commentUserIds.length > 0) {
        const { data: commentUsersData } = await supabase
          .from('users')
          .select('id, username, pfp_url, status')
          .in('id', commentUserIds);
        
        commentUsersData?.forEach(user => {
          usersMap.set(user.id, user);
        });
      }
    }

    // Obtener likes de posts
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('post_id');

    if (likesError) {
      console.warn('Error fetching post likes:', likesError);
    }

    // Contar likes por post
    const likesCount: Record<string, number> = {};
    likesData?.forEach(like => {
      likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1;
    });

    // Obtener likes de comentarios
    const { data: commentLikesData, error: commentLikesError } = await supabase
      .from('comment_likes')
      .select('comment_id');

    if (commentLikesError) {
      console.warn('Error fetching comment likes:', commentLikesError);
    }

    // Contar likes por comentario
    const commentLikesCount: Record<string, number> = {};
    commentLikesData?.forEach(like => {
      commentLikesCount[like.comment_id] = (commentLikesCount[like.comment_id] || 0) + 1;
    });

    // Mapear posts y agregar comentarios
    const posts: Post[] = postsData.map((post: any) => {
      const user = usersMap.get(post.user_id);
      
      const postComments = (commentsData || [])
        .filter((comment: any) => comment.post_id === post.id)
        .map((comment: any) => {
          const commentUser = usersMap.get(comment.user_id);
          return {
            id: comment.id,
            userName: commentUser?.username || 'unknown',
            userPfp: commentUser?.pfp_url || '',
            userStatus: commentUser?.status || '',
            commentTxt: comment.text || '',
            likes: commentLikesCount[comment.id] || 0,
          };
        });

      return {
        id: post.id,
        userName: user?.username || 'unknown',
        userPfp: user?.pfp_url || '',
        userStatus: user?.status || '',
        postImg: post.image_url || '',
        postCaption: post.caption || '',
        likes: likesCount[post.id] || 0,
        commentsCount: postComments.length,
        comments: postComments,
      };
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Crear un nuevo post en Supabase
 * Usa user_id (UUID) del usuario autenticado
 */
export const createPostInDB = async (
  postData: CreatePostPayload & { userId: string }
): Promise<Post> => {
  try {
    // Insertar post con user_id
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: postData.userId,
          image_url: postData.imageUrl,
          caption: postData.caption,
        },
      ])
      .select('id, image_url, caption, user_id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, pfp_url, status')
      .eq('id', postData.userId)
      .single();

    if (userError) {
      console.warn('Error fetching user for post:', userError);
    }

    return {
      id: data.id,
      userName: userData?.username || 'unknown',
      userPfp: userData?.pfp_url || '',
      userStatus: userData?.status || '',
      postImg: data.image_url || '',
      postCaption: data.caption || '',
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Eliminar un post de Supabase
 * Solo el dueño del post puede borrarlo
 */
export const deletePostFromDB = async (postId: string): Promise<void> => {
  try {
    // Verificar que el usuario esté autenticado
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      throw new Error('Usuario no autenticado');
    }

    // Obtener el post para verificar el dueño
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (postError) {
      throw new Error('Error al obtener el post');
    }

    if (!post) {
      throw new Error('Post no encontrado');
    }

    // Verificar que el usuario actual sea el dueño del post
    if (post.user_id !== session.user.id) {
      throw new Error('No tienes permiso para borrar este post');
    }

    // Eliminar likes asociados
    await supabase.from('likes').delete().eq('post_id', postId);
    
    // Eliminar comentarios y sus likes
    const { data: comments } = await supabase
      .from('comments')
      .select('id')
      .eq('post_id', postId);

    if (comments && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      await supabase.from('comment_likes').delete().in('comment_id', commentIds);
    }
    
    await supabase.from('comments').delete().eq('post_id', postId);
    
    // Eliminar el post
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Actualizar caption de un post
 */
export const updatePostCaptionInDB = async (postId: string, caption: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ caption: caption })
      .eq('id', postId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating post caption:', error);
    throw error;
  }
};

// ==================== COMMENTS ====================

/**
 * Agregar un comentario a un post
 * Usa user_id (UUID) del usuario autenticado
 */
export const addCommentToDB = async (
  commentData: CreateCommentPayload & { userId: string }
): Promise<Comment> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: commentData.postId,
          user_id: commentData.userId,
          text: commentData.commentTxt,
        },
      ])
      .select('id, post_id, text, user_id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, pfp_url, status')
      .eq('id', commentData.userId)
      .single();

    if (userError) {
      console.warn('Error fetching user for comment:', userError);
    }

    return {
      id: data.id,
      userName: userData?.username || 'unknown',
      userPfp: userData?.pfp_url || '',
      userStatus: userData?.status || '',
      commentTxt: data.text || '',
      likes: 0,
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Eliminar un comentario
 */
export const deleteCommentFromDB = async (commentId: string): Promise<void> => {
  try {
    // Eliminar likes del comentario
    await supabase.from('comment_likes').delete().eq('comment_id', commentId);
    
    // Eliminar el comentario
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// ==================== LIKES ====================

/**
 * Toggle like en un post
 * Usa user_id (UUID) del usuario autenticado
 */
export const togglePostLikeInDB = async (postId: string, userId: string, isLiked: boolean): Promise<void> => {
  try {
    // Primero verificar si el like ya existe usando maybeSingle para evitar errores cuando no existe
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    // Si hay un error que no sea "no encontrado", lanzarlo
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    const likeExists = !!existingLike;

    if (isLiked) {
      // Eliminar like solo si existe
      if (likeExists) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
      }
    } else {
      // Agregar like solo si no existe
      if (!likeExists) {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }]);

        // Si el error es de duplicado o conflicto, ignorarlo (ya existe)
        if (error) {
          // Códigos de error comunes: 23505 (unique violation), 409 (conflict)
          if (error.code === '23505' || error.code === 'PGRST301' || error.message?.includes('duplicate') || error.message?.includes('conflict')) {
            console.warn('Like already exists, ignoring duplicate insert');
            return;
          }
          throw error;
        }
      }
    }
  } catch (error: any) {
    // Si es un error de duplicado o conflicto, no es crítico
    if (error.code === '23505' || error.code === 'PGRST301' || error.code === 409 || error.message?.includes('duplicate') || error.message?.includes('conflict')) {
      console.warn('Like already exists, ignoring duplicate insert');
      return;
    }
    console.error('Error toggling post like:', error);
    throw error;
  }
};

/**
 * Obtener likes de un usuario para posts
 * Usa user_id (UUID) del usuario
 */
export const fetchUserPostLikes = async (userId: string): Promise<Record<string, boolean>> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) {
      // Si es un error 406 (Not Acceptable), puede ser un problema de permisos o formato
      // Intentar con un formato más simple
      if (error.code === 'PGRST116' || error.message?.includes('406')) {
        console.warn('Error fetching user post likes (may be permissions issue):', error);
        return {};
      }
      console.warn('Error fetching user post likes:', error);
      return {};
    }

    const likes: Record<string, boolean> = {};
    if (data) {
      data.forEach(like => {
        if (like.post_id) {
          likes[like.post_id] = true;
        }
      });
    }

    return likes;
  } catch (error) {
    console.error('Error fetching user post likes:', error);
    return {};
  }
};

/**
 * Toggle like en un comentario
 * Usa user_id (UUID) del usuario autenticado
 */
export const toggleCommentLikeInDB = async (commentId: string, userId: string, isLiked: boolean): Promise<void> => {
  try {
    if (isLiked) {
      // Eliminar like
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Agregar like
      const { error } = await supabase
        .from('comment_likes')
        .insert([{ comment_id: commentId, user_id: userId }]);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    throw error;
  }
};

/**
 * Obtener likes de comentarios de un usuario
 * Usa user_id (UUID) del usuario
 */
export const fetchUserCommentLikes = async (userId: string): Promise<Record<string, boolean>> => {
  try {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('Error fetching user comment likes:', error);
      return {};
    }

    const likes: Record<string, boolean> = {};
    data?.forEach(like => {
      likes[like.comment_id] = true;
    });

    return likes;
  } catch (error) {
    console.error('Error fetching user comment likes:', error);
    return {};
  }
};

// ==================== AUTHENTICATION ====================

/**
 * Registrar un nuevo usuario con Supabase Auth
 */
export const signUpWithAuth = async (
  email: string,
  password: string,
  userData: {
    userName: string;
    userPfp: string;
    userStatus: string;
    bio?: string;
  }
) => {
  try {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar que el password tenga al menos 6 caracteres
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // 1. Crear usuario en Supabase Auth
    console.log('Intentando crear usuario con email:', normalizedEmail);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          user_name: userData.userName,
          user_pfp: userData.userPfp,
          user_status: userData.userStatus,
          bio: userData.bio,
        },
      },
    });

    if (authError) {
      console.error('Error de Supabase Auth:', authError);
      // Mejorar mensajes de error
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        throw new Error('Este email ya está registrado');
      }
      if (authError.message.includes('invalid') || authError.message.includes('Email address')) {
        throw new Error(`El email "${normalizedEmail}" no es válido. Por favor verifica el formato.`);
      }
      if (authError.message.includes('Password')) {
        throw new Error('La contraseña no cumple con los requisitos');
      }
      // Retornar el mensaje de error de Supabase si es claro
      throw new Error(authError.message || 'Error al crear la cuenta');
    }
    
    // Nota: Si Supabase requiere confirmación de email, el usuario recibirá un email
    // pero aún así podemos crear el perfil en la tabla users
    // En desarrollo, puedes deshabilitar "Confirm email" en Supabase Dashboard > Authentication > Settings
    
    if (!authData.user) {
      throw new Error('No se pudo crear el usuario');
    }

    // 2. Crear registro en la tabla users con el mismo ID que auth.users
    // Construir el objeto de inserción solo con los campos que existen en la tabla
    const userInsertData: any = {
      id: authData.user.id, // Usar el mismo ID de auth.users
      username: userData.userName, // Columna real: username
      status: userData.userStatus, // Columna real: status
      pfp_url: userData.userPfp, // Columna real: pfp_url
    };
    
    // Solo incluir bio si se proporciona (y si la columna existe en la tabla)
    // Por ahora lo omitimos ya que la columna no existe en Supabase
    // if (userData.bio) {
    //   userInsertData.bio = userData.bio;
    // }
    
    console.log('Intentando insertar perfil en tabla users:', userInsertData);
    const { data: userDataResult, error: userError } = await supabase
      .from('users')
      .insert([userInsertData])
      .select()
      .single();

    if (userError) {
      // Si falla la inserción en users, intentar obtener el perfil o crear uno básico
      console.warn('Error al crear perfil en tabla users:', userError);
      
      // Intentar obtener el perfil por si ya existe
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (existingProfile) {
        // Si ya existe, retornar ese
        return {
          user: authData.user,
          session: authData.session,
          userProfile: existingProfile,
        };
      }

      // Si no existe y el error es de constraint, el usuario ya está registrado
      if (userError.code === '23505') { // Unique violation
        throw new Error('Este usuario ya está registrado');
      }

      // Para otros errores, lanzar el error original
      throw new Error(`Error al crear el perfil: ${userError.message}`);
    }

    return {
      user: authData.user,
      session: authData.session,
      userProfile: userDataResult,
    };
  } catch (error: any) {
    console.error('Error signing up:', error);
    // Retornar un mensaje de error más amigable
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Error al registrar el usuario. Por favor intenta de nuevo.');
  }
};

/**
 * Iniciar sesión con Supabase Auth
 */
export const signInWithAuth = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      // Manejar error de email no confirmado
      if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        throw new Error('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      }
      throw error;
    }
    if (!data.user) throw new Error('No se pudo autenticar el usuario');

    // Obtener datos del usuario de la tabla users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn('No se encontró perfil de usuario:', profileError);
      // Si no existe perfil, crear uno básico
      const { data: newProfile } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            username: data.user.user_metadata?.user_name || data.user.email?.split('@')[0] || 'user',
            pfp_url: data.user.user_metadata?.user_pfp || '/assets/icons/Profile-icon.svg',
            status: data.user.user_metadata?.user_status || '🐾 New member',
          },
        ])
        .select()
        .single();

      return {
        user: data.user,
        session: data.session,
        userProfile: newProfile,
      };
    }

    return {
      user: data.user,
      session: data.session,
      userProfile,
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Cerrar sesión
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Obtener la sesión actual
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Obtener el usuario actual autenticado
 */
export const getCurrentUser = async () => {
  try {
    // Primero verificar si hay una sesión
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Si es un error de sesión faltante, simplemente retornar null
      if (error.message?.includes('session') || error.message?.includes('Auth session missing')) {
        return null;
      }
      throw error;
    }
    return user;
  } catch (error: any) {
    // No loggear errores de sesión faltante como errores
    if (error?.message?.includes('session') || error?.message?.includes('Auth session missing')) {
      return null;
    }
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Obtener perfil completo del usuario actual (auth + users table)
 */
export const getCurrentUserProfile = async () => {
  try {
    // Primero verificar si hay una sesión activa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session || !session.user) {
      return null;
    }

    const user = session.user;

    // Solo seleccionar columnas que existen
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('id, username, pfp_url, status')
      .eq('id', user.id)
      .single();

    if (error) {
      // Si no se encuentra el perfil, no es un error crítico
      if (error.code === 'PGRST116') {
        console.warn('Usuario de auth existe pero no tiene perfil en la tabla users');
        return null;
      }
      // Para otros errores, loggear pero no fallar
      console.warn('Error obteniendo perfil:', error);
      return null;
    }

    // Calcular contadores desde la tabla follows
    const [followersCount, followingCount] = await Promise.all([
      getFollowersCount(user.id),
      getFollowingCount(user.id),
    ]);

    return {
      authUser: user,
      profile: {
        ...userProfile,
        followers_count: followersCount,
        following_count: followingCount,
      },
    };
  } catch (error: any) {
    // No loggear errores de sesión faltante
    if (error?.message?.includes('session') || error?.message?.includes('Auth session missing')) {
      return null;
    }
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Verificar si un email ya está registrado
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code === 'PGRST116') {
      // No se encontró el usuario
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

/**
 * Verificar si un username ya existe
 */
export const checkUsernameExists = async (userName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', userName.toLowerCase()) // Columna real: username
      .single();

    if (error && error.code === 'PGRST116') {
      // No se encontró el usuario
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

// ==================== USERS ====================

/**
 * Obtener todos los usuarios registrados
 */
export const fetchUsers = async (): Promise<RegisteredUser[]> => {
  try {
    // Solo seleccionar columnas que existen en la tabla
    const { data, error } = await supabase
      .from('users')
      .select('id, username, pfp_url, status');

    if (error) {
      console.error('Error fetching users:', error);
      // Retornar array vacío en lugar de lanzar error
      return [];
    }
    if (!data) return [];

    // Obtener contadores de followers y following desde la tabla follows
    const usersWithCounts = await Promise.all(
      data.map(async (user) => {
        const [followersCount, followingCount] = await Promise.all([
          getFollowersCount(user.id),
          getFollowingCount(user.id),
        ]);

        return {
          id: user.id,
          email: '', // email no existe en la tabla users
          password: '', // password no existe en la tabla users
          userName: user.username, // Columna real: username
          userPfp: user.pfp_url, // Columna real: pfp_url
          userStatus: user.status, // Columna real: status
          bio: undefined, // bio no existe en la tabla
          followersCount,
          followingCount,
        };
      })
    );

    return usersWithCounts;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Retornar array vacío en lugar de lanzar error
    return [];
  }
};

/**
 * Registrar un nuevo usuario en la tabla users
 * Nota: Para usuarios autenticados, usar signUpWithAuth en lugar de esta función
 */
export const registerUserInDB = async (userData: Omit<RegisteredUser, 'id'>): Promise<RegisteredUser> => {
  try {
    // Primero verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username, pfp_url, status, followers_count, following_count')
      .eq('username', userData.userName)
      .maybeSingle();

    // Si el usuario ya existe, retornarlo
    if (existingUser && !checkError) {
      return {
        id: existingUser.id,
        email: '',
        password: '',
        userName: existingUser.username,
        userPfp: existingUser.pfp_url,
        userStatus: existingUser.status,
        bio: undefined,
        followersCount: existingUser.followers_count || 0,
        followingCount: existingUser.following_count || 0,
      };
    }

    // Si hay un error que no sea "no encontrado", lanzarlo
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Si no existe, crear el usuario
    const insertData: any = {
      username: userData.userName, // Columna real: username
      pfp_url: userData.userPfp, // Columna real: pfp_url
      status: userData.userStatus, // Columna real: status
    };
    
    // Solo incluir password si se proporciona (para usuarios creados desde posts no se necesita)
    if (userData.password) {
      insertData.password = userData.password; // En producción usar hash
    }

    const { data, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // Si el error es de duplicado, intentar obtener el usuario existente
      if (error.code === '23505') {
        const { data: existingUserData } = await supabase
          .from('users')
          .select('id, username, pfp_url, status, followers_count, following_count')
          .eq('username', userData.userName)
          .single();
        
        if (existingUserData) {
          return {
            id: existingUserData.id,
            email: '',
            password: '',
            userName: existingUserData.username,
            userPfp: existingUserData.pfp_url,
            userStatus: existingUserData.status,
            bio: undefined,
            followersCount: existingUserData.followers_count || 0,
            followingCount: existingUserData.following_count || 0,
          };
        }
      }
      throw error;
    }
    if (!data) throw new Error('No data returned from insert');

    return {
      id: data.id,
      email: data.email || '',
      password: data.password || '',
      userName: data.username, // Columna real: username
      userPfp: data.pfp_url, // Columna real: pfp_url
      userStatus: data.status, // Columna real: status
      bio: undefined, // bio no existe
      followersCount: data.followers_count || 0,
      followingCount: data.following_count || 0,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Buscar usuario por email y password
 */
export const findUserByCredentials = async (email: string, password: string): Promise<RegisteredUser | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró el usuario
        return null;
      }
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email || '',
      password: data.password || '',
      userName: data.username, // Columna real: username
      userPfp: data.pfp_url, // Columna real: pfp_url
      userStatus: data.status, // Columna real: status
      bio: undefined, // bio no existe
      followersCount: data.followers_count || 0,
      followingCount: data.following_count || 0,
    };
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

/**
 * Actualizar datos de un usuario
 */
export const updateUserInDB = async (userId: string, updates: Partial<RegisteredUser>): Promise<void> => {
  try {
    const updateData: any = {};
    
    // Actualizar solo las columnas que existen en la tabla
    if (updates.userName !== undefined) updateData.username = updates.userName; // Columna real: username
    if (updates.userPfp !== undefined) updateData.pfp_url = updates.userPfp; // Columna real: pfp_url
    if (updates.userStatus !== undefined) updateData.status = updates.userStatus; // Columna real: status
    // email, password, followers_count, following_count pueden no existir
    // if (updates.email !== undefined) updateData.email = updates.email;
    // if (updates.password !== undefined) updateData.password = updates.password;
    // if (updates.followersCount !== undefined) updateData.followers_count = updates.followersCount;
    // if (updates.followingCount !== undefined) updateData.following_count = updates.followingCount;

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Incrementar/decrementar followers de un usuario
 * Si la columna no existe, no hace nada (no lanza error)
 */
export const updateUserFollowers = async (userName: string, increment: boolean): Promise<void> => {
  try {
    // Intentar obtener el usuario con followers_count
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('followers_count')
      .eq('username', userName)
      .maybeSingle();

    // Si hay error o la columna no existe, simplemente retornar sin hacer nada
    if (fetchError) {
      // Si el error es que la columna no existe, no es crítico
      if (fetchError.message?.includes('column') && fetchError.message?.includes('does not exist')) {
        console.warn('Column followers_count does not exist, skipping update');
        return;
      }
      // Si es otro error, loguearlo pero no lanzarlo
      console.warn('Error fetching user for followers update:', fetchError);
      return;
    }

    if (!user) {
      console.warn('User not found for followers update');
      return;
    }

    // Si followers_count es undefined, la columna probablemente no existe
    if (user.followers_count === undefined) {
      console.warn('Column followers_count does not exist, skipping update');
      return;
    }

    const newCount = increment
      ? (user.followers_count || 0) + 1
      : Math.max(0, (user.followers_count || 0) - 1);

    const { error } = await supabase
      .from('users')
      .update({ followers_count: newCount })
      .eq('username', userName);

    if (error) {
      // Si el error es que la columna no existe, no es crítico
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        console.warn('Column followers_count does not exist, skipping update');
        return;
      }
      console.warn('Error updating user followers:', error);
      // No lanzar el error, solo loguearlo
    }
  } catch (error: any) {
    // No lanzar el error, solo loguearlo
    console.warn('Error updating user followers:', error);
  }
};

/**
 * Incrementar/decrementar following de un usuario
 * Si la columna no existe, no hace nada (no lanza error)
 */
export const updateUserFollowing = async (userId: string, increment: boolean): Promise<void> => {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('following_count')
      .eq('id', userId)
      .maybeSingle();

    // Si hay error o la columna no existe, simplemente retornar sin hacer nada
    if (fetchError) {
      // Si el error es que la columna no existe, no es crítico
      if (fetchError.message?.includes('column') && fetchError.message?.includes('does not exist')) {
        console.warn('Column following_count does not exist, skipping update');
        return;
      }
      // Si es otro error, loguearlo pero no lanzarlo
      console.warn('Error fetching user for following update:', fetchError);
      return;
    }

    if (!user) {
      console.warn('User not found for following update');
      return;
    }

    // Si following_count es undefined, la columna probablemente no existe
    if (user.following_count === undefined) {
      console.warn('Column following_count does not exist, skipping update');
      return;
    }

    const newCount = increment
      ? (user.following_count || 0) + 1
      : Math.max(0, (user.following_count || 0) - 1);

    const { error } = await supabase
      .from('users')
      .update({ following_count: newCount })
      .eq('id', userId);

    if (error) {
      // Si el error es que la columna no existe, no es crítico
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        console.warn('Column following_count does not exist, skipping update');
        return;
      }
      console.warn('Error updating user following:', error);
      // No lanzar el error, solo loguearlo
    }
  } catch (error: any) {
    // No lanzar el error, solo loguearlo
    console.warn('Error updating user following:', error);
  }
};

/**
 * Verificar si un usuario sigue a otro
 */
export const checkIfFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    // Usar count para verificar si existe la relación (más eficiente y confiable)
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      // Si el error es que no se encontró (PGRST116), la relación no existe
      if (error.code === 'PGRST116') {
        return false;
      }
      console.warn('Error checking follow relationship:', error);
      return false;
    }

    return (count || 0) > 0;
  } catch (error) {
    console.warn('Error checking follow relationship:', error);
    return false;
  }
};

/**
 * Toggle follow/unfollow relación entre usuarios
 * Guarda la relación en la tabla 'follows' con follower_id y following_id
 */
export const toggleFollowInDB = async (followerId: string, followedUserName: string, isFollowing: boolean): Promise<void> => {
  try {
    // Obtener el ID del usuario seguido
    const { data: followedUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', followedUserName)
      .maybeSingle();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }
    if (!followedUser) {
      throw new Error('User to follow not found');
    }

    const followingId = followedUser.id;

    // SIEMPRE verificar primero el estado real en la base de datos
    const relationshipExists = await checkIfFollowing(followerId, followingId);

    if (isFollowing) {
      // Eliminar relación de seguimiento (dejar de seguir)
      if (!relationshipExists) {
        // La relación no existe, no hay nada que eliminar - esto es válido
        return;
      }

      const { error: deleteError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (deleteError) {
        // Si el error es RLS (Row Level Security), es un problema de permisos
        if (deleteError.message?.includes('row-level security') || deleteError.message?.includes('RLS')) {
          console.warn('RLS policy prevents deleting follow relationship. Please check Supabase RLS policies.');
          throw new Error('No tienes permisos para dejar de seguir a este usuario. Por favor, verifica las políticas de seguridad en Supabase.');
        }
        // Si el error es que no existe la relación, no es crítico
        if (deleteError.code === 'PGRST116') {
          return;
        }
        throw deleteError;
      }
    } else {
      // Agregar relación de seguimiento (seguir)
      // Si la relación ya existe, no intentar insertar (evitar error 409)
      if (relationshipExists) {
        // La relación ya existe en la DB - esto significa que el estado local estaba desincronizado
        // No es un error, simplemente retornar (el estado se actualizará en el thunk)
        return;
      }

      // Solo intentar insertar si la relación NO existe
      const { error: insertError } = await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: followingId }]);

      if (insertError) {
        // Si el error es RLS (Row Level Security), es un problema de permisos
        if (insertError.message?.includes('row-level security') || insertError.message?.includes('RLS')) {
          console.warn('RLS policy prevents inserting follow relationship. Please check Supabase RLS policies.');
          throw new Error('No tienes permisos para seguir a este usuario. Por favor, verifica las políticas de seguridad en Supabase.');
        }
        // Si el error es de duplicado (23505, PGRST301, o 409), la relación ya existe
        // Esto puede pasar en casos de race condition (otra petición insertó entre la verificación y el insert)
        // No es un error crítico - la relación ya existe, que es lo que queríamos lograr
        if (insertError.code === '23505' || insertError.code === 'PGRST301' || insertError.status === 409 || insertError.code === '409') {
          // La relación ya existe en la DB - esto es válido, no lanzar error
          return;
        }
        throw insertError;
      }
    }
  } catch (error: any) {
    // Si es un error de RLS, proporcionar un mensaje más claro
    if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
      throw new Error('No tienes permisos para realizar esta acción. Por favor, verifica las políticas de seguridad en Supabase.');
    }
    // Si es un error 409 (Conflict), probablemente es un duplicado (race condition)
    if (error.status === 409 || error.code === '409' || error.code === '23505' || error.code === 'PGRST301') {
      // La relación ya existe - no es un error, simplemente retornar
      return;
    }
    console.error('Error toggling follow:', error);
    throw error;
  }
};

/**
 * Obtener usuarios que sigue el usuario actual
 * Usa la tabla 'follows' con follower_id y following_id
 * follower_id = userId (el usuario actual)
 * following_id = los usuarios que el usuario actual está siguiendo
 */
export const fetchUserFollowing = async (userId: string): Promise<Record<string, boolean>> => {
  try {
    // Obtener la lista de usuarios que el usuario actual está siguiendo
    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (error) {
      // Si la tabla no existe, retornar objeto vacío
      if (error.message.includes('relation "follows" does not exist')) {
        return {};
      }
      console.warn('Error fetching user following:', error);
      return {};
    }

    // Obtener los usernames de los usuarios seguidos
    const followingIds = data?.map(f => f.following_id).filter(Boolean) || [];
    if (followingIds.length === 0) return {};

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username')
      .in('id', followingIds);

    if (usersError) {
      console.warn('Error fetching followed users:', usersError);
      return {};
    }

    const following: Record<string, boolean> = {};
    users?.forEach(user => {
      if (user.username) {
        following[user.username] = true;
      }
    });

    return following;
  } catch (error) {
    console.error('Error fetching user following:', error);
    return {};
  }
};

/**
 * Obtener contador de seguidores de un usuario
 * Usa count en la tabla 'follows'
 */
export const getFollowersCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    if (error) {
      console.warn('Error getting followers count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn('Error getting followers count:', error);
    return 0;
  }
};

/**
 * Obtener contador de usuarios que sigue un usuario
 * Usa count en la tabla 'follows'
 */
export const getFollowingCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    if (error) {
      console.warn('Error getting following count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn('Error getting following count:', error);
    return 0;
  }
};

