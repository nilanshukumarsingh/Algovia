const express = require('express');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// ── Rate limiters ──────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many registration attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const submitLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  message: { message: 'Submission limit reached. Please wait before submitting again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/user/login', loginLimiter);
app.use('/user/register', registerLimiter);
app.use('/submission/submit', submitLimiter);

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);

// ── Global error handler (must be last) ───────────────────────────────────
app.use(errorHandler);

const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server listening at port number: " + process.env.PORT);
    });
  }
  catch (err) {
    console.error("Startup error:", err);
  }
};

InitalizeConnection();
