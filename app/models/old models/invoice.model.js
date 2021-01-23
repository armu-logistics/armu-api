module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define("invoice", {
    invoiceId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: false,
    },
    shipmentId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: false,
    },
  });
  return Invoice;
};
