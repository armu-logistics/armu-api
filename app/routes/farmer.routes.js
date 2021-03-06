const { authJwt } = require("../middleware");
const controller = require("../controllers/farmer/farmer.controller");
module.exports = function (app) {
  app.post(
    "/api/farmer/profile/create-farm",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.createFarm
  );
  app.get(
    "/api/farmer/profile/farms/get",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.getFarms
  );
  app.post(
    "/api/farmer/profile/update-farm",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.updateFarm
  );
  app.post(
    "/api/farmer/product/add",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.addProduct
  );
  app.get(
    "/api/farmer/get-posted-products",
    [authJwt.verifyToken, authJwt.isFarmer],
    controller.getPostedProducts
  );
};
