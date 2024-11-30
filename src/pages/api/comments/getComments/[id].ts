import connectDB from "@/utils/db";
import Comment from "@/models/Comment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    try {
      await connectDB();
      const comments = await Comment.find({ postId: id });

      if (!comments) {
        return res.status(404).json({ message: "Comments not found" });
      }

      if (comments.length === 0) {
        return res.status(404).json({ message: "No comments found" });
      }

      res
        .status(200)
        .json({ comments, message: "Comments fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error: " + error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
