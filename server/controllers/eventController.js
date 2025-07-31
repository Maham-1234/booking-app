const { Event, Booking } = require("../models");
const { Op } = require("sequelize");

// const getAllEvents = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10, status = "active", search } = req.query;
//     const offset = (page - 1) * limit;

//     const whereClause = { status };

//     if (search) {
//       whereClause[Op.or] = [
//         { title: { [Op.iLike]: `%${search}%` } },
//         { location: { [Op.iLike]: `%${search}%` } },
//       ];
//     }

//     const events = await Event.findAndCountAll({
//       where: whereClause,
//       limit: parseInt(limit),
//       offset: offset,
//       order: [["eventDate", "ASC"]],
//     });

//     res.status(200).json({
//       status: "success",
//       results: events.count,
//       data: {
//         events: events.rows,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(events.count / limit),
//           totalResults: events.count,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getAllEvents = async (req, res, next) => {
  try {
    // 1. Read the 'sort' parameter from the query string, defaulting to 'eventDate'
    const { page = 1, limit = 9, status = "active", search, sort = 'eventDate' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { status };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // --- THIS IS THE KEY CHANGE ---
    // 2. Create a dynamic 'order' clause based on the 'sort' parameter
    let orderClause = [['eventDate', 'ASC']]; // Default sort order

    if (sort === 'price-asc') {
      orderClause = [['price', 'ASC']];
    } else if (sort === 'price-desc') {
      orderClause = [['price', 'DESC']];
    }
    // If sort is 'eventDate', the default is already set.

    // 3. Use the dynamic 'orderClause' in your database query
    const events = await Event.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: orderClause, // Apply the dynamic sorting here
    });

    res.status(200).json({
      status: "success",
      results: events.count,
      data: {
        events: events.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(events.count / limit),
          totalResults: events.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const eventBody = req.body;
    eventBody.availableSeats = req.body.totalSeats;
    const event = await Event.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    await event.update(req.body);

    res.status(200).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    // Check if event has bookings
    const bookingCount = await Booking.count({
      where: { eventId: req.params.id },
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Cannot delete event with existing bookings",
      });
    }

    await event.destroy();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
