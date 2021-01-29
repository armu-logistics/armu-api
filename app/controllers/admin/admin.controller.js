const db = require("../../models");
const Farmer = db.farmer;
const Farm = db.farm;
const User = db.user;
const Grade = db.grade;
const Product = db.product;
const Joi = require("joi");
const validate = require("../../util/validation");
const FarmerProduct = db.farmerProduct;
let errHandler = new Error();

exports.addGrade = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
  });
  validate(req.body, schema, res);
  Grade.create({ name: req.body.name })
    .then((grade) => {
      return res.send("Grade created successfully!");
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
    name: Joi.string().required().label("Name"),
    grades: Joi.array().required().min(1).label("Grades"),
  });
  let productCreatedInfo;
  validate(req.body, schema, res);
  Product.create({ name: req.body.name })
    .then((productCreated) => {
      productCreatedInfo = productCreated;
      productCreatedInfo.addGrade(req.body.grades);
    })
    .then((product) => {
      return res.send("Product added successfully.");
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};

exports.getAllProducts = (req, res) => {
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
        errHandler.message = ["No products found."];
        errHandler.statusCode = 404;
        throw errHandler;
      }
      res.send(farmerProductsFoundInfo);
    })
    .catch((err) => {
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};
