const db = require("../models");
const config = require("../config/auth.config");
const uuid = require("uuid");
const User = db.user;
const Role = db.role;
const PasswordReset = db.password_reset;
const sendMail = require("../config/mail.config");
const crypto = require("crypto");
const Joi = require("joi");
const validate = require("../util/validation");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getRoles = (req, res) => {
  Role.findAll({
    where: { name: ["farmer", "buyer"] },
    attributes: ["id", "name"],
  }).then((roles) => {
    res.send(roles);
  });
};

exports.signup = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    mobile: Joi.string().required().label("Mobile number"),
    email: Joi.string().required().email().label("Email"),
    kra_pin: Joi.string().required().label("KRA pin"),
    password: Joi.string().required().label("Password"),
    roles: Joi.array()
      .items(Joi.string().valid("farmer", "buyer"))
      .max(1)
      .min(1),
  })
    .when(
      Joi.object({
        roles: Joi.array().items(Joi.string().required().valid("farmer")),
      }).unknown(),
      {
        then: Joi.object({
          national_id: Joi.number().required().label("National I.D"),
        }),
      }
    )
    .when(
      Joi.object({
        roles: Joi.array().items(Joi.string().valid("buyer")),
      }).unknown(),
      {
        then: Joi.object({
          businessRegistrationNumber: Joi.string()
            .required()
            .label("Business Registration Number"),
          primaryContactName: Joi.string()
            .required()
            .label("Primary contact name"),
          city: Joi.string().required().label("City"),
        }),
      }
    );
  validate(req.body, schema, res);
  let userInfo, roleInfo;
  // Save User to Database
  let vtoken = crypto.randomBytes(20).toString("hex");

  User.create({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    kra_pin: req.body.kra_pin,
    password: bcrypt.hashSync(req.body.password, 8),
    vtoken: vtoken,
    verified: 0,
    roles: req.body.roles,
  })
    .then((user) => {
      userInfo = user;
      return Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
    })
    .then((role) => {
      roleInfo = role;
      return userInfo.setRole(roleInfo[0]);
    })
    .then((roleSet) => {
      console.log(roleInfo);
      if (roleInfo[0].name === "farmer") {
        return userInfo.createFarmer({ national_id: req.body.national_id });
      } else if (roleInfo[0].name === "buyer") {
        return userInfo.createBuyer({
          businessRegistrationNumber: req.body.businessRegistrationNumber,
          primaryContactName: req.body.primaryContactName,
          city: req.body.city,
        });
      }
    })
    .then((userDetails) => {
      // send email
      let verificationLink =
        "http://www.armulogistics.com/auth/verifySignUp/" + vtoken;
      let email = userInfo.email;
      let subject = "VERIFY ACCOUNT";
      let html =
        "<p>You are receiving this email because you signed up to armu logistics.</p>";
      html +=
        '<p>Click <a href="' +
        verificationLink +
        '">here</a> to verify you account.</p></br></br>';
      html +=
        "<p>If you are having trouble clicking the link, copy and paste the URL below into your web browser:</p>";
      html += verificationLink;
      sendMail(email, subject, html, (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Internal Error!", data: data });
        } else {
          return res.status(200).send({
            success: true,
            message: "User registered successfully! Please verfiy account.",
            link: verificationLink,
            userId: userInfo.id,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.resendOtp = (req, res) => {
  let token = crypto.randomBytes(20).toString("hex");

  User.findOne({
    where: { email: req.body.email, verified: [0, null] },
  })
    .then((user) => {
      if (!user) {
        throw new Error("Invalid request");
      }
      return User.update({ vtoken: token }, { where: { email: user.email } });
    })
    .then((updated) => {
      let verificationLink =
        "http://www.armulogistics/auth/resend-otp/" + token;
      let email = req.body.email;
      let subject = "VERIFY ACCOUNT";
      let html =
        "<p>You are receiving this email because you requested to verify your account.</p>";
      html +=
        '<p>Click <a href="' +
        verificationLink +
        '">here</a> to verify you account.</p></br></br>';
      html +=
        "<p>If you are having trouble clicking the link, copy and paste the URL below into your web browser:</p>";
      html += verificationLink;
      sendMail(email, subject, html, (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Internal Error!", data: data });
        } else {
          return res.status(200).send({
            success: true,
            message: "Verification link is sent! Please verfiy account.",
            link: verificationLink,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send({ success: false, message: err.message });
    });
};

exports.verifyAccount = (req, res) => {
  User.findOne({
    where: {
      vtoken: req.params.token,
    },
  })
    .then((user) => {
      if (!user) {
        throw new Error("Invalid request");
      }
      return User.update(
        { vtoken: null, verified: 1 },
        { where: { email: user.email } }
      );
    })
    .then((verified) => {
      if (verified) {
        return res
          .status(200)
          .send({ success: true, message: "Account has been verified" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ success: false, message: "Invalid request!" });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.verified != 1) {
        return res
          .status(401)
          .send({ success: false, message: "Please verify account." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRole().then((roles) => {
        authorities.push("ROLE_" + roles.name.toUpperCase());
        res.status(200).send({
          id: user.id,
          username: user.name,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.password_reset = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (!user) {
      return res.status(400).send({ message: "User does not exist!." });
    } else {
      let resetToken = Math.floor(Math.random(10000000) * 10000000);
      let protocol = req.protocol;
      const PORT = process.env.PORT || 8080;
      let hostname = req.hostname + ":" + PORT;
      let resetLink =
        protocol + "://" + hostname + "/api/auth/password-reset/" + resetToken;
      //save reset info to db
      PasswordReset.create({
        email: user.email,
        token: resetToken,
      }).then((reset) => {
        reset.setUser(user);
        Role.findOne({ where: { id: user.roleId } }).then((role) => {
          reset.setRole(role);
        });
        // send email
        let email = user.email;
        let subject = "PASSWORD RESET";
        let html =
          "<p>You are receiving this email because we received a password reset request for your account.</p>";
        html +=
          '<p>Click <a href="' +
          resetLink +
          '">here</a> to reset your password.</p></br></br>';
        html +=
          "<p>If you are having trouble clicking the link, copy and paste the URL below into your web browser:</p>";
        html += resetLink;
        sendMail(email, subject, html, (err, data) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Internal Error!", data: data });
          } else {
            return res.status(200).send({
              message: "Email sent. Click on the link provided.",
              resetLink: resetLink,
            });
          }
        });
      });
    }
  });
};

exports.password_reset_token = (req, res) => {
  PasswordReset.findOne({
    where: {
      token: req.params.resetToken,
    },
    order: [["createdAt", "DESC"]],
  })
    .then((reset) => {
      if (!reset) {
        res.status(200).send({
          message: "Invalid token",
        });
      } else {
        if (req.body.password !== req.body.confirm_password)
          return res
            .status(200)
            .send({ message: "Passwords provided don't match." });

        //reset password
        let newPassword = bcrypt.hashSync(req.body.password, 8);
        let emailReset = reset.email;
        let roleId = reset.roleId;
        User.update(
          { password: newPassword },
          { where: { email: emailReset, roleId: roleId } }
        )
          .then((userReset) => {
            PasswordReset.update(
              {
                token: null,
                status: "reset",
              },
              {
                where: { email: emailReset },
              }
            ).catch((err) => {
              res.status(500).send({ message: err.message });
            });

            res.status(200).send({ message: "Password reset successfully!" });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
