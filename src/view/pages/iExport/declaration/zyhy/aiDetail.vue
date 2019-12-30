<template>
  <ai-detail v-if="isNeedDisplayCompare" :picDatas="picDatas" ref="aiDialog" :currentPicRefs="currentPicRefs"></ai-detail>
</template>

<script>
import aiDetail from '../component/aiDetail/aiDetail'
// import businessUtil from '../decPage/common/businessUtil'

export default {
  components: {
    aiDetail
  },
  data () {
    return {
      picList: {},
      ocrFields: {},
      orcListFomart: [],
      currentPicRefs: null,
      picDatas: null
    }
  },
  props: {

  },
  computed: {
    isNeedDisplayCompare () {
      return this.picDatas && this.picDatas.length
    }
  },
  methods: {
    // 画表头区域
    drawArea (data) {
      if (!this.isNeedDisplayCompare) {
        return
      }
      let field = this.ocrFields[data.key][data.value]
      if (field && field.picRefs.length) {
        this.currentPicRefs = field.picRefs
      } else { // 这个字段没有记录图片
        this.currentPicRefs = null
      }
    },
    // 画表体区域
    drawBoyArea (data) {
      if (!this.isNeedDisplayCompare) {
        return
      }
      let list = this.orcListFomart[data.key][data.formIndex][data.index]
      let field = ''
      list.forEach(e => {
        if (e.fieldCode === data.value) {
          field = e
        }
      })
      if (field && field.picReferences.length) {
        this.currentPicRefs = field.picReferences
      } else { // 这个字段没有记录图片
        this.currentPicRefs = null
      }
    },
    getDecByOcr (result) {
      let dataResult = result
      let arr = dataResult.multiDocFields
      // // 处理表头数据
      let fields = {}
      for (let i in arr) {
        fields[i] = {}
      }
      for (let j in fields) {
        for (let key in arr[j]) {
          let childField = arr[j][key]
          fields[j][childField.fieldCode] = {
            value: childField.fieldValue, // 字段值
            level: childField.prob, // 识别准确率
            picRefs: childField.picReferences // 涉及图片
          }
        }
      }
      this.ocrFields = fields
      this.orcListFomart = dataResult.multiDocTables
      this.picDatas = dataResult.picDatas
    }
  }
}
</script>
