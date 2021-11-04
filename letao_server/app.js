const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const jwt = require("koa-jwt");
const { jwtSecret } = require("./config");
const xmlParser = require('koa-xml-body')
const cors = require('koa-cors')



const { getRandomStr } = require("./utils");
//启动dotenv
require("dotenv").config();

app.use(xmlParser())
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
app.use(function (ctx, next) {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = "Protected resource, use Authorization header to get access\n";
    } else {
      throw err;
    }
  });
});
app.use(
  jwt({ secret: jwtSecret }).unless({
    path: [/^\/public/, /^\/users\/login/, /^\/users\/register/],
  })
);
// middlewares 中间件
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(cors());
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
