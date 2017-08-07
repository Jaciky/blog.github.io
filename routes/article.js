var express = require('express');
var router = express.Router();

//权限判断
var auth = require('../middleware/auth');

//数据库文章相关的集合
var articleModel = require('../mongodb/db').articleModel;

var multer = require('multer');

var storage = multer.diskStorage({
    //将图片上传后保存的位置
    destination: function (req, file, cb) {
        cb(null, '../public/uploads');
    },
    //上传后文件的名字
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var uploads = multer({storage: storage});  //中间件函数


//发表文章路由
router.get('/add', auth.checkLogin, function (req, res) {
    res.render('article/add', {title: "发表文章标题", content: "发表文章内容"});
});

/**
 * 1: 增加一个发表文章的路由
 * 2: 获取提交文章信息
 * 3: 数据库中增加一个集合(article-->title/content/createAt)
 * 4: 数据库中创建文档保存提交的文章信息
 * */
router.post('/add', uploads.single('poster'), function (req, res) {
    var article = req.body;

    //文章发表的时间
    article.createAt = Date.now();

    //作者
    article.user = req.session.user._id;

    if (req.file){ //有文件上传
        article.poster = '/uploads/'+req.file.filename;
    }

    articleModel.create(article, function (err, doc) {
        if (!err){
            req.flash('success', '发表文章信息成功');
            res.redirect('/');
        } else {
            req.flash('error', '发表文章信息失败');
            res.redirect('back');
        }
    });
});

module.exports = router;
