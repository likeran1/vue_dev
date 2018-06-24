import axios from 'axios'

axios.defaults.baseURL = 'http://leng45.eicp.net:10000';
//axios.defaults.baseURL = 'http://127.0.0.1:10002';
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Methods': 'GET, POST,PUT,DELETE',
  'Access-Control-Allow-Origin': '*'
};

axios.interceptors.response.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axios
