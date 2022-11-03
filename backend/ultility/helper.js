const md5 = require("md5");

exports.Roles = {
    Admin: 'admin',
    User: 'user'
}
//function hashPassword
exports.hashPassword = (password) => {
    return md5(password)
}