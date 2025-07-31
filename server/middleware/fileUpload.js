const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads", "avatars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const resizeUserAvatar = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    const filepath = path.join(uploadsDir, filename);

    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Add filename to request for use in controller
    req.file.filename = filename;
    next();
  } catch (error) {
    next(error);
  }
};

const uploadUserAvatar = upload.single("avatar");

module.exports = {
  uploadUserAvatar,
  resizeUserAvatar,
};
