const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        //isAfter: new Date().toISOString(),
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10000,
      },
    },
    availableSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("active", "cancelled", "completed"),
      defaultValue: "active",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path to event image",
    },
    imageUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.image) {
          return `${process.env.BASE_URL || "http://localhost:3000"}/uploads/${
            this.image
          }`;
        }
        return null;
      },
    },
  },
  {
    hooks: {
      beforeCreate: (event) => {
        event.availableSeats = event.totalSeats;
      },
    },
  }
);

module.exports = Event;
