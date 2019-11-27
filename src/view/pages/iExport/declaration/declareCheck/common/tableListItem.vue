<template>
  <el-popover
    width="300"
    @show="getVisible"
    v-model="config.visible" :disabled="disable">
    <advises v-if="config.visible" :checkobj="config.notes" :value='config.value' @backNote="changeNote"></advises>
    <div slot="reference">
      <div class="img-table-tip" v-if="config.value || (config.notes && config.notes.length>0)"></div>
      <slot></slot>
    </div>
  </el-popover>
</template>

<script>
import advises from './advises'
// import { mapState } from 'vuex'

export default {
  props: {
    name: {
      type: String
    },
    config: {
      type: Object
    },
    disable: {
      type: Boolean,
      default: false
    },
    moduleName: {
      type: String
    }
  },
  components: {
    advises
  },
  computed: {
    isLook () {
      return this.$store.state[this.moduleName].isLook
    }
  },
  methods: {
    getVisible () {
      if (this.isLook && (!this.config.notes || (this.config.notes && this.config.notes.length === 0))) {
        this.config.visible = false
      }
    },
    changeNote (note) {
      this.config.value = note
      this.config.visible = false
    }
  }
}
</script>
<style>
.img-table-tip{
    background: linear-gradient(45deg,transparent 7px,red 0) left;
    position: absolute;
    right: 0;
    width: 10px;
    height: 10px;
  }
</style>
