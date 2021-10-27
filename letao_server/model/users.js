const { query } = require("../db/query");
module.exports.register = async (username, password, mobile) => {
  return await query(
    `insert into user ( username, password, mobile ) values ("${username}", "${password}" , "${mobile}" )`
  );
};
// 根据用户名查询用户
module.exports.findUserByName = async (username) => {
  return await query("select * from user where username = ?", [username]);
};

//根据用户名密码登录
module.exports.findUserInfo = async (username, password) => {
  return await query("select * from user where username=? and password = ?", [
    username,
    password,
  ]);
};
