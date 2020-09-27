module.exports = (sequelize, Sequelize) => {
  const PasswordReset = sequelize.define(
    "passwordReset",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
    },
    { freezeTableName: true, tableName: "passwordResets" }
  );

  return PasswordReset;
};
