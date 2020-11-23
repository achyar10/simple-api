const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const transaction_detail = sequelize.define('transaction_detail', {
        barcode: DataTypes.STRING,
        desc: DataTypes.STRING,
        qty: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        disc: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        hpp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    })
    transaction_detail.associate = function (models) {
        transaction_detail.belongsTo(models.transaction)
        transaction_detail.belongsTo(models.inventory)
    }
    sequelizePaginate.paginate(transaction_detail)
    return transaction_detail;
}