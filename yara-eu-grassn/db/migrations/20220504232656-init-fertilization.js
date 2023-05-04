const { checkTableExists } = require('../helper');
const tableName = 'Fertilization';

module.exports = {
    /**
     * Execute migration
     *
     * @param {import('sequelize/lib/query-interface')} queryInterface Passed arguments
     * @param {import('sequelize')} Sequelize Sequelize instance
     */
    up: async (queryInterface, Sequelize) => {
        const tableExists = await checkTableExists(queryInterface, tableName);
        if (!tableExists) {
            const transaction = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;', {
                    transaction: transaction
                });

                await queryInterface.createTable(
                    tableName,
                    {
                        id: {
                            type: Sequelize.UUID,
                            primaryKey: true,
                            allowNull: false,
                            defaultValue: Sequelize.fn('gen_random_uuid')
                        },
                        farmId: {
                            type: Sequelize.UUID,
                            allowNull: false,
                            references: { model: 'Farm', key: 'id' }
                        },
                        fieldId: {
                            type: Sequelize.UUID,
                            allowNull: false,
                            references: { model: 'Field', key: 'id' }
                        },
                        date: {
                            type: Sequelize.DATE,
                            allowNull: true,
                        },
                        fertilizerId: {
                            type: Sequelize.UUID,
                            allowNull: false,
                        },
                        amount: {
                            type: Sequelize.DECIMAL,
                            allowNull: false,
                        },
                        location: {
                            type: Sequelize.JSONB,
                            allowNull: false,
                        },
                        created: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.fn('NOW')
                        },
                        modified: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.fn('NOW')
                        },
                        modifiedBy: {
                            type: Sequelize.STRING(150),
                            allowNull: false,
                            defaultValue: 'admin@yara.com'
                        },
                        deleted: {
                            type: Sequelize.DATE,
                            allowNull: true
                        }
                    },
                    { transaction: transaction }
                );

                return transaction.commit();
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } else {
            return true;
        }
    },

    /**
     * Down the migration
     *
     * @param {import('sequelize/lib/query-interface')} queryInterface Passed arguments
     */
    down: async (queryInterface) => {
        return queryInterface.dropTable(tableName);
    }
};
