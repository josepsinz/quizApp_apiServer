const router = require('express').Router();
const qUser_Ctrl = require("../../Controllers/qUser_ctrl")

router.get('/', qUser_Ctrl.getAll)
router.get('/:nick', qUser_Ctrl.getUserByNick)
router.post('/signup', qUser_Ctrl.signUp)
router.post('/signin', qUser_Ctrl.signIn)
router.post('/savequiz', qUser_Ctrl.saveQuizDone)

module.exports = router;