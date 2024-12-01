"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/Post";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/utils/auth";
import Link from "next/link";

export default function PostPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts/getPosts");
      const data = await response.json();

      if (!data.posts) {
        return;
      }

      setPosts(data.posts);
    };

    fetchPosts();
    setIsLoggedIn(isUserLoggedIn());
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
            <Link href={`/posts/${post._id}`} className="block">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-700 mb-2">
              {post.content.substring(0, 100)}...
            </p>
            <p className="text-sm text-gray-600 mb-2">By: {post.authorName}</p>
            <p className="text-sm text-gray-500">
              Created on: {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {isLoggedIn && (
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/posts/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Add New Post
          </button>
        </div>
      )}
    </div>
  );
}
