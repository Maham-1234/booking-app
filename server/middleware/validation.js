// const Joi = require("joi");

// const validateSchema = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);

//     if (error) {
//       console.log("validation error");
//       return res.status(400).json({
//         status: "error",
//         message: "Validation failed",
//         details: error.details.map((detail) => ({
//           field: detail.path.join("."),
//           message: detail.message,
//         })),
//       });
//     }

//     next();
//   };
// };

// const schemas = {
//   register: Joi.object({
//     name: Joi.string().min(2).max(50).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//     confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
//   }),

//   login: Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),

//   createEvent: Joi.object({
//     title: Joi.string().min(5).max(200).required(),
//     description: Joi.string().required(),
//     eventDate: Joi.date().greater("now").required(),
//     location: Joi.string().required(),
//     totalSeats: Joi.number().integer().min(1).max(10000).required(),
//     price: Joi.number().min(0).required(),
//   }),

//   updateEvent: Joi.object({
//     title: Joi.string().min(5).max(200),
//     description: Joi.string(),
//     eventDate: Joi.date().greater("now"),
//     location: Joi.string(),
//     totalSeats: Joi.number().integer().min(1).max(10000),
//     price: Joi.number().min(0),
//     status: Joi.string().valid("active", "cancelled", "completed"),
//   }),

//   createBooking: Joi.object({
//     eventId: Joi.number().integer().required(),
//     quantity: Joi.number().integer().min(1).max(5000).required(),
//   }),
//   updateProfile: Joi.object({
//     name: Joi.string().min(2).max(50),
//     // bio: Joi.string().max(500),
//     email: Joi.string().email(),
//   }),
// };

// module.exports = { validateSchema, schemas };
const validateRequest = (schema) => (req, res, next) => {
  try {
    //console.log("Schema received in middleware:", schema);

    // Parse the request body, query, and params against the provided schema
    // schema.parse({
    //   body: req.body,
    //   query: req.query,
    //   params: req.params,
    // });
     if (schema.shape.body) {
      schema.shape.body.parse(req.body);
    }
    if (schema.shape.query) {
      schema.shape.query.parse(req.query);
    }
    if (schema.shape.params) {
      schema.shape.params.parse(req.params);
    }
    next();
  } catch (error) {
    // If validation fails, Zod throws an error
    console.error("Input validation failed:", error.errors);
    
    // return res.status(400).json({
    //   status: "error",
    //   message: "Validation failed",
    //   // Map Zod errors to a user-friendly format
    //   errors: error.errors.map((err) => ({
    //     field: err.path.join('.'), // e.g., "body.email"
    //     message: err.message,
    //   })),
    // });
    const errors = error.flatten().fieldErrors;
      console.error("Zod Validation Errors:", errors);
      return res.status(400).json({
        status: "error",
        message: "Invalid request data",
        errors: errors,
      });
    }
    // Forward any other kind of error
    //next(error);

};

module.exports = validateRequest;