import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminUser = {
  username: "admin",
  password: "$2a$10$ElGomjz70Z1H5ec9N5Jy0uhrdC7BlA25847eZUDOqTrgoLrQXVUTG",
  role: "admin",
};

const SECRET_KEY =
  process.env.JWT_SECRET_KEY ||
  "$2a$10$ElGomjz70Z1H5ec9N5Jy0uhrdC7BlA25847eZUDOqTrgoLrQXVUTG";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Both username and password are required!" });
    }

    if (username !== adminUser.username) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isValidPassword = await bcrypt.compare(password, adminUser.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { username: adminUser.username, role: adminUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
