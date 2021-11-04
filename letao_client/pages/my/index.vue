<template>
  <div class="my">
    <div class="my_info">
      <h3>会员个人中心</h3>
      <p>
        <span>用户名：</span>
        <span>{{ userInfo.username }}</span>
      </p>
      <p>
        <span>手机号：</span>
        <span>{{ userInfo.mobile }}</span>
      </p>
      <van-button type="info" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
const Cookie = require("js-cookie");

export default {
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["updateToken", "updateUserInfo"]),
    //退出登录
    logout() {
      //清除token
      this.updateToken("");
      this.updateUserInfo("");
      //cookie清除
      Cookie.remove("token");
      Cookie.remove("userInfo");
      //跳转到index
      this.$router.push("/my/login");
    }
  }
};
</script>

<style>
.my_info {
  padding-left: 2rem;
}
</style>
