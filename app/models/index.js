const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.farmer = require("../models/farmer.model.js")(sequelize, Sequelize);
db.buyer = require("../models/buyer.model.js")(sequelize, Sequelize);
db.farm = require("../models/farm.model.js")(sequelize, Sequelize);
db.password_reset = require("../models/password_reset.model.js")(
  sequelize,
  Sequelize
);
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
//user and password_reset
db.user.hasMany(db.password_reset);
db.password_reset.belongsTo(db.user);
// role and password_reset
db.role.hasMany(db.password_reset);
db.password_reset.belongsTo(db.role);
// farmer and farm
db.farmer.hasMany(db.farm);
db.farm.belongsTo(db.farmer);
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
