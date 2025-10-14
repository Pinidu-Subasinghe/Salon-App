import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

// ✅ Register user (default role = user)
export const registerUser = async (req, res) => {
  try {
    const { title, fullName, phone, password, confirmPassword } = req.body;

    if (!title || !fullName || !phone || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ phone });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ title, fullName, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Issue a JWT (short-lived recommended) and create a server-side session
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token expiry still set, session controls inactivity
    );

    // create session with 1 hour inactivity expiry (sliding)
    const ONE_HOUR = 1000 * 60 * 60;
    const expiresAt = new Date(Date.now() + ONE_HOUR);
    await Session.create({ token, user: user._id, expiresAt });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        title: user.title,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Logout
export const logoutUser = async (req, res) => {
  try {
    // if the client sent the token in Authorization header, remove the session
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      await Session.deleteOne({ token }).catch(() => {});
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update profile (name, phone, password)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, phone, password } = req.body;
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
