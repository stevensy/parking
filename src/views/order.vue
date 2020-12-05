<template>
<el-container class="container">
  <el-main class="main">
    <el-form class="orderform" ref="orderForm" :model="orderForm" :rules="rules" label-width="80px">
      <el-form-item label="进场时间" prop="entryTime">
        <el-input id="trigger" size="mini" readonly v-model.trim="orderForm.entryTime" placeholder="请选择进场时间"></el-input>
      </el-form-item>
      <el-form-item label="离场时间" prop="leaveTime">
        <el-input id="trigger1" size="mini" readonly v-model.trim="orderForm.leaveTime" placeholder="请选择离场时间"></el-input> 
      </el-form-item>
      <el-form-item v-for="(item, index) in orderForm.licenses" :key="'item'+index" :label="index ? '' : '车牌'" :prop="'licenses.' + index + '.license'" :rules="{required: true, message: '请输入车牌', trigger: 'change'}">
        <el-input size="mini" readonly @click.native="chooseCar(index)" v-model="item.license" placeholder="请输入车牌">
          <i v-if="index" slot="suffix"  class="el-icon-remove-outline" @click.prevent.stop="minusCar(index)"></i>
          <i v-else slot="suffix" class="el-icon-circle-plus-outline" @click.prevent.stop="addCar"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="访客姓名" prop="linkman">
        <el-input size="mini" v-model.trim="orderForm.linkman" placeholder="请输入访客姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="linkmanPhone">
        <el-input size="mini" maxlength="11" v-model.trim="orderForm.linkmanPhone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button class="loginBtn" :loading="loading" type="primary" size="medium" @click="submit">预约</el-button>
      </el-form-item>
    </el-form>
    <car-plate v-model="orderForm.carNo" @getPlateNum="getNum" @update:showLayer="handleLayer" @update:showCarPlate="handleCar" :showCarPlate="showCarPlate" :showLayer="showLayer"/>
  </el-main>
  <el-footer>
    <Bar />
  </el-footer>
</el-container>
</template>

<script>
import Bar from '../components/bar.vue'
import MobileSelect from 'mobile-select'
import carPlate from "../components/carPlate"
import { limitStr } from "@/utils/index"
import { storage } from '@/utils'
import { getTimeRange, booking } from "@/api"
export default {
  components: { Bar, carPlate },
  data() {
    return {
      orderForm: {
        entryTime: undefined,
        leaveTime: undefined,
        licenses: [{ license: '' }],
        linkman: undefined,
        linkmanPhone: undefined,
        username: storage.get('userInfo') && storage.get('userInfo').username,
        account: storage.get('userInfo') && storage.get('userInfo').account
      },
      rules: {
        entryTime: [{ required: true, message: '请选择进场时间', trigger: 'change' }],
        leaveTime: [{ required: true, message: '请选择出场时间', trigger: 'change' }],
        // linkman: [
        //   { required: true, message: '请输入联系人', trigger: 'blur' },
        //   { pattern: /^[\u4E00-\u9FA5a-zA-Z]+$/, message: '请输入正确联系人' }
        // ],
        // linkmanPhone: [
        //   { required: true, message: '请输入电话', trigger: 'blur' }, 
        //   { pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '请输入正确手机号', trigger: 'blur' }
        // ]
      },
      loading: false,
      showCarPlate: false,
      showLayer: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getTimeRange().then(res => {
        let _this = this
        // 设置默认值
        this.orderForm.entryTime = new Date().getFullYear() + '-' + res.wheels[0].data[1].split(' ')[0].replace(/月/, '-').replace(/日/, ' ') + res.wheels[1].data[0]
        this.orderForm.leaveTime = new Date().getFullYear() + '-' + res.wheels[0].data[1].split(' ')[0].replace(/月/, '-').replace(/日/, ' ') + res.wheels[1].data[res.wheels[1].data.length - 1]
        var mobileSelect = new MobileSelect({
          trigger: '#trigger',
          title: '选择进场时间',
          wheels: res.wheels,
          position:[1,2],
          callback:function(indexArr, data){
            console.log(data); //返回选中的json数据
            let newData = data[0].split(' ')[0]
            _this.orderForm.entryTime = new Date().getFullYear() + '-' + newData.replace(/月/, '-').replace(/日/, ' ') + data[1]
          }
        });
        var mobileSelect1 = new MobileSelect({
          trigger: '#trigger1',
          title: '选择离场时间',
          wheels: res.wheels,
          position:[1,18],
          callback:function(indexArr, data){
            console.log(data); //返回选中的json数据
            let newData = data[0].split(' ')[0]
            _this.orderForm.leaveTime = new Date().getFullYear() + '-' + newData.replace(/月/, '-').replace(/日/, ' ') + data[1]
          }
        });
      })
    },
    chooseCar(index) {
      this.index = index
      this.showCarPlate = true
      this.showLayer = true
    },
    handleLayer(v) {
      this.showLayer = v
    },
    handleCar(v) {
      this.showCarPlate = v
    },
    getNum(v) {
      this.orderForm.licenses[this.index].license = v
    },
    addCar() {
      this.orderForm.licenses.push({ license: '' })
    },
    minusCar(index) {
      this.orderForm.licenses.splice(index, 1)
    },
    submit() {
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          // 较验时间
          let { username, account, linkman, linkmanPhone, entryTime, leaveTime } = this.orderForm
          if (new Date(entryTime).getTime() >= new Date(leaveTime).getTime()) {
            this.$message.error('离场时间不能小于进场时间!')
            return false
          }
          let licenses = this.orderForm.licenses.map(item => {
            item.linkman = linkman,
            item.linkmanPhone = linkmanPhone,
            item.entryTime = entryTime,
            item.leaveTime = leaveTime
            return item
          })
          let params = Object.assign({}, { licenses }, { username, account })
          this.loading = true
          this.$confirm('您确定需要预约吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            booking(params).then(res => {
              this.loading = false
              if (res.status) {
                this.$router.push({path: '/'})
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg || '出错了'
                })
              }
            }).catch(err => {
              this.loading = false
            })
          }, err => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
  padding:0
}
.orderform {
  padding:5em 1em 0;
}
</style>