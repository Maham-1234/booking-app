const { Booking, Event, User, sequelize } = require("../models");
const { Op } = require("sequelize");
const { sendBookingConfirmationEmail } = require("../services/emailService");
const getUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "confirmed", search } = req.query;
    const offset = (page - 1) * limit;

    const eventWhereClause = {};

    if (search) {
      eventWhereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const {count, rows} = await Booking.findAndCountAll({
      where: {
        userId: req.user.id,
        status,
      },
      include: [
        {
          model: Event,
          as: "event",
                  attributes: ["id", "title", "eventDate", "location"],

          where:
            Object.keys(eventWhereClause).length > 0
              ? eventWhereClause
              : undefined,
        },
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    res.status(200).json({
      status: "success",
      results: count, // Use the total count from findAndCountAll
      data: {
        bookings: rows, // Use the rows for the array
        // Add the required pagination object
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          totalResults: count,
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
const { page = 1, limit = 10, status = "confirmed" } = req.query;
    const offset = (page - 1) * limit;

    const {count,rows} = await Booking.findAndCountAll({
      where: { status },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Event,
          as: "event",
          attributes: ["id","title", "eventDate", "location"],
        },
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
      distinct:true,
    });

   res.status(200).json({
      status: "success",
      results: count,
      data: {
        bookings: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          totalResults: count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const createBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.id;
    const event = await Event.findByPk(eventId, { transaction });

    if (!event) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    if (event.status !== "active") {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Event is not available for booking",
      });
    }

    if (event.availableSeats < quantity) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: `Only ${event.availableSeats} seats available`,
      });
    }

    const existingBooking = await Booking.findOne({
      where: {
        userId: userId,
        eventId: eventId,
        status: "confirmed",
      },
      transaction,
    });

    if (existingBooking) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "You already have a booking for this event",
      });
    }

    const totalAmount = parseFloat(event.price) * quantity;

    // Create booking
    const bookingReference = `BK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
    const booking = await Booking.create(
      {
        userId: userId,
        eventId: eventId,
        quantity: quantity,
        totalAmount: totalAmount,
        bookingReference: bookingReference,
        status: "confirmed",
      },
      { transaction }
    );

    // Update available seats
    await event.update(
      {
        availableSeats: event.availableSeats - quantity,
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch user details for the email (userId is in scope)
    const user = await User.findByPk(userId);
    if (user && user.email) {
      const bookingDetails = {
        userName: user.name,
        userEmail: user.email,
        eventName: event.title,
        eventDate: event.eventDate,
        eventLocation: event.location,
        numberOfTickets: booking.quantity,
        totalPrice: booking.totalAmount,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
      };
      await sendBookingConfirmationEmail(user.email, bookingDetails);
    } else {
      console.warn(
        `Could not send booking confirmation email for booking ${booking.id}: User or user email not found.`
      );
    }

    // Fetch the complete booking with event details
    // const completeBooking = await Booking.findByPk(booking.id, {
    //   include: [
    //     {
    //       model: Event,
    //       as: "event",
    //       attributes: ["title", "eventDate", "location"],
    //     },
    //   ],
    // });
 const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        // Include the FULL event object to match eventBaseSchema
        { model: Event, as: "event" },
        // Also include the user object to match userBaseSchema
        { model: User, as: "user", attributes: { exclude: ['password'] } }
      ],
    });
    res.status(201).json({
      status: "success",
      data: {
        booking: completeBooking,
      },
    });
  } catch (error) {
    console.error(
      "Error after transaction commit or during booking finalization:",
      error
    );

    if (
      transaction &&
      transaction.finished !== "committed" &&
      transaction.finished !== "rolled back"
    ) {
      await transaction.rollback();
      console.log("Transaction successfully rolled back.");
    } else {
      console.log(
        "Transaction already finished (committed or rolled back). Not attempting rollback."
      );
    }
    next(error);
  }
};
const updateBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const bookingId = req.params.id;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 5000) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Quantity must be between 1 and 5000",
      });
    }

    // Find booking with associated event
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId: req.user.id,
      },
      include: [
        {
          model: Event,
          as: "event",
        },
      ],
      transaction,
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Cannot update a cancelled booking",
      });
    }

    const event = booking.event;
    const seatDifference = quantity - booking.quantity;

    // Check if enough seats are available
    if (seatDifference > 0 && event.availableSeats < seatDifference) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Not enough seats available for update",
      });
    }

    // Update event available seats
    await event.update(
      {
        availableSeats: event.availableSeats - seatDifference,
      },
      { transaction }
    );

    // Update booking details
    await booking.update(
      {
        quantity,
        totalAmount: quantity * parseFloat(event.price),
        status: "confirmed",
      },
      { transaction }
    );

    await transaction.commit();

     const responseBooking = booking.toJSON();
    responseBooking.user = await User.findByPk(booking.userId, {
        attributes: { exclude: ['password'] }
    });
    res.status(200).json({
      status: "success",
      data: {
        booking: responseBooking,
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const bookingId = req.params.id;

    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId: req.user.id,
      },
      include: [
        {
          model: Event,
          as: "event",
        },
      ],
      transaction,
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Booking is already cancelled",
      });
    }

    // Update booking status
    await booking.update({ status: "cancelled" }, { transaction });

    // Return the seats back to event
    await booking.event.update(
      {
        availableSeats: booking.event.availableSeats + booking.quantity,
      },
      { transaction }
    );

    await transaction.commit();

        const responseBooking = booking.toJSON();
    responseBooking.user = await User.findByPk(booking.userId, {
        attributes: { exclude: ['password'] }
    });


    res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
      data: {
        booking: responseBooking,
      },
    });

  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  getUserBookings,
  getAllBookings,
  createBooking,
  updateBooking,
  cancelBooking,
};
