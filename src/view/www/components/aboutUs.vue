<template>
  <div class="aboutUs">
    <!-- 公司简介 -->
    <div class="companyIntro">
      <div class="title">
          <p class="big">关于我们</p>
          <p class="light">ABOUT US</p>
      </div>
      <div class="detail mainer">
        <div class="text">
          <div><i class="www-icon icon-logo2"></i></div>
          <div v-html="introduce.zbx"></div>
          <div class="shine"><i class="www-icon icon-shine"></i></div>
          <div v-html="introduce.longshine"></div>
          <div v-html="introduce.jinguan"></div>
        </div>
      </div>
    </div>
    <!-- 联系我们区域 -->
    <div class="contactUs">
      <div :class="{'mainer':true }" v-if="current">
        <baidu-map class="map nameCard" :center="centerPoint" :zoom="zoom" :scroll-wheel-zoom="false" ak='qFHHVG13nGc25bOu8bOw6mIyWsQo78q8'>
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker
              v-for="marker of markers"
              :position="{lng: marker.lng, lat: marker.lat}"
              :key="marker.name"
              :icon="{url:marker.iconPath,size: {width: 15, height: 19}}"
              @mouseover="marker.show = true"
              @mouseout="marker.show = false">
              <!-- <bm-info-window :show="marker.show" @close="infoWindowClose(marker.name)" @open="infoWindowOpen(marker.name)">{{marker.name}}</bm-info-window> -->
              <!-- :title="marker.name" -->
              <my-overlay
                :position="{lng: marker.lng, lat: marker.lat}"
                :active="marker.show"
                :text="marker.name">
              </my-overlay>
            </bm-marker>
          </bml-marker-clusterer>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        </baidu-map>
      </div>
      <div :class="{'mainer':true ,'nameCard':true}" v-if="!current">
        <img class="map-static" src="https://www.5itrade.cn/files/CCBA/map.jpg" alt="">
      </div>
      <div class="mainer switch">
        <el-row>
          <el-button plain @click="current=!current">{{current==true?'查看静态地图':'查看动态地图'}}</el-button>
        </el-row>
         <!-- <el-row>
          <el-button plain @click="reportError">错误日志测试</el-button>
        </el-row> -->
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../common/eventBus'
import {companys, introduce} from '@/config/www'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmlMarkerClusterer from 'vue-baidu-map/components/extra/MarkerClusterer.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
import MyOverlay from './common/MyOverlay'

export default {
  components: {
    BmlMarkerClusterer,
    MyOverlay,
    BaiduMap,
    BmMarker,
    BmNavigation
  },
  data () {
    return {
      formData: {
        name: '',
        mobile: '',
        code: '',
        corpName: '',
        email: ''
      },
      current: false,
      markers: [],
      zoom: 5,
      show: false,
      active: false,
      introduce: {},
      centerPoint: {lng: 114.365689, lat: 30.579686} // 中心点
    }
  },
  mounted () {
    if (this.$route.hash) { // 说明是点击预约按钮跳转过来的,则定位到锚点
      eventBus.$emit('custormAnchor', 'anchor')
    }
  },
  beforeCreate () {
    // import(/* webpackChunkName: "baiduMap" */'vue-baidu-map').then(module => {
    //   Vue.use(module, {
    //     ak: ''
    //   })
    // })
  },
  created () {
    this.getMarker()
    this.introduce = introduce
  },
  methods: {
    getMarker () {
      for (let k in companys) {
        companys[k].forEach(v => {
          this.markers.push({
            lng: v.value[0],
            lat: v.value[1],
            iconPath: v.iconPath,
            name: v.name,
            show: false
          })
        })
      }
    },
    reportError () {
      this.aa = this.aa[0]
    },
    infoWindowOpen (name) {
      this.markers.forEach(v => {
        if (v.name === name) {
          v.show = true
        } else {
          v.show = false
        }
      })
    },
    infoWindowClose () {
      this.markers.forEach(v => {
        if (v.name === name) {
          v.show = false
        } else {
          v.show = false
        }
      })
    },
    draw ({el, BMap, map}) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(116.404, 39.915))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    }
  }
}
</script>

<style lang="less" scoped>
.map-static {
  display: block;
  margin: 0 auto;
  width: 862px;
}
.switch {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  .el-button.is-plain:hover {
    background: #fff;
    border-color: #dcdfe6;
    color: #409EFF;
  }
}
// 公司简介区域
.companyIntro {
  margin: 40px 0;
}
  .detail {
    h3 {
      color: black;
      font-size: 16px;
      font-weight: bold;
      margin: 10px 0;
    }
    p {
      text-indent: 2em;
      line-height: 26px;
    }
    .text {
      i {
        margin-bottom: 10px;
      }
      .shine {
        margin-top: 30px;
      }
    }
    .photo {
      width: 30%;
    }
  }
  // 联系我们区域
  .contactUs {
    padding-bottom: 30px;
    .light {
      margin-bottom: 0;
    }
  }
  // 在线预约区域
  .orderInline {
    padding-top: 20px;
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
        width: 200px;
        font-size: 18px;
        font-weight: bold;
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
    }
  }
  .nameCard {
    height: 690px;
    background-color: #EDF6FF;
  }
</style>
