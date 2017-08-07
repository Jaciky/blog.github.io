//引入mongoose模块
var mongoose = require('mongoose');

var dbUrl = require('../dbUrl').dbUrl;

//连接数据库
mongoose.connect(dbUrl);

//创建集合字段
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,

    //用户头像
    avatar: String
});

//创建model
var userModel = mongoose.model("user", userSchema);



//文章相关的
var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    createAt: {
        type: Date,
        default: Date.now()
    },

    //作者
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    //文章的封面图片
    poster: String

});

var articleModel = mongoose.model('article', articleSchema);


//导出user集合
module.exports.userModel = userModel;

//导出article集合
module.exports.articleModel = articleModel;