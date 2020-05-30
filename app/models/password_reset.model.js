module.exports = (sequelize, Sequelize) => {
  const PasswordReset = sequelize.define("password_resets", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: Sequelize.STRING,
    },
  });

  return PasswordReset;
};
