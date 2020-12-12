const Question = require("../Models/Question");
const Quiz = require("../Models/Quiz");
const sequelize = require("../Config");
const User_Quiz = require("../Models/User_Quiz");

exports.getQuiz = (req, res) => {
    Question.findAll({
        where: {
            difficulty: req.params.difficulty,
            category: req.params.category
        },
    }).then( (response) => {
        let arrayResponse = JSON.parse(JSON.stringify(response))
        let shuffled = arrayResponse
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
        let responseFine = [];
        for(let i = 0; i<5; i++){
            responseFine[i] = shuffled[i];
        };
        let idQuestions = responseFine.map ((el) => el.id)
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
            res.status(200).send({questions: responseFine, idQuiz})
        })
        .catch((err) => {
            res.status(200).send({err_message: "Error al generar cuestionario", err_code: 1})
        })
        
    }).catch( (err) => {
        res.status(200).send({err_message: "Error al buscar las preguntas", err_code: 1})
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
        res.status(200).send({tables: response})
    }).catch((err) => {
        console.log(err)
        res.status(200).send({err_message: "Error al sacar la clasificación", err_code: 1})
    })
}