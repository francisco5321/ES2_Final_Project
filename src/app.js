const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "greenherb-api"
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

module.exports = app;
