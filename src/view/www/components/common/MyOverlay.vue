<template>
  <bm-overlay
    ref="customOverlay"
    :class="{sample: true, active}"
    pane="labelPane"
    @draw="draw">
    <div class="text" v-text="text"></div>
  </bm-overlay>
</template>

<script>
import BmOverlay from 'vue-baidu-map/components/overlays/Overlay.vue'

export default {
  components: {
    BmOverlay
  },
  props: ['text', 'position', 'active'],
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    draw ({el, BMap, map}) {
      const {lng, lat} = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x + 20 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
