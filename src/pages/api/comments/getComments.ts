import connectDB from "@/utils/db";
import Comment from "@/models/Comment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const comments = await Comment.find();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
