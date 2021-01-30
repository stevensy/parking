<template>
  <el-form class="form" ref="form" :model="form" :rules="rules">
    <el-form-item prop="account">
      <el-input size="medium" clearable v-model="form.account" disabled maxlength="50" placeholder="请输入账号" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="medium" type="password" maxlength="50" show-password v-model="form.password" placeholder="请输入原密码">
        <i slot="prefix" class="el-icon-lock"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="newPassword">
      <el-input size="medium" v-model="form.newPassword" maxlength="10" show-password placeholder="请输入新密码">
        <i slot="prefix" class="el-icon-lock"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="comfirmPassword">
      <el-input size="medium" v-model="form.comfirmPassword" maxlength="10" show-password placeholder="确认新密码">
        <i slot="prefix" class="el-icon-lock"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-row :gutter="20" type="flex" align="center">
        <el-col :span="12">
          <el-button class="loginBtn" :loading="loading" type="primary" size="medium" @click="change">确认修改密码</el-button>
        </el-col>
        <el-col :span="12">
          <el-button class="loginBtn auth-btn" :loading="loading" type="test" size="medium" @click="back">取消</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>
<script>
import { storage } from '@/utils'
import { updatePWD } from '@/api'
import md5 from 'js-md5';
export default {
  data() {
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请确认新密码'))
      } else {
        if (value === this.form.password) {
          callback()
        } else {
          callback(new Error('密码输入不一致，请重新输入密码'))
        }
      }
    }
    return {
      form: {
        account: storage.get('userInfo') && storage.get('userInfo').account || undefined,
        password: undefined,
        newPassword: undefined,
        comfirmPassword: undefined
      },
      loading: false,
      show: true,
      count: undefined,
      timer: null,
      rules: {
        password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        comfirmPassword: [{ required: true, validator: checkPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    change() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          let { account, password, newPassword } = this.form
          updatePWD({ account, password: md5(password), newPassword: md5(newPassword) }).then(res => {
            this.loading = false
            if (res.status) {
              this.$message({
                type: 'success',
                message: '密码修改成功,请重新登录！',
                duration: 1500
              })
              storage.clear()
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
          }).catch(e => {
            this.loading = false
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
.loginBtn.auth-btn{
  background: #29b7b7;
}
</style>