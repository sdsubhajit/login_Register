const express = require('express')
const route = express.Router()
const controller = require('../controller/userController')
const duplicate = require('../middleware/checkDuplicate')


route.get('/' , controller.home)
route.get('/register' , controller.register)
route.post('/register/create' , [duplicate.CheckDuplicate] , controller.register_create)
route.get('/login' , controller.login)
route.post('/login/create' , controller.login_create)
route.get('/dashboard' , controller.userAuther ,controller.dashboard)
route.get('/logout' , controller.logout)



module.exports = route