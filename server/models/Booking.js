const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Events",
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5000,
    },
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("confirmed", "cancelled", "pending","used"),
    defaultValue: "confirmed",
  },
  bookingReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
Booking.addHook("beforeCreate", (booking) => {
  booking.bookingReference = `BK${Date.now()}${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`;
});
module.exports = Booking;
