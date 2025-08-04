require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const redis = require("redis");
const passport = require("passport");
require("./config/passport");
require("./jobs/cronJob");

const { sequelize } = require("./models");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const app = express();

    const authRouter = require("./routes/authRouter");
    const eventRouter = require("./routes/eventRouter");
    const bookingRouter = require("./routes/bookingRouter");
    const errorHandler = require("./middleware/errorHandler");

    const { redisClient, connectRedis } = require("./utils/redisClient");
    console.log(typeof RedisStore); // function

    // Handle Redis connection events
    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected successfully");
    });

    redisClient.on("ready", () => {
      console.log("Redis client is ready");
    });
    //connect redis client
    await connectRedis();
    console.log("Redis connection initialized");

    app.use(
      session({
        store: new RedisStore({
          client: redisClient,
          prefix: "booking_session:",
          ttl: 86400, // Session TTL in seconds (24 hours)
        }),
        secret: process.env.SESSION_SECRET || "a_strong_secret_for_development",
        resave: false,
        saveUninitialized: false,
        rolling: true, // Reset expiration on activity
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          //maxAge: 1000 * 10, // 10 seconds
          sameSite: "lax",
        },
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // CORS middleware
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );

    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static("public"));

    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    app.use("/api/auth", authRouter);
    app.use("/api/events", eventRouter);
    app.use("/api/bookings", bookingRouter);

    app.get("/session", (req, res) => {
      res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        sessionId: req.sessionID,
        session: {
          cookie: req.session.cookie,
        },
      });
    });

    app.get("/redis-test", async (req, res) => {
      try {
        const testKey = "test:" + Date.now();
        const testValue = "Hello Redis!";

        await redisClient.set(testKey, testValue, { EX: 60 }); // Expires in 60 seconds

        const retrievedValue = await redisClient.get(testKey);

        const sessionKeys = await redisClient.keys("booking_session:*");

        res.json({
          success: true,
          test: {
            key: testKey,
            setValue: testValue,
            retrievedValue: retrievedValue,
            match: testValue === retrievedValue,
          },
          sessions: {
            count: sessionKeys.length,
            keys: sessionKeys.slice(0, 5),
          },
          redis: {
            connected: redisClient.isReady,
            uptime: await redisClient.ping(),
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    app.get("/health", async (req, res) => {
      try {
        const redisStatus = redisClient.isReady ? "connected" : "disconnected";

        if (redisClient.isReady) {
          await redisClient.ping();
        }

        res.status(200).json({
          status: "success",
          message: "Booking API is running successfully",
          timestamp: new Date().toISOString(),
          redis: {
            status: redisStatus,
            ready: redisClient.isReady,
            host: process.env.REDIS_HOST || "localhost",
            port: process.env.REDIS_PORT || 6379,
          },
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Health check failed",
          error: error.message,
        });
      }
    });

    // 404 handler
    app.use("*", (req, res) => {
      res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`,
      });
    });

    // Global error handler
    app.use(errorHandler);

    // Database connection and server start
    const startServer = async () => {
      try {
        if (redisClient.isReady) {
          const pingResult = await redisClient.ping();
          console.log("Redis connection test successful:", pingResult);
        } else {
          console.warn("Redis client is not ready yet");
        }

        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync({ force: false });
        console.log("Database synchronized");

        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
          console.log(`Environment: ${process.env.NODE_ENV}`);
        });
      } catch (error) {
        console.error("Unable to start server:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      try {
        await redisClient.quit();
        console.log("Redis client disconnected");
      } catch (err) {
        console.error("Error disconnecting Redis:", err);
      } finally {
        process.exit(0);
      }
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      try {
        await redisClient.quit();
        console.log("Redis client disconnected");
      } catch (err) {
        console.error("Error disconnecting Redis:", err);
      } finally {
        process.exit(0);
      }
    });

    await startServer();
  } catch (error) {
    console.error("Fatal error during application startup:", error);
    process.exit(1);
  }
})();
