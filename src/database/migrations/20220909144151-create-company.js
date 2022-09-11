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
                allowNull: true,
            },

            phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            website: {
                type: Sequelize.STRING,
                allowNull: true,
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
