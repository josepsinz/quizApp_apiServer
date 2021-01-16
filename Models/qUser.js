const { DataTypes } = require("sequelize");
const sequelize = require("../Config")

const qUser = sequelize.define('qUser', {
    nick: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    medium_score: {
        type: DataTypes.DECIMAL(10, 2),
        primaryKey: true,
        allowNull: false,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        primaryKey: false,
        allowNull: false
    },
    nick_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: 'qUser',
    timestamps: false
});

module.exports = qUser;