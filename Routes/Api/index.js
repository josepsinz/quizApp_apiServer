const router = require('express').Router();

router.use('/users', require('./users'))
router.use('/quiz', require('./quiz'))

module.exports = router;