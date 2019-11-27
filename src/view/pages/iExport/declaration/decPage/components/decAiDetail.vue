<template>
  <ai-detail v-if="isNeedDisplayCompare" :picDatas="picDatas" :currentPicRefs="currentPicRefs"></ai-detail>
</template>

<script>
import aiDetail from '../../component/aiDetail/aiDetail'
import businessUtil from '../common/businessUtil'
import decBus from '../common/bus'

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
    moduleName: {
      type: String
    }
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
      let field = this.ocrFields[data.value]
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
      // 判断 这条数据在识别记录里是否存在。如果不是存在的则是自己手动添加的表体
      let orcLength = +data.gNo
      if (orcLength <= this.orcListFomart.length && this.orcListFomart[orcLength - 1][data.value] && this.orcListFomart[orcLength - 1][data.value].picRefs.length) {
        this.currentPicRefs = this.orcListFomart[orcLength - 1][data.value].picRefs
      } else {
        this.currentPicRefs = null
      }
    },
    /**
     * 调取智能制单的识别数据
     * pid 为智能识别结果的 id 那边为taskId
     * flag 为是否需要设置报关单数据 有数据则需要则是报关单数据
     */
    getDecByOcr (pid, flag = false) {
      this.$post({
        url: 'API@/dec-common/dec/orc/getDecDocumentDetail',
        data: {ocrNo: pid},
        success: (res) => {
          let dataResult = JSON.parse(res.result.taskResult)
          let decVo = res.result.decData ? JSON.parse(res.result.decData) : null
          let decColorInfo = res.result.decColorInfo ? JSON.parse(res.result.decColorInfo) : null
          let initHeadColor = businessUtil.generateDecAiHeadColor()
          let arr = dataResult.fields
          console.log(arr)
          // 处理表头数据
          let fields = {}
          let headVo = businessUtil.generateDecHead()
          for (let i in arr) {
            let field = arr[i]
            fields[field.fieldCode] = {
              value: field.fieldValue, // 字段值
              level: field.prob, // 识别准确率
              picRefs: field.picReferences // 涉及图片
            }
            if (headVo[field.fieldCode] !== undefined) {
              headVo[field.fieldCode] = field.fieldValue
            }
            if (field.fieldCode === 'totalWeight') {
              this.$store.commit(this.moduleName + '/changeDecPage', {key: 'PLNet', value: field.fieldValue})
            }
            if (field.fieldCode === 'totalAmount') {
              this.$store.commit(this.moduleName + '/changeDecPage', {key: 'inoviceTotalPrice', value: field.fieldValue})
            }
            // 如果没有颜色和有对应该字段 则需要初始化颜色
            /**
             * 黑色字体：代表精准识别结果，在几个单证中都有此字段内容
               黄色字体：代表单一识别结果，只在一个单证中有此字段内容
               红色字体：代表无识别结果或字段为空处，需要制单人员人工补充。
             */
            if (!decColorInfo && initHeadColor[field.fieldCode] !== undefined) {
              if (field.picReferences.length === 0 || field.picReferences.length === undefined || field.fieldValue === '') {
                initHeadColor[field.fieldCode] = 0
              } else if (field.picReferences.length === 1) {
                initHeadColor[field.fieldCode] = 1
              } else {
                initHeadColor[field.fieldCode] = 2
              }
            }
          }
          // 处理申报单位 当三者都没有值的时候 需要设置为当前登陆用户
          if (!(headVo['agentCodeScc'] || headVo['agentCode'] || headVo['agentName'])) {
            headVo['agentCode'] = this.$store.state.userLoginInfo.tradeCode
            headVo['agentCodeScc'] = this.$store.state.userLoginInfo.sccCode
            headVo['agentName'] = this.$store.state.userLoginInfo.cusCorpName
            initHeadColor['agentCode'] = '2'
            initHeadColor['agentCodeScc'] = '2'
            initHeadColor['agentName'] = '2'
          }
          this.ocrFields = fields
          // 处理表体数据
          let orcList = dataResult.table
          let orcBodyList = [] // 格式化过后的识别记录表体数据
          let orcBodyAfter = {} // 存放格式化过后的表体实体对象
          let listVo = [] // 格式化成报关单表体数据
          let bodyVo = {} // 格式化成报关单表体数据的单个对象
          let orcBodyVo = {} // 未格式化识别记录的表体数据的单个对象
          let bodyfield // 为格式化识别记录的 字段属性
          let initBodyColor
          let bodyAiColorList = []
          for (let x in orcList) {
            bodyVo = businessUtil.generateDecBody()
            orcBodyVo = orcList[x]
            orcBodyAfter = {}
            initBodyColor = businessUtil.generateDecAiBodyColor()
            for (let y in orcBodyVo) {
              bodyfield = orcBodyVo[y]
              orcBodyAfter[bodyfield.fieldCode] = {
                value: bodyfield.fieldValue, // 字段值
                mun: bodyfield.picReferences.length, // 出现次数
                level: bodyfield.prob, // 识别准确率
                picRefs: bodyfield.picReferences // 涉及图片
              }
              if (bodyVo[bodyfield.fieldCode] !== undefined) {
                bodyVo[bodyfield.fieldCode] = bodyfield.fieldValue
              }
              // 初始化 AI的字体颜色
              if (!decColorInfo && initBodyColor[bodyfield.fieldCode] !== undefined) {
                if (bodyfield.picReferences.length === 0 || bodyfield.picReferences.length === undefined || bodyfield.fieldValue === '') {
                  initBodyColor[bodyfield.fieldCode] = 0
                } else if (bodyfield.picReferences.length === 1) {
                  initBodyColor[bodyfield.fieldCode] = 1
                } else {
                  initBodyColor[bodyfield.fieldCode] = 2
                }
              }
              // 临时用到时候要删除
              if (bodyfield.fieldCode === 'gNo' && !bodyfield.fieldValue) {
                bodyVo['gNo'] = +x + 1
              }
              if (bodyfield.dictValue) {
                bodyVo[bodyfield.fieldCode + 'Value'] = bodyfield.dictValue
              }
            }
            bodyAiColorList.push(initBodyColor)
            orcBodyList.push(orcBodyAfter)
            listVo.push(bodyVo)
          }
          if (decColorInfo) {
            // 处理 字符串 转化为int类型
            for (let headKey in decColorInfo.headAiColor) {
              decColorInfo[headKey] = +decColorInfo.headAiColor[headKey]
            }
            for (let index in decColorInfo.bodyAiColor) {
              for (let bodykey in decColorInfo.bodyAiColor[index]) {
                decColorInfo.bodyAiColor[index][bodykey] = +decColorInfo.bodyAiColor[index][bodykey]
              }
            }
            decBus.$emit('setHeadAiColor', decColorInfo.headAiColor)
            decBus.$emit('setBodyAiColor', decColorInfo.bodyAiColor)
          } else {
            decBus.$emit('setHeadAiColor', initHeadColor)
            decBus.$emit('setBodyAiColor', bodyAiColorList)
          }
          this.orcListFomart = orcBodyList
          this.picDatas = dataResult.picDatas
          if (flag) {
            if (decVo) {
              this.$emit('ai:formatedData', {...decVo, flag: flag})
            } else {
              this.$emit('ai:formatedData', {
                decHeadVO: headVo,
                decListVO: listVo,
                flag: flag
              })
            }
          }
        },
        other: (res) => {
          this.messageTips(res.message, 'error')
        }
      })
    }
  }
}
</script>
