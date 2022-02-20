const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const uuid = require("uuid");
const morgan = require("morgan");

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(morgan("combined"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to armu logistics." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/buyer.routes")(app);
require("./app/routes/farmer.routes")(app);
require("./app/routes/admin.routes")(app);

//error handling middleware
app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .send({ success: false, message: err.message });
});

module.exports = app;
