const { register, findUserByName, findUserInfo } = require("../model/users");
const Joi = require("joi");
const { cryptoPaddword } = require("../utils");
const { secret, jwtSecret } = require("../config");
const jwt = require("jsonwebtoken");
//注册
module.exports.register = async (ctx) => {
  // 读取到请求参数
  const { username, password, mobile } = ctx.request.body;

  // 参数校验 是否合法   不合法返回提示信息  并return 退出
  const schema = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,20}$/),
    repeat_password: Joi.ref("password"),
    mobile: Joi.string().pattern(
      /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
    ),
  });

  const verify = schema.validate({ username, password, mobile });

  // 如果校验不通过，要return
  if (verify.error) {
    ctx.body = {
      status: 0,
      message: verify.error.details[0].message,
    };

    return;
  }

  //查询当前用户是否已经注册
  const user = await findUserByName(username);

  //已经注册
  if (user[0]) {
    ctx.body = {
      status: 0,
      message: "您已经注册，无重复注册",
    };

    return;
  }
  // 操作数据数据模型层 model
  const result = await register(
    username,
    cryptoPaddword(password + secret),
    mobile
  );

  ctx.body = {
    status: 200,
    message: "注册成功",
  };
};

//登录
module.exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;

  //查询数据库中 是否有用户信息
  const result = await findUserInfo(
    username,
    cryptoPaddword(password + secret)
  );
  //用户是否存在
  if (result[0]) {
    //根据用户名和密码生成token
    const token = jwt.sign(
      {
        data: {
          username,
          password,
        },
      },
      jwtSecret,
      { expiresIn: 60 * 60 }
    );

    ctx.body = {
      status: 200,
      data: token,
      message: "登录成功",
    };
  } else {
    ctx.body = {
      status: 0,
      message: "登录失败 检查用户名或密码",
    };
  }
};
