const { Sequelize } = require('sequelize');

const config = {
    POSTGRES_PASSWORD: process.env.PASSWORD,
    POSTGRES_USER: process.env.DB_USER,
    POSTGRES_DB: process.env.DB,
    POSTGRES_HOST: process.env.HOST,
    POSTGRES_PORT: process.env.DB_PORT
}

const sequelize = new Sequelize(config.POSTGRES_DB, config.POSTGRES_USER, config.POSTGRES_PASSWORD, {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    dialect: "postgres",
    logging: false,
    quoteIdentifiers: false,
    omitNull: true
});

module.exports = sequelize

