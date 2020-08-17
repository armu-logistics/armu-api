module.exports = (sequelize, Sequelize) => {
  const Farmer = sequelize.define("farmers", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    kra_pin: {
      type: Sequelize.STRING,
      unique: true,
    },
    id_number: {
      type: Sequelize.STRING,
      unique: true,
    },
    cooperative: {
      type: Sequelize.STRING,
    },
  });

  return Farmer;
};
