import connectDB from "@/utils/db";
import Post from "@/models/Post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await connectDB();

      const posts = await Post.find();

      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).json({ message: "Error getting posts", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
