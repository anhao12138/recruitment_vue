import axios from '../axios';

export const listJob = {
    p: ['get, /v1/job'],
    r: () => {
        return axios.get(`/v1/candidate/job`);
    }
};
export const listRecommendJob = {
    p: ['get, /v1/job/recommend'],
    r: () => {
        return axios.get(`/v1/candidate/job/recommend`);
    }
};

export const applyJob = {
    p: ['post, /login'],
    r: applyJobVo => {
        return axios.post(`/v1/candidate/job/apply`, applyJobVo);
    }
};

export const getApplyResult = {
    p: ['get, /login'],
    r: jobQuery => {
        return axios.get(`/v1/candidate/job/apply/result?jobId=${jobQuery.jobId}`);
    }
};
