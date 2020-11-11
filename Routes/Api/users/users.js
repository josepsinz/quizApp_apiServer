const router = require("express").Router();
const User_Ctrl = require("../../../Controllers/qUser_ctrl");

exports.getAll = async (req, res) => {
    let users = {}
    try {
        users = await User_Ctrl.getAll()
    } catch (e) {
        return e
    }
    res.status(200).json(users);
}

exports.getByNick = async (req, res) => {
    let user = {}
    try {
        user = await User_Ctrl.getUserByNick(req.params)
    } catch (e) {
        return e
    }
    res.status(200).json(user);
}
