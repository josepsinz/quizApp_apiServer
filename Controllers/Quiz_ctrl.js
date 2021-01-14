const Question = require("../Models/Question");
const Quiz = require("../Models/Quiz");
const sequelize = require("../Config");
const User_Quiz = require("../Models/User_Quiz");
const { Op } = require("sequelize");

exports.getQuiz = (req, res) => {
    Question.findAll({
        where: {
            difficulty: req.params.difficulty,
            category: req.params.category,
            approved: true,
            nick: { [Op.ne]: req.params.nick }
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
        let idQuiz;
        Quiz.create(newQuiz)
            .then((response) => {
                let parsedResponse = JSON.parse(JSON.stringify(response));
                idQuiz = parsedResponse.id;
                console.log("NEW QUIZ CREATED!");
                res.status(200).send({ questions: arrayResponse, idQuiz })
            })
            .catch((err) => {
                res.status(200).send({ err_message: "Error al generar cuestionario", err_code: 1 })
            })
    }).catch((err) => {
        res.status(200).send({ questions: [] })
    })
}

exports.createQuestion = (req, res) => {
    Question.create(req.body)
        .then((response) => {
            res.status(200).send({ newQuestion: response })
        }).catch((err) => {
            console.log(err)
            res.status(200).send({ err_message: "Error al enviar pregunta", err_code: 1 })
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
        res.status(200).send({ err_message: "Error al sacar la clasificación", err_code: 1 })
    })
}

function decryptNickHash(nick, hash) {
    bcrypt.compare(nick, hash, (err, istrue) => {
        if (err) {
            console.log("No coincide")
            return false
        } else {
            console.log("Coincide")
            return true
        }
    })
}