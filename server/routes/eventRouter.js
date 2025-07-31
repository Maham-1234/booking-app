// const express = require("express");
// const {
//   getAllEvents,
//   getEvent,
//   createEvent,
//   updateEvent,
//   deleteEvent,
// } = require("../controllers/eventController");
// const { protect, restrictTo } = require("../middleware/auth");
// const { validateSchema, schemas } = require("../middleware/validation");

// const router = express.Router();

// router
//   .route("/")
//   .get(getAllEvents)
//   .post(
//     protect,
//     restrictTo("admin"),
//     validateSchema(schemas.createEvent),
//     createEvent
//   );

// router
//   .route("/:id")
//   .get(getEvent)
//   .put(
//     protect,
//     restrictTo("admin"),
//     validateSchema(schemas.updateEvent),
//     updateEvent
//   )
//   .delete(protect, restrictTo("admin"), deleteEvent);

// module.exports = router;

const express = require("express");

const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { ensureAuthenticated, restrictTo } = require("../middleware/auth");
//const { validateSchema, schemas } = require("../middleware/validation");
const validateRequest = require("../middleware/validation");
const validateOutput = require("../middleware/outputValidation");
const schemas = require("../validation/schemas");

const router = express.Router();

router
  .route("/")
  .get(
    validateRequest(schemas.event.getAllRequest),
    validateOutput(schemas.event.getAllEventsResponse),
    getAllEvents
  )
  .post(
    ensureAuthenticated,
    restrictTo("admin"),
    validateRequest(schemas.event.createRequest),
    validateOutput(schemas.event.getEventResponse),
    createEvent
  );

router
  .route("/:id")
  .get(
    validateRequest(schemas.event.getByIdRequest),
    validateOutput(schemas.event.getEventResponse),
    getEvent
  )
  .put(
    ensureAuthenticated,
    restrictTo("admin"),
    validateRequest(schemas.event.updateRequest),
    validateOutput(schemas.event.getEventResponse),
    updateEvent
  )
  .delete(
    ensureAuthenticated,
    restrictTo("admin"),
    validateRequest(schemas.event.getByIdRequest),
    deleteEvent
  );

module.exports = router;
