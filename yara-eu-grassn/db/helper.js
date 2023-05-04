const config = require('./config');
const fs = require('fs');

/**
 * Check if a table exists helper function
 *
 * @param {import('sequelize/lib/query-interface')} queryInterface Passed arguments
 * @param {string} tableName Sequelize instance
 */
const checkTableExists = async (queryInterface, tableName) => {
    const query = `SELECT EXISTS(
      SELECT *
      FROM information_schema.tables
      WHERE
        table_name = '${tableName}'
    );`;
    const tableQueryResult = await queryInterface.sequelize.query(query, {
        type: queryInterface.sequelize.QueryTypes.SELECT
    });
    if (tableQueryResult && tableQueryResult.length > 0 && tableQueryResult[0].exists) {
        return true;
    }

    return false;
};

/**
 * Check if a table is empty helper function
 *
 * @param {import('sequelize/lib/query-interface')} queryInterface Passed arguments
 * @param {string} tableName Sequelize instance
 */
const checkTableEmpty = async (queryInterface, tableName) => {
    const query = `SELECT COUNT(*) AS count from "${tableName}"`;
    const tableQueryResult = await queryInterface.sequelize.query(query, {
        type: queryInterface.sequelize.QueryTypes.SELECT
    });

    if (tableQueryResult && tableQueryResult.length > 0 && tableQueryResult[0].count) {
        return Number(tableQueryResult[0].count) <= 0;
    }

    return false;
};

const getSqlData = (sqlPath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(sqlPath, 'utf8', (err, sqlData) => {
            if (err) {
                return reject(err);
            }

            return resolve(sqlData);
        });
    });
};

const getMigrationTableName = () => {
    return process.env.NODE_ENV !== "development" ? 'SequelizeMeta' : config["development"].migrationStorageTableName;
};

module.exports = {
    checkTableExists,
    checkTableEmpty,
    getSqlData,
    getMigrationTableName
};
