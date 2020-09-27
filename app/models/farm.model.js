module.exports = (sequelize, Sequelize) => {
  const Farm = sequelize.define("farm", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    size: {
      type: Sequelize.DOUBLE(255, 4),
    },
  });

  return Farm;
};
