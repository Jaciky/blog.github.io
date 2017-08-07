//  blog:server 就是debug名字，要和环境变量对应
//成功
var debugSuccess = require('debug')('blog:success');

//失败
var debugError = require('debug')('blog:error');

//警告
var debugWarn = require('debug')('blog:Warning');

debugSuccess("这是成功信息");

debugError("这是失败信息");

debugWarn("这是警告信息");

console.log("这是测试信息");

