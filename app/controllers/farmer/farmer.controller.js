const db = require("../../models");
const Farmer = db.farmer;
const Farm = db.farm;
const User = db.user;
const Joi = require("joi");
const validate = require("../../util/validation");
let errHandler = new Error();

exports.createFarmerDetails = (req, res) => {
  const schema = Joi.object({
    userId: Joi.string().required().label("User Id"),
    kra_pin: Joi.string().required().label("KRA Pin"),
    id_number: Joi.string().required().label("ID Number"),
  });
  validate(req.body, schema, res);
  let userFoundInfo, farmerDetailsCreatedInfo;
  User.findOne({ where: { id: req.body.userId } })
    .then((userFound) => {
      userFoundInfo = userFound;
      if (!userFoundInfo) {
        errHandler.success = false;
        errHandler.message = ["User id is invalid."];
        errHandler.statusCode = 400;
        throw errHandler;
      }
      return userFoundInfo.createFarmer({
        kra_pin: req.body.kra_pin,
        id_number: req.body.id_number,
      });
    })
    .then((farmerDetailsCreated) => {
      farmerDetailsCreatedInfo = farmerDetailsCreated;
      if (!farmerDetailsCreatedInfo) {
        return res.status(500).send({ message: ["Error occurred."] });
      }
      return res.status(200).send({
        success: true,
        message: ["Farmer details created successfully."],
        data: farmerDetailsCreatedInfo,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};

exports.updateFarmerDetails = (req, res) => {
  const schema = Joi.object({
    kra_pin: Joi.string().required().label("KRA Pin"),
    id_number: Joi.string().required().label("ID Number"),
  });
  validate(req.body, schema, res);
  let farmerInfo, farmerDetailsInfo;
  User.findByPk(req.userId)
    .then((farmerFound) => {
      farmerInfo = farmerFound;
      return farmerInfo.getFarmer();
    })
    .then((farmerDetails) => {
      farmerDetailsInfo = farmerDetails;
      if (!farmerDetailsInfo) {
        //create farmer details
        return farmerInfo.createFarmer({
          kra_pin: req.body.kra_pin,
          id_number: req.body.id_number,
        });
      } else {
        //update farmer details
        farmerDetailsInfo.kra_pin = req.body.kra_pin;
        farmerDetailsInfo.id_number = req.body.id_number;
        return farmerDetailsInfo.save();
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
        message: ["Farmer details updated successfully."],
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

exports.createFarm = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Farm name"),
    location: Joi.string().required().label("Farm Location"),
    size: Joi.number().required().label("Size of farm"),
  });
  validate(req.body, schema, res);
  let farmerInfo;
  Farmer.findOne({ where: { userId: req.userId } })
    .then((farmerFound) => {
      farmerInfo = farmerFound;
      return farmerInfo.createFarm({
        name: req.body.name,
        location: req.body.location,
        size: req.body.size,
      });
    })
    .then((farmCreated) => {
      return res.status(200).send({
        success: true,
        message: ["Farm created successfully."],
        farm: farmCreated,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};

exports.updateFarm = (req, res) => {
  const schema = Joi.object({
    farm_id: Joi.string().required().label("farm id"),
    name: Joi.string().required().label("Name of fame"),
    location: Joi.string().required().label("Location"),
    size: Joi.number().required().label("Size"),
  });
  validate(req.body, schema, res);
  let farmerInfo;
  Farmer.findOne({ where: { userId: req.userId } })
    .then((farmerFound) => {
      farmerInfo = farmerFound;
      // return res.send(Object.keys(farmerInfo.__proto__));
      return farmerInfo.getFarms(req.body.farm_id).then((farmFound) => {
        console.log(farmFound);
        if (farmFound.length === 0) {
          errHandler.success = false;
          errHandler.message = ["Farm not found."];
          errHandler.statusCode = 404;
          throw errHandler;
        }
        let farm = farmFound[0];
        farm.name = req.body.name;
        farm.location = req.body.location;
        farm.size = req.body.size;
        return farm.save();
      });
    })
    .then((updatedFarm) => {
      return res.status(200).send({
        success: true,
        message: ["Farm updated successfully."],
        data: updatedFarm,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};
