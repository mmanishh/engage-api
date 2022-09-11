module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('company',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING,
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },

        });

    return Company;
};
