<template>
  <div v-if="isShow">
    <div>
      <div class="plate-wrap">
        <!-- 头部车牌号 -->
        <div class="car_title">请输入车牌号<i class="el-icon-close close" @click="closePro" /> </div>
        <!-- 已输入信息 -->
        <div class="car_input">
          <ul class="clearfix ul_input">
            <li v-for="(item, index) in bindInput" :key="index" class="input_pp">
              <span :class="item.classStyle" v-if="index==7 && !chooseKey[7]" class="newc"><b class="zi">新能源</b></span>
              <span :class="item.classStyle" v-if="index!=7 || chooseKey[7]">{{ chooseKey[index] || '' }}</span>
            </li>
          </ul>
        </div>
        <div class="surebtn" @click="chooseKeyNums(37)">确认</div>
      </div>
      <!-- 填写省级简称和车牌信息 -->
      <div class="provinces-wrap">
        <ul class="clearfix ul_pro">
          <li v-show="showFlag == 0" v-for="(item, index) in provinces" :key="index">
            <span @click="chooseProvince(item);">{{ provinces[index] }}</span>
          </li>
          <li v-show="showFlag == 1" v-for="(item, index) in keyNums" :key="index + 999">
            <span @click="chooseKeyNums(index);">{{ keyNums[index] }}</span>
          </li>
          <li class="li_close" @click="closePro">
            <span>关闭</span>
          </li>
          <li class="li_clean" @click="cleanPro">
            <span>清空</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="layer" v-if="showLayer"></div>
  </div>
</template>
<script>
export default {
  props: {
    //是否显示
    showCarPlate: {
      type: Boolean,
      default: false
    },
    //是否获取车牌号
    getPlateNum: {
      type: Function,
      default: () => {}
    },
    //是否显示遮罩层
    showLayer:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShow: {
      get() {
        return this.showCarPlate
      },
      set(val) {
        this.$emit('update:showCarPlate', val)
      }
    },
    layout: {
      get() {
        return this.showLayer
      },
      set(val) {
        this.$emit('update:showLayer', val)
      }
    }
  },
  data() {
    let _sf = this;
    return {
      provinces: [
        "京",
        "沪",
        "浙",
        "苏",
        "粤",
        "鲁",
        "晋",
        "冀",
        "豫",
        "川",
        "渝",
        "辽",
        "吉",
        "黑",
        "皖",
        "鄂",
        "津",
        "贵",
        "云",
        "桂",
        "琼",
        "青",
        "新",
        "藏",
        "蒙",
        "宁",
        "甘",
        "陕",
        "闽",
        "赣",
        "湘"
      ],
      keyNums: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        "Del",
        "确定"
      ],
      bindInput: [
        {
          classStyle: "active"
        },
        {
          classStyle: ""
        },
        {
          classStyle: ""
        },
        {
          classStyle: ""
        },
        {
          classStyle: ""
        },
        {
          classStyle: ""
        },
        {
          classStyle: ""
        },
        {
          classStyle: ""
        }
      ],
      currentIndex: 0,
      chooseKey: [],
      hasPro: "",
      showFlag: 0,
      MAX_INDEX: 7
    };
  },
  methods: {
    //获取车牌信息
    showNum() {
      let palteNum = this.chooseKey.join("");
      this.$emit('getPlateNum', palteNum)
    },
    //选择省级简称
    chooseProvince(item) {
      this.hasPro = "hasPro";
      this.chooseKey[0] = item;
      this.showFlag = 1;
      this.addStyle();
    },
    closePro() {
      this.isShow = false;
      this.layout = false;
      this.initStyle();
    },
    //当前样式更改
    //这里写的不太优雅，后面有空优化一下
    addStyle() {
      this.bindInput.forEach(ele => {
        ele.classStyle = "";
      });

      let styleIndex = 0;
      if (this.currentIndex >= this.MAX_INDEX) {
        styleIndex = this.MAX_INDEX;
      } else {
        styleIndex = this.currentIndex + 1;
      }
      this.bindInput[styleIndex].classStyle = "active";
    },
    //初始化样式
    initStyle() {
      this.bindInput.forEach(ele => {
        ele.classStyle = "";
      });
      this.bindInput[0].classStyle = "active";
    },
    //点击清楚按钮
    cleanPro() {
      this.chooseKey = [];
      this.currentIndex = 0;
      this.showFlag = 0;
      this.initStyle();
    },
    //点击按钮时间
    chooseKeyNums(index) {
      //点击确定时
      if (index == 37) {
        if (this.chooseKey.length < 7) {
          return false
        }
        this.showNum();
        this.cleanPro();
        this.closePro()

      } else if (index == 36) {
        //点击删除DEL
        this.chooseKey.pop();
        this.currentIndex--;
        this.addStyle();
        if (this.currentIndex === -1) {
          this.currentIndex = 0;
          this.showFlag = 0;
        }
        
      } else {
        // 正常点击输入
        if (this.currentIndex === 0 && typeof +this.keyNums[index] === 'number' && !isNaN(this.keyNums[index])) {
          this.$message({
            type: 'error',
            message: '必需是字母',
            customClass: 'msgTip',
            duration: 1500
          })
          return
        }
        this.currentIndex++;
        if (this.currentIndex > this.MAX_INDEX) {
          this.currentIndex = this.MAX_INDEX;
          this.chooseKey.pop();
        }
        
        this.chooseKey.push(this.keyNums[index]);
        this.addStyle();
      }
    }
  }
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
}
.msgTip {
  z-index: 10000 !important;
}
.plate-wrap {
  width: calc(100% - 2rem);
  margin-left: 1rem;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #cccccc;
  box-shadow:0px 0px 30px 0px rgba(0,159,222,0.3);
  z-index: 9999;
  position: absolute;
  top: 20%;
}
.plate-wrap .close {
  position: absolute;
  right:20px;
}
.surebtn {
  width: 90%;
  margin: 20px auto;
  height: 40px;
  line-height: 40px;
  background:#ff7e00;
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
  border-radius: 4px;
}
.clearfix:after {
  content: ".";
  display: block;
  font-size: 0;
  height: 0;
  clear: both;
  visibility: hidden;
}

