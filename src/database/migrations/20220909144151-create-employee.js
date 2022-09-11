module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('employees',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4(),
            },

            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            email: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            CompanyId: {
                type: Sequelize.UUID,
                references: {
                    model: 'companies',
                    key: 'id',
                },
                allowNull: false,
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
    down: (queryInterface) => queryInterface.dropTable('employees'),
};
