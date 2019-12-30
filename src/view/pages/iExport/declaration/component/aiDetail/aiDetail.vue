<template>
  <div v-if="isNeedDisplayCompare" v-show="unDialogVisible" class='unDialog' :style="{width: dialogPosition.width + 'px', height: dialogPosition.height + 'px' }" v-dialogMove>
    <!-- 标题栏 -->
    <div class='unDialog-header'>
      <span style='font-size: 14px;'>识别对比(按住ALT+鼠标滚轮可缩放大小)</span>
    </div>
    <!-- 内容区 -->
    <div class='unDialog-tabs'>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane class="tabPane" :label="tabName" v-for="tabName in tabNames" :name="tabName" :key="tabName">
          <el-carousel indicator-position="none" trigger="click" height='100%' :autoplay="false" :loop="false" @change="carouselChange" :ref="'carousel' + tabName">
            <el-carousel-item v-for="(item, index) in picList[tabName]" :key="item.picType + index" name='index'>
              <img-detail v-bind="$attrs" v-if="item.url" :currentPicInfo="item" :showPosition="showPosition" :ref="'imgDetail_' + tabName + '_' + index" :currentImgRect="currentImgRect"></img-detail>
            </el-carousel-item>
          </el-carousel>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import imgDetail from './components/imgDetail'
import dialogMove from './directives/dialogMove'

