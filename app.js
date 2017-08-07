//express模块(安装，路由，中间件，静态文件，模版引擎，req，获取post请求体，路由容器，模版文件拆分....)
var express = require('express');
//路径相关 path.join  __dirname
var path = require('path');
//处理ico文件
var favicon = require('serve-favicon');
//日志
var logger = require('morgan');
//处理cookie
var cookieParser = require('cookie-parser');
//处理post请求体信息获取
var bodyParser = require('body-parser');

//session模块
var session = require('express-session');
//将session数据保存到数据库中
var MongoStore = require('connect-mongo')(session);

//引入flash模块
var flash = require('connect-flash');


//路由容器
var index = require('./routes/index'); //处理首页
var user = require('./routes/user'); //处理用户
var article = require('./routes/article');//处理文章

var app = express();

// view engine setup
//设置模版引擎文件
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine("html", require("ejs").__express);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源文件
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: "come",
  save: true,
  saveUninitialized: true,

  //直接将session和数据库进行关联，将session信息直接保存到数据库中
  store: new MongoStore({
    url: require('./dbUrl').dbUrl
  })
}));

//使用flash模块
app.use(flash());


//公共中间件-->将所有路由中的公共操作提取到该中间件中
app.use(function (req, res, next) {
  res.locals.user = req.session.user;//将用户的登陆信息保存到模版引擎文件的user中

  //成功的提示信息
  res.locals.success = req.flash('success');
  //失败的提示信息
  res.locals.error = req.flash('error');

  next();
});

//使用路由容器
app.use('/', index);
app.use('/user', user);
app.use('/article', article);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //向模版引擎文件导入数据(所有模版引擎文件都能够使用该数据)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //模版引擎文件渲染
  res.render('error');
});

module.exports = app;
