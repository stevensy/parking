<template>
  <el-form class="form" ref="form" :model="form" :rules="rules">
    <el-form-item prop="phone">
      <el-input size="medium" clearable v-model="form.phone" maxlength="11" placeholder="请输入手机号">
        <i slot="prefix" class="el-icon-mobile-phone"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="verificationCode">
      <el-input size="medium" type="text" maxlength="5" v-model="form.verificationCode" placeholder="请输入验证码">
        <i slot="prefix" class="el-icon-lock"></i>
        <span v-if="show" slot="suffix" class="getsms" @click="getCode">获取验证码</span>
        <span v-else slot="suffix" class="getsms">{{ count }}s</span>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="medium" v-model="form.password" maxlength="10" show-password placeholder="请输入新密码">
        <i slot="prefix" class="el-icon-lock"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button  class="loginBtn" :loading="loading" type="primary" size="medium" @click="change">确认修改密码</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { storage } from '@/utils'
import { getMScode, findPWD } from '@/api'
import md5 from 'js-md5';
export default {
  data() {
    return {
      form: {
        account: storage.get('userInfo') && storage.get('userInfo').account || undefined,
        phone: storage.get('userInfo') && storage.get('userInfo').phone || undefined,
        verificationCode: undefined,
        password: undefined
      },
      loading: false,
      show: true,
      count: undefined,
      timer: null,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '请输入正确手机号', trigger: 'blur' }
        ],
        verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getCode() {
      let { phone } = this.form
      if (!phone) {
        this.$refs.form.validateField('phone')
        return false
      }
      getMScode({ phone }).then(res => {
        if (res.status) {
          this.$message.success('发送成功')
          const TIME_COUNT = 59;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
            if (this.count > 1 && this.count <= TIME_COUNT) {
              this.count--;
              } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              }
            }, 1000)
          }
        }
      })
    },
    change() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          let { account, phone, verificationCode, password } = this.form
          findPWD({ account, phone, verificationCode, password: md5(password) }).then(res => {
            this.loading = false
            if (res.status) {
              this.$message({
                type: 'success',
                message: '密码修改成功',
                duration: 1500
              })
              setTimeout(() => {
                this.$router.push({ path: '/login'})
              }, 1500)
            } else {
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1500
              })
            }
          })
          
        }
      })
    }
  }
}
</script>
<style scoped>
.form{
  padding:10em 1em 0;
}
.form .getsms {
  font-size: 14px;
  color: #fff;
  background: #ff7e00;
  padding: 2px 7px;
}
</style>