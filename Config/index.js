const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production'

const options = isProduction ? {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
} : {}

const sequelize = new Sequelize(isProduction ? process.env.DATABASE_URL : `postgresql://${process.env.DB_USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DB}`, {
    dialect: "postgres",
    logging: false,
    quoteIdentifiers: false,
    omitNull: true,
    dialectOptions: options
})

module.exports = sequelize