export default {
  directives: {
    dialogMove: dialogMove
  },
  components: {
    imgDetail
  },
  props: {
    picDatas: {
      type: Array
    },
    currentPicRefs: {
      type: Array
    }
  },
  data () {
    return {
      unDialogVisible: false,
      picList: {},
      ocrFields: {},
      orcListFomart: [],
      activeName: '',
      activeIndex: 0,
      tabNames: [],
      picMap: {},
      showPosition: false,
      isNeedDisplayCompare: false,
      dialogPosition: {
        width: 0,
        height: 0
      },
      currentImgRect: null
    }
  },
  watch: {
    currentPicRefs: function (newVal, oldVal) {
      if (this.isNeedDisplayCompare) {
        if (this.unDialogVisible) {
          this.calArea()
        } else {
          this.unDialogVisible = !this.unDialogVisible
          this.$nextTick(() => {
            this.calArea()
          })
        }
      }
    }
  },
  created () {
    this.changeDialogPosition()
    window.addEventListener('resize', this.resizeHandler)
    this.formatPicData()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler () {
      this.changeDialogPosition()
      this.$nextTick(() => {
        this.$refs['imgDetail_' + this.activeName + '_' + this.activeIndex][0].drawImgRect(this.currentImgRect)
      })
    },
    formatPicData () {
      let groupedPic = {}
      // 这里格式化图片,把相同类型的图片归类在一起放到同一个tab下
      this.picDatas && this.picDatas.forEach(pic => {
        if (pic.picType.code !== 'other') {
          pic.originUrl = pic.url
          if (groupedPic[pic.picType.name]) {
            groupedPic[pic.picType.name].push(pic)
          } else {
            groupedPic[pic.picType.name] = []
            groupedPic[pic.picType.name].push(pic)
          }
          if (pic.angle) {
            pic.url = ''
            // 旋转照片
            this.getBase64(pic.originUrl, pic.width, pic.height, -pic.angle, (dataUrl) => {
              pic.url = dataUrl
            })
          }
        }
      })
      this.picList = groupedPic
      this.tabNames = Object.keys(groupedPic)
      if (this.tabNames && this.tabNames.length) {
        this.isNeedDisplayCompare = true
        // 初始化 默认选中第一个tab
        this.activeName = this.tabNames[0]
        this.unDialogVisible = true
        let picMap = {}
        this.tabNames.forEach((tabName, tabIndex) => {
          groupedPic[tabName].forEach((pic, picIndex) => {
            picMap[pic.picId] = {
              tabName: tabName,
              picIndex: picIndex
            }
          })
        })
        this.picMap = picMap
      }
    },
    changeDialogPosition () {
      console.log(this.$attrs.pagePos)
      if (this.$attrs.pagePos) {
        this.dialogPosition = {
          width: this.$attrs.pagePos.totalW - this.$attrs.pagePos.otherW,
          height: parseInt(document.body.clientHeight - 120)
        }
      } else {
        this.dialogPosition = {
          width: parseInt(document.body.clientWidth - 815),
          height: parseInt(document.body.clientHeight - 120)
        }
      }
    },
    getBase64 (imgUrl, imgW, imgH, deg, callback) {
      let Img = new Image()
      let dataURL = ''
      Img.setAttribute('crossOrigin', 'Anonymous')
      Img.src = imgUrl
      Img.onload = function () { // 要先确保图片完整获取到，这是个异步事件
        let canvas = document.createElement('canvas') // 创建canvas元素
        let ctx = canvas.getContext('2d')
        let rad = 2 * Math.PI / 360 * deg
        let width = imgW * Math.cos(rad) + imgH * Math.sin(rad)
        let height = imgH * Math.cos(rad) + imgW * Math.sin(rad)
        canvas.width = imgW
        canvas.height = imgH
        let cx = 0.5 * imgW // x of shape center
        let cy = 0.5 * imgH // y of shape center
        let rcx = 0.5 * width
        let rcy = 0.5 * height
        ctx.translate(cx, cy) // translate to center of shape
        ctx.rotate(rad)
        ctx.translate(-rcx, -rcy) // translate center back to 0,0
        ctx.drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
        dataURL = canvas.toDataURL() // 转换图片为dataURL（转换成base64）
        callback(dataURL)
      }
    },
    // 关闭 组件
    closeOcrCompare () {
      this.unDialogVisible = false
    },
    // 切换tabs
    handleClick (name) {
      this.activeName = name.label
      this.$nextTick(() => {
        this.calcPosition()
      })
    },
    // 切换图片时
    carouselChange (picIndex) {
      this.calcPosition(picIndex)
    },
    calcPosition (picIndex) {
      let fieldPic
      if ((!picIndex && picIndex !== 0) && this.currentPicRefs && this.currentPicRefs.length) {
        this.currentPicRefs.some((picRef, index) => {
          if (this.picMap[picRef.picId].tabName === this.activeName) {
            fieldPic = picRef
            return true
          }
          return false
        })
        if (fieldPic) picIndex = this.picMap[fieldPic.picId].picIndex || 0
      } else if (this.currentPicRefs && this.currentPicRefs.length) {
        this.currentPicRefs.some((picRef, index) => {
          if (picRef.picId === this.picList[this.activeName][picIndex].picId) {
            fieldPic = picRef
            return true
          }
          return false
        })
      }
      picIndex = picIndex || 0
      this.drawRedBoder(this.picList[this.activeName][picIndex], fieldPic)
    },
    calArea () {
      /**
       * 1 通过识别记录确认这个字段涉及有几张图片
       * 2 确定当前字段在当前tab下是否存在
       * 3 如果存在 则确定是当前的那一张图片有这个字段 如果有很多张有 就默认显示第一张
       * 4 如果当前 tab 下不存在 则从第一个tab开始找到有这个字段的tab 默认显示首先找到的tab
       * 5 确定是哪张图片 如果有多张图片有这个字段 则默认显示第一张
       * 6 计算红框显示位置
       */
      let picRefs = this.currentPicRefs
      let isCurr = false // 判断当前页是否有字段值
      let fieldPic
      if (picRefs && picRefs.length) {
        if (picRefs.length > 1) { // 如果有多张图片涉及这个字段
          // 首先判断这个字段 当前tab 有没有值
          picRefs.some((picRef, index) => {
            let isSamePic = this.picMap[picRef.picId].tabName === this.activeName
            if (isSamePic) {
              fieldPic = picRefs[index]
              isCurr = true
            }
            return isSamePic
          })
        }
        if (!isCurr) {
          this.activeName = this.picMap[picRefs[0].picId].tabName
          fieldPic = picRefs[0]
        }
        this.activeIndex = this.picMap[fieldPic.picId].picIndex
        let pic = this.picList[this.activeName][this.activeIndex]
        // 显示滚动图片的哪一张
        if (isCurr && this.$refs['carousel' + this.activeName][0].activeIndex === this.activeIndex) {
          this.drawRedBoder(pic, fieldPic)
        } else {
          this.$nextTick(() => {
            this.$refs['carousel' + this.activeName][0].setActiveItem(this.activeIndex)
            this.drawRedBoder(pic, fieldPic)
          })
        }
      } else {
        this.drawRedBoder(null, fieldPic)
      }
    },
    // 计算缩放比例并画图
    drawRedBoder (pic, field) {
      if (field) {
        this.$refs['imgDetail_' + this.activeName + '_' + this.activeIndex][0].drawImgRect(field)
        this.currentImgRect = field
        this.showPosition = true
      } else {
        this.currentImgRect = null
        this.showPosition = false
      }
    }
  }
}
</script>

<style lang="less">
.unDialog {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 600px;
  height: 616px;
  background-color: #fff;
  border: 1px solid ;
  border-radius: 2px;
  z-index: 1000;
  box-sizing: border-box;
  .unDialog-header {
    background-color: #0969C8;
    color: #fff;
    height: 15px;
    line-height: 15px;
    padding: 10px 0px 10px 10px;
    cursor: move;
    user-select: none;
    .unDialog-close {
      position: absolute;
      top: 6px;
      right: 16px;
      cursor: pointer;
    }
  }
  .unDialog-tabs {
    background-color: #fff;
    height: calc(100% - 35px);
    .el-tabs {
      height: 100%;
    }
    .el-tabs__content {
      height: calc(100% - 30px);
      .el-tab-pane{
        height: 100%;
        .el-carousel{
          height: 100%;
        }
      }
    }
    .el-tabs__header {
      padding: 0 20px;
      margin: 0;
      .el-tabs__item{
        height: 30px;
        line-height: 30px;
      }
    }
  }
}

</style>
