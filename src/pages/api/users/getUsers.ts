import connectDB from "@/utils/db";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getUsersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await connectDB();

      const users = await User.find();

      return res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res
        .status(500)
        .json({ message: "Error connecting to the database", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
