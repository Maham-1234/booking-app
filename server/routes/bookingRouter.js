// const express = require("express");
// const {
//   getUserBookings,
//   getAllBookings,
//   createBooking,
//   updateBooking,
//   cancelBooking,
// } = require("../controllers/bookingController");
// const { protect, restrictTo } = require("../middleware/auth");
// const { validateSchema, schemas } = require("../middleware/validation");

// const router = express.Router();

// // All routes require authentication
// router.use(protect);

// router
//   .route("/")
//   .get(getUserBookings)
//   .post(validateSchema(schemas.createBooking), createBooking);
// //.post(createBooking);

// router.get("/all", restrictTo("admin"), getAllBookings);

// router.route("/:id").put(updateBooking).delete(cancelBooking);

// module.exports = router;

const express = require("express");
const {
  getUserBookings,
  getAllBookings,
  createBooking,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { ensureAuthenticated, restrictTo } = require("../middleware/auth");
const validateRequest = require("../middleware/validation");
const validateOutput = require("../middleware/outputValidation");
const schemas = require("../validation/schemas");

const router = express.Router();

router.use(ensureAuthenticated);

router
  .route("/")
  .get(
    validateRequest(schemas.booking.getUserBookingsRequest),
    validateOutput(schemas.booking.getAllBookingsResponse),
    getUserBookings
  )
  .post(
    validateRequest(schemas.booking.createRequest),
    validateOutput(schemas.booking.getBookingResponse),
    createBooking
  );

router.get(
  "/all",
  restrictTo("admin"),
  validateRequest(schemas.booking.getUserBookingsRequest),
  validateOutput(schemas.booking.getAllBookingsResponse),

  getAllBookings
);

router
  .route("/:id")
  .put(
    validateRequest(schemas.booking.updateRequest),
    validateOutput(schemas.booking.getBookingResponse),
    updateBooking
  )
  .delete(
    validateRequest(schemas.booking.getByIdRequest),
    validateOutput(schemas.booking.getBookingResponse),
    cancelBooking
  );

module.exports = router;
