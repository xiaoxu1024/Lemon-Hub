const Router = require('koa-router')
const {verifyUser, handlePassword} = require('../middleware/user-middleware')
const {
  create,
  avatarInfo
} = require('../controller/user-controller')

const userRouter = new Router({prefix: '/users'})


userRouter.post('/', verifyUser, handlePassword, create)
//获取头像
userRouter.get('/:userId/avatar', avatarInfo)

module.exports = userRouter