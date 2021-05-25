const jwt = require('jsonwebtoken')

const userService = require('../service/user-service')
const errorTypes = require('../constans/error-types')
const md5password = require('../utils/password-handle')
const authService = require('../service/auth-service')

const {PUBLIC_KEY} = require('../app/config')

const verifyLogin = async (ctx, next) => {
  //1.获取用户名和密码
  const {username, password} = ctx.request.body

  //2.判断用户密码是否为空
  if(!username || !password){
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }
  //3.判断用户是否存在
  const result = await userService.getUserByName(username)
  const user = result[0]
  if(!user){
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }
  //4.判断密码是否和数据库中密码一直(必须加密后比较)
  if(md5password(password) !== user.password){
    const error = new Error(errorTypes.PASSWORD_IS_ERROR)
    return ctx.app.emit('error', error, ctx)
  }
  
  ctx.user = user
  await next()
}

const verifyAuth = async (ctx, next) => {
  //获取token
  const authorization = ctx.header.authorization
  if(!authorization){
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')
  //验证token
  try{
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
    await next()
  }catch(err){
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
}

const verifyPermission = async (ctx, next) => {
  //获取数据
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const {id} = ctx.user
  //查询是否具备权限
  try{
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if(!isPermission){
      const error = new Error(errorTypes.UNPERMISSION)
      return ctx.app.emit('error', error, ctx)
    }
    await next()
  }catch(err){
    console.log(err);
  }


}

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}