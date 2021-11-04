<template>
  <div class="login">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { verify } from "~/utils";
import { Toast } from "vant";
import { mapMutations } from "vuex";
const Cookie = require("js-cookie");
export default {
  data() {
    return {
      username: "", //用户名
      password: "" //密码
    };
  },
  methods: {
    ...mapMutations(["updateToken", "updateUserInfo"]),
    //登录按钮
    /**
     * 登录
     * values:提交登录时 所有的表单参数对象
     */
    async onSubmit(values) {
      //1.表单校验
      const msg =
        verify.username(this.username) || verify.password(this.password);
      if (msg) {
        Toast(msg);
        return;
      }
      //2.表单校验通过
      const {
        status,
        data: { token, username, mobile }
      } = await this.$api.Login(values);
      if (status == 200) {
        //存储token到vuex
        this.updateToken(token);
        //存储用户信息到vuex
        this.updateUserInfo({
          username,
          mobile
        });
        //存储token到cookie
        Cookie.set("token", token);
        Cookie.set("userInfo", JSON.stringify({ username, mobile }));
        //到首页
        this.$router.push("/");
      }
    }
  }
};
</script>

<style></style>
