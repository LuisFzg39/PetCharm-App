// Tipos base para el sistema de comentarios
export type Comment = {
  id: string;
  userName: string;
  userPfp: string;
  userStatus: string;
  commentTxt: string;
  likes: number;
};

// Tipo para un post completo
export type Post = {
  id: string;
  userName: string;
  userPfp: string;
  userStatus: string;
  postImg: string;
  postCaption: string;
  likes: number;
  commentsCount?: number;
  comments: Comment[];
};

// Tipo para el usuario actual autenticado
export type User = {
  id: string;
  userName: string;
  userPfp: string;
  userStatus: string;
  bio?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
};

// Tipo para crear un nuevo post
export type CreatePostPayload = {
  imageUrl: string;
  caption: string;
};

// Tipo para crear un nuevo comentario
export type CreateCommentPayload = {
  postId: string;
  commentTxt: string;
};

