const fs = require('fs')

const fileService = require('../service/file-service')
const momentService = require('../service/moment-service')

class MomentController {
  async create(ctx, next) {
    //获取数据(user_id,content,图片）
    const userId = ctx.user.id
    const { content } = ctx.request.body
    //插入一条动态
    const result = await momentService.create(userId, content)
    ctx.body = result
  }
  async detail(ctx, next) {
    //1.获取momentId
    const momentId = ctx.params.momentId

    //2.根据momentId查询这条动态数据
    const result = await momentService.getMomentById(momentId)
    ctx.body = result
  }
  async list(ctx, next) {
    //获取offset/size
    const { offset, size } = ctx.query
    //查询列表数据
    const result = await momentService.getMomentList(offset, size)
    ctx.body = result
  }
  async update(ctx, next) {
    //获取参数
    const momentId = ctx.params.momentId
    const { content } = ctx.request.body
    const { id } = ctx.user
    //更新数据
    const result = await momentService.update(content, momentId)
    ctx.body = result
  }
  async remove(ctx, next) {
    //获取参数
    const momentId = ctx.params.momentId

    //删除内容
    const result = await momentService.remove(momentId)
    ctx.body = result
  }
  async addLabels(ctx, next) {
    //1.获取标签和动态id
    const labels = ctx.labels
    const { momentId } = ctx.params

    //2.添加所有标签
    for(let label of labels){
      //2.1判断标签是否已经和动态有关
      const isExist = await momentService.hasLabel(momentId, label.id)
      if(!isExist){
        await momentService.addLabel(momentId, label.id)
      }
    }

    ctx.body = '给动态成功添加标签'
  }
  async fileInfo(ctx, next){
    const {filename} = ctx.params
    const fileInfo = await fileService.getFileByFilename(filename)

    ctx.response.set('content-type', fileInfo.mimetype)
    ctx.body = fs.createReadStream(`./uploads/picture/${filename}`)
  }
}

module.exports = new MomentController()