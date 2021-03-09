import axios from "axios";
import env from "./config/env";
import { message } from "ant-design-vue";
import { getToken, removeToken } from "./util/token";

//axios 配置
axios.defaults.timeout = env.timeout;
axios.defaults.baseURL = env.baseURL;
axios.defaults.headers = {
  "Content-Type": "application/json;charset=UTF-8",
  Accept: "application/json"
};

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (
      config.url.startsWith("/v1/candidate/") &&
      getToken("x-auth-token-candidate")
    ) {
      config.headers["x-auth-token-candidate"] = getToken(
        "x-auth-token-candidate"
      );
    }
    if (
      config.url.startsWith("/v1/recruiter/") &&
      getToken("x-auth-token-recruiter")
    ) {
      config.headers["x-auth-token-recruiter"] = getToken(
        "x-auth-token-recruiter"
      );
    }
    if (config.url.startsWith("/v1/admin/") && getToken("x-auth-token-admin")) {
      config.headers["x-auth-token-admin"] = getToken("x-auth-token-admin");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data && response.data.code !== "000000") {
      message.error(response.data.message);

      if (
        response.data.code === "010001" &&
        response.data.message === "token认证不通过"
      ) {
        setTimeout(() => {
          removeToken();
          location.reload();
        }, 1000);
      }
    }
    return response;
  },
  error => {
    if (error) {
      message.error("请求异常[" + error + "]");
    }
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);

export default axios;
