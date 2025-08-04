const { User } = require("../models");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
require("../config/passport");

const redisClient = require("../utils/redisClient");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with this email",
      });
    }
    if (role && role === "admin") {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
          status: "error",
          message: "Only admins can create other admins",
        });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      const { password, ...safeUser } = user.toJSON();

      return res.status(201).json({
        status: "success",
        message: "User registered and logged in successfully.",
        data: {
          user: safeUser,
        },
      });
    });

    // res.status(201).json({
    //   status: "success",
    //   message: "User registered successfully. Please log in.",
    //   data: { user },
    // });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const sessionId = req.sessionID;

    req.logout(function (err) {
      if (err) return next(err);

      req.session.destroy(async (err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return next(err);
        }

        try {
          await redisClient.del(`booking_session:${sessionId}`);
          console.log(`Session ${sessionId} manually removed from Redis`);
        } catch (redisError) {
          console.error("Redis session cleanup error:", redisError);
        }

        res.clearCookie("connect.sid");
        res.status(200).json({
          status: "success",
          message: "Logged out successfully",
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    if (name) {
      await user.update({
        name: name || user.name,
      });
    }
    if (email) {
      await user.update({
        email: email || user.email,
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await user.isValidPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current password." });
      }

      user.password = newPassword;
    }
    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(
        __dirname,
        "..",
        "uploads",
        "avatars",
        user.avatar
      );
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar filename
    await user.update({
      avatar: req.file.filename,
    });

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Avatar uploaded successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Delete avatar file if exists
    if (user.avatar) {
      const avatarPath = path.join(
        __dirname,
        "..",
        "uploads",
        "avatars",
        user.avatar
      );
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

      // Remove avatar from database
      await user.update({
        avatar: null,
      });
    }

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Avatar deleted successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const localLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Authentication failed",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      const { password, ...safeUser } = user.toJSON();

      // Log successful login
      console.log(`User ${user.id} logged in with session ${req.sessionID}`);

      return res.status(200).json({
        status: "success",
        data: {
          user: safeUser,
          // sessionId: req.sessionID,
        },
      });
    });
  })(req, res, next);
};

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: true,
  }),

  (req, res) => {
    console.log(
      "Google callback successful. Redirecting user to the frontend homepage."
    );

    res.redirect("http://localhost:5173/user/home");
  },
];
module.exports = {
  register,
  getProfile,
  logout,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  localLogin,
  googleAuth,
  googleCallback,
};
