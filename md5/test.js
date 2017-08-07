var crypto = require("crypto");

console.log(crypto.getHashes());

//创建md5加密
var md5 = crypto.createHash("md5");

//向md5中传入要加密的数据
md5.update("chenchao");

//加密后的输出
var result = md5.digest("hex");

// 4f0e473930d604e441c6d5306139d437

// 4f0e473930d604e441c6d5306139d437
console.log(result);




