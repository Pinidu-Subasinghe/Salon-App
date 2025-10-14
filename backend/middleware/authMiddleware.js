import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

// protect middleware now checks for a server-side session with sliding expiry
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    // verify token signature and basic expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check server-side session store to implement inactivity expiry (sliding window)
    const session = await Session.findOne({ token }).exec();
    if (!session) return res.status(403).json({ message: "Invalid or expired session" });

    const now = new Date();
    if (session.expiresAt < now) {
      // session expired, remove it
      await Session.deleteOne({ _id: session._id }).catch(() => {});
      return res.status(403).json({ message: "Session expired" });
    }

    // refresh sliding expiry: set new expiresAt = now + 1 hour
    const ONE_HOUR = 1000 * 60 * 60;
    session.expiresAt = new Date(now.getTime() + ONE_HOUR);
    await session.save();

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
