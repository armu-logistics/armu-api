const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  app.get("/api/auth/signup", controller.getSignup);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/password-reset", controller.password_reset);
  app.post(
    "/api/auth/password-reset/:resetToken",
    controller.password_reset_token
  );
};
