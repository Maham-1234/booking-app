// const express = require("express");
// const {
//   getFile,
//   uploadAvatar,
//   uploadEventImage,
//   uploadMultipleFiles,
//   deleteFile,
//   getFileInfo,
// } = require("../controllers/fileController");
// const { protect, restrictTo } = require("../middleware/auth");
// const { uploadConfigs, processImage } = require("../middleware/fileUpload");

// const router = express.Router();

// // Public route to serve files
// router.get("/:folder/:filename", getFile);

// // Protected routes
// router.use(protect);

// // Upload user avatar
// router.post(
//   "/avatar",
//   uploadConfigs.single("avatar"),
//   processImage,
//   uploadAvatar
// );

// // Upload event image (admin only)
// router.post(
//   "/event/:id/image",
//   restrictTo("admin"),
//   uploadConfigs.single("eventImage"),
//   processImage,
//   uploadEventImage
// );

// // Upload multiple files
// router.post(
//   "/multiple",
//   uploadConfigs.multiple("files", 5),
//   uploadMultipleFiles
// );

// // Get file info
// router.get("/:folder/:filename/info", getFileInfo);

// // Delete file (admin only)
// router.delete("/:folder/:filename", restrictTo("admin"), deleteFile);

// module.exports = router;
