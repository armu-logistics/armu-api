module.exports = (sequelize, Sequelize) => {
  const Buyer = sequelize.define("buyers", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    businessRegistrationNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    primaryContactName: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
  });

  return Buyer;
};
