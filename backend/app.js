const express = require("express");
const app = express();
const dotenv = require("dotenv");
const books = require("./routes/book");
const path = require("path");
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// app.use(logger);
app.use("/books", books);

app.get("/", (req, res) => {
  res.json({ message: "hello from / endpoint" });
});

const DBConnection = async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log(`connected to db on ${process.env.DB_URL}`);
};

DBConnection().catch((e) => console.log(e));

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`backend run on port ${PORT}`);
});
