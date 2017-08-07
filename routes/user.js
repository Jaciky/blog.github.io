var express = require('express');
var router = express.Router();

//导入数据库中user集合
var userModel = require('../mongodb/db').userModel;

// 导入md5加密模块
var md5 = require('../md5/md5').md5;

//权限判断
var auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', auth.checkNotLogin, function (req, res) {
    res.render('user/login', {title: '登陆页标题', content: '登陆页内容'});
});

router.post('/login', auth.checkNotLogin, function (req, res) {
    var user = req.body;

    //对密码进行加密处理
    user.password = md5(user.password);

    userModel.findOne(user, function (err, doc) {
        if (!err) {
            if (doc) {

                //将用户的登陆信息保存到session中
                req.session.user = doc;

                req.flash('success', '用户登陆成功');

                res.redirect("/");
            } else {
                req.flash('error', '该用户尚未注册，请先注册');

                res.redirect("back");
            }
        } else {
            req.flash('error', '登陆用户信息失败，请重新登陆');

            res.redirect("back");
        }
    });
});

router.get('/reg', auth.checkNotLogin, function (req, res) {
    res.render('user/reg', {title: '注册页标题', content: '注册页内容'});
});

//注册页面表单提交路由处理
router.post('/reg', auth.checkNotLogin, function (req, res) {
    var user = req.body;//获取表单提交的信息

    //对密码进行加密处理
    user.password = md5(user.password);

    //保存用户的头像
    user.avatar = "https://secure.gravatar.com/avatar/"+user.email;

    userModel.findOne(user, function (err, doc) {
        if (!err) {
            if (doc) { //已经注册了
                req.flash('error', '当前用户已经注册，请更改信息重新注册');

                res.redirect("back");
            } else { //没有注册过
                userModel.create(user, function (err, doc) {
                    if (!err) {
                        req.flash('success', '注册用户信息成功，跳转到登陆页');
                        res.redirect('/user/login');
                    } else {
                        req.flash('error', '注册用户信息失败，请重新注册');
                        res.redirect("back");
                    }
                });
            }
        } else {
            req.flash('error', '查找用户信息失败，请重新注册');

            res.redirect("back");
        }
    });
});

router.get('/logout', auth.checkLogin, function (req, res) {
    req.session.user = null;//清除登陆信息

    req.flash('success', '退出成功');
    res.redirect('/'); //直接跳转到首页
});

module.exports = router;
