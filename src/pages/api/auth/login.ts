import connectDB from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Both username and password are required!" });
    }

    try {
      await connectDB();

      const existingUser = await User.findOne({ username });

      if (!existingUser) {
        return res.status(401).json({ message: "Invalid username" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { username: existingUser.username, role: existingUser.role },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      return res.status(500).json({ message: "Error logging in", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