.car_title {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #cccccc;
}

.ul_pro {
  background-color: #ced3d9;
  text-align: center;
  padding: 4px 2px;
  font-size: 14px;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 9999;
  li {
    float: left;
    width: 11.11%;
    padding: 2px;
  }
}

.ul_pro .li_close {
  float: right;
  width: 22.22%;
  span {
    background-color: #acb3bb;
  }
}

.ul_pro .li_clean {
  float: right;
  width: 22.22%;
}

.ul_pro li span {
  display: block;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 2px #888888;
  /* max-width:48px; margin:0 auto; */
  line-height: 32px;
  padding-top: 2px;
}

.car_input {
  height: 5rem;
}

.ul_input {
  padding: 20px 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.ul_input li .active {
  border: 1px solid #00beff;
  color: #00beff;
}

.ul_input li {
  text-align: center;
}

.ul_input li span {
  display: block;
  background-color: #F8F8F8;
  border-radius: 4px;
  width: 40px;
  font-size: 16px;
  color:#000;
  height: 45px;
  line-height: 45px;
}
.ul_input li span .zi{
  font-size: 10px;
  color:#ddd;
}
@media (max-width: 359px) {
  .ul_input li.newc {
    width: 40px;
  }
  .ul_input li span{
    width: 30px;
    height: 30px;
    line-height: 30px;
  }
}

.ul_keybord {
  background-color: #ced3d9;
  text-align: center;
  padding: 4px 2px;
  font-size: 14px;
}

.ul_keybord li {
  float: left;
  width: 10%;
  padding: 2px;
  box-sizing: border-box;
}

.ul_keybord .ikey20 {
  margin-left: 5%;
}

.ul_keybord .li_w {
  width: 11.11%;
}

.ul_keybord .li_close {
  float: right;
  width: 22.22%;
}

.ul_keybord .li_close span {
  background-color: #acb3bb;
}

.ul_keybord .li_clean {
  float: right;
  width: 22.22%;
}

.ul_keybord li span {
  display: block;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 2px #888888;
  line-height: 32px;
  padding-top: 2px;
}

.ul_keybord li span:active {
  background-color: #4da9f2;
  color: #fff;
}

.layer{
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  opacity: .3;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9998;
}
</style>