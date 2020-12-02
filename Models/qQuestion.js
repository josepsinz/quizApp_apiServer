const { DataTypes } = require("sequelize");
const sequelize = require("../Config");

const qQuestion = sequelize.define("qQuestion", {
    idQuestion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
    }
}, {
    freezeTableName: true,
    tableName: 'qQuestion',
    timestamps: false
})

module.exports = qQuestion;