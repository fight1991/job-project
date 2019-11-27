<template>
    <el-container class="ccba-control main" v-loading="$store.state.loading">
      <el-header class="header" height="62px">
        <top @resetMiddleInfo="resetMiddleInfo"></top>
      </el-header>
      <el-container class="middle">
        <el-aside :class="['sidebar',{'sidebar-xs-only' : this.$store.state.menuShow}]" :width="$store.state.collapse ? '64px' : '200px'">
          <sidebar></sidebar>
        </el-aside>
        <el-main class="middle-right">
          <!-- <div class="scroll-hidden"></div> -->
          <middle ref="middle"></middle>
        </el-main>
      </el-container>
      <el-footer class="footer-bottom" :height="footHeight+'px'">
        <foot @pullHeight="pullHeight"></foot>
      </el-footer>
    </el-container>
</template>
<script>
import top from './components/header.vue'
import sidebar from './components/sidebar.vue'
import foot from './components/footer.vue'
import middle from './middle.vue'

export default {
  components: {
    top,
    sidebar,
    foot,
    middle
  },
  data () {
    return {
      footHeight: '50'
    }
  },
  mounted () {
  },
  methods: {
    pullHeight (value) {
      this.footHeight = value
    },
    resetMiddleInfo () {
      this.$refs.middle.getCheckPanel()
    }
  }
}
</script>
<style scoped lang="less">
.main{
  width: 100%;
  background-color: @sys-color-gray;
  height:calc(~"(100% - 55px)")
}
.middle {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  height:calc(~"(100% - 55px)")
}
.header{
    padding: 0;
    background-color:@sys-color-main;
    box-shadow: 0 2px 3px rgba(17,17,17,0.1), 0 0 0 1px rgba(17,17,17,0.1);
    // z-index: 2000;
}
.footer-bottom {
  width: 100%;
  padding: 0;
  position:fixed;
  bottom: 0;
  left: 0;
  z-index: 11;
  background-color: @aid-color-main;
}
.middle-right {
  // border: 1px solid red;
  padding: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  // height: 100%;
  // height: calc(~"(100% - 75px)");
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  .scroll-hidden {
    height: 100%;
    width: 17px;
    background-color: @sys-color-gray;
    position: absolute;
    top: 0;
    right: 0;
  }
}
.sidebar {
  background-color: @aid-color-white;
  margin: 20px 20px 20px 20px;
  z-index: 10;
  overflow: hidden;
  border-radius: 5px;
  // border: 1px solid red;
}
.sidebar::-webkit-scrollbar {
  display: none;
}
@media only screen and (max-device-width: 767px) and (-webkit-min-device-pixel-ratio: 2) {
  .sidebar {
    position: absolute;
    height: 100%;
  }
}
@-moz-document {

}
</style>
