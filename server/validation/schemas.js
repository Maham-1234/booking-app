const { z } = require("zod");

//================================================================================
// 1. BASE SCHEMAS (REUSABLE BUILDING BLOCKS)
//================================================================================

// Base schema for a "safe" user object (NEVER includes password)
const userBaseSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["user", "admin"]),
    avatar: z.string().nullable().optional(),
    createdAt: z.date().or(z.string().datetime()),
    updatedAt: z.date().or(z.string().datetime()),
  })
  .strip();

// Base schema for an event object
const eventBaseSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    description: z.string().nullable(),
    eventDate: z.date().or(z.string().datetime()),
    location: z.string(),
    totalSeats: z.number().int(),
    availableSeats: z.number().int(),
    price: z.coerce.number(),
    status: z.enum(["active", "inactive", "completed", "cancelled"]),
    createdAt: z.date().or(z.string().datetime()),
    updatedAt: z.date().or(z.string().datetime()),
  })
  .strip();

// Base schema for a booking object
const bookingBaseSchema = z
  .object({
    id: z.number().int(),
    userId: z.number().int(),
    eventId: z.number().int(),
    quantity: z.number().int(),
    totalAmount: z.coerce.number(),
    bookingReference: z.string(),
    status: z.enum(["confirmed", "cancelled"]),
    createdAt: z.date().or(z.string().datetime()),
    updatedAt: z.date().or(z.string().datetime()),
  })
  .strip();

// Reusable schema for id parameter in URL
const paramsSchema = z.object({
  id: z.coerce.number().int({ message: "Invalid ID parameter" }),
});

// Reusable schema for pagination query
const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

//================================================================================
//  FINAL SCHEMAS (GROUPED BY RESOURCE)
//================================================================================

const schemas = {
  //-------------------------------------
  // User & Authentication Schemas
  //-------------------------------------
  user: {
    // --- Request Schemas ---
    registerRequest: z.object({
      body: z
        .object({
          name: z.string().min(2, "Name must be at least 2 characters").max(50),
          email: z.email("Invalid email address"),
          password: z.string().min(6, "Password must be at least 6 characters"),
          confirmPassword: z.string(),
          role: z.enum(["user", "admin"]).optional().default("user"), // ⬅️ optional role
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"], // Field to attach the error to
        }),
    }),
    loginRequest: z.object({
      body: z
        .object({
          email: z.email("Invalid email address"),
          password: z.string().min(1, "Password is required"),
        })
        .strip(),
    }),
    updateProfileRequest: z.object({
      body: z.object({
        name: z.string().min(2).max(50).optional(),
        email: z.email().optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
      }),
    }),

    // --- Response Schemas ---
    //authResponse: z.object({ user: userBaseSchema }), // For login, register
    authResponse: z.object({
      status: z.literal("success"),
      data: z.object({
        user: userBaseSchema,
      }),
    }),
    getProfileResponse: z.object({
      status: z.literal("success"),
      data: z.object({
        user: userBaseSchema,
      }),
    }), // For get/update profile
  },

  //-------------------------------------
  // Event Schemas
  //-------------------------------------
  event: {
    // --- Request Schemas ---
    createRequest: z.object({
      body: z.object({
        title: z.string().min(5).max(200),
        description: z.string().min(1, "Description is required"),
        eventDate: z
          .string()
          .datetime("Invalid date format")
          .refine((date) => new Date(date) > new Date(), {
            message: "Event date must be in the future",
          }),
        location: z.string().min(1, "Location is required"),
        totalSeats: z.number().int().min(1).max(10000),
        price: z.number().min(0),
      }),
    }),
    updateRequest: z.object({
      params: paramsSchema,
      body: z
        .object({
          title: z.string().min(5).max(200).optional(),
          description: z.string().optional(),
          eventDate: z.string().datetime().optional(),
          location: z.string().optional(),
          price: z.coerce.number().min(0).optional(),
          status: z.enum(["active", "cancelled", "completed"]).optional(),
          image: z.string().nullable().optional(),
          totalSeats: z.coerce.number().int().min(1).optional(),
        })
        .strip(), // Disallow extra properties in the body
    }),
    getAllRequest: z.object({
      query: paginationQuerySchema.extend({
        status: z.enum(["active", "inactive"]).optional(),
        search: z.string().optional(),
      }),
    }),
    getByIdRequest: z.object({ params: paramsSchema }),

    // --- Response Schemas ---
    getEventResponse: z.object({
      status: z.literal("success"),
      data: z.object({
        event: eventBaseSchema,
      }),
    }),
    getAllEventsResponse: z.object({
      status: z.literal("success"),
      results: z.number().int(),
      data: z.object({
        events: z.array(eventBaseSchema),
        pagination: z.object({
          page: z.number().int(),
          limit: z.number().int(),
          totalPages: z.number().int(),
          totalResults: z.number().int(),
        }),
      }),
    }),
  },

  //-------------------------------------
  // Booking Schemas
  //-------------------------------------
  booking: {
    // --- Request Schemas ---
    createRequest: z.object({
      body: z.object({
        eventId: z.number().int("Invalid Event ID"),
        quantity: z
          .number()
          .int()
          .min(1, "Quantity must be at least 1")
          .max(5000),
      }),
    }),
    updateRequest: z.object({
      params: paramsSchema,
      body: z.object({
        quantity: z
          .number()
          .int()
          .min(1, "Quantity must be at least 1")
          .max(5000),
      }),
    }),
    getUserBookingsRequest: z.object({
      query: paginationQuerySchema.extend({
        status: z.enum(["confirmed", "cancelled"]).optional(),
        search: z.string().optional(),
      }),
    }),
    getByIdRequest: z.object({ params: paramsSchema }),

    // --- Response Schemas ---
    getBookingResponse: z.object({
      status: z.literal("success"),
      data: z.object({
        booking: bookingBaseSchema.extend({
          // When fetching a single booking, it's good to include
          // full details of the associated event and user.
          event: eventBaseSchema.optional(),
          user: userBaseSchema.optional(),
        }),
      }),
      message: z.string().optional(), // For messages like "Booking cancelled"
    }),

    getAllBookingsResponse: z.object({
      status: z.literal("success"),
      results: z.coerce.number(),
      data: z.object({
        bookings: z.array(
          bookingBaseSchema.extend({
            event: eventBaseSchema
              .pick({ id: true, title: true, eventDate: true, location: true })
              .optional(),
            user: userBaseSchema.pick({ id: true, name: true }).optional(),
          })
        ),
        pagination: z.object({
          page: z.coerce.number().int(),
          limit: z.coerce.number().int(),
          totalPages: z.coerce.number().int(),
          totalResults: z.coerce.number().int(),
        }),
      }),
    }),
  },
};

module.exports = schemas;
