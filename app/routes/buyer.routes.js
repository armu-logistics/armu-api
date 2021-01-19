const { authJwt } = require("../middleware");
const controller = require("../controllers/buyer/buyer.controller");
module.exports = function (app) {
  app.get(
    "/api/buyer/get-posted-products",
    [authJwt.verifyToken, authJwt.isBuyer],
    controller.getPostedProducts
  );
};
