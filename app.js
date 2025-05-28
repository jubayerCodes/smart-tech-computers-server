require("dotenv").config();
const express = require("express");
const router = require("./src/routes/api");
const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

//Database Connection
let URL = process.env.MONGO_URI;
let option = {
  autoIndex: true,
};
mongoose
  .connect(URL, option)
  .then((res) => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://smart-tech-computers-client.vercel.app",
    ], // Add multiple allowed origins here
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/v1", router);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", async (req, res) => {
  console.log("✅ Root route hit");
  res.send({ message: "Server is working" });
});


module.exports = app;
