import axios from "../axios";

export const listMyJob = {
  p: ["get, /v1/job/my"],
  r: () => {
    return axios.get(`/v1/recruiter/job/own`);
  }
};

export const postJob = {
  p: ["post, /login"],
  r: newJobVo => {
    return axios.post(`/v1/recruiter/job`, newJobVo);
  }
};
export const updateJob = {
  p: ["post, /login"],
  r: updateJobVo => {
    return axios.post(`/v1/recruiter/job/${updateJobVo.jobId}`, updateJobVo);
  }
};
export const delJob = {
  p: ["post, /login"],
  r: jobId => {
    return axios.delete(`/v1/recruiter/job/${jobId}`);
  }
};

export const getApplyHistory = {
  p: ["get, /login"],
  r: jobQuery => {
    return axios.get(`/v1/recruiter/job/apply/history?jobId=${jobQuery.jobId}`);
  }
};

export const reviewJobApply = {
  p: ["post, /login"],
  r: reviewJobApplyVo => {
    return axios.post(`/v1/recruiter/job/review`, reviewJobApplyVo);
  }
};
