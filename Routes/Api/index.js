const router = require('express').Router();

router.use('/users', require('./users'))
router.use('/quiz', require('./quiz'))
router.use('/tables', require('./tables'))

module.exports = router;