const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const inventory = sequelize.define('inventory', {
        barcode: DataTypes.STRING,
        desc: DataTypes.STRING,
        image: DataTypes.STRING,
        hpp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        disc: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['barcode']
            }
        ]
    })
    inventory.associate = function (models) {
        inventory.hasMany(models.transaction_detail, {
            as: 'items',
            foreignKey: 'inventoryId',
            onDelete: 'SET NULL'
        })
    }
    sequelizePaginate.paginate(inventory)
    return inventory;
}