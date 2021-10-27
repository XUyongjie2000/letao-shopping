const Koa = require("koa"); //koa包
const app = new Koa();  //创建app服务
const views = require("koa-views"); // 处理静态资源
const json = require("koa-json"); // json格式化
const onerror = require("koa-onerror");//处理异常
const bodyparser = require("koa-bodyparser");//解析post请求
const logger = require("koa-logger");//记录日志
const jwt = require("koa-jwt");
const { jwtSecret } = require("./config");
const xmlParser = require("koa-xml-body");
// const { getRandomStr } = require("./utils");
// console.log(getRandomStr().length);
//启动dotenv
require("dotenv").config();
app.use(xmlParser());
//加载路由
const index = require("./routes/index");
const users = require("./routes/users");
const category = require("./routes/category");
const sms = require("./routes/sms");
const order = require("./routes/order");
// error handler 错误处理
onerror(app);

//使用koa-jwt中间件  来判断 拦截客户端在调用服务端接口的时候
//如果请求途中没有设置token  直接返回401
// app.use(function (ctx, next) {
//   return next().catch((err) => {
//     if (401 == err.status) {
//       ctx.status = 401;
//       ctx.body = "Protected resource, use Authorization header to get access\n";
//     } else {
//       throw err;
//     }
//   });
// });
// app.use(
//   jwt({ secret: jwtSecret }).unless({
//     path: [/^\/public/, /^\/users\/login/, /^\/users\/register/],
//   })
// );
// middlewares 中间件
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(category.routes(), users.allowedMethods());
app.use(sms.routes(), sms.allowedMethods());
app.use(order.routes(), order.allowedMethods());
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
