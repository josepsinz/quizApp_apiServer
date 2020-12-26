const router = require('express').Router();
const qUser_Ctrl = require("../../Controllers/qUser_ctrl")

router.get('/', qUser_Ctrl.getAll)
router.get('/:nick', qUser_Ctrl.getUserByNick)
router.get('/myprofile/:nick', qUser_Ctrl.getMyProfileStatistics)
router.post('/signup', qUser_Ctrl.signUp)
router.post('/signin', qUser_Ctrl.signIn)
router.post('/savequiz', qUser_Ctrl.saveQuizDone)
router.delete('/:nick', qUser_Ctrl.deleteUser)

module.exports = router;