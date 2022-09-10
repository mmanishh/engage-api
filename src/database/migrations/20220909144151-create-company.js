module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('companies',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4(),
            },

            name: {
                type: Sequelize.STRING,
            },

            email: {
                type: Sequelize.STRING,
                unique: true,
            },

            phone: {
                type: Sequelize.STRING,
            },

            website: {
                type: Sequelize.STRING,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        }),
    down: (queryInterface) => queryInterface.dropTable('companies'),
};
