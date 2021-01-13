module.exports = (sequelize, Sequelize) => {
  const Offer = sequelize.define("offer", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: Sequelize.FLOAT(255, 2),
    },
    price: {
      type: Sequelize.FLOAT(255, 2),
    },
    orderId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: false,
    },
    farmerProductId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: false,
    },
  });

  return Offer;
};
