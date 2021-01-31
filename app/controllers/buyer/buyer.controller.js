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
const Order = db.order;
let errHandler = new Error();

exports.getPostedProducts = (req, res) => {
  let farmerProductsFoundInfo;
  FarmerProduct.findAll({
    where: { status: "posted" },
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

exports.buyPostedProduct = (req, res) => {
  const schema = Joi.object({
    farmerProductId: Joi.string().required().label("farm product id"),
  });
  validate(req.body, schema, res);
  let product, productOrdered;
  FarmerProduct.findByPk(req.body.farmerProductId)
    .then((farmerProductFound) => {
      product = farmerProductFound;
      if (!product) {
        errHandler.message = ["Product not found."];
        errHandler.statusCode = 404;
        throw errHandler;
      }
      product.status = "pending_review";
      return product.save();
    })
    .then((productBought) => {
      productOrdered = productBought;
      return Order.create({
        userId: req.userId,
        farmerProductId: product.id,
        status: "ordered",
      });
    })
    .then(() => {
      return res.send({
        success: true,
        message: ["Product purchased successfully. "],
        data: productOrdered,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message, data: err.data });
    });
};

exports.getOrders = (req, res) => {
  let orders;
  Order.findAll({
    where: { userId: req.userId },
    include: { model: FarmerProduct },
  })
    .then((ordersFound) => {
      orders = ordersFound;
      if (orders.length < 1) {
        errHandler.message = ["No orders found."];
        errHandler.statusCode = 404;
        throw errHandler;
      }
      return res.send({ success: true, orders: orders });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(err.statusCode || 500)
        .send({ success: false, message: err.message });
    });
};
