module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        bidId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        productId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        price: {
            type: Sequelize.FLOAT(255,2)
        },
        _orderDate: {
            type: Sequelize.DATEONLY
        },
        get orderDate() {
            return this._orderDate;
        },
        set orderDate(value) {
            this._orderDate = value;
        },
        paymentMethod: {
            type: Sequelize.STRING
        }
    });
    return Order;
}