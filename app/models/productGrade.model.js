module.exports = (sequelize, Sequelize) => {
  const productGrade = sequelize.define("productGrade", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    productId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    gradeId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  });

  return productGrade;
};
