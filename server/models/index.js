const sequelize = require("../config/database");
const User = require("./User");
const Event = require("./Event");
const Booking = require("./Booking");
const RefreshToken = require("./RefreshToken");

// Define associations
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

Event.hasMany(Booking, { foreignKey: "eventId", as: "bookings" });
Booking.belongsTo(Event, { foreignKey: "eventId", as: "event" });

User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Event,
  Booking,
  RefreshToken,
};
