const { checkTableExists } = require('../helper');
const tableName = 'Organization';

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
                        name: {
                            type: Sequelize.STRING(200),
                            allowNull: false
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
