const router = require('express').Router();
const Quiz_Ctrl = require("../../Controllers/Quiz_ctrl");

router.get('/:difficulty/:category/:nick', Quiz_Ctrl.getQuiz);
router.post('/addquestion', Quiz_Ctrl.createQuestion);

module.exports = router;