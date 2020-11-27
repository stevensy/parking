<template>
  <el-container class="container">
    <el-main class="main" style="padding: 0">
      <el-tabs v-model="activeName">
        <el-tab-pane label="预约" name="first">
          <Car v-if="activeName==='first'" :lists="all" @change="edit" @delete="del" @search="handSearch" status="0" @loadmore="loadmore" />
        </el-tab-pane>
        <el-tab-pane label="入场" name="second">
          <Car v-if="activeName==='second'" :lists="todo" @change="edit" @delete="del" @search="handSearch" status="1" @loadmore="loadmore" />
        </el-tab-pane>
        <el-tab-pane label="历史" name="third">
          <Car v-if="activeName==='third'" :lists="complete" @change="edit" @delete="del" @search="handSearch" status="-1" @loadmore="loadmore" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer>
      <Bar />
    </el-footer>
    <el-dialog
      title="修改"
      :visible.sync="editDialog"
      :modal-append-to-body="false"
      width="90%"
      >
      <el-form class="orderform" ref="orderForm" :model="orderForm" :rules="rules" label-width="80px">
        <el-form-item label="进场时间" prop="entryTime">
          <el-input id="trigger" size="mini" readonly v-model.trim="orderForm.entryTime" placeholder="请选择进场时间"></el-input>
        </el-form-item>
        <el-form-item label="离场时间" prop="leaveTime">
          <el-input id="trigger1" size="mini" readonly v-model.trim="orderForm.leaveTime" placeholder="请选择离场时间"></el-input> 
        </el-form-item>
        <el-form-item label="车牌" prop="license">
          <el-input size="mini" readonly @click.native="chooseCar" v-model="orderForm.license" placeholder="请输入车牌" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input size="mini" v-model.trim="orderForm.linkman" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="linkmanPhone">
          <el-input size="mini" maxlength="11" v-model.trim="orderForm.linkmanPhone" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeOrder">确 定</el-button>
      </span>
    </el-dialog>
    <car-plate @getPlateNum="getNum" @update:showLayer="handleLayer" @update:showCarPlate="handleCar" :showCarPlate="showCarPlate" :showLayer="showLayer"/>
  </el-container>
</template>

<script>
import Bar from '../components/bar.vue'
import Car from '../components/orderCar'
import MobileSelect from 'mobile-select'
import carPlate from "../components/carPlate"
import { storage } from '@/utils'
import { limitStr } from "@/utils/index"
import { bookingList, editBooking, delBooking, getTimeRange } from "@/api/"
export default {
  components: { Bar, Car, carPlate },
  data() {
    return {
      activeName: 'first',
      all: [],
      todo: [],
      complete: [],
      lose: [],
      editDialog: false,
      orderForm: {
        entryTime: undefined,
        leaveTime: undefined,
        licenses:[],
        linkman: undefined,
        linkmanPhone: undefined
      },
      rules: {
        linkman: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { pattern: /^[\u4E00-\u9FA5]+$/, message: '请输入正确联系人' }
        ],
        linkmanPhone: [
          { required: true, message: '请输入电话', trigger: 'blur' }, 
          { pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '请输入正确手机号', trigger: 'blur' }
        ]
      },
      loading: false,
      showCarPlate: false,
      showLayer: false,
      state: false
    }
  },
  watch: {
    activeName(v) {
      // if (v) {
      //   this.state.loaded()
      //   console.log(this.state)
      // }
      // if(v === 'first') {
      //   // this.init()
      // } else if (v === 'second') {
      //   this.loadmore('0')
      // } else if (v === 'third') {
      //   this.loadmore('1')
      // } else {
      //   this.loadmore('-1')
      // }
    }
  },
  mounted() {
    this.arr = [{ name: 'third', code: '-1', list: 'complete' }, { name: 'second', code: '1', list: 'todo' }, { name: 'first', code: '0', list: 'all' }]
  },
  methods: {
    handSearch({ filter, status }) {
      let arr = this.arr.filter(item => item.code === status)[0].list
      this[arr] = []
      this.loadmore({ status, filter }, this.infinite)
    },
    loadmore({ status, page = 1, filter = {} }, state) {
      this.infinite = state
      let arr = this.arr.filter(item => item.code === status)[0].list
      bookingList(Object.assign({ status, pageSize: 10, page }, filter)).then(res => {
        if (res.list && res.list.length) {
          if (this[arr].length >= res.pagination.total) {
            state.complete && state.complete()
          } else {
            this[arr] = this[arr].concat(res.list)
            state.loaded && state.loaded()
          }
        } else {
          state.complete && state.complete()
        }
        // if (Object.prototype.toString.call(state, -8) === 'Function') {
        //   state(res)
        // }
      })
    },
    edit(row) {
      this.resetForm('orderForm')
      this.orderForm = Object.assign({}, row)
      this.editDialog = true
      this.getTime()
    },
    del(orderId) {
      this.$confirm('删除后不可恢复，您确定删除该预约信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBooking({ orderId }).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            let obj = this.arr.filter(item => item.name === this.activeName)[0]
            this[obj.list] = []
            this.loadmore({ status: obj.code }, this.infinite)
          }
        })
      })
    },
    getTime() {
      getTimeRange().then(res => {
        let _this = this
        var mobileSelect = new MobileSelect({
          trigger: '#trigger',
          title: '选择进场时间',
          wheels: res.wheels,
          position:[0,0],
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
          position:[0,0],
          callback:function(indexArr, data){
            console.log(data); //返回选中的json数据
            let newData = data[0].split(' ')[0]
            _this.orderForm.leaveTime = new Date().getFullYear() + '-' + newData.replace(/月/, '-').replace(/日/, ' ') + data[1]
          }
        });
      })
    },
    chooseCar() {
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
      this.orderForm.license = v
    },
    changeOrder() {
      if (this.state) {
        return false
      }
      this.state = true
      let { orderId, account, entryTime, leaveTime, linkman, license, linkmanPhone, status } = this.orderForm 
      // 较验时间
      if (new Date(entryTime).getTime() >= new Date(leaveTime).getTime()) {
        this.$message.error('离场时间不能小于进场时间!')
        return false
      }
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          editBooking({ orderId, account, entryTime, leaveTime, linkman, license, linkmanPhone }).then(res => {
            if (res.status) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.editDialog = false
              let obj = this.arr.filter(item => item.name === this.activeName)[0]
              this[obj.list] = []
              this.loadmore({ status: obj.code }, this.infinite)
              this.state = false
            }
          })
        }
      })
    }
  }
}
</script>
<style>
.el-dialog__body {
  padding: 10px 20px !important;
}
.el-tabs__nav-scroll {
  padding: 0 20px;
}
.el-tabs__nav {
  padding: 5px 0;
}
.el-tabs__content {
  padding: 0 20px;
}
</style>
