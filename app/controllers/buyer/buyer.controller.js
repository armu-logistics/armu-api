const db = require("../../models");
const Buyer = db.buyer;
const User = db.user;
const Joi = require("joi");
const validate = require("../../util/validation");
const Farmer = db.farmer;
const Farm = db.farm;
const FarmerProduct = db.farmerProduct;
const ProductGrade = db.productGrade;
const Product = db.product;
const Grade = db.grade;
let errHandler = new Error();

exports.getPostedProducts = (req, res) => {
  let farmerProductsFoundInfo;
  console.log(db);
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
