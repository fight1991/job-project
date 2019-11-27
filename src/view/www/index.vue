<template>
<div class="out-container www" ref="www">
  <div class="container" ref="container">
    <Header></Header>
    <div class="main">
      <router-view></router-view>
    </div>
    <Fixed class="staPositon" @backTop ="backTop"></Fixed>
    <Footer></Footer>
  </div>
</div>
</template>

<script>
import Header from './components/common/header.vue'
import Footer from './components/common/footer.vue'
import Fixed from './components/common/fixed.vue'
export default {
  components: {
    Header,
    Footer,
    Fixed
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
    backTop () {
      this.$refs['www'].scrollTop = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .out-container {
    min-width: 1000px;
    height: 100%;
    overflow: auto;
  }
  .staPositon {
    position: fixed;
    right: 20px;
    bottom: 18%;
    z-index: 999;
  }

</style>
