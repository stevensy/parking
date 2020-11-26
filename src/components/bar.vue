<template>
  <el-row class="footer" type="flex" align="center" justify="space-around">
    <el-col :span="8">
      <p @click="link(0)" :class="{active: $route.name === 'Home'}">
        <i class="el-icon-s-grid"></i>
        <span>管理</span>
      </p>
    </el-col>
    <el-col :span="8">
      <p @click="link(1)" :class="{active: $route.name === 'Order'}">
        <i class="el-icon-circle-plus"></i>
        <span>预约</span>
      </p>
    </el-col>
    <el-col :span="8">
      <p @click="link(2)" :class="{active: $route.name === 'My'}">
        <i class="el-icon-s-custom"></i>
        <span>我的</span>
      </p>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'footBar',
  methods: {
    link(page) {
      const arr = ['/', '/order', '/my'], reg = this.$route.path
      if (reg === arr[page]) return
      this.$router.push({ path: arr[page]})
    }
  }
}
</script>

<style>
.el-footer {
  padding:0 !important;
  background: #fff;
}
.footer {
  align-items: center;
  height: 100%;
  box-shadow: 1px 1px 3px #333;
  color:#666;
}
.footer p.active{
  color: #ff7e00;
}
.footer i, .footer span{
  display: block;
  text-align: center;
}
</style>