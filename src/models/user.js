const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            hooks: {
                beforeCreate(user) {
                    user.password = crypto
                        .createHash('md5')
                        .update(user.password)
                        .digest('hex');
                },
                beforeUpdate(user) {
                    user.password = crypto
                        .createHash('md5')
                        .update(user.password)
                        .digest('hex');
                },
            },
        },
        {
            defaultScope: {
                attributes: { exclude: ['password'] },
            },
            scopes: {
                withSecretColumns: {
                    attributes: { include: ['password'] },
                },
            },
        });

    User.associate = () => {
    // associations can be defined here
    };

    return User;
};
