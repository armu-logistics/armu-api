module.exports = (sequelize, Sequelize) => {
  const FarmerProduct = sequelize.define(
    "farmerProduct",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      productDescription: {
        type: Sequelize.TEXT,
      },
      pricePerBag: {
        type: Sequelize.FLOAT(255, 2),
      },
      numberOfBags: {
        type: Sequelize.FLOAT(255, 2),
      },
      pickUpLocation: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,
      },
      farmId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      productGradeId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    },
    { freezeTableName: true, tableName: "farmerProducts" }
  );

  return FarmerProduct;
};
