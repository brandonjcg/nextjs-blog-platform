import connectDB from "@/utils/db";
import Post from "@/models/Post";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";

export default async function createPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, content, authorName } = req.body;

    if (!title || !content || !authorName) {
      return res
        .status(400)
        .json({ message: "Title, content and author name are required!" });
    }

    try {
      await connectDB();

      const user = await User.findOne({ username: authorName });

      if (!user) {
        return res.status(404).json({ message: "Author not found" });
      }

      const newPost = new Post({
        title,
        content,
        authorId: user._id,
        authorName: user.username,
      });

      await newPost.save();

      return res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error creating post", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
