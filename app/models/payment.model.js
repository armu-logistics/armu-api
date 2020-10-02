module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define('payment', {
        invoiceNumber: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        method: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT(10,2)
        }
    });
    
    return Payment;
}