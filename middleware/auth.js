//登陆后才能做的事情
module.exports.checkLogin = function (req, res, next) {
    if (req.session.user){ //登陆
        req.flash('success', '已经登陆，可以进行访问');
        next();
    } else {
        req.flash('error', '当前用户未登陆，没有权限进行访问');
        res.redirect('/user/login');
    }
};

//未登陆才能做的事情
module.exports.checkNotLogin = function (req, res, next) {
    if (req.session.user){ //登陆
        req.flash('error', '当前用户已登陆，不能进行访问');
        res.redirect("/");
    } else {
        req.flash('success', '未登陆，可以进行访问');
        next();
    }
};



