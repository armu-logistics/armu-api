const { authJwt } = require("../middleware");
const controller = require("../controllers/buyer/buyer.controller");
module.exports = function (app) {
  // app.post(
  //   "/api/buyer/profile/create-buyer-details",
  //   controller.createBuyerDetails
  // );
  // app.post(
  //   "/api/buyer/profile/update-buyer-details",
  //   [authJwt.verifyToken, authJwt.isBuyer],
  //   controller.updateBuyerDetails
  // );
};
