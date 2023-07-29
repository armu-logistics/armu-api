const app = require("./app");
const PORT = process.env.PORT || 8085;
const { sync } = require("./app/util/sync");

// database
const db = require("./app/models");
function serverListen(port) {
  // set port, listen for requests
  app.listen(port, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

async function startApplication() {
  try {
    await db.sequelize.sync({ alter: true });
    await sync();
    serverListen(PORT);
  } catch (error) {
    console.error(error);
  }
}

startApplication();
