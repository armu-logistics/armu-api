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
