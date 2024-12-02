"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/Post";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Token from "@/interfaces/Token";
import { toast } from "react-toastify";
import Comments from "@/components/Comments";

export default function PostPage() {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const { id } = useParams<{ id: string | undefined }>();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const response = await fetch(`/api/posts/getPost/${id}`);
      const data = await response.json();
      setPost(data.post);
    };

    fetchPost();
  }, [id]);

  const canDeletePost = () => {
    if (!post) return false;

    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
      const decodedToken: Token = jwtDecode(token);

      return (
        decodedToken.role === "admin" ||
        post.authorName === decodedToken.username
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");

    if (!token || !post) return;

    let decodedToken: Token;

    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error(
        "An error occured while decoding token. Please try again later."
      );
      return;
    }

    try {
      const response = await fetch(`/api/posts/deletePost`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post._id,
          username: decodedToken.username,
          role: decodedToken.role,
        }),
      });

      const data = await response.json();

      if (data.message !== "Post deleted successfully") {
        console.error("Could not delete the post:", data.message);
        toast.error(data.message || "Error deleting the post");
      } else {
        toast.success("Post deleted successfully");
        router.push("/"); // Redirect after successful deletion
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  if (!post)
    return (
      <div className="flex justify-center items-center text-lg">Loading...</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700"
        >
          &larr; Back
        </button>
      </div>

      {/* Post Title */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
        {post.title}
      </h1>

      {/* Post Content */}
      <div className="prose prose-lg text-gray-700 mb-6">
        <p>{post.content}</p>
      </div>

      {/* Post Author */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>
          By: <span className="font-semibold">{post.authorName}</span>
        </p>
        <p className="text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Comment Section */}
      <Comments post={post} />

      {/* Delete Post Button */}
      {canDeletePost() && (
        <div className="text-center mt-8">
          <button
            onClick={handleDeletePost}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
