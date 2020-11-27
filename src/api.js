import { storage } from '@/utils';
import request from '@/utils/request';

// 微信配置 列表
export function getWxconfig() {
  return request({
    url: '/getWxconfig',
    method: 'get',
  })
}

// code换openId
export function getOpenId (data) {
  return request({
    url: '/wxLogin',
    method: 'post',
    data
  })
}

// 验证登录状态
export function isLogin (data) {
  return request({
    url: '/isExist',
    method: 'post',
    data
  })
}

// login
export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// booking
export function booking (data) {
  return request({
    url: '/reserve',
    method: 'post',
    data
  })
}

// 进场离场时间
export function getTimeRange (query) {
  return request({
    url: '/getTimeRange',
    method: 'get',
    query
  })
}

// 预约列表
export function bookingList (data = {}) {
  data = Object.assign({}, data, { account: storage.get('userInfo') && storage.get('userInfo').account })
  return request({
    url: '/showReserve',
    method: 'post',
    data
  })
}

// 修改预约
export function editBooking (data) {
  data = Object.assign({}, data, { account: storage.get('userInfo') && storage.get('userInfo').account })
  return request({
    url: '/updateReserve',
    method: 'post',
    data
  })
}

// 删除预约
export function delBooking (data) {
  data = Object.assign({}, data, { account: storage.get('userInfo') && storage.get('userInfo').account })
  return request({
    url: '/deleteReserve',
    method: 'post',
    data
  })
}

// 绑定与解绑微信openid
export function bindOrUnbindWx (type, data) {
  return request({
    url: type ? '/unBindWx' : '/bindWx',
    method: 'post',
    data
  })
}

// 获取验证码
export function getMScode (data) {
  return request({
    url: '/getVerificationCode',
    method: 'post',
    data
  })
}

// 找加密码
export function findPWD (data) {
  return request({
    url: '/retrievePassword',
    method: 'post',
    data
  })
}