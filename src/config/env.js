const ENV = process.env.NODE_ENV;

const env = {
  // 开发环境
  development: {
    baseURL: '/recruitment',
    timeout: 8000,
    dev: true
  },
  // 生产环境
  production: {
    baseURL: '/recruitment',
    timeout: 8000
  }
};

export default env[ENV];