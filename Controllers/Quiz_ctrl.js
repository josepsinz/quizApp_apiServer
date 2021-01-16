const Question = require("../Models/Question");
const Quiz = require("../Models/Quiz");
const sequelize = require("../Config");
const User_Quiz = require("../Models/User_Quiz");
const qUser = require("../Models/qUser");
const { Op } = require("sequelize");

exports.getQuiz = (req, res) => {
    qUser.findOne({
        where: {
            nick_hash: req.params.hash
        }
    }).then((user) => {
        if (user) {
            Question.findAll({
                where: {
                    difficulty: req.params.difficulty,
                    category: req.params.category,
                    approved: true,
                    nick: { [Op.ne]: user.dataValues.nick }
                },
                limit: 5,
                order: sequelize.random()
            }).then((response) => {
                let arrayResponse = JSON.parse(JSON.stringify(response))
                let idQuestions = arrayResponse.map((el) => el.id)
                let newQuiz = {
                    questions: idQuestions,
                    date_creation: new Date(),
                    difficulty: req.params.difficulty,
                    category: req.params.category
                };
                Quiz.create(newQuiz)
                    .then((response) => {
                        let parsedResponse = JSON.parse(JSON.stringify(response));
                        res.status(200).send({ questions: arrayResponse, idQuiz: parsedResponse.id })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(500).send({ err_message: "Error creating new quiz" })
                    })
            }).catch((err) => {
                console.log(err)
                res.status(200).send({ questions: [] })
            })
        } else {
            res.status(500).send({ err_message: "Can not find user logged properly" })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ err_message: "Error getting user" })
    })
}

exports.createQuestion = (req, res) => {
    qUser.findOne({
        where: {
            nick_hash: req.body.nickHash
        }
    }).then((user) => {
        if (user) {
            sequelize.query('select max(id) from question').then((maxId) => {
                const { nickHash, ...body } = req.body
                body.nick = user.dataValues.nick
                body.id = maxId[0][0].max + 1
                Question.create(body)
                    .then((response) => {
                        res.status(200).send({ newQuestion: response })
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).send({ err_message: "Error sending new question " })
                    })
            }).catch((err) => {
                console.log(err)
                res.status(500).send({ err_message: "Error retrieving max id" })
            })
        } else {
            res.status(500).send({ err_message: "Can not find user logged properly" })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ err_message: "Error getting user" })
    })
}

exports.getTableResults = (_, res) => {
    User_Quiz.findAll({
        attributes: [
            'nick',
            [User_Quiz.sequelize.fn('AVG', User_Quiz.sequelize.col('result')), 'medium_score'],
            [User_Quiz.sequelize.fn('COUNT', User_Quiz.sequelize.col('id_quiz')), 'num_quiz']
        ],
        group: 'nick',
        order: [[User_Quiz.sequelize.fn('AVG', User_Quiz.sequelize.col('result')), 'DESC']]
    }).then((response) => {
        res.status(200).send({ tables: response })
    }).catch((err) => {
        console.log(err)
        res.status(200).send({ err_message: "Error retrieving tables" })
    })
}