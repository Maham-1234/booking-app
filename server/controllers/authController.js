// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const { User, RefreshToken } = require("../models");
// const path = require("path");
// const fs = require("fs");

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };
// const signRefreshToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
//   });
// };
// const createSendToken = async (user, statusCode, res) => {
//   const token = signToken(user.id);
//   const refreshToken = signRefreshToken(user.id);
//   // Store refresh token in database
//   await RefreshToken.create({
//     token: refreshToken,
//     userId: user.id,
//     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//   });

//   // Remove password from output
//   user.password = undefined;

//   // res.status(statusCode).json({
//   //   status: "success",
//   //   token,
//   //   refreshToken,
//   //   data: {
//   //     user,
//   //   },
//   // });

//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
//     sameSite: "Strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   };

//   // Set tokens in cookies
//   res.cookie("jwt", token, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // Access token (15 min)
//   res.cookie("refreshToken", refreshToken, cookieOptions); // Refresh token (7 days)

//   // Send response
//   res.status(statusCode).json({
//     status: "success",
//     data: { user },
//   });
// };
// const refreshAccessToken = async (req, res, next) => {
//   try {
//     //const { refreshToken } = req.body;
//     const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(401).json({
//         status: "error",
//         message: "Refresh token required",
//       });
//     }

//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

//     // Check if refresh token exists in database
//     const storedToken = await RefreshToken.findOne({
//       where: {
//         token: refreshToken,
//         userId: decoded.id,
//         isActive: true,
//       },
//     });

//     if (!storedToken || storedToken.expiresAt < new Date()) {
//       return res.status(401).json({
//         status: "error",
//         message: "Invalid or expired refresh token",
//       });
//     }

//     // Generate new access token
//     const newAccessToken = signToken(decoded.id);
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     };

//     res.cookie("jwt", newAccessToken, {
//       ...cookieOptions,
//       maxAge: 15 * 60 * 1000,
//     }); // Access token (15 min)

//     res.status(200).json({
//       status: "success",
//       token: newAccessToken,
//     });
//   } catch (error) {
//     return res.status(401).json({
//       status: "error",
//       message: "Invalid refresh token",
//     });
//   }
// };
// const register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({
//         status: "error",
//         message: "User already exists with this email",
//       });
//     }
//     if (role && role === "admin") {
//       if (!req.user || req.user.role !== "admin") {
//         return res.status(403).json({
//           status: "error",
//           message: "Only admins can create other admins",
//         });
//       }
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || "user",
//     });

//     createSendToken(user, 201, res);
//   } catch (error) {
//     next(error);
//   }
// };

// const logout = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body;

//     if (refreshToken) {
//       await RefreshToken.update(
//         { isActive: false },
//         { where: { token: refreshToken } }
//       );
//     }
//     res.clearCookie("jwt");
//     res.clearCookie("refreshToken");

//     res.status(200).json({
//       status: "success",
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({
//         status: "error",
//         message: "Invalid email or password",
//       });
//     }

//     createSendToken(user, 200, res);
//   } catch (error) {
//     next(error);
//   }
// };

// const getProfile = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       attributes: { exclude: ["password"] },
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateProfile = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { name } = req.body;

//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     await user.update({
//       name: name || user.name,
//     });

//     // Remove password from response
//     user.password = undefined;

//     res.status(200).json({
//       status: "success",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const uploadAvatar = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }
//     // Check if file was uploaded
//     if (!req.file) {
//       return res.status(400).json({
//         status: "error",
//         message: "No file uploaded",
//       });
//     }

//     // Delete old avatar if exists
//     if (user.avatar) {
//       const oldAvatarPath = path.join(
//         __dirname,
//         "..",
//         "uploads",
//         "avatars",
//         user.avatar
//       );
//       if (fs.existsSync(oldAvatarPath)) {
//         fs.unlinkSync(oldAvatarPath);
//       }
//     }

//     // Update user with new avatar filename
//     await user.update({
//       avatar: req.file.filename,
//     });

//     // Remove password from output
//     user.password = undefined;

//     res.status(200).json({
//       status: "success",
//       message: "Avatar uploaded successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// const deleteAvatar = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     // Delete avatar file if exists
//     if (user.avatar) {
//       const avatarPath = path.join(
//         __dirname,
//         "..",
//         "uploads",
//         "avatars",
//         user.avatar
//       );
//       if (fs.existsSync(avatarPath)) {
//         fs.unlinkSync(avatarPath);
//       }

//       // Remove avatar from database
//       await user.update({
//         avatar: null,
//       });
//     }

//     // Remove password from output
//     user.password = undefined;

//     res.status(200).json({
//       status: "success",
//       message: "Avatar deleted successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   register,
//   login,
//   getProfile,
//   refreshAccessToken,
//   logout,
//   updateProfile,
//   uploadAvatar,
//   deleteAvatar,
// };

const { User } = require("../models");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
require("../config/passport");

const redisClient = require("../utils/redisClient");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role='user' } = req.body;

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

    res.status(201).json({
      status: "success",
      message: "User registered successfully. Please log in.",
      data: { user },
    });
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
    const { name } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await user.update({
      name: name || user.name,
    });

    // Remove password from response
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

// const localLogin = (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({
//         status: "error",
//         message: info?.message || "Authentication failed",
//       });
//     }
//     req.login(user, (err) => {
//       if (err) return next(err);
//       const { password, ...safeUser } = user.toJSON();

//       // Log successful login
//       console.log(`User ${user.id} logged in with session ${req.sessionID}`);


//       res.status(200).json({
//       status: "success",
//       data: {
//         safeUser,
//       },
//     });
//     //   return res
//     //     .status(200)
//     //     .json({ status: "success", user: safeUser, sessionId: req.sessionID });
//     // });
//   })(req, res, next);
// };

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

// const googleCallback = [
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     const { password, ...safeUser } = req.user.toJSON();

//     res.status(200).json({
//       status: "success",
//       message: "Google login successful",
//       user: safeUser,
//     });
//   },
// ];

const googleCallback = [
  // This part is almost correct, but we need to tell Passport where to go on success as well.
  // We will handle the redirect manually in the next step for more control.
  passport.authenticate("google", { 
    failureRedirect: 'http://localhost:5173/login', // Use the FULL frontend URL for failure
    session: true // This is correct, it ensures a session cookie is created
  }),

  // This function will only run if passport.authenticate() succeeds.
  (req, res) => {
    // By this point, Passport has done its job:
    // 1. The user is authenticated.
    // 2. A session has been created.
    // 3. A `connect.sid` (or similar) cookie has been set on the response headers.
    // 4. `req.user` contains the authenticated user's data.

    // Now, our ONLY job is to tell the user's browser where to go.
    // We redirect them to their homepage within the React application.

    console.log('Google callback successful. Redirecting user to the frontend homepage.');
    
    // IMPORTANT: Use the FULL frontend URL.
    res.redirect('http://localhost:5173/user/home');
  }
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
