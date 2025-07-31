const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

seedAdmin();
