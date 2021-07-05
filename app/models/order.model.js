module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    // count: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: false,
    //   unique: true,
    // },
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: false,
    },
    farmerProductId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: false,
    },
    status: {
      type: Sequelize.STRING,
    },
  });
  return Order;
};
