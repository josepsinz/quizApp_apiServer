const router = require('express').Router();
const User_Ctrl = require("../../Controllers/qUser_ctrl")

router.get('/', User_Ctrl.getAll)
router.get('/:nickName', User_Ctrl.getUserByNick)
router.post('/signup', User_Ctrl.signUp)
router.post('/signin', User_Ctrl.signIn)

module.exports = router;