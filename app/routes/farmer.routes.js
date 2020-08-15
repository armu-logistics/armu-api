const { authJwt } = require("../middleware");
const controller = require("../controllers/farmer/farmer.controller");
module.exports = function (app) {
  app.post(
    "/api/farmer/profile/create-farmer-details",
    controller.createFarmerDetails
  );
  app.post(
    "/api/farmer/profile/update-farmer-details",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.updateFarmerDetails
  );
  app.post(
    "/api/farmer/profile/create-farm",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.createFarm
  );
  app.post(
    "/api/farmer/profile/update-farm",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.updateFarm
  );
};
