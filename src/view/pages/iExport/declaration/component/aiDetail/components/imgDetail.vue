<template>
  <div class="imgDetail">
    <div class="unDialog-container" ref="unDialog-container" @wheel="wheel($event)">
      <div style='width: 100%; height: 100%;' :style="{transform: 'translate3d('+ left + 'px, '+ top +'px, 0px) scale(' + scale + ')'}" @mousedown="moveImg($event)">
        <div class='unDialog-content'>
          <img :src='currentPicInfo.url' class="starryImg" ref="starryImg" @load="calImgPosition">
          <div :style='{top: rectPosition.top + "px", left: rectPosition.left + "px", width: rectPosition.width + "px", height: rectPosition.height + "px", display: isNeedShowPosition ? "block" : "none"}' class='unDialog-sign'></div>
        </div>
      </div>
      <div class="hCenter"></div>
      <div class="wCenter"></div>
    </div>
    <div class="toolbar">
      <span class="ai-icon-print" title="打印" @click="aiPrint"><i class='dec-i'></i></span>
      <span class="ai-icon-amplifier" title="放大" @click="addSize"><i class='dec-i'></i></span>
      <span class="ai-icon-shrink" title="缩小" @click="subSize"><i class='dec-i'></i></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'img-detail',
  props: {
    currentPicInfo: {
      type: Object
    },
    showPosition: {
      type: Boolean
    }
  },
  data () {
    return {
      signDiv: 'block',
      scale: 1,
      left: 0,
      top: 0,
      wheeling: false,
      scaleRatio: 0.1,
      rectPosition: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      imgInfo: {
        widthScale: 0,
        heightScale: 0
      }
    }
  },
  computed: {
    isNeedShowPosition () {
      return this.showPosition && !(this.rectPosition.top === 0 && this.rectPosition.left === 0 && this.rectPosition.width === 0 && this.rectPosition.height === 0)
    }
  },
  methods: {
    calImgPosition (force) {
      let imgPosition = this.$refs.starryImg
      this.imgInfo = {
        widthScale: imgPosition.clientWidth / this.currentPicInfo.width,
        heightScale: imgPosition.clientHeight / this.currentPicInfo.height
      }
    },
    drawImgRect (field) {
      if (field && !(field.h === 0 && field.w === 0 && field.x === 0 && field.y === 0)) {
        this.calImgPosition()
        let top = this.imgInfo.heightScale * field.y
        let left = this.imgInfo.widthScale * field.x
        let width = this.imgInfo.widthScale * field.w
        let height = this.imgInfo.heightScale * field.h
        this.rectPosition = {
          top: top - 1,
          left: left - 1,
          width: width + 2,
          height: height + 2
        }
      }
    },
    wheel (event) {
      if (event.altKey) {
        event.preventDefault()
        event.stopPropagation()
        if (this.wheeling) {
          return
        }
        this.wheeling = true
        setTimeout(() => {
          this.wheeling = false
        }, 50)
        let delta = 1
        if (event.deltaY) {
          delta = event.deltaY > 0 ? 1 : -1
        } else if (event.wheelDelta) {
          delta = -event.wheelDelta / 120
        } else if (event.detail) {
          delta = event.detail > 0 ? 1 : -1
        }
        let diffScale = -delta * this.scaleRatio * 10
        this.scale = this.scale + diffScale
        let relativePosition = this.$refs['unDialog-container'].getBoundingClientRect()
        this.left = (event.pageX - relativePosition.left + this.left) * this.scale / (this.scale - diffScale) - (event.pageX - relativePosition.left)
        this.top = (event.pageY - relativePosition.top + this.top) * this.scale / (this.scale - diffScale) - (event.pageY - relativePosition.top)
      }
    },
    // 打印单据
    aiPrint () {
      window.open(this.currentPicInfo.originUrl, '_blank')
    },
    // 放大图片
    addSize () {
      this.scale = this.scale + this.scaleRatio
      this.centerJustify(this.scaleRatio)
    },
    centerJustify (diffScale) {
      this.left = this.left + this.left / (this.scale - diffScale) * diffScale
      this.top = this.top + this.top / (this.scale - diffScale) * diffScale
    },
    // 缩小图片
    subSize () {
      if (this.scale > 0) {
        this.scale = this.scale - this.scaleRatio
        this.centerJustify(-this.scaleRatio)
      }
    },
    // 拖动图片
    moveImg (e) {
      let self = this
      // 阻止默认事件的方法,如果不阻止默认事件onmouseup会无法触发
      e.preventDefault()
      e.stopPropagation()
      let downPageX = e.pageX
      let downPageY = e.pageY
      let left = self.left
      let top = self.top
      document.onmousemove = (e) => {
        self.left = left + e.pageX - downPageX
        self.top = top + e.pageY - downPageY
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>
<style lang="less">
  .imgDetail{
    height: 100%;
    .unDialog-container{
      position: relative;
      width: 100%;
      height: calc(100% - 20px);
      overflow: hidden;
      .hCenter{
        position: absolute;
        height: 1px;
        width: 100%;
        background: red;
        top: 200px;
      }
      .wCenter{
        position: absolute;
        height: 100%;
        width: 1px;
        background: blue;
        left: 169px;
        top: 0;
      }
      .unDialog-content {
        position: relative;
        width: 100%;
        height: 100%;
        .starryImg{
          width: 100%;
          height: auto;
        }
      }
    }
    .toolbar {
      height: 20px;
      text-align: center;
      .dec-i{
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        margin: 0 5px;
      }
    }
  }
</style>
