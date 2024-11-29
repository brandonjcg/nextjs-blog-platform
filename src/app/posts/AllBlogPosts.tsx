"use client";

import { useEffect, useState } from "react";
import { Post } from "../interface/Post";

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts/getPosts");
      const data = await response.json();
      console.log("data", data);
      setPosts(data.posts);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <a href={`/posts/${post._id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
