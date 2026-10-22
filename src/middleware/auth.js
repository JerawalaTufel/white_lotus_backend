import jwt from "jsonwebtoken";
import { env } from "../env.js";
import { prisma } from "../prisma.js";

export const cookieName = "token";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function signToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, env.jwtSecret, { expiresIn: "7d" });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = req.cookies?.[cookieName] || bearer;

  if (!token) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    res.status(401).json({ error: "Your session has ended. Sign in again." });
    return;
  }

  prisma.admin
    .findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    })
    .then((admin) => {
      if (!admin) {
        res.status(401).json({ error: "Sign in required." });
        return;
      }
      req.admin = admin;
      next();
    })
    .catch(next);
}
