import connectDB from "@/utils/db";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteUsersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required!" });
    }

    try {
      await connectDB();

      const deletedUser = await User.findOneAndDelete({ username });

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting user", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
