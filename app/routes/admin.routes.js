const { authJwt } = require("../middleware");
const controller = require("../controllers/admin/admin.controller");
module.exports = function (app) {
  app.post("/api/admin/grade/add", [authJwt.isAdmin], controller.addGrade);
  app.post("/api/admin/product/add", [authJwt.isAdmin], controller.addProduct);
  app.post(
    "/api/admin/get-all-products",
    [authJwt.isAdmin],
    controller.getAllProducts
  );
};
