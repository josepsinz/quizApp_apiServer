const router = require('express').Router();
const qUser_Ctrl = require("../../Controllers/qUser_ctrl")
const jwt = require("../../Middleware/authJwt");

router.get('/', jwt.verifyToken, qUser_Ctrl.getAll)
router.get('/:nick', jwt.verifyToken, qUser_Ctrl.getUserByNick)
router.get('/myprofile/:nick', jwt.verifyToken, qUser_Ctrl.getMyProfileStatistics)
router.post('/signup', qUser_Ctrl.signUp)
router.post('/signin', qUser_Ctrl.signIn)
router.post('/savequiz', jwt.verifyToken, qUser_Ctrl.saveQuizDone)
router.delete('/:nick', jwt.verifyToken, qUser_Ctrl.deleteUser)

module.exports = router;