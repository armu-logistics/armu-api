const db = require("../../models");
const Buyer = db.buyer;
const User = db.user;
const Joi = require("joi");
const validate = require("../../util/validation");
let errHandler = new Error();
exports.createBuyerDetails = (req, res) => {
  const schema = Joi.object({
    userId: Joi.string().required().label("User Id"),
    kra_pin: Joi.string().required().label("KRA Pin"),
    id_number: Joi.string().required().label("ID Number"),
    city: Joi.string().required().label("City"),
  });
  validate(req.body, schema, res);
  let userFoundInfo, buyerDetailsCreatedInfo;
  User.findOne({ where: { id: req.body.userId } })
    .then((userFound) => {
      userFoundInfo = userFound;
      if (!userFoundInfo) {
        errHandler.success = false;
        errHandler.message = ["User id is invalid."];
        errHandler.statusCode = 400;
        throw errHandler;
      }
      //   return res.send({ magic: Object.keys(userFoundInfo.__proto__) });
      return userFoundInfo.createBuyer({
        kra_pin: req.body.kra_pin,
        id_number: req.body.id_number,
        city: req.body.city,
      });
    })
    .then((buyerDetailsCreated) => {
      buyerDetailsCreatedInfo = buyerDetailsCreated;
      if (!buyerDetailsCreatedInfo) {
        return res.status(500).send({ message: ["Error occurred."] });
      }
      return res.status(200).send({
        success: true,
        message: ["Buyer details created successfully."],
        data: buyerDetailsCreatedInfo,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};

exports.updateBuyerDetails = (req, res) => {
  const schema = Joi.object({
    kra_pin: Joi.string().required().label("KRA Pin"),
    id_number: Joi.string().required().label("ID Number"),
    city: Joi.string().required().label("City"),
  });
  validate(req.body, schema, res);
  let buyerInfo, buyerDetailsInfo;
  User.findByPk(req.userId)
    .then((buyer) => {
      buyerInfo = buyer;
      return buyerInfo.getBuyer();
    })
    .then((buyerDetails) => {
      buyerDetailsInfo = buyerDetails;
      if (!buyerDetailsInfo) {
        //create buyer details
        return buyerInfo.createBuyer({
          kra_pin: req.body.kra_pin,
          id_number: req.body.id_number,
          city: req.body.city,
        });
      } else {
        //update buyer details
        buyerDetailsInfo.kra_pin = req.body.kra_pin;
        buyerDetailsInfo.id_number = req.body.id_number;
        buyerDetailsInfo.city = req.body.city;
        return buyerDetailsInfo.save();
      }
    })
    .then((createUpdate) => {
      if (!createUpdate) {
        errHandler.success = false;
        errHandler.message = ["Error occurred."];
        errHandler.statusCode = 500;
        throw errHandler;
      }
      return res.status(200).send({
        success: true,
        message: ["Buyer details updated successfully."],
        data: createUpdate,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};
