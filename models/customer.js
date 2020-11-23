const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
    const customer = sequelize.define('customer', {
        fullname: DataTypes.STRING,
        phone: DataTypes.STRING(20),
        address: DataTypes.TEXT,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })
    sequelizePaginate.paginate(customer)
    return customer;
}