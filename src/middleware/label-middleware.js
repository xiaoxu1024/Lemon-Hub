const labelService = require('../service/label-service')

const verifyLabelExists = async (ctx, next) => {
  //取出所有要添加的标签
  const {labels} = ctx.request.body
  const newLabels = []
  //2.判断每个标签是否存在
  for(let name of labels){
    const labelResult = await labelService.getLabelByName(name)
    const label = {name}
    if(!labelResult){
      //不存在创建
      const result = await labelService.create(name)
      label.id = result.insertId
    }else{
      label.id = labelResult.id
    }
    newLabels.push(label)
  }

  ctx.labels = newLabels
  await next()
}

module.exports = {
  verifyLabelExists
}