const qUser = require("../Models/qUser");
const bcrypt = require("bcrypt");

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
            nickName: req.params.nickName
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
                    res.status(200).send({ code: 5, newUser: response})
                })
                .catch((err) => {
                    res.status(200).send({ code: 6, err_message: `El usuario ${req.body.nickName} ya existe. Elija otro nombre de usuario. Gracias` })
                })
        }
    })
}

exports.signIn = (req, res) => {
    qUser.findOne({
        where: {
            nickName: req.body.nickName
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
                        res.status(200).send({ code: 3, isLogged: istrue, err_message: `La contraseña para ${req.body.nickName} no es válida`})
                    }
                }
            })
        })
        .catch((error) => {
            res.status(200).send({ code: 4, err_message: `Usuario ${req.body.nickName} no encontrado` })
        })
}
