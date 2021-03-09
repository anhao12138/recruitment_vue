<template>
  <div class="login-wrapper">
    <div v-if="isLogin" style="background-color: #fff;width: 100%;text-align: center;">
      <h1 style="margin-top: 0.5em;">应聘者登录</h1>
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
        <a @click="isLogin=false">立即注册</a>
      </a-form>
    </div>

    <div v-if="!isLogin" style="background-color: #fff;width: 100%;text-align: center;">
      <h1 style="margin-top: 0.5em;">应聘者注册</h1>
      <a-form id="components-form-demo-normal-login" :form="regForm" class="login-form" @submit="handleReg">
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
          <a-input
            v-decorator="[
          'phone',
          { rules: [{ required: true, message: 'Please input your Phone!' }] }
        ]"
            type="phone"
            placeholder="phone"
          >
            <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">立即注册</a-button>
        </a-form-item>
        <a @click="isLogin=true">立即登录</a>
      </a-form>
    </div>
  </div>
</template>

<script>
import * as userApi from "../../api/candidateUser";
import { setToken } from "../../util/token";
import { setItem } from "../../util/cookie";
import { md5 } from "../../util/hashUtil";
import Bus from "../../bus";

export default {
  data() {
    return {
      isLogin: true
    };
  },
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
          userApi.login.r(loginVo).then(resp => {
            if (resp.data.code === "000000") {
              setToken("x-auth-token-candidate", resp.data.data.token);
              setItem("candidate-username", resp.data.data.username);
              setItem(
                "candidate-" + resp.data.data.username + "-fitstLogin",
                resp.data.data.firstLogin
              );
              Bus.$emit("candidateUsername", resp.data.data.username);

              this.$router.replace({
                name: "candidateJob"
              });
            }
          });
        }
      });
    },
    handleReg(e) {
      e.preventDefault();
      this.regForm.validateFields((err, values) => {
        if (!err) {
          let regVo = {
            username: values.username,
            password: md5(values.password),
            phone: values.phone,
            userType: "APPLICANT"
          };
          userApi.reg.r(regVo).then(resp => {
            if (resp.data.code === "000000") {
              this.$message.info("用户注册成功!");
              this.isLogin = true;
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