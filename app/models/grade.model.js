module.exports = (sequelize, Sequelize) => {
    const Grade = sequelize.define("grade", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    });
  
    return Grade;
  };
  