"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize").Sequelize;
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
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
db.users.belongsTo(db.roles);
db.roles.hasMany(db.users);
// user and buyer
db.users.hasOne(db.buyers);
db.buyers.belongsTo(db.users);
// user and farmer
db.users.hasOne(db.farmers);
db.farmers.belongsTo(db.users);
//user and password_reset
db.users.hasMany(db.password_resets);
db.password_resets.belongsTo(db.users);
// role and password_reset
db.roles.hasMany(db.password_resets);
db.password_resets.belongsTo(db.roles);
// farmer and farm
db.farmers.hasMany(db.farms);
db.farms.belongsTo(db.farmers);
db.ROLES = ["buyer", "farmer", "admin"];

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
