<template>
  <td :class='colorArr[checkData.color]' @click="itemClick">
    <el-popover
      width="300"  @show="getVisible"
      v-model="checkData.visible" :disabled="disabled">
      <advises v-if="checkData.visible" :checkobj="checkData.notes" :value='checkData.value' @backNote="changeNote"></advises>
      <div slot="reference" >
        <div class="img-tip" v-if="checkData.value || (checkData.notes && checkData.notes.length>0)"></div>
        <template v-if="isShowLabel">
          <template v-if="label">
           <span class='title-name'>{{label}}</span>
          </template>
          <template v-else-if="checkData.label">
            <span class='title-name'>{{checkData.label}}</span>
          </template>
          <template v-else>
            <span v-if="isImport" class='title-name'>{{checkData.importLabel}}</span>
            <span v-else class='title-name'>{{checkData.exportLabel}}</span>
          </template>
        </template>
        <slot></slot>
      </div>
    </el-popover>
  </td>
</template>
<script>
import advises from './advises'
// import { mapState } from 'vuex'

export default {
  props: {
    checkData: {
      type: Object
    },
    isShowLabel: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    moduleName: {
      type: String
    }
  },
  computed: {
    isImport () {
      return this.$store.state[this.moduleName].isImport
    },
    isLook () {
      return this.$store.state[this.moduleName].isLook
    }
  },
  components: {
    advises
  },
  data () {
    return {
      colorArr: ['c1', 'c2', 'c3']
    }
  },
  created () {},
  methods: {
    itemClick () {
      this.changeColor()
      this.$emit('itemClick')
      if (this.$attrs.isFromAi) {
        this.$emit('drawArea', {value: this.checkData.key})
      }
    },
    changeColor () {
      if (this.isLook) {
        return
      }
      if (this.$store.state.ifDecOpen) {
        if (this.checkData.color === 0) {
          this.checkData.color = 2
        } else if (this.checkData.color === 2) {
          this.checkData.color = 1
        } else if (this.checkData.color === 1) {
          this.checkData.color = 0
        }
      } else {
        if (this.checkData.color === 0) {
          this.checkData.color = 1
        } else if (this.checkData.color === 1) {
          this.checkData.color = 0
        }
      }
    },
    changeNote (note) {
      this.checkData.value = note
      this.checkData.visible = false
    },
    getVisible () {
      if (this.isLook && (!this.checkData.notes || (this.checkData.notes && this.checkData.notes.length === 0))) {
        this.checkData.visible = false
      }
    }
  }
}
</script>
<style scoped lang="less">
.c3 {
  background-color:#d2ffd2;
}
.c2 {
  background-color:#ffd0d8;
}

.c1 {
  background-color: #fff;
}
.img-tip{
  position: absolute;
  background: linear-gradient(45deg,transparent 7px,red 0) left;
  right: 0;
  width: 10px;
  height: 10px;
}
.title-name{
  font-weight: bold;
  margin-left: 5px;
}
.el-popover__reference{
  min-height: 17px;
  position: relative;
}
.sys-main {
  padding: 0;
}
</style>
