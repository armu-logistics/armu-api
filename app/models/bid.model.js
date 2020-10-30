module.exports = (sequelize, Sequelize) => {
    const Bid = sequelize.define('bid', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        buyerId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        orderId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        productId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        } 
    });

    return Bid;
}