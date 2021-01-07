const db = require("../../models");
const Farmer = db.farmer;
const Farm = db.farm;
const User = db.user;
const FarmerProduct = db.farmerProduct;
const ProductGrade = db.productGrade;
const Product = db.product;
const Grade = db.grade;
const Joi = require("joi");
const validate = require("../../util/validation");
let errHandler = new Error();

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

exports.getFarms = (req, res) => {
  User.findOne({ where: { id: req.userId }, required: true })
    .then((userFound) => {
      if (!userFound) {
        errHandler.message = ["No user found."];
        errHandler.statusCode = 404;
        throw errHandler;
      }
      return userFound.getFarmer();
    })
    .then((farmerFound) => {
      return farmerFound.getFarms({ include: { model: FarmerProduct } });
    })
    .then((farmsFound) => {
      if (farmsFound.length === 0) {
        errHandler.message = ["No farms found."];
        errHandler.statusCode = 404;
        throw errHandler;
      }

      return res.send(farmsFound);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};

exports.addProduct = (req, res) => {
  const schema = Joi.object({
    productDescription: Joi.string().required().label("Product descirption"),
    pricePerBag: Joi.number().required().label("Price per pag"),
    numberOfBags: Joi.number().required().label("Number of Bags"),
    pickUpLocation: Joi.string().required().label("Pick up location"),
    farmId: Joi.string().required().label("Farm id"),
    productId: Joi.string().required().label("Product id"),
    gradeId: Joi.string().required().label("Grade id"),
  });
  validate(req.body, schema, res);
  let productGradeFoundInfo;
  ProductGrade.findOne({
    where: { productId: req.body.productId, gradeId: req.body.gradeId },
  })
    .then((productGradeFound) => {
      productGradeFoundInfo = productGradeFound;
      if (!productGradeFoundInfo) {
        errHandler.message = [
          "The product grade combination has not been found.",
        ];
        errHandler.statusCode = 404;
        throw errHandler;
      }
      return FarmerProduct.create({
        productDescription: req.body.productDescription,
        pricePerBag: req.body.pricePerBag,
        numberOfBags: req.body.numberOfBags,
        pickUpLocation: req.body.pickUpLocation,
        farmId: req.body.farmId,
        productGradeId: productGradeFoundInfo.id,
        status: "posted",
      });
    })
    .then((farmerProduct) => {
      let farmerProductCreated = farmerProduct;
      return res.send({
        success: true,
        message: "Product created successfully.",
        data: farmerProductCreated,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};
exports.getPostedProducts = (req, res) => {
  let farmerProductsFoundInfo;
  FarmerProduct.findAll({
    include: [
      { model: ProductGrade, include: [{ model: Product }, { model: Grade }] },
      {
        model: Farm,
        required: true,
        include: {
          model: Farmer,
          required: true,
          include: {
            model: User,
            where: { id: req.userId },
            attributes: ["id", "name", "mobile", "email", "kra_pin"],
            required: true,
          },
        },
      },
    ],
  })
    .then((farmerProductsFound) => {
      farmerProductsFoundInfo = farmerProductsFound;
      if (farmerProductsFoundInfo.length == 0) {
        errHandler.message = ["No posted products found."];
        errHandler.statusCode = 404;
        throw errHandler;
      }
      res.send(farmerProductsFoundInfo);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};
