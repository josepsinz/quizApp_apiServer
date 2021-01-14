const router = require('express').Router();
const Quiz_Ctrl = require("../../Controllers/Quiz_ctrl");
const jwt = require("../../Middleware/authJwt");

router.get('/:difficulty/:category/:nick', Quiz_Ctrl.getQuiz);
router.post('/addquestion', jwt.verifyToken, Quiz_Ctrl.createQuestion);

module.exports = router;