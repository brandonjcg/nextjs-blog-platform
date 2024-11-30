"use client";

import { useEffect, useState } from "react";
import { Post } from "@/app/interface/Post";

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts/getPosts");
      const data = await response.json();
      setPosts(data.posts);
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          >
            <a href={`/posts/${post._id}`} className="block">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
            </a>
            <p className="text-sm text-gray-600 mb-2">By: {post.authorName}</p>
            <p className="text-sm text-gray-500">
              Created on: {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
