const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const transaction = sequelize.define('transaction', {
        no_trans: DataTypes.STRING,
        cashier: DataTypes.STRING,
        customer_name: DataTypes.STRING,
        customer_phone: DataTypes.STRING(20),
        pay_method: {
            type: DataTypes.ENUM,
            values: ['CASH', 'DEBIT/CREDIT'],
            defaultValue: 0
        },
        cash: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        total_disc: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        total_qty: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        total_hpp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        grand_total: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        hold: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        cancel: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['no_trans']
            }
        ]
    })
    transaction.associate = function (models) {
        transaction.hasMany(models.transaction_detail, {
            as: 'items',
            foreignKey: 'transactionId',
            onDelete: 'CASCADE'
        })
        transaction.belongsTo(models.customer)
        transaction.belongsTo(models.user)
    }
    sequelizePaginate.paginate(transaction)
    return transaction;
}