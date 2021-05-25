const fs = require('fs')

const userService = require('../service/user-service')
const fileServie = require('../service/file-service')

class UserController {
  async create(ctx, next){
    //获取用户请求传递的参数
    const user = ctx.request.body
    //查询数据
    const result = await userService.create(user)
    //返回数据
    ctx.body = result
  }
  async avatarInfo(ctx, next){
    const {userId} = ctx.params
    const avatarInfo = await fileServie.getAvatarByUserId(userId)
    
    //处理为直接显示的图像
    ctx.response.set('content-type', avatarInfo.mimetype)
    ctx.body = fs.createReadStream(`./uploads/avatar/${avatarInfo.filename}`)
  }
}

module.exports = new UserController()