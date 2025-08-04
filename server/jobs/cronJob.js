const { Event, Booking } = require("../models");
const { Op } = require("sequelize");
const cron = require("node-cron");

const completePastEvents = async () => {
  try {
    const pastEvents = await Event.findAll({
      where: {
        eventDate: { [Op.lt]: new Date() },
        status: "active",
      },
    });

    for (const event of pastEvents) {
      await event.update({ status: "completed" });

      await Booking.update(
        { status: "used" },
        { where: { eventId: event.id, status: "confirmed" } }
      );
    }

    console.log(`Completed ${pastEvents.length} past events.`);
  } catch (err) {
    console.error("Error in completePastEvents:", err.message);
  }
};

// cron.schedule('0 0 * * *', () => {
//   console.log('Running scheduled job to complete past events...');
//   completePastEvents();
// });

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled job to complete past events...");
  completePastEvents();
});
