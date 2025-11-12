import React from "react";
import CreatePost from "../components/home/CreatePost";
import Post from "../components/home/Post";
import { usePosts } from "../store/hooks";

function HomeFeed() {
  const { posts } = usePosts();

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center pb-4 lg:pb-12">
      {/* Component to create a post - Solo en desktop */}
      <div className="hidden lg:block w-full">
        <CreatePost />
      </div>

      {/* Render all posts */}
      <div className="w-full lg:w-auto px-5 lg:px-0">
        {posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            userName={post.userName}
            userPfp={post.userPfp}
            userStatus={post.userStatus}
            postImg={post.postImg}
            postCaption={post.postCaption}
            likes={post.likes}
            commentsCount={post.commentsCount}
            comments={post.comments}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeFeed;
