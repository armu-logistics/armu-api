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
// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
//////// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to armu application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/buyer.routes")(app);
require("./app/routes/farmer.routes")(app);

app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .send({ success: false, message: err.message });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: "a8d8ee46-f798-429e-b523-59de9c538a18",
    name: "buyer",
  });

  Role.create({
    id: "8688784d-9f7b-4e26-a262-d2a6fdb824a5",
    name: "farmer",
  });

  Role.create({
    id: "af66e44c-da0f-41a0-8f43-0c812bad492c",
    name: "admin",
  });
}
