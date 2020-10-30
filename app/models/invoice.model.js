module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define("invoice", {
        invoiceId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        orderId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        shipmentId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }
    });
    return Invoice;
}