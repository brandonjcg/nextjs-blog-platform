import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  process.env.JWT_SECRET_KEY ||
  "$2a$10$ElGomjz70Z1H5ec9N5Jy0uhrdC7BlA25847eZUDOqTrgoLrQXVUTG";

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const decoded = jwt.verify(token, SECRET_KEY);

        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  };
}
