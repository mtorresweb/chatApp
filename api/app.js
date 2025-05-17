const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandler.js");
const NotFoundError = require("./utils/errors.js");

//route imports
const userRoutes = require("./routes/user.js");
const chatRoutes = require("./routes/chat.js");
const messageRoutes = require("./routes/message.js");

const app = express();

// Enable trust proxy - add this line before other middleware
app.set("trust proxy", 1);

// Security configuration
app.use(
  cors({
    origin: "*",
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: [
          "'self'",
          "'strict-dynamic'",
          "'nonce-rAnd0m123'",
          "'unsafe-inline'",
          "'unsafe-eval'",
        ],
        requireTrustedTypesFor: ["script"],
      },
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api", limiter);

//Valid content types
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//Not found middleware
app.use("*", (req, res, next) => next(new NotFoundError(req.path)));

//Error middleware
app.use(errorHandler);

module.exports = app;
