const express = require('express')
const router = express.Router()
const userController = require('../app/controller/userController')
const verifyToken = require('../app/middleware/verifyToken')
const verifyTokenAndAdmin = require('../app/middleware/verifyTokenAndAdmin')

router.post('/find-user',  userController.findUser)
router.get('/:id', verifyToken,  userController.getAllUser)
router.delete('/:id', verifyTokenAndAdmin, userController.delete)

module.exports = router
