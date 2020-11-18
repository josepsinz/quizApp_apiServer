const qUser = require("../Models/qUser");
const bcrypt = require("bcrypt");

exports.getAll = (_, res) => {
    qUser.findAll()
        .then((response) => {
            res.status(200).send({ users: response })
        })
        .catch((err) => {
            res.status(500).send({ err_message: "Error al buscar los usuarios" })
        })
}

exports.getUserByNick = (req, res) => {
    console.log(req.params);
    qUser.findOne({
        where: {
            nickName: req.params.nickName
        }
    })
        .then((response) => {
            res.status(200).send({ user: response })
        })
        .catch((err) => {
            res.status(500).send({ err_message: "Error al buscar usuario" })
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
                    res.status(200).send({ newUser: response })
                })
                .catch((err) => {
                    res.status(500).send({ err_message: err })
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
                    res.status(500).send({ message: "Error al desencriptar" })
                } else {
                    if (istrue) {
                        res.status(200).send({ isLogged: istrue })
                    } else {
                        res.status(200).send({ isLogged: istrue })
                    }
                }
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send({ err_message: `Usuario ${req.body.nickName} no encontrado` })
        })
}
