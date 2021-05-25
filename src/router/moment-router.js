const Router = require('koa-router')

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/moment-controller')
const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth-middleware')
const {
  verifyLabelExists
} = require('../middleware/label-middleware')


const momentRouter = new Router({prefix: '/moment'})

//发表动态
momentRouter.post('/', verifyAuth, create)
//获取动态详情
momentRouter.get('/:momentId', detail)
//获取动态列表
momentRouter.get('/', list)
//修改动态
momentRouter.patch('/:momentId',verifyAuth, verifyPermission, update)
//删除动态
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)
//给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels)
//动态配图
momentRouter.get('/images/:filename', fileInfo)
module.exports = momentRouter