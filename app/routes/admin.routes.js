const { authJwt } = require("../middleware");
const controller = require("../controllers/admin/admin.controller");
module.exports = function (app) {
  app.post("/api/admin/grade/add", controller.addGrade);
  app.post("/api/admin/product/add", controller.addProduct);
};
