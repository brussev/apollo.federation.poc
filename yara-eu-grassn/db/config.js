const defaultConfig = {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD.trim(),
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    protocol: 'postgres',
    operatorsAliases: '0'
};

module.exports = {
    development: {
        ...defaultConfig,
        migrationStorageTableName: 'SequelizeMetaGrassN'
    },
    int: defaultConfig,
    production: defaultConfig,
    test: defaultConfig
};
