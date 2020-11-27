<template>
  <div>
    <el-form ref="form" :model="form" label-width="40px" style="text-align: left;">
      <el-form-item label="车牌" prop="license" style="margin-bottom: 10px">
        <el-input size="mini" style="width: 100%" clearable placeholder="请输入车牌" v-model="form.license"></el-input>
      </el-form-item>
      <el-form-item label="日期" prop="date"  style="margin-bottom: 10px">
        <el-col :span="11">
          <el-date-picker
            v-model="form.dateRange[0]"
            style="width: 100%"
            size="mini"
            :editable="false"
            type="date"
            clearable
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
        </el-col>
        <el-col :span="2" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="form.dateRange[1]"
            style="width: 100%"
            size="mini"
            :editable="false"
            type="date"
            clearable
            :picker-options="options"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <p class="error" v-if="error">日期请选择开始日期和结束日期</p>
      <el-form-item label-width="0">
        <el-button size="mini" class="serchBtn" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="block" v-for="item in lists" :key="item.id">
      <div class="info-head">
        <p class="status">{{ statusList[+item.status + 1] }}</p>
        <p class="id">单号:{{ item.orderId }}</p>
      </div>
      <div class="info-list">
        <p>车牌：{{ item.license }}</p>
        <p>联系人：{{ item.linkman }}</p>
        <p>手机号: <a style="text-decoration: none; color:#333" :href="'tel:' + item.linkmanPhone">{{ item.linkmanPhone }}</a> <i class="el-icon-phone-outline"></i></p>
        <p>进场时间: {{ item.entryTime }}</p>
        <p>离场时间: {{ item.leaveTime }}</p>
      </div>
      <div class="info-edit" v-if="!+item.status">
        <!-- <el-button type="primary" class="changeBtn" size="mini" @click="change(item)">修改</el-button> -->
        <el-button v-if="+item.status===0" type="danger" size="mini" @click="del(item.orderId)">删除</el-button>
      </div>
    </div>
    <InfiniteLoading spinner="waveDots" ref="infiniteLoading" :distance="50" @infinite="infiniteHandler">
      <div slot="spinner" class="txt">拼命加载中...</div> <!-- //加载中的文字 -->
      <div slot="no-more" class="txt">已加载完毕!</div> <!-- //加载完毕的文字 -->
      <div slot="no-results" class="txt">暂无数据:(</div>  <!-- //没有数据的文字 -->
    </InfiniteLoading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: 'orderCarInfo',
  components: { InfiniteLoading },
  props: {
    status: {
      type: [String || undefined],
      default: undefined
    },
    lists: {
      type: Array,
      defalut: () => []
    }
  },
  data() {
    let _this = this;
    return {
      options: {
        disabledDate(time) {
          let beginDateVal = _this.form.dateRange[0]
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          }
    　　}
      },
      error: false,
      form: {
        license: undefined,
        dateRange: [],
      },
      statusList: ['历史', '预约', '入场'],
      state: [], // 防重重点击
      page: 0
    }
  },
  watch: {
    lists(v) {
      this.state = v.map(item => {
        return {
          id: item.id,
          isdel: false
        }
      })
    }
  },
  methods: {
    search() {
      if ((!this.form.dateRange[0] && this.form.dateRange[1]) || (this.form.dateRange[0] && !this.form.dateRange[1])) {
        this.error = true
        return 
      }
      this.error = false
      this.$emit('search', { filter: this.form, status: this.status})
    },
    change(row) {
      this.$emit('change', row)
    },
    del(id) {
      this.$emit('delete', id)
    },
    infiniteHandler($state) {
      this.$emit('loadmore',  { status: this.status, page: ++this.page }, $state)
    }
  }
}
</script>
<style>
.block {
  background:#eee;
  text-align:left;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 4px;
}
.block .info-head {
  display: flex;
  justify-content: space-between;
  margin-bottom:1em;
  padding-bottom:1em;
  border-bottom: 1px solid #d1d1d1;
}
.block .info-list {
  line-height: 1.6;
  font-size: 14px;
}
.block .info-edit{
  display: flex;
  margin-top:1em;
  justify-content: space-between;
}
.error {
  font-size: 12px;
  color:#fc7609
}
.txt {
  font-size: 14px;
  color:#999;
}
</style>