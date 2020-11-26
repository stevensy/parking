<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { storage } from '@/utils'
export default {
  name: 'app',
  mounted() {
    // storage.clear()
    // let beginTime = 0; //开始时间
    // let differTime = 0; //时间差
    // window.onunload = function() {
    //   differTime = new Date().getTime() - beginTime;
    //   if (differTime <= 5) {
    //     storage.clear()
    //     console.log("这是关闭");
    //   } else {
    //     console.log("这是刷新");
    //   }
    // };

    // window.onbeforeunload = function() {
    //   beginTime = new Date().getTime();
    // };
     
    // 获取浏览器信息ua
    // let u = navigator.userAgent, isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // if (isAndroid) {
    //   window.onunload = function () {
    //     console.log('页面要关闭了:onunload');
    //   }
      // window.addEventListener('unload', function(e) {
      //   differTime = new Date().getTime() - beginTime;
      //   if (differTime <= 5) {
      //     storage.clear()
      //     console.log("这是关闭");
      //   }
      // }, false);
    // }
    // console.log(isAndroid, isiOS)
    // if (isiOS) {
    //   // 处理事件
    //    console.log("888");
    //   window.addEventListener('pagehide', function(e) {
    //      console.log("7890");
 
    //     differTime = new Date().getTime() - beginTime;
    //     if (differTime <= 5) {
    //       storage.clear()
    //       console.log("这是关闭");
    //     }
    //   }, false);
    // }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-message {
  min-width: 90% !important;
}
.el-message-box {
  width: 90%;
}
.container {
  height: 100vh;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus{
  border-color: #ff7e00;
}
.el-tabs__item.is-active,.el-tabs__item:hover {
  color: #ff7e00;
}
.el-tabs__item {
  color:#666;
}
.el-tabs__active-bar {
  background:#ff7e00
}
.el-button--primary, .el-button--primary:focus, .el-button--primary:hover{
  background:#ff7e00;
  border-color: #ff7e00;
}
.loginBtn, .serchBtn, .el-button.serchBtn:hover, .el-button.serchBtn:focus{
  width: 100%; background:#ff7e00;border: none; color:#fff
}
.changeBtn {
  background:#ff7e00;border: none
}
</style>
