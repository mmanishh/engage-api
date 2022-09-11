const { Company } = require('./index');

module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('employee',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.firstName} ${this.lastName}`;
                },
            },

        }, {
            defaultScope: {
                include: { model: Company },
                attributes: { exclude: ['CompanyId'] },
            },
        });

    Employee.belongsTo(Company, { onDelete: 'cascade', foreignKey: 'CompanyId' });

    return Employee;
};
