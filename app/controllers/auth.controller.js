const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getSignup = (req, res) => {
  Role.findAll({ where: { name: ["farmer", "buyer"] } }).then((roles) => {
    res.send(roles);
  });
};

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile: req.body.mobile,
    email: req.body.email,
    roles: req.body.roles,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      }).then((roles) => {
        user.setRole(roles[0]).then(() => {
          res
            .status(200)
            .send({ status: 1, message: "User registered successfully!" });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
          username: user.first_name + " " + user.last_name,
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
