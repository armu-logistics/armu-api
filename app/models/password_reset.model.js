module.exports = (sequelize, Sequelize) => {
  const PasswordReset = sequelize.define("password_resets", {
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
  });

  return PasswordReset;
};
