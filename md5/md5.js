module.exports.md5 = function (str) {
    var crypto = require("crypto");

    var md5 = crypto.createHash("md5");

    md5.update(str);

    return md5.digest("hex");
};