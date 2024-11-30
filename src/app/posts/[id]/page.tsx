"use client";

import { useEffect, useState } from "react";
import { Post } from "@/app/interfaces/Post";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Token } from "@/app/interfaces/Token";
import Comment from "@/app/interfaces/Comment";
import { isUserLoggedIn } from "@/utils/auth";
import { toast } from "react-toastify";

const PostPage: React.FC = () => {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [post, setPost] = useState<Post | null>(null);
  const { id } = useParams<{ id: string | undefined }>();

  useEffect(() => {
    if (!id) return;

    console.log("id::", id);

    const fetchPost = async () => {
      const response = await fetch(`/api/posts/getPost/${id}`);
      const data = await response.json();
      setPost(data.post);
    };

    const fetchComments = async () => {
      const response = await fetch(`/api/comments/getComments/${id}`);
      const data = await response.json();
      console.log("data::", data);

      if (data.message !== "Comments fetched successfully" || !data.comments) {
        return;
      }

      setComments(data.comments);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const canDeleteComment = (comment: Comment): boolean => {
    if (!comment) return false;

    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
      const decodedToken: Token = jwtDecode(token);

      return (
        decodedToken.role === "admin" ||
        comment.username === decodedToken.username
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

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

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token || !post) return;

    let decodedToken: Token;

    console.log("post::", post);

    try {
      decodedToken = jwtDecode(token);
      console.log("decodedToken", decodedToken);
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

      console.log("data::", data);

      if (data.message !== "Post deleted successfully") {
        console.error("Could not delete the post:", data.message);
        toast.error(data.message || "Error deleting the post");
      } else {
        console.log(data.message); // Log the success message
        toast.success("Post deleted successfully");
        router.push("/"); // Redirect after successful deletion
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token || !newComment.trim()) return;

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
      const response = await fetch(`/api/comments/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          postId: post?._id,
          username: decodedToken.username,
        }),
      });

      const data = await response.json();

      if (data.message !== "Comment added successfully") {
        console.error("Error adding comment:", data.message);
        toast.error(data.message || "Error adding comment");
      } else {
        setComments((prevComments) => [...prevComments, data.commentData]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");

    if (!token) return;

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
      const response = await fetch(`/api/comments/deleteComment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: commentId,
          role: decodedToken.role,
          username: decodedToken.username,
        }),
      });

      const data = await response.json();

      if (data.message !== "Comment deleted successfully") {
        console.error("Error deleting comment:", data.message);
        toast.error(data.message || "Error deleting comment");
      } else {
        toast.success("Comment deleted successfully");
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  if (!post)
    return (
      <div className="flex justify-center items-center text-lg">Loading...</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
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
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {/* Display Comments */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{comment.username}</p>
                  <p>{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {canDeleteComment(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {/* Comment Input */}
        {isUserLoggedIn() && (
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg"
            ></textarea>
            <button
              onClick={handleAddComment}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add Comment
            </button>
          </div>
        )}
      </div>

      {/* Delete Post Button */}
      {canDeletePost() && (
        <div className="text-center mt-8">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostPage;
