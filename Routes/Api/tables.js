const router = require('express').Router();
const Quiz_Ctrl = require("../../Controllers/Quiz_ctrl")
const jwt = require("../../Middleware/authJwt");

router.get('/', jwt.verifyToken, Quiz_Ctrl.getTableResults);

module.exports = router;