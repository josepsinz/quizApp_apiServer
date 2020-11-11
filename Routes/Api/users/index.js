const router = require('express').Router();
const Users = require('./users')


router.get('/', Users.getAll)
router.get('/:nickName', Users.getByNick)

module.exports = router;