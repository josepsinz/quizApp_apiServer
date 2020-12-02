const router = require('express').Router();
const Quiz_Ctrl = require("../../Controllers/qQuiz_ctrl");

router.get('/:difficulty/:category', Quiz_Ctrl.getQuiz);

module.exports = router;