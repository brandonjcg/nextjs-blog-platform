import connectDB from "@/utils/db";
import Comment from "@/models/Comment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await connectDB();
      const { postId, content, author } = req.body;
      const newComment = new Comment({
        postId,
        content,
        author,
      });
      const commentData = await newComment.save();
      res.status(201).json(commentData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
