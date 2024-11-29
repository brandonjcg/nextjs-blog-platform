import connectDB from "@/utils/db";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getUsersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query; // Destructure the 'id' from query params

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      await connectDB();

      const user = await User.findById(id);

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res
        .status(500)
        .json({ message: "Error connecting to the database", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
