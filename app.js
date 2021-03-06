const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const uuid = require("uuid");

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

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
