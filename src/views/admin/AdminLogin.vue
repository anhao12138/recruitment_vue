<template>
  <div class="login-wrapper">
    <div style="background-color: #fff;width: 100%;text-align: center;">
      <h1 style="margin-top: 0.5em;">管理员登录</h1>
      <a-form id="components-form-demo-normal-login" :form="loginForm" class="login-form" @submit="handleLogin">
        <a-form-item>
          <a-input
            v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your username!' }] }
        ]"
            placeholder="Username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] }
        ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import * as userApi from "../../api/adminUser";
import { setToken } from "../../util/token";
import { setItem } from "../../util/cookie";
import { md5 } from "../../util/hashUtil";
import Bus from "../../bus";

export default {
  beforeCreate() {
    this.loginForm = this.$form.createForm(this);
    this.regForm = this.$form.createForm(this);
  },
  methods: {
    handleLogin(e) {
      e.preventDefault();
      this.loginForm.validateFields((err, values) => {
        if (!err) {
          let loginVo = {
            username: values.username,
            password: md5(values.password)
          };
          console.info(values.username)
          userApi.login.r(loginVo).then(resp => {
            if (resp.data.code === "000000") {
              setToken("x-auth-token-admin", resp.data.data.token);
              setItem("admin-username", resp.data.data.username);
              Bus.$emit("adminUsername", resp.data.data.username);

              this.$router.replace({
                name: "adminJob"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.login-wrapper {
  min-height: 80vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.login-form {
  width: 260px;
  margin: 0 auto;
}
.login-form-button {
  width: 100%;
}
</style>