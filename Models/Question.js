const { DataTypes } = require("sequelize");
const sequelize = require("../Config");

const Question = sequelize.define("question", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        //allowNull: false
    },
    question: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        primaryKey: false
    },
    answer: {
        type: DataTypes.STRING,
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
    approved: {
        type: DataTypes.BOOLEAN,
        primaryKey: false
    },
    nick: {
        type: DataTypes.STRING,
        primaryKey: false
    }
}, {
    freezeTableName: true,
    tableName: 'question',
    timestamps: false
})

module.exports = Question;