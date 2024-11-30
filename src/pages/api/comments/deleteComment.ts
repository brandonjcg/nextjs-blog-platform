import connectDB from "@/utils/db";
import Comment from "@/models/Comment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id, username, role } = req.body;

    if (!id || !username || !role) {
      return res
        .status(400)
        .json({ message: "Comment ID, User ID and role are required!" });
    }

    try {
      await connectDB();

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (role !== "admin" && comment.username !== username) {
        return res.status(403).json({
          message: "You do not have permission to delete this comment",
        });
      }

      await Comment.findByIdAndDelete(id);

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting comment", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
