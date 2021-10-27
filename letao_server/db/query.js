var mysql = require("mysql");

const { config } = require("./config");
//配置信息
const dbConfig = config[process.env.DB_ENV];
console.log(process.env.DB_HOST, "DB_host");
//连接数据库的配置信息
var pool = mysql.createPool(dbConfig);
//创建连接  sql:sql语句
module.exports.query = (sql, value) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!  没有连接上

      // Use the connection 使用连接发送sql语句到数据库，数据库中的letao会执行sql语句
      //执行结果 在回调函数中 参数二返回
      connection.query(sql, value, function (error, results, fields) {
        // When done with the connection, release it. 每连接上之后拿到返回的数据的之后，会把当前的连接释放掉
        connection.release();

        // Handle error after the release. 抛出异常
        if (error) throw error;

        resolve(results);
        // Don't use the connection here, it has been returned to the pool.
      });
    });
  });
};
