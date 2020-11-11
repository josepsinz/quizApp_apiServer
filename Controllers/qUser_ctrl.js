const qUser = require("../Models/qUser");

exports.getAll = () => {
    return qUser.findAll();
}

exports.getUserByNick = ({ nickName }) => {
    return qUser.findAll({
        where: {
            nickName: nickName
        }
    });
}
