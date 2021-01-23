module.exports = (sequelize, Sequelize) => {
  const PaymentMethod = sequelize.define("paymentMethod", {
    businessId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    mobile: {
      type: Sequelize.STRING,
    },
    creditOrDebit: {
      type: Sequelize.STRING,
    },
    bankTransfer: {
      type: Sequelize.STRING,
    },
  });

  return PaymentMethod;
};
