import axios from "../axios";

export const reg = {
  p: ["post, /login"],
  r: regVo => {
    return axios.post(`/v1/candidate/user/reg`, regVo);
  }
};

export const login = {
  p: ["post, /login"],
  r: loginVo => {
    return axios.post(`/v1/candidate/user/login`, loginVo);
  }
};

export const logout = {
  p: ["post, /logout"],
  r: () => {
    return axios.post(`/v1/candidate/user/logout`);
  }
};

export const info = {
  p: ["get, /user"],
  r: () => {
    return axios.get(`/v1/candidate/user`);
  }
};

export const updateUser = {
  p: ["post, /user"],
  r: updateVo => {
    return axios.put(`/v1/candidate/user`, updateVo);
  }
};
