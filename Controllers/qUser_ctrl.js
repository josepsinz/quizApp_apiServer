const qUser = require("../Models/qUser");
const bcrypt = require("bcrypt");
const User_Quiz = require("../Models/User_Quiz");

exports.getAll = (_, res) => {
    qUser.findAll()
        .then((response) => {
            res.status(200).send({ users: response })
        })
        .catch((err) => {
            res.status(200).send({ err_message: "Error al buscar los usuarios" })
        })
}

exports.getUserByNick = (req, res) => {
    qUser.findOne({
        where: {
            nick: req.params.nick
        }
    })
        .then((response) => {
            res.status(200).send({ user: response })
        })
        .catch((err) => {
            res.status(200).send({ err_message: "Error al buscar usuario" })
        })
}

exports.signUp = (req, res) => {
    let newuser = {}
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).send({ err_message: "Error al encriptar" })
        } else {
            newuser = {
                ...req.body,
                password: hash
            }
            qUser.create(newuser)
                .then((response) => {
                    res.status(200).send({ code: 5, newUser: response })
                })
                .catch((err) => {
                    res.status(200).send({ code: 6, err_message: `El usuario ${req.body.nick} ya existe. Elija otro nombre de usuario. Gracias` })
                })
        }
    })
}

exports.signIn = (req, res) => {
    qUser.findOne({
        where: {
            nick: req.body.nick
        }
    })
        .then((response) => {
            bcrypt.compare(req.body.password, response.password, (err, istrue) => {
                if (err) {
                    res.status(200).send({ code: 1, err_message: "Error al desencriptar" })
                } else {
                    if (istrue) {
                        res.status(200).send({ code: 2, isLogged: istrue })
                    } else {
                        res.status(200).send({ code: 3, isLogged: istrue, err_message: `La contraseña para ${req.body.nick} no es válida` })
                    }
                }
            })
        })
        .catch((error) => {
            res.status(200).send({ code: 4, err_message: `Usuario ${req.body.nick} no encontrado` })
        })
}

exports.saveQuizDone = (req, res) => {
    User_Quiz.create(req.body)
        .then((response) => {
            User_Quiz.findOne({
                attributes: [
                    [User_Quiz.sequelize.fn('AVG', User_Quiz.sequelize.col('result')), 'medium_score'],
                ],
                where: { nick: req.body.nick },
                group: 'nick'
            }).then((response) => {
                let { medium_score } = JSON.parse(JSON.stringify(response));
                let avg_score = parseFloat(medium_score).toFixed(2);
                qUser.update(
                    { medium_score: avg_score },
                    {
                        where: { nick: req.body.nick }
                    }).then(() => {
                        res.status(200).send({ res: "Puntuación actualizada" })
                    })
            }).catch((err) => {
                res.status(200).send({ err_message: "Error al sacar la clasificación", err_code: 1 })
            })

        }).catch((err) => {
            res.status(200).send({ err_message: "Error al guardar cuestionario", err_code: 1 })
        })
}
