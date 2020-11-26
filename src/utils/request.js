import axios from 'axios';
import { Message } from 'element-ui';

import { storage } from '@/utils';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_APIURL,
  // 超时
  timeout: 50000
})
// request拦截器
service.interceptors.request.use(
  config => {
    // if (getToken()) {
    //   config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // // 全局添加时间戳以防有缓存
    // if (config.method == 'post') {
    //   config.url += `?_t=${Date.parse(new Date()) / 1000}`
    // } else {
    //   config.params = {
    //     ...config.params,
    //     _t: Date.parse(new Date()) / 1000
    //   }
    // }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
    if (res.errors && Object.keys(res.errors).length) {
      Message({
        message: error.message || error.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return res.data
    } else {
      if (res.data.status === -1) {
        Message({
          message: res.data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        storage.clear()
      } else {
        return res.data
      }
    }
  },
  error => {
    Message({
      message: error.message || error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
