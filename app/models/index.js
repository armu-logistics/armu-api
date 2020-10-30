"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize").Sequelize;
const basename = path.basename(__filename);
const env = process.env.NODE_ENV.trim() || "development";
const config = require("../config/db.config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
console.log(db);
// Associations
// user and role
db.user.belongsTo(db.role);
db.role.hasMany(db.user);
// user and buyer
db.user.hasOne(db.buyer);
db.buyer.belongsTo(db.user);
// user and farmer
db.user.hasOne(db.farmer);
db.farmer.belongsTo(db.user);
//user and passwordReset
db.user.hasMany(db.passwordReset);
db.passwordReset.belongsTo(db.user);
// role and passwordReset
db.role.hasMany(db.passwordReset);
db.passwordReset.belongsTo(db.role);
// farmer and farm
db.farmer.hasMany(db.farm);
db.farm.belongsTo(db.farmer);
db.ROLES = ["buyer", "farmer", "admin"];
//product and grade
db.product.belongsToMany(db.grade, {
  through: db.productGrade,
  foreignKey: "productId",
});
db.grade.belongsToMany(db.product, {
  through: db.productGrade,
  foreignKey: "gradeId",
});
//productGrade and farm
db.farm.belongsToMany(db.productGrade, {
  through: db.farmerProduct,
  foreignKey: "farmId",
});
db.productGrade.belongsToMany(db.farm, {
  through: db.farmerProduct,
  foreignKey: "productGradeId",
});

//product and bid
db.product.hasMany(db.bid);
db.bid.belongsTo(db.product);
//buyer and order
db.buyer.belongsToMany(db.order, {
  through: db.bid,
  foreignKey: "buyerId",
});
db.order.belongsToMany(db.buyer, {
  through: db.bid,
  foreignKey: "orderId",
});
//buyer and paymentMethod
db.buyer.hasMany(db.paymentMethod);
db.paymentMethod.belongsTo(db.buyer);
//farmerProduct and offer
db.farmerProduct.hasMany(db.offer);
db.offer.belongsTo(db.farmerProduct);
//offer and order
db.offer.hasOne(db.order);
db.order.belongsTo(db.offer);
//invoice and order
db.invoice.hasMany(db.order);
db.order.belongsTo(db.invoice);
// invoice and payment
db.invoice.hasMany(db.payment);
db.payment.belongsTo(db.invoice);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
