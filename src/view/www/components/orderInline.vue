<template>
  <div class="aboutUs">
    <!-- 背景图区域 -->
    <!-- <div class="banner none">
      <img :src="bannerList[2]" alt="">
    </div> -->
    <div class="mainer">
      <!-- 在线预约区域 -->
      <div class="orderInline">
        <span id="anchor"></span>
        <div class="title">
          <p class="big">在线预约</p>
          <p class="light">ONLINE BOOKING</p>
        </div>
        <el-form label-position="top" label-width="250px" ref="Form" :model="formData" :rules="rules" status-icon>
          <el-row :gutter="40">
            <el-col :span="16" :offset="4">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formData.name" :maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业名称" prop="corpName">
                  <el-input v-model="formData.corpName" :maxlength="30"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="16" :offset="4">
              <el-col :span="12">
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="formData.mobile" :maxlength="11"></el-input>
                  <el-button class="sendCode" @click="sendCode" :disabled="timerId>0? true:false">{{content}}</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机验证码" prop="code">
                  <el-input v-model="formData.code" ref="mobileCode" :maxlength="4"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="16" :offset="4">
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="formData.email" ></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <div class="remind">
          <div class="line"><span>温馨提示：请您填写真实的姓名和联系方式，我们会有专员与您联系。</span></div>
        </div>
        <div class="btn-now">
          <button class="btn-order" @click="orderNow">立即预约</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import BMap from 'BaiduMap'
import eventBus from '../common/eventBus'
export default {
// 百度地图api ak=NyTAf7KeueRYw66iDfFh20pDmxlGFrfO
  data () {
    return {
      bannerList: ['@/assets/www-img/images/banner01.png', '@/assets/www-img/images/banner02.png', '@/assets/www-img/images/banner03.png'],
      formData: {
        name: '',
        mobile: '',
        code: '',
        corpName: '',
        email: ''
      },
      content: '发送验证码', // 按钮里显示的内容
      totalTime: 60, // 记录具体倒计时时间
      timerId: 0, // 存储定时器的值
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {pattern: /^[(\u4e00-\u9fa5)|(a-zA-Z0-9)]+$/, message: '姓名不能包含特殊字符', trigger: 'blur'},
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {pattern: /^(1)(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        corpName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入4位验证码', trigger: 'blur' },
          {pattern: /^\d{4}$/, message: '请输入4位数字', trigger: 'blur'}
        ],
        email: [
          {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: '请输入正确的邮箱', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    // let map = new BMap.Map(this.$refs.map)
    // let point = new BMap.Point(120.3793852119, 31.496710920389) // 创建中心点坐标
    // let marker = new BMap.Marker(point) // 创建标注
    // map.centerAndZoom(point, 15) // 初始化地图，设置中心点坐标和地图级别
    // map.addOverlay(marker) // 将标注添加到地图
    // map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    // let local = new BMap.LocalSearch(map, { renderOptions: {map: map, autoViewport: true} })
    // local.search('朗新金关')
    if (this.$route.hash) { // 说明是点击预约按钮跳转过来的,则定位到锚点
      eventBus.$emit('custormAnchor', 'anchor')
    }
  },
  methods: {
    orderNow () { // 立即预约请求
      this.$refs['Form'].validate(valid => {
        if (valid) {
          this.$store.dispatch('ajax', {
            url: 'API@/login/login/addAppointment',
            data: this.formData,
            router: this.$router,
            success: res => {
              if (res.code === '0000') { // 成功
                this.$message({
                  type: 'success',
                  message: '预约成功'
                })
                // 重置表单
                this.$refs['Form'].resetFields()
                // 清空定时器和重置验证码按钮
                clearInterval(this.timerId)
                this.timerId = 0
                this.totalTime = 60
                this.content = '发送验证码'
              } else if (res.code === '0001') { // 验证码失效
                this.formData.code = ''
                this.$message({
                  type: 'error',
                  message: res.message
                })
                // 移除表单校验结果
                this.$refs['Form'].clearValidate('code')
                this.$refs['mobileCode'].focus()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message + ',请稍后再试'
                })
              }
            }
          })
        }
      })
    },
    sendCode () { // 获取验证码请求
      let mobile = this.formData.mobile
      let reg = /^(1)(3|4|5|6|7|8|9)\d{9}$/
      if (!mobile) {
        this.$message({
          type: 'error',
          message: '请输入手机号'
        })
        return
      }
      if (!reg.test(mobile)) {
        return
      }
      // 倒计时开启
      this.countDown()
      // 发送请求 获取验证码
      this.$store.dispatch('ajax', {
        url: 'API@/login/login/getValidateCode',
        data: {
          mobile,
          type: 'subscribe'
        },
        router: this.$router,
        success: res => {
          if (res.code === '0000') {
            this.$message({
              type: 'success',
              message: res.message
            })
          }
        }
      })
    },
    countDown () { // 倒计时功能
    // 如果发现有定时器运行 return
      if (this.timerId) return
      this.content = this.totalTime + '秒'
      this.timerId = setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + '秒'
        if (this.totalTime < 0) {
          // 清除定时器
          clearInterval(this.timerId)
          this.timerId = 0
          this.totalTime = 60
          this.content = '重新发送'
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  .detail {
    h3 {
      color: black;
      font-size: 16px;
      font-weight: bold;
      margin: 10px 0;
    }
    p {
      text-indent: 1em;
      line-height: 26px;
    }
    .text {
      width: 70%;
      padding-right: 30px;
    }
    .photo {
      width: 30%;
    }
  }
  // 联系我们区域

  // 在线预约区域
  .orderInline {
    padding-top: 40px;
    padding-bottom: 40px;
    .line {
      height: 0;
      border-top: 1px solid #ccc;
      width: 550px;
      margin: 20px auto;
      text-align: center;
      span {
        display: block;
        background: #fff;
        width: 460px;
        margin: 0 auto;
        margin-top: -10px;
        color: #999;
      }
    }
    .btn-now {
      padding: 20px 0;
      text-align: center;
      button {
        background-color: #FF7200;
        width: 180px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        border: none;
        padding: 8px 0;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .sendCode {
      position: absolute;
      right: 28px;
      top: 8px;
      border: none;
      border-left: 1px solid #ccc;
      border-radius: 0;
      box-sizing: border-box;
      padding: 5px 5px 5px 10px;
      width:90px;
    }
  }
  .el-row {
    margin-bottom: 15px;
  }
  .title {
    margin-bottom: 35px;
  }
</style>
