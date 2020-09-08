module.exports = (sequelize, Sequelize) => {
  const Farmer = sequelize.define("farmers", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    national_id: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return Farmer;
};
