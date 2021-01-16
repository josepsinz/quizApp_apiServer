const qUser = require("../Models/qUser");
const bcrypt = require("bcrypt");
const User_Quiz = require("../Models/User_Quiz");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const checkHash = require("../Utils/checkHash")

exports.signUp = async (req, res) => {
    let newUser = {}
    let pass = false
    let hash = ""
    do {
        await bcryptHashWithoutSlash(req.body.nick).then((resp) => {
            hash = resp
            pass = true
        }).catch((err) => {
            //console.log(err)
        })
    } while (!pass)
    bcrypt.genSalt(+process.env.ROUNDS_GEN_BCRYP, (err, saltPass) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err_message: "Error when generating salt round (password)" })
        }
        bcrypt.hash(req.body.password, saltPass, (err, hashPass) => {
            if (err) {
                console.log(err)
                res.status(500).send({ err_message: "Error when encrypting password" })
            }
            newUser = {
                nick: req.body.nick,
                password: hashPass,
                created_at: new Date(),
                nick_hash: hash
            }
            qUser.create(newUser)
                .then((response) => {
                    const token = jwt.sign({ nick: req.body.nick }, process.env.SECRET, {
                        expiresIn: 1800 //half an hour
                    })
                    res.status(200).send({ code: 5, token, nickHash: newUser.nick_hash })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(200).send({ code: 6, err_message: `${newUser.nick} exists. Choose another nick` })
                })
        })
    })
}

exports.signIn = (req, res) => {
    qUser.findOne({
        where: {
            nick: req.body.nick
        }
    })
        .then((response) => {
            checkHash(req.body.password, response.password).then(() => {
                const token = jwt.sign({ nick: req.body.nick }, process.env.SECRET, {
                    expiresIn: 1800 //half an hour
                })
                res.status(200).send({ code: 2, token, nickHash: response.nick_hash })
            }).catch((reject) => {
                if (!reject) {
                    res.status(200).send({ code: 3, err_message: `Password not valid` })
                } else {
                    res.status(500).send({ err_message: "Error decrypting" })
                }
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(200).send({ code: 4, err_message: `User ${req.body.nick} not found` })
        })
}

exports.saveQuizDone = (req, res) => {
    qUser.findOne({
        where: {
            nick_hash: req.body.nickHash
        }
    }).then((user) => {
        if (user) {
            const { nickHash, ...body } = req.body
            body.nick = user.dataValues.nick
            User_Quiz.create(body)
                .then(() => {
                    User_Quiz.findOne({
                        attributes: [
                            [User_Quiz.sequelize.fn('AVG', User_Quiz.sequelize.col('result')), 'medium_score'],
                        ],
                        where: { nick: body.nick },
                        group: 'nick'
                    }).then((response) => {
                        let { medium_score } = JSON.parse(JSON.stringify(response));
                        let avg_score = parseFloat(medium_score).toFixed(2);
                        qUser.update(
                            { medium_score: avg_score },
                            {
                                where: { nick: body.nick }
                            }).then(() => {
                                res.status(200).send({ res: "Updated user score" })
                            })
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).send({ err_message: "Error getting current quiz" })
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).send({ err_message: "Error saving quiz" })
                })
        } else {
            res.status(500).send({ err_message: "Can not find user logged properly" })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ err_message: "Error getting user" })
    })
}

exports.getMyProfileStatistics = (req, res) => {
    qUser.findOne({
        where: {
            nick_hash: req.params.nickHash
        }
    }).then((user) => {
        if (user) {
            qUser.findAll({
                where: {
                    nick: { [Op.ne]: 'admin' },
                },
                order: ['medium_score desc']
            }).then((users) => {
                const infoUsersOrderBy = JSON.parse(JSON.stringify(users));
                let ranking;
                const { created_at } = infoUsersOrderBy.find((el, index) => {
                    ranking = index + 1;
                    return el.nick === user.dataValues.nick
                });
                let registry = created_at.substring(0, 10)
                User_Quiz.findAll({
                    attributes: [
                        [User_Quiz.sequelize.fn('AVG', User_Quiz.sequelize.col('result')), 'medium_score'],
                        [User_Quiz.sequelize.fn('MAX', User_Quiz.sequelize.col('result')), 'max_result'],
                        [User_Quiz.sequelize.fn('MIN', User_Quiz.sequelize.col('duration')), 'min_duration'],
                        [User_Quiz.sequelize.fn('COUNT', User_Quiz.sequelize.col('id_quiz')), 'quiz_done'],
                    ],
                    where: {
                        nick: user.dataValues.nick
                    }
                }).then((data) => {
                    let result = JSON.parse(JSON.stringify(data));
                    let statistics = {
                        ...result[0],
                        ranking,
                        created_at: registry,
                        nick: user.dataValues.nick
                    }
                    res.status(200).send({ statistics })
                }).catch(err => {
                    console.log(err);
                    res.status(500).send({ err_message: "Error getting statistics" })
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).send({ err_message: "Error getting users info" })
            })
        } else {
            res.status(500).send({ err_message: "Can not find user logged properly" })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ err_message: "Error getting user" })
    })
}

exports.deleteUser = (req, res) => {
    qUser.findOne({
        where: {
            nick_hash: req.params.nickHash
        }
    }).then((user) => {
        if (user) {
            User_Quiz.destroy({
                where: {
                    nick: user.dataValues.nick
                }
            }).then(() => {
                qUser.destroy({
                    where: {
                        nick: user.dataValues.nick
                    }
                }).then(() => {
                    res.status(200).send({ userDeleted: user.dataValues.nick })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send({ err: `Error deleting user ${user.dataValues.nick}` })
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).send({ err: `Error deleting user quiz` })
            })
        } else {
            res.status(500).send({ err_message: "Can not find user logged properly" })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({ err_message: "Error getting user" })
    })
}

const bcryptHashWithoutSlash = (nick) => {
    let promiseReturned = new Promise((resolved, reject) => {
        let gen = bcrypt.genSaltSync(+process.env.ROUNDS_GEN_BCRYP)
        let hash = bcrypt.hashSync(nick, gen)
        if (hash.includes("/")) {
            reject("hash not valid for these app!")
        } else {
            resolved(hash)
        }
    })
    return promiseReturned
}