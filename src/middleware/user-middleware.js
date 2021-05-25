const errorTypes = require('../constans/error-types')
const service = require('../service/user-service')
const md5password = require('../utils/password-handle')

const verifyUser = async (ctx, next) => {
  //1.获取用户名和密码
  const {username, password} = ctx.request.body

  //2.判断用户名和密码不能为空
  if(!username || !password){
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  //3.判断这次注册的用户名没有被注册过
  const result = await service.getUserByName(username)
  if(result.length){
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }
  await next()
}

const handlePassword = async (ctx, next) => {
  const {password} = ctx.request.body
  ctx.request.body.password = md5password(password)

  await next()
}

module.exports = {
  verifyUser,
  handlePassword
}