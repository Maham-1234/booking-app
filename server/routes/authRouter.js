// const express = require("express");

// const { validateSchema, schemas } = require("../middleware/validation");
// const { protect } = require("../middleware/auth");
// const {
//   uploadUserAvatar,
//   resizeUserAvatar,
// } = require("../middleware/fileUpload");

// const {
//   register,
//   login,
//   getProfile,
// } = require("../controllers/authController");

// const {
//   refreshAccessToken,
//   logout,
//   uploadAvatar,
//   deleteAvatar,
//   updateProfile,
// } = require("../controllers/authController");

// const router = express.Router();

// router.post("/register", validateSchema(schemas.register), register);
// router.post("/login", validateSchema(schemas.login), login);

// router.use(protect);

// router.route("/profile").get(getProfile).put(updateProfile);
// router
//   .route("/avatar")
//   .post(uploadUserAvatar, resizeUserAvatar, uploadAvatar)
//   .delete(deleteAvatar);

// router.post("/refresh", refreshAccessToken);
// router.post("/logout", logout);

// module.exports = router;

const express = require("express");
const passport = require("passport");
require("../config/passport");
//const { validateSchema, schemas } = require("../middleware/validation");
const {
  uploadUserAvatar,
  resizeUserAvatar,
} = require("../middleware/fileUpload");
//const schemas = require("../validation/schemas");
const validateRequest = require("../middleware/validation");
const validateOutput = require("../middleware/outputValidation");
const schemas = require("../validation/schemas");

const { register, getProfile } = require("../controllers/authController");

const {
  refreshAccessToken,
  logout,
  uploadAvatar,
  deleteAvatar,
  updateProfile,
  localLogin,
  googleAuth,
  googleCallback,
} = require("../controllers/authController");

const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  validateRequest(schemas.user.registerRequest),
  validateOutput(schemas.user.authResponse),
  register
);
router.post(
  "/login",
  validateRequest(schemas.user.loginRequest),
  validateOutput(schemas.user.authResponse),
  localLogin
);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

router
  .route("/profile")
  .get(
    ensureAuthenticated,
    validateOutput(schemas.user.getProfileResponse),
    getProfile
  )
  .put(
    ensureAuthenticated,
    validateRequest(schemas.user.updateProfileRequest),
    validateOutput(schemas.user.getProfileResponse),
    updateProfile
  );
router
  .route("/avatar")
  .post(
    ensureAuthenticated,
    uploadUserAvatar,
    resizeUserAvatar,
    validateOutput(schemas.user.getProfileResponse),
    uploadAvatar
  )
  .delete(
    ensureAuthenticated,
    validateOutput(schemas.user.getProfileResponse),
    deleteAvatar
  );

router.post("/logout", logout);

module.exports = router;
