import connectDB from "@/utils/db";
import Post from "@/models/Post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deletePostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id, username, role } = req.body;

    if (!id || !username || !role) {
      return res
        .status(400)
        .json({ message: "Post ID, User ID and role are required!" });
    }

    try {
      await connectDB();

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (role !== "admin" && post.authorName.toString() !== username) {
        return res
          .status(403)
          .json({ message: "You do not have permission to delete this post" });
      }

      await post.deleteOne({ _id: id });

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting post", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
