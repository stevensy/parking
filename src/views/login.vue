<template>
<div>
  <div class="wxinfo" v-if="headimgurl && type">
    <img :src="headimgurl" alt="">
    <p class="nick">{{ nickname }}</p>
  </div>
  <el-form class="form" :class="{'pd10': !headimgurl}" ref="form" :model="form" :rules="rules">
    <el-form-item prop="account">
      <el-input size="medium" clearable maxlength="11" v-model.trim="form.account" placeholder="请输入账号">
        <i slot="prefix" class="el-icon-mobile-phone"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="medium" v-model.trim="form.password" show-password placeholder="请输入密码">
        <i slot="prefix" class="el-icon-lock"></i>
      </el-input>
    </el-form-item>
     <!-- <el-form-item style="text-align: left">
      <el-checkbox v-model="checked">记住账号密码</el-checkbox>
     </el-form-item> -->
    <el-form-item>
      <el-button :loading="loading" class="loginBtn" type="primary" size="medium" @click="toLogin">登录</el-button>
    </el-form-item>
  </el-form>
  <div class="getpwd">
    <router-link class="btn" to="/getpwd">忘记密码</router-link>
  </div>
</div>

</template>

<script>
import { storage, getQuery, setCookie } from '@/utils'
import { login } from '@/api'
import md5 from 'js-md5';
export default {
  data() {
    return {
      loading: false,
      checked: true,
      headimgurl: storage.get('userInfo') && storage.get('userInfo').headimgurl || undefined,
      nickname: storage.get('userInfo') && storage.get('userInfo').nickname || undefined,
      sex: storage.get('userInfo') && storage.get('userInfo').sex || undefined,
      type: getQuery('type').type || 0,
      openid: getQuery('openid').openid,
      form: {
        account: undefined, // 15021778520
        password: undefined
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          // { pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '此账号为手机号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    toLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          let { account, password } = this.form
          setCookie('isRemember', this.checked ? 1 : 0)
          login({ bind: this.type, account, password: md5(password), loginType: /^1[3|4|5|8][0-9]\d{4,8}$/.test(account) ? 'phone' : 'account', openid: this.openid, headimgurl: this.headimgurl, nickname: this.nickname, gender: this.sex && (this.sex + '') || undefined}).then(res => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: '登录成功！',
                duration: 1500
              })
              setTimeout(_ => {
                this.loading = false
                let { account, phone, openid, headimgurl, username, nickname, gender: sex, position } = res.data
                openid ? storage.set('openid', openid) : storage.set('auth', 'h5')
                storage.set('userInfo', { account, phone, headimgurl, username, nickname, sex, position })
                this.$router.push(res.isReserve ? '/' : '/order')
              }, 2000)
              
            } else {
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1500
              })
              this.loading = false
            }
          }).catch(err => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.wxinfo {
  padding: 3em 0 0;
}
.form{
  padding:5em 1em 0;
}
.form.pd10 {
  padding-top: 10em;
}
.getpwd {
  font-size: 14px;
  display: block;
  text-align:right;
  padding-right: 1em;
}
.getpwd .btn {
  color:#666;
}
</style>