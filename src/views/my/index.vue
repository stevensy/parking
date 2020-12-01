<template>
  <el-container class="container">
    <el-header class="header">
      <el-avatar class="avatar" shape="circle" size="medium" :src="userInfo && userInfo.headimgurl" @error="errorHandler">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANEAAADeCAYAAACjbOU6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF92lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTEtMTdUMTU6Mjc6MDgrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTExLTE3VDE1OjMwOjUyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTExLTE3VDE1OjMwOjUyKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmJiMDQ0ZmFjLTg4MDktNDZmYS05NzVlLWZkYTdlYzVlODBmNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmNmNjc5NDZhLTA0NWItZWY0Zi1hNGIzLWVmNDVlMWQ2MGYzMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjRhYWQ4M2M2LTRjYTMtNDRhNy04OTYxLTE1ZTlkMWQ0MTI5NiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NGFhZDgzYzYtNGNhMy00NGE3LTg5NjEtMTVlOWQxZDQxMjk2IiBzdEV2dDp3aGVuPSIyMDIwLTExLTE3VDE1OjI3OjA4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YmIwNDRmYWMtODgwOS00NmZhLTk3NWUtZmRhN2VjNWU4MGY0IiBzdEV2dDp3aGVuPSIyMDIwLTExLTE3VDE1OjMwOjUyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y8hntAAAojUlEQVR4nO2de3wT15n3f2fku3wjxpahcSAWiASCbExCg0mAFmxoA2wTkm2yBbopTQNJ3zTltt1NGy7pNl1ueZu8haQkmy3QBrIQUggtN2/Bu5iUxAabwBtE5JgYsARRMLZsGdmas39IMrKty4w0V2m+n48/YGlmzmNpfnOe85znOYdQSqEhD/bmi3fYLjWNtjdfvNve3DQGAJxtrfnWs/WTw51XMnHKbv//zeVTdvleOyCutRqhIJqIxMfZ1ppmPVs/taHm2KPWs/UP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"/>
      </el-avatar>
      <div class="userInfo">
        <p class="account">{{ userInfo && userInfo.username }}</p>
        <p class="nickname">手机: {{ userInfo && userInfo.phone }}</p>
        <p class="nickname">职位: {{ userInfo && userInfo.position || '--' }}</p>
      </div>
    </el-header>
    <el-main>
      <ul class="lists">
        <li @click="changeState">
          <p><i class="icon el-icon-chat-dot-round"></i> {{ openid ? '解绑微信' : '绑定微信' }}</p>
          <i class="el-icon-arrow-right"></i>
        </li>
        <li @click="toChangePwd">
          <p><i class="icon el-icon-unlock"></i>修改密码</p>
          <i class="el-icon-arrow-right"></i>
        </li>
        <li @click="logout">
          <p><i class="icon el-icon-switch-button"></i>退出</p>
          <i class="el-icon-arrow-right"></i>
        </li>
      </ul>
    </el-main>
    <el-footer>
      <Bar />
    </el-footer>
  </el-container>
</template>
<script>
import Bar from '../../components/bar.vue'
import { storage, getQuery } from '../../utils/index'
import { getOpenId, bindOrUnbindWx } from '@/api/'
export default {
  components: { Bar },
  data() {
    return {
      userInfo:  storage.get('userInfo'),
      openid: storage.get('openid'),
      code: getQuery('code').code,
      appid: storage.get('appid'),
      backUrl: undefined,
      state: false
    }
  },
  watch: {
    code: {
     handler(v) {
      this.init()
     },
     immediate: true
    },
    openid(v) {
      this.avatar = v ?  storage.get('userInfo') && storage.get('userInfo').headimgurl : undefined
    }
  },
  methods: {
    init() {
      this.backUrl = this.$router.mode === 'hash' ? `${location.origin}/#/my` : `${location.origin}/my`
      if (this.code && !this.openid && !this.avatar) {
        getOpenId({ code: this.code }).then(res => {
          if (res.status === 0) {
            let { account, openid, headimgurl, nickname, sex } = res.data
            storage.set('userInfo', { headimgurl, nickname, sex })
            storage.set('openid', openid)
            this.openid = openid
            bindOrUnbindWx(0, { account, openid, headimgurl, nickname, gender: sex + '' }).then(res => {
              if (res.status) {
                this.$message({
                  type: 'success',
                  message: '操作成功！',
                  duration: 1500
                })
              }
            })
          }
        })
      }
    },
    errorHandler() {
      return true
    },
    toChangePwd() {
      this.$router.push({path: '/getpwd'})
    },
    changeState() {
      if (this.state) {
        return false
      }
      this.state = true
      let params = { account: this.account }
      if (this.openid) {
        bindOrUnbindWx(1, params).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.state = false
            storage.remove('openid')
            storage.remove('userInfo')
            this.openid = undefined
          }
        })
      } else {
        window.location.assign(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ this.appid }&redirect_uri=${ encodeURIComponent(this.backUrl) }&response_type=code&scope=snsapi_userinfo&state=0&connect_redirect=1#wechat_redirect`)
      }
    },
    logout() {
      storage.clear()
      this.$router.push({path: '/login'})
    }
  }
}
</script>
<style scoped>
.container {
  text-align:left;
}
.container .header {
  padding: 4.8em 2em;
  background: url('../../assets/head.png') left top/100% auto no-repeat;
  display: flex;
  align-items: center;
}
.container .header .avatar {
  margin-right: 1em;
  width: 60px;
  height: 60px;
}
.container .header .userInfo {
  line-height: 1;
  color:#fff;
}
.container .header .userInfo .account {
  font-size: 1.2em;
  font-weight: bold;
}
.container .header .nickname {
  font-size: 12px;
  margin-top: 5px;
  color:#fff;
}
.container .lists {
  list-style: none;
}
.container .lists li {
  padding: 1em;
  font-size: 14px;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container .lists li .icon {
  margin-right: 5px;
}
</style>
<style>
.el-avatar {
  background: none;
}
</style>