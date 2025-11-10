import React, { useState } from "react";
import CreatePost from "../components/home/CreatePost";
import Post from "../components/home/Post";
import usersData from "../data/users.json";

function HomeFeed() {
  const [posts, setPosts] = useState(usersData);

  function handleCreatePost(newPostData: { imageUrl: any; caption: any; }) {
    // Create the new post manually
    const newPost = {
      userName: "valxcicat",
      userPfp: "/assets/vectors/img/profile-pics/Pfp1.jpg",
      userStatus: "meowing 😸",
      postImg: newPostData.imageUrl,
      postCaption: newPostData.caption,
      likes: 0,
      commentsCount: 0,
      comments: []
    };

    // Add the new post to the top of the list
    setPosts([newPost, ...posts]);
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center pb-12">
      {/* Component to create a post */}
      <CreatePost onCreatePost={handleCreatePost} />

      {/* Render all posts */}
      {posts.map((post, index) => (
        <Post
          key={index}
          userName={post.userName}
          userPfp={post.userPfp}
          userStatus={post.userStatus}
          postImg={post.postImg}
          postCaption={post.postCaption}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </div>
  );
}

export default HomeFeed;
