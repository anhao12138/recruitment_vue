import axios from "../axios";

export const listJob = {
  p: ["get, /v1/job"],
  r: () => {
    return axios.get(`/v1/admin/job`);
  }
};

export const reviewJob = {
  p: ["post, /login"],
  r: reviewJobVo => {
    return axios.post(`/v1/admin/job/${reviewJobVo.jobId}/review?result=${reviewJobVo.result}`);
  }
};
