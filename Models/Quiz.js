const { DataTypes } = require("sequelize");
const sequelize = require("../Config");

const Quiz = sequelize.define("quiz", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        //allowNull: false
    },
    questions: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        primaryKey: false
    },
    date_creation: {
        type: DataTypes.DATE,
        primaryKey: false
    },
    difficulty: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    category: {
        type: DataTypes.STRING,
        primaryKey: false
    },
}, {
    freezeTableName: true,
    tableName: 'quiz',
    timestamps: false
})

module.exports = Quiz;