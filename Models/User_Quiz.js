const { DataTypes } = require("sequelize");
const sequelize = require("../Config");

const User_Quiz = sequelize.define("user_quiz", {
    nick: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    id_quiz: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    duration: {
        type: DataTypes.FLOAT,
        primaryKey: false
    },
    result: {
        type: DataTypes.DECIMAL(10,2),
        primaryKey: false
    }
}, {
    freezeTableName: true,
    tableName: 'user_quiz',
    timestamps: false
})

module.exports = User_Quiz;