const { default: axios } = require("axios");
const {
  createSign,
  getTrade_no,
  getRandomStr,
  orderHandle,
  queryOrder,
} = require("../utils");
const {
  appid,
  mch_id,
  notify_url,
  orderUrl,
  orderquery,
} = require("../config/wx");
const QRCode = require("qrcode");
const { query } = require("../db/query");

// let nonce_str = getRandomStr();
// let out_trade_no = getTrade_no();
//微信下单
module.exports.order = async (ctx) => {
  //前端调用下单接口时传递的参数
  const { body, total_fee, spbill_create_ip, trade_type } = ctx.request.body;
  //下单的参数
  const params = {
    appid, // 公众账号ID
    mch_id, //商户号
    nonce_str: getRandomStr(), //32位以内的随机字符串
    // sign, //签名
    body, //商品描述
    out_trade_no: getTrade_no(), //商户订单号
    total_fee, //金额
    spbill_create_ip, //终端IP
    notify_url, //微信服务器回调地址
    trade_type, //交易类型
  };
  //生成签名  需要发送的参数生成
  const sign = createSign(params);
  //请求参数 新增sign属性
  //   params.sign = sign;

  //微信下单请求参数
  let sendData = `
            <xml>
                <appid>${appid}</appid>
                <body>${body}</body>
                <mch_id>${mch_id}</mch_id>
                <nonce_str>${params.nonce_str}</nonce_str>
                <notify_url>${notify_url}</notify_url>
                <out_trade_no>${params.out_trade_no}</out_trade_no>
                <spbill_create_ip>${spbill_create_ip}</spbill_create_ip>
                <total_fee>${total_fee}</total_fee>
                <trade_type>${trade_type}</trade_type>
                <sign>${sign}</sign>
            </xml>
   `;

   console.log(1);
  const data = await orderHandle(orderUrl, sendData);

  //下单成功
  const { return_code, return_msg, result_code, code_url } = data;
  if (
    return_code == "SUCCESS" &&
    result_code == "SUCCESS" &&
    return_msg == "OK"
  ) {
   console.log(2);
   //把订单数据写到payorder
    await query(
      `insert into payorder (appid,mch_id,nonce_str,body,out_trade_no,total_fee,spbill_create_ip,trade_type,trade_state)values ("${appid}","${mch_id}","${params.nonce_str}","${body}","${params.out_trade_no}","${total_fee}","${spbill_create_ip}","${trade_type}","NOTPAY")`
    );
   console.log(3);
   data.payUrl = await QRCode.toDataURL(code_url);
   console.log(4);
   //把随机字符串 和商户订单号传给前端
    data.nonce_str = params.nonce_str;
    data.out_trade_no = params.out_trade_no;
  }
  ctx.body = {
    status: 200,
    data,
  };
};

//微信下单通知
module.exports.notify = async (ctx) => {
  //打印微信服务器回调你的接口时的请求报文
  // out_trade_no 商户订单号
  const { out_trade_no } = ctx.request.body.xml;
  //根据商户订单号更新订单状态
  await query(
    `update payorder set trade_state = "SUCCESS" where out_trade_no = "${out_trade_no}" `
  );

  const {
    appid,
    bank_type,
    cash_fee,
    fee_type,
    is_subscribe,
    mch_id,
    nonce_str,
    openid,
    // out_trade_no,
    sign,
    time_end,
    total_fee,
    trade_type,
    transaction_id,
  } = ctx.request.body.xml;

  // 根据商户订单号查询支付订单表是否存在此订单
  const data = await query(`select * from payorder where out_trade_no = ?`, [
    out_trade_no,
  ]);
  if (data.length) return; // 退出程序
  // await query(`insert into playorder (appid, bank_type,cash_fee,fee_type,is_subscribe,mch_id,nonce_str,openid,out_trade_no,sign,time_end,total_fee,trade_type,transaction_id) `)
  const result = await query(
    `insert into payorder(appid, bank_type,cash_fee,fee_type,is_subscribe,mch_id,nonce_str,openid,out_trade_no,sign,time_end,total_fee,trade_type,transaction_id) values('${appid}','${bank_type}','${cash_fee}','${fee_type}','${is_subscribe}','${mch_id}','${nonce_str}','${openid}','${out_trade_no}','${sign}','${time_end}','${total_fee}','${trade_type}','${transaction_id}')`
  );

  // 响应微信服务器接口，订单处理成功，无需重复通知
  ctx.body = `<xml>
    <return_code><![CDATA[SUCCESS]]></return_code>
    <return_msg><![CDATA[OK]]></return_msg>
  </xml>`;
};

// 微信订单查询
module.exports.queryOrder = async (ctx) => {
  const { nonce_str, out_trade_no } = ctx.request.body;
  let params = {
    appid,
    mch_id,
    nonce_str,
    out_trade_no,
    // sign,
  };
  // 生成签名
  let sign = createSign(params);
  let sendData = `
         <xml>
            <appid>${appid}</appid>
            <mch_id>${mch_id}</mch_id>
            <nonce_str>${nonce_str}</nonce_str>
            <out_trade_no>${out_trade_no}</out_trade_no>
            <sign>${sign}</sign>
       </xml>
  `;
  const data = await orderHandle(orderquery, sendData);
  ctx.body = {
    status: 200,
    data,
  };
};
