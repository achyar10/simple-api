const sequelizePaginate = require('sequelize-paginate')
module.exports =  (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        fullname: DataTypes.STRING,
        username: DataTypes.STRING(100),
        password: DataTypes.STRING,
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '0=user, 1=superadmin'
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['username']
            }
        ]
    })
    sequelizePaginate.paginate(user)
    return user;
}