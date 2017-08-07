var express = require('express');
var router = express.Router();

var articleModel = require('../mongodb/db').articleModel;

/* GET home page. */
router.get('/', function (req, res, next) {

    var pageNum = parseInt(req.query.pageNum);
    var pageSize = parseInt(req.query.pageSize);

    (!pageNum) && (pageNum = 1);
    (!pageSize) && (pageSize = 6);

    articleModel.find({})
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .populate('user')//user外健转换成对应的对象文档
        .exec(function (err, ary) {
            if (!err) {
                articleModel.count({}, function (err, count) {
                   if (!err){
                       req.flash('success', '显示文章列表信息成功');

                       res.render('index',
                           {
                               title: '首页标题',
                               articles: ary,
                               pageNum: pageNum,
                               pageSize: pageSize,
                               totalPage: Math.ceil(count/pageSize)
                           });
                   }  else {
                       req.flash('error', '显示文章列表信息失败');
                       res.redirect('back');
                   }
                })

            } else {
                req.flash('error', '显示文章列表信息失败');
                res.redirect('back');
            }
        });
});

module.exports = router;
