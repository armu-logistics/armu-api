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

  app.get("/api/auth/getRoles", controller.getRoles);

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkDuplicateMobileNumber,
      verifySignUp.checkDuplicateKRA,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/verify-account/:token", controller.verifyAccount);

  app.post("/api/auth/resend-otp", controller.resendOtp);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/password-reset", controller.passwordReset);
  app.post(
    "/api/auth/password-reset/:resetToken",
    controller.passwordReset_token
  );
};
