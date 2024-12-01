import Comment from "@/interfaces/Comment";
import { Post } from "@/interfaces/Post";
import Token from "@/interfaces/Token";
import { isUserLoggedIn } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Comments({ post }: { post: Post | null }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    if (!post?._id) return;

    const fetchComments = async () => {
      const response = await fetch(`/api/comments/getComments/${post._id}`);
      const data = await response.json();

      if (data.message !== "Comments fetched successfully" || !data.comments) {
        return;
      }

      setComments(data.comments);
    };

    fetchComments();
  }, [post?._id]);

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

  return (
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
  );
}
