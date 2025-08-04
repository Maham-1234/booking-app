const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { User, Event, Booking, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log("Database synced successfully");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@bookingapi.com",
      password: "admin123",
      role: "admin",
    });

    // Create regular users
    const users = await User.bulkCreate([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        role: "user",
      },
    ]);

    const rawEvents = [
      {
        title: "Tech Conference 2024",
        description:
          "Annual technology conference featuring the latest trends in software development, AI, and cloud computing.",
        eventDate: new Date("2024-12-15 09:00:00"),
        location: "Convention Center, San Francisco",
        totalSeats: 500,
        availableSeats: 500,
        price: 149.99,
        status: "active",
      },
      {
        title: "Rock Concert - The Midnight",
        description:
          "Live performance by The Midnight band with special guests.",
        eventDate: new Date("2024-11-20 20:00:00"),
        location: "Madison Square Garden, New York",
        totalSeats: 2000,
        availableSeats: 2000,
        price: 89.99,
        status: "active",
      },
      {
        title: "Startup Pitch Night",
        description:
          "Local entrepreneurs pitch their innovative ideas to investors.",
        eventDate: new Date("2024-10-30 18:00:00"),
        location: "Innovation Hub, Austin",
        totalSeats: 200,
        availableSeats: 200,
        price: 25.0,
        status: "active",
      },
      {
        title: "Food Festival",
        description:
          "Taste amazing dishes from local restaurants and food trucks.",
        eventDate: new Date("2025-11-05 12:00:00"),
        location: "Central Park, Chicago",
        totalSeats: 1000,
        availableSeats: 1000,
        price: 35.0,
        status: "active",
      },
    ];

    const events = await Event.bulkCreate(
      rawEvents.map((event) => ({
        ...event,
        image: `https://picsum.photos/600/384?random=${Math.random()%100}
`,
      }))
    );

    // Create some sample bookings
    const bookings = await Booking.bulkCreate(
      [
        {
          userId: users[0].id,
          eventId: events[0].id,
          quantity: 2,
          totalAmount: 299.98,
          status: "confirmed",
        },
        {
          userId: users[1].id,
          eventId: events[1].id,
          quantity: 1,
          totalAmount: 89.99,
          status: "confirmed",
        },
        {
          userId: users[2].id,
          eventId: events[2].id,
          quantity: 3,
          totalAmount: 75.0,
          status: "confirmed",
        },
      ],
      { individualHooks: true }
    );

    // Update available seats for booked events
    await Event.update(
      { availableSeats: 498 },
      { where: { id: events[0].id } }
    );
    await Event.update(
      { availableSeats: 1999 },
      { where: { id: events[1].id } }
    );
    await Event.update(
      { availableSeats: 197 },
      { where: { id: events[2].id } }
    );

    console.log("Sample data created successfully!");
    console.log("\nTest Accounts:");
    console.log("Admin: admin@bookingapi.com / admin123");
    console.log("User: john@example.com / password123");
    console.log("User: jane@example.com / password123");
    console.log("User: bob@example.com / password123");

    console.log(
      "Created users:",
      users.map((u) => u.toJSON())
    );
    console.log(
      "Created events:",
      events.map((e) => e.toJSON())
    );

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

(async () => {
  await seedDatabase();
})();
