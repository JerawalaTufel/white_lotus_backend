import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { fail, parseOrFail } from "../http.js";
import { loginSchema } from "../validation/schemas.js";
import { cookieName, cookieOptions, signToken } from "../middleware/auth.js";

const attempts = new Map();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 8;

function recentAttempts(key) {
  const now = Date.now();
  const stamps = (attempts.get(key) || []).filter((stamp) => now - stamp < windowMs);
  attempts.set(key, stamps);
  return stamps;
}

export async function login(req, res) {
  const { email, password } = parseOrFail(loginSchema, req.body);
  const key = `${req.ip}:${email}`;

  if (recentAttempts(key).length >= maxAttempts) {
    throw fail(429, "Too many sign-in attempts. Wait a few minutes and try again.");
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  const matches = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !matches) {
    recentAttempts(key).push(Date.now());
    throw fail(401, "Email or password is incorrect.");
  }

  attempts.delete(key);
  res.cookie(cookieName, signToken(admin), cookieOptions);
  res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
}

export function logout(_req, res) {
  res.clearCookie(cookieName, {
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
    path: cookieOptions.path,
  });
  res.status(204).end();
}

export function currentAdmin(req, res) {
  res.json({ admin: req.admin });
}
