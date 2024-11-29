import connectDB from "@/utils/db";
import Post from "@/models/Post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getPostByIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query; // Destructure the 'id' from query params

    if (!id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    try {
      console.log("req.query.id", req.query.id);
      await connectDB();

      const post = await Post.findById(req.query.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ post });
    } catch (error) {
      return res.status(500).json({ message: "Error getting post", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
