<template>
<!-- 报关单表头——特殊业务标识组件 -->
  <section>
    <!--特殊业务标识 弹出框 开始 -->
    <el-dialog :modal-append-to-body='false'
      title="特殊业务标识"
      :visible.sync="specialBusiVisible"
      :before-close="specialBusiClose"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      @open="specialBusiShow"
      v-dialogDrag
      width="600px">
      <el-checkbox-group v-model="checkBoxList" class ='border-margin'>
        <el-row class="border-bottom">
          <el-col :span="6">
            <el-checkbox label="国际赛事"></el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox label="特殊进出军工物资"></el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox label="国际援助物资"></el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox label="国际会议"></el-checkbox>
          </el-col>
        </el-row>
        <el-row class="m-t-10 border-bottom">
          <el-col :span="6">
            <el-checkbox label="直通放行"></el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-checkbox label="外交礼遇"></el-checkbox>
          </el-col>
          <el-col :span="6" v-if="iEFlag == 'I'" >
            <el-checkbox label="转关"></el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="sureSpecialBusi" class="dialog-primary-btn" :disabled="isDisabled">确定</el-button>
      </span>
    </el-dialog>
    <!--特殊业务标识 弹出框 结束-->
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  name: 'special-bussiness',
  props: {
    specialBusiVisible: {
      type: Boolean,
      default: false
    },
    iEFlag: {
      type: String,
      default: 'I'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    specialBusiList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      checkBoxList: []
    }
  },
  methods: {
    specialBusiShow () {
      this.checkBoxList = util.simpleClone(this.specialBusiList)
    },
    specialBusiClose () {
      this.$emit('update:specialBusiVisible', false)
    },
    // 特殊业务标识 确认
    sureSpecialBusi () {
      let specDeclFlagArr = ['0', '0', '0', '0']
      let specDeclFlag2Arr = ['0', '0', '0', '0']
      let specDeclFlag = ''
      let specDeclFlag2 = ''
      let specDeclFlagValue = ''
      if (this.checkBoxList.length !== 0) {
        for (let i in this.checkBoxList) {
          let name = this.checkBoxList[i]
          switch (name) {
            case '国际赛事':
              specDeclFlagArr[0] = '1'
              break
            case '特殊进出军工物资':
              specDeclFlagArr[1] = '1'
              break
            case '国际援助物资':
              specDeclFlagArr[2] = '1'
              break
            case '国际会议':
              specDeclFlagArr[3] = '1'
              break
            case '直通放行':
              specDeclFlag2Arr[0] = '1'
              break
            case '外交礼遇':
              specDeclFlag2Arr[2] = '1'
              break
            case '转关':
              specDeclFlag2Arr[3] = '1'
              break
          }
        }
        specDeclFlag = specDeclFlagArr.join('')
        specDeclFlag2 = specDeclFlag2Arr.join('')
        specDeclFlagValue = this.checkBoxList.join(',')
      }
      this.$emit('close:specialBussiness', {specDeclFlag: specDeclFlag, specDeclFlag2: specDeclFlag2, specDeclFlagValue: specDeclFlagValue})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/decCss';
 .border-bottom {
   border-bottom: 0;
 }
 .m-t-10{
    margin-top: 10px;
  }
</style>
