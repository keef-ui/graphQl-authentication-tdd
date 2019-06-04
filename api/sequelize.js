const Sequelize = require('sequelize')
const UserModel = require('./models/user')


// * * * * * * * * * * * * * * * Connect to db * * * * * * * * * * * * * *
const sequelize = new Sequelize('register_user', 'testuser', 'test', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
      define: {
        timestamps: false
    }
})


//* * * * * * * * * * * * * *  Data modeling ie set up relationships etc * * * * * * * * * * * * * *
const User = UserModel(sequelize, Sequelize)
// BlogTag will be our way of tracking relationship between Blog and Tag models
// each Blog can have multiple tags and each Tag can have multiple blogs
// const ItemDone = sequelize.define('blog_tag', {})
// const Blog = BlogModel(sequelize, Sequelize)
// const Done = DoneModel(sequelize, Sequelize)

// Blog.belongsToMany(Tag, { through: BlogTag, unique: false })
// Tag.belongsToMany(Blog, { through: BlogTag, unique: false })
// Blog.belongsTo(User);



// * * * * * * * * * * * * * * Export models so other pasrtsc can use * * * * * * * * * * * * * *
module.exports = {
  User
}