const qQuestion = require("../Models/qQuestion");

exports.getQuiz = (req, res) => {
    qQuestion.findAll({
        where: {
            difficulty: req.params.difficulty,
            category: req.params.category
        }
    }).then( (response) => {
        res.status(200).send({questions: response})
    }).catch( (err) => {
        res.status(200).send({err_message: "Error al generar cuestionario", err_code: 1})
    })
}