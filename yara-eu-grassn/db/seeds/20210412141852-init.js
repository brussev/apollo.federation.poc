const path = require('path');
const { checkTableEmpty, getSqlData } = require('../helper');

const tables = [
    'Organization',
    'Farm',
    'Fertilization',
    'Harvest',
    'Field'
];

module.exports = {
    up: async (queryInterface) => {
        const isEmptyResults = await Promise.all(tables.map((table) => checkTableEmpty(queryInterface, table)));

        if (isEmptyResults.every((isEmpty) => isEmpty)) {
            const sqlData = await getSqlData(path.join(__dirname, 'initial-data.sql'));

            return queryInterface.sequelize.query(sqlData);
        } else {
            return true;
        }
    },

    down: async () => {
        return true;
    }
};
