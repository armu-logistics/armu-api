module.exports = (sequelize, Sequelize) => {
  const Buyer = sequelize.define("buyers", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    kra_pin: {
      type: Sequelize.STRING,
    },
    id_number: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
  });

  return Buyer;
};
