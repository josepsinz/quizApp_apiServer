const router = require('express').Router();
const qUser_Ctrl = require("../../Controllers/qUser_ctrl")
const jwt = require("../../Middleware/authJwt");

router.get('/myprofile/:nickHash', jwt.verifyToken, qUser_Ctrl.getMyProfileStatistics)
router.post('/signup', qUser_Ctrl.signUp)
router.post('/signin', qUser_Ctrl.signIn)
router.post('/savequiz', jwt.verifyToken, qUser_Ctrl.saveQuizDone)
router.delete('/:nickHash', jwt.verifyToken, qUser_Ctrl.deleteUser)

module.exports = router;