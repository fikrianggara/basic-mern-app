const express = require("express");
const app = express();
require("dotenv").config();
const { logger, logEvents } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConnection");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

connectDB();
// app.use(logger);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/note", noteRoutes);

app.get("/", (req, res) => {
  res.send("home page");
});

app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "Not Found" });
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => {
    console.log(`backend run on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
