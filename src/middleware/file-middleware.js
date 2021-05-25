const Multer = require('koa-multer')

const avatarUpload = Multer({
  dest:'./uploads/avatar'
})
const avatarHandler = avatarUpload.single('avatar')

const pictureUpload = Multer({
  dest:'./uploads/picture'
})
const pictureHandler = pictureUpload.array('picture', 9)

module.exports = {
  avatarHandler,
  pictureHandler
}