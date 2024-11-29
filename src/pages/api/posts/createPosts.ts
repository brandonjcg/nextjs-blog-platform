import connectDB from "@/utils/db";
import Post from "@/models/Post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content and author are required!" });
    }

    try {
      await connectDB();

      const newPost = new Post({ title, content, author });

      await newPost.save();

      return res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error creating post", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
