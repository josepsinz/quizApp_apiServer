const { Sequelize } = require('sequelize');

const config = {
    POSTGRES_PASSWORD: "pgadmin",
    POSTGRES_USER: "postgres",
    POSTGRES_DB: "quizDB",
    POSTGRES_HOST: "localhost",
    POSTGRES_PORT : 5432
}

const sequelize = new Sequelize(config.POSTGRES_DB, config.POSTGRES_USER, config.POSTGRES_PASSWORD, {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    dialect: "postgres",
    logging: false
});

module.exports = sequelize

