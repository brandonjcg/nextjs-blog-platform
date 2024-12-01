"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/Post";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/utils/auth";
import Link from "next/link";

export default function PostPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const postsPerPage = 6; // Number of posts per page
  const totalPages = Math.ceil(posts.length / postsPerPage);

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.map((post) => (
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

      {/* Pagination Controls */}
      {paginatedPosts.length > postsPerPage && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}

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
