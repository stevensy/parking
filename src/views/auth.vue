<template>
  <div class="auth">
    <p>为了给你提供服务</p>
    <p>请允许获得你的公开信息(昵称、头像等)</p>
    <el-button :loading="loading" class="btn" type="primary" @click="wxAuth">微信授权登录</el-button>
    <el-button class="btn auth-btn" type="primary" :disabled="code!=null" @click="toLogin">暂不微信授权登录</el-button>
  </div>
</template>
<script>
import { storage, getQuery, delCookie } from '@/utils'
import { getWxconfig, getOpenId } from '@/api'
export default {
  data() {
    return {
      loading: false,
      code: getQuery('code').code,
      appId: undefined,
      backUrl: undefined, //b6348241a16e.ngrok.io
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      delCookie('isRemember');
      // 获取appId
      getWxconfig().then(res => {
        if (res.status) {
          this.appId = res.data.length && res.data[0].appId
          storage.set('appid', this.appId)
        }
      })
      this.backUrl = this.$router.mode === 'hash' ? 'http://m.hejnet.cn/#/Auth' : 'http://m.hejnet.cn/Auth'
      if(this.code) {
        this.loading = true
        getOpenId({ code: this.code }).then(res => {
          this.loading = false
          if (res.status === -1) {
            this.wxAuth()
          } else if (res.status === 0) {
            // 没有绑定过的
            this.$confirm('是否需要绑定?', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(data => {
              let { openid, account, phone, headimgurl, nickname, sex, position } = res.data
              storage.set('userInfo', { account, phone, headimgurl, nickname, sex: sex+'', position })
              location.href=`${location.origin}${this.$router.mode === 'hash' ? '/#' : ''}/login?type=1&openid=${openid}`
              // this.$router.push({ path: '/login', query: { type: 1, openid } })
            }, err => {
              location.href=`${location.origin}${this.$router.mode === 'hash' ? '/#' : ''}/login?type=0`
              // this.$router.push({ path: '/login', query: { type: 0 } }) 
            })
          } else {
            // 已绑过的
            let { openid, account, phone, headimgurl, username, nickname, gender: sex, position } = res.data
            openid && storage.set('openid', openid)
            storage.set('userInfo', { account, phone, headimgurl, username, nickname, sex, position })
            this.$router.push(res.isReserve ? '/' : '/order')
          }
        })
      }
    },
    wxAuth() {
      this.loading = true
      window.location.assign(`https://open.weixin.qq.com/connect/oauth2/authorize?appId=${ this.appId }&redirect_uri=${ encodeURIComponent(this.backUrl) }&response_type=code&scope=snsapi_userinfo&state=0&connect_redirect=1#wechat_redirect`)
    },
    toLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style>
.auth {
  background: #eee;
  height: 100vh;
  padding: 10em 2em 0;
  box-sizing: border-box;
}
.auth p {
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}
.auth p:last-of-type {
  margin-bottom: 1em;
}
.auth .btn{
  width: 100%;
  margin-bottom: 1em;
  color: #fff;
  background: #ff7e00;
  border-radius: 4px;
  margin-left: 0;
  border: none;

}
.auth .btn.auth-btn{
  background: #29b7b7;
}
.el-message-box {
  max-width: 80% !important;
  top: 2em;
}
</style>