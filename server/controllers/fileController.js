// const fs = require("fs");
// const path = require("path");
// const { User, Event } = require("../models");
// const { uploadsDir } = require("../middleware/fileUpload");

// // Get file by filename
// const getFile = async (req, res, next) => {
//   try {
//     const { folder, filename } = req.params;
//     const filePath = path.join(uploadsDir, folder, filename);

//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         status: "error",
//         message: "File not found",
//       });
//     }

//     // Get file stats
//     const stats = fs.statSync(filePath);
//     const fileSize = stats.size;

//     // Set appropriate headers
//     res.setHeader("Content-Length", fileSize);
//     res.setHeader("Content-Type", getContentType(filename));
//     res.setHeader("Cache-Control", "public, max-age=31536000");

//     // Stream the file
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } catch (error) {
//     next(error);
//   }
// };

// // Upload user avatar
// const uploadAvatar = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         status: "error",
//         message: "No file uploaded",
//       });
//     }

//     const userId = req.user.id;
//     const relativePath = path.relative(uploadsDir, req.file.path);

//     // Update user avatar in database
//     await User.update({ avatar: relativePath }, { where: { id: userId } });

//     // Get updated user
//     const user = await User.findByPk(userId, {
//       attributes: { exclude: ["password"] },
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Avatar uploaded successfully",
//       data: {
//         user,
//         fileUrl: `/uploads/${relativePath}`,
//       },
//     });
//   } catch (error) {
//     // Clean up uploaded file on error
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     next(error);
//   }
// };

// // Upload event image
// const uploadEventImage = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         status: "error",
//         message: "No file uploaded",
//       });
//     }

//     const eventId = req.params.id;
//     const relativePath = path.relative(uploadsDir, req.file.path);

//     // Check if event exists
//     const event = await Event.findByPk(eventId);
//     if (!event) {
//       // Clean up uploaded file
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }

//       return res.status(404).json({
//         status: "error",
//         message: "Event not found",
//       });
//     }

//     // Delete old image if exists
//     if (event.image) {
//       const oldImagePath = path.join(uploadsDir, event.image);
//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }
//     }

//     // Update event image in database
//     await event.update({ image: relativePath });

//     res.status(200).json({
//       status: "success",
//       message: "Event image uploaded successfully",
//       data: {
//         event,
//         fileUrl: `/uploads/${relativePath}`,
//       },
//     });
//   } catch (error) {
//     // Clean up uploaded file on error
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     next(error);
//   }
// };

// // Upload multiple files
// const uploadMultipleFiles = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         status: "error",
//         message: "No files uploaded",
//       });
//     }

//     const uploadedFiles = req.files.map((file) => {
//       const relativePath = path.relative(uploadsDir, file.path);
//       return {
//         filename: file.filename,
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//         path: relativePath,
//         url: `/uploads/${relativePath}`,
//       };
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Files uploaded successfully",
//       data: {
//         files: uploadedFiles,
//       },
//     });
//   } catch (error) {
//     // Clean up uploaded files on error
//     if (req.files) {
//       req.files.forEach((file) => {
//         if (fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }
//       });
//     }
//     next(error);
//   }
// };

// // Delete file
// const deleteFile = async (req, res, next) => {
//   try {
//     const { folder, filename } = req.params;
//     const filePath = path.join(uploadsDir, folder, filename);

//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         status: "error",
//         message: "File not found",
//       });
//     }

//     // Delete file
//     fs.unlinkSync(filePath);

//     res.status(200).json({
//       status: "success",
//       message: "File deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get file info
// const getFileInfo = async (req, res, next) => {
//   try {
//     const { folder, filename } = req.params;
//     const filePath = path.join(uploadsDir, folder, filename);

//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         status: "error",
//         message: "File not found",
//       });
//     }

//     // Get file stats
//     const stats = fs.statSync(filePath);

//     res.status(200).json({
//       status: "success",
//       data: {
//         filename: filename,
//         size: stats.size,
//         created: stats.birthtime,
//         modified: stats.mtime,
//         contentType: getContentType(filename),
//         url: `/uploads/${folder}/${filename}`,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Helper function to get content type
// const getContentType = (filename) => {
//   const ext = path.extname(filename).toLowerCase();
//   const contentTypes = {
//     ".jpg": "image/jpeg",
//     ".jpeg": "image/jpeg",
//     ".png": "image/png",
//     ".gif": "image/gif",
//     ".webp": "image/webp",
//     ".pdf": "application/pdf",
//     ".doc": "application/msword",
//     ".docx":
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ".txt": "text/plain",
//   };
//   return contentTypes[ext] || "application/octet-stream";
// };

// module.exports = {
//   getFile,
//   uploadAvatar,
//   uploadEventImage,
//   uploadMultipleFiles,
//   deleteFile,
//   getFileInfo,
// };
