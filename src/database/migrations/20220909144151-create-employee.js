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
            },

            lastName: {
                type: Sequelize.STRING,
            },

            email: {
                type: Sequelize.STRING,
                unique: true,
            },

            phone: {
                type: Sequelize.STRING,
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
