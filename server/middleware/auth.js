// const jwt = require("jsonwebtoken");
// const { User } = require("../models");

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token && req.cookies && req.cookies.jwt) {
//       token = req.cookies.jwt;
//     }

//     if (!token) {
//       return res.status(401).json({
//         status: "error",
//         message: "Access denied. No token provided.",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findByPk(decoded.id);

//     if (!user || !user.isActive) {
//       return res.status(401).json({
//         status: "error",
//         message: "User no longer exists or is deactivated",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       status: "error",
//       message: "Invalid token",
//     });
//   }
// };

// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         status: "error",
//         message: "Access denied. Insufficient permissions.",
//       });
//     }
//     next();
//   };
// };

// module.exports = { protect, restrictTo };
// middleware/ensureAuth.js
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
