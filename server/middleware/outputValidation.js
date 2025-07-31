// const validateOutput = (schema) => (req, res, next) => {
//   const originalJson = res.json;

//   res.json = function (body) {
//     try {
//       // We only validate successful responses (2xx status codes)
//       if (res.statusCode >= 200 && res.statusCode < 300) {
//         // The actual data is often nested under a 'data' property
//         const dataToValidate = body.data;

//         // In some cases, the data might not be nested (e.g., lists)
//         const finalData = dataToValidate || body;

//         // Validate the data against the provided schema
//         schema.parse(finalData);
//       }
//     } catch (error) {
//       // Log the validation error on the server
//       console.error("Output validation failed:", error);

//       // Important: Don't send the validated data.
//       // Instead, send a generic error to the client to avoid leaking implementation details.
//       const response = {
//         status: "error",
//         message: "An internal error occurred: Invalid response structure.",
//       };
//       // Set the original res.json back to avoid infinite loops
//       res.json = originalJson;
//       return res.status(500).json(response);
//     }

//     // If validation succeeds, call the original res.json
//     return originalJson.call(this, body);
//   };

//   next();
// };

// module.exports = validateOutput;

// middleware/outputValidation.js

const validateOutput = (schema) => (req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    try {
      // We only validate successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // The schema is designed to parse the ENTIRE body.
        // Do not attempt to extract nested properties here.
        schema.parse(body);
      }
    } catch (error) {
      console.error("Output validation failed:", error);

      const response = {
        status: "error",
        message: "An internal error occurred: Invalid response structure.",
      };
      res.json = originalJson; // Restore original function to prevent loops
      return res.status(500).json(response);
    }

    // If validation passes, call the original res.json with the original body
    return originalJson.call(this, body);
  };

  next();
};

module.exports = validateOutput;