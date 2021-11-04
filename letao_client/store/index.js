//公共仓库
// export const state = () => {
//   return {
//     //令牌
//     token: "",
//     userInfo: ""
//   };
// };
export const state = () => ({
  token: "",
  userInfo: ""
});

//调用同步方法
export const mutations = {
  //修改用户信息数据
  updateUserInfo(state, payload) {
    //修改用户信息
    state.userInfo = payload;
  },
  //修改token
  updateToken(state, payload) {
    state.token = payload;
    console.log(state);
  }
};
//调用异步方法

export const actions = {
  //只在服务端执行一次 路由切换不会执行
  nuxtServerInit({ commit }, { req }) {
    console.log(11);
    //定义token
    let token = "";
    let userInfo = {};
    //是否存在cookie
    if (req.headers.cookie) {
      //设置token
      let parse = require("cookieparser").parse(req.headers.cookie);
      console.log(token, userInfo);
      token = parse.token;
      userInfo = JSON.parse(parse.userInfo);
    }
    //修改token
    console.log(" :>> ");
    commit("updateToken", token);
    commit("updateUserInfo", userInfo);
  }
};
