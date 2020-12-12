const router = require('express').Router();
const Quiz_Ctrl = require("../../Controllers/Quiz_ctrl")

router.get('/', Quiz_Ctrl.getTableResults);

module.exports = router;