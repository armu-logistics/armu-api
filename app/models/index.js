"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize").Sequelize;
const basename = path.basename(__filename);
const env = process.env.NODE_ENV.trim() || "development";
const config = require("../config/db.config.js")[env];
const db = {};
console.log(config);
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

//product and grade
db.product.hasMany(db.productGrade, {
  foreignKey: "productId",
});
db.productGrade.belongsTo(db.product, {
  foreignKey: "productId",
});
db.grade.hasMany(db.productGrade, {
  foreignKey: "gradeId",
});
db.productGrade.belongsTo(db.grade, {
  foreignKey: "gradeId",
});
//productGrade and farm
db.farm.hasMany(db.farmerProduct, {
  foreignKey: "farmId",
});
db.farmerProduct.belongsTo(db.farm, {
  foreignKey: "farmId",
});

// farmerProduct and productGrade

db.productGrade.hasMany(db.farmerProduct, {
  foreignKey: "productGradeId",
});
db.farmerProduct.belongsTo(db.productGrade, {
  foreignKey: "productGradeId",
});

db.user.hasMany(db.order, { foreignKey: "userId" });
db.order.belongsTo(db.user, { foreignKey: "userId" });
db.farmerProduct.hasMany(db.order, { foreignKey: "farmerProductId" });
db.order.belongsTo(db.farmerProduct, { foreignKey: "farmerProductId" });
//product and bid
// db.product.hasMany(db.bid);
// db.bid.belongsTo(db.product);
//buyer and order
// db.buyer.belongsToMany(db.order, {
//   through: db.bid,
//   foreignKey: "buyerId",
// });
// db.order.belongsToMany(db.buyer, {
//   through: db.bid,
//   foreignKey: "orderId",
// });
//buyer and paymentMethod
// db.buyer.hasMany(db.paymentMethod);
// db.paymentMethod.belongsTo(db.buyer);
//farmerProduct and offer
// db.farmerProduct.hasMany(db.offer);
// db.offer.belongsTo(db.farmerProduct);
//offer and order
// db.offer.hasOne(db.order);
// db.order.belongsTo(db.offer);
//invoice and order
// db.invoice.hasMany(db.order);
// db.order.belongsTo(db.invoice);
// invoice and payment
// db.invoice.hasMany(db.payment);
// db.payment.belongsTo(db.invoice);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.ROLES = ["buyer", "farmer", "admin"];
module.exports = db;
