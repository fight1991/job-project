<template>
<!-- 报关单表头——检验检疫申报要素组件 -->
  <section>
   <el-dialog :modal-append-to-body='false'
      title="检验检疫签证申报要素"
      :visible.sync="decElementsVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeCompnent'
      @open="decElementsShow"
      v-dialogDrag
      width="60%">
      <el-table  ref="decElementsTable" :data="elementsList"
        highlight-current-row border size='mini'
        @select="decElementsChangeFun"
        max-height="300" style="width: 100%">
        <el-table-column  type="selection" min-width="50"></el-table-column>
        <el-table-column  property="gNo" label="序号" min-width="50"></el-table-column>
        <el-table-column  property="appCertCode" label="证书代码" min-width="50"></el-table-column>
        <el-table-column  property="appCertName" label="证书名称" min-width="150"></el-table-column>
        <el-table-column  property="applOri" label="正本数量" min-width="50">
          <template slot-scope="scope">
            <input v-model="scope.row.applOri" maxlength='50'>
          </template>
        </el-table-column>
        <el-table-column  property="applCopyQuan" label="副本数量" min-width="50">
          <template slot-scope="scope">
            <input v-model="scope.row.applCopyQuan" maxlength='50'>
          </template>
        </el-table-column>
      </el-table>
      <div class="border m-t-10">
        <el-form label-width="140px" :model='headVo' size="mini" label-position="right" v-if = "iEFlag == 'I'" @keyup.enter.native="switchFoucsByEnter">
         <el-row >
            <el-col :span="24">
              <el-form-item label="境内收发货人名称(外文)" class="sys-d-title">
                <el-input v-model="headVo.domesticConsigneeEname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="境外收发货人名称(中文)" class="sys-d-title">
                <el-input v-model="headVo.overseasConsignorCname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="境外发货人地址" class="sys-d-title">
                <el-input v-model="headVo.overseasConsignorAddr" :maxlength='100'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="卸毕日期">
                <el-date-picker
                  v-model="headVo.cmplDschrgDt"
                  @change='cmplDschrgDtChange'
                  type="date"
                  value-format="yyyyMMdd"
                  format='yyyyMMdd'
                  style="width:100%"
                  placeholder=" ">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="商品英文名称">
                <el-col :span="20">
                  <el-input v-model="headVo.gEnName" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodsEnConent" ></el-button>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form label-width="140px" size="mini" label-position="right" v-else @keyup.enter.native="switchFoucsByEnter">
         <el-row >
            <el-col :span="24">
              <el-form-item label="境内收发货人名称(外文)" class="sys-d-title">
                <el-input v-model="headVo.domesticConsigneeEname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="境外收发货人名称(中文)" class="sys-d-title">
                <el-input v-model="headVo.overseasConsignorCname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item label="商品英文名称">
                <el-col :span="20">
                  <el-input v-model="headVo.gEnName" disabled></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button  class="btn-pop" icon="fa fa-ellipsis-h" @click="openGoodsEnConent" ></el-button>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="layer-btn" @click="savedDcElements" :disabled="isDisabled">保存</el-button>
      </span>
    </el-dialog>
    <goods-ename :goodsEnNameVisible.sync="goodsEnNameVisible" :gEnName='headVo.gEnName' @close:goodsEnName="backGoodsEnName" :isDisabled='isDisabled' :goodsEnNameList="goodsEnNameList"></goods-ename>
  </section>
</template>
<script>
import goodsEname from './goodsEname'
import util from '@/common/util'
import decUtil from '../../common/decUtil'
export default {
  name: 'ciq-elements',
  props: {
    decElementsVisible: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    iEFlag: {
      type: String,
      default: 'I'
    },
    initCiqElements: { // 表头数据
      type: Object,
      default: () => {
        return {
          cmplDschrgDt: '', // 卸毕日期
          domesticConsigneeEname: '', // 境内收发货人名称(外文)
          overseasConsignorCname: '', // 境外收发货人名称(中文)
          overseasConsignorAddr: '', // 境外发货人地址
          gEnName: '', // 商品英文名称
          goodsEnNameVisible: [],
          decRequestCerts: []
        }
      }
    },
    goodsEnNameList: {
      type: Array
    }
  },
  components: {
    goodsEname
  },
  data () {
    return {
      goodsEnNameVisible: false,
      elementsList: [],
      decElementsList: [],
      checkedDecElementsList: [],
      headVo: {
        cmplDschrgDt: '', // 卸毕日期
        domesticConsigneeEname: '', // 境内收发货人名称(外文)
        overseasConsignorCname: '', // 境外收发货人名称(中文)
        overseasConsignorAddr: '', // 境外发货人地址
        gEnName: '' // 商品英文名称
      },
      decRequestCerts: []
    }
  },
  methods: {
    // 卸毕日期的change事件 如果 卸毕日期为null 则 赋值为空
    cmplDschrgDtChange () {
      if (!this.headVo.cmplDschrgDt) {
        this.headVo.cmplDschrgDt = ''
      }
    },
    openGoodsEnConent () {
      this.goodsEnNameVisible = true
    },
    decElementsShow () {
      this.headVo.cmplDschrgDt = this.initCiqElements.cmplDschrgDt
      this.headVo.domesticConsigneeEname = this.initCiqElements.domesticConsigneeEname
      this.headVo.overseasConsignorCname = this.initCiqElements.overseasConsignorCname
      this.headVo.overseasConsignorAddr = this.initCiqElements.overseasConsignorAddr
      this.headVo.gEnName = this.initCiqElements.gEnName
      this.decRequestCerts = util.simpleClone(this.initCiqElements.decRequestCerts)
      this.checkedDecElementsList = []
      if (window.localStorage.getItem('decElementsList')) {
        this.elementsList = JSON.parse(window.localStorage.getItem('decElementsList'))
      }
      // 初始化选中的值
      let list = this.decRequestCerts
      this.$nextTick(_ => {
        if (list.length > 0) {
          list.forEach(item => {
            this.$refs.decElementsTable.toggleRowSelection(this.elementsList.find(d => {
              if (d.appCertCode.toString() === item.appCertCode) {
                this.checkedDecElementsList.push(d)
                return true
              }
            }), true)
          })
        } else {
          this.$refs.decElementsTable.clearSelection()
        }
      })
      for (let i in this.decRequestCerts) {
        for (let n in this.elementsList) {
          if (this.decRequestCerts[i].gNo === this.elementsList[n].gNo) {
            this.elementsList[n].applCopyQuan = this.decRequestCerts[i].applCopyQuan
            this.elementsList[n].applOri = this.decRequestCerts[i].applOri
            break
          }
        }
      }
    },
    // 检验检疫申报要素 给选中的数据赋值
    decElementsChangeFun (value) {
      this.checkedDecElementsList = util.simpleClone(value)
    },
    // 检验检疫申报要素  保存
    savedDcElements () {
      let decRequestCertsArr = util.simpleClone(this.checkedDecElementsList)
      // 重新设置一下 手动填写的参数，以防止 先勾选数据后填写表格时出现的没有赋值上的问题
      for (let i in decRequestCertsArr) {
        for (let n in this.elementsList) {
          if (decRequestCertsArr[i].gNo === this.elementsList[n].gNo) {
            decRequestCertsArr[i].applCopyQuan = this.elementsList[n].applCopyQuan
            decRequestCertsArr[i].applOri = this.elementsList[n].applOri
            break
          }
        }
      }
      let nameList = []
      for (let i in decRequestCertsArr) {
        nameList.push(decRequestCertsArr[i].appCertName)
      }
      this.$refs.decElementsTable.clearSelection()
      this.$emit('close:ciqElements', {
        appCertName: nameList.join(','),
        decRequestCerts: decRequestCertsArr,
        headVo: util.simpleClone(this.headVo)
      })
      this.headVo = {
        cmplDschrgDt: '', // 卸毕日期
        domesticConsigneeEname: '', // 境内收发货人名称(外文)
        overseasConsignorCname: '', // 境外收发货人名称(中文)
        overseasConsignorAddr: '', // 境外发货人地址
        gEnName: '' // 商品英文名称
      }
      this.decRequestCerts = []
    },
    closeCompnent () {
      this.$refs.decElementsTable.clearSelection()
      this.$emit('close:ciqElements', {
        headVo: this.headVo
      })
    },
    backGoodsEnName (param) {
      if (param) {
        this.headVo.gEnName = param.gEnName
      }
      this.goodsEnNameVisible = false
    },
    // 调用切换焦点的方法
    switchFoucsByEnter (e) {
      decUtil.switchFoucsByEnter(e, this.foucsByEnter)
    },
    foucsByEnter (e, next, secondNext) {
      // 下个元素存在
      if (next) {
        if (e.target.attributes.enter && e.target.attributes.enter.nodeValue === 'no') {
          return false
        } else {
          next.focus()
          next.select()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/decCss';
 .border{
    border: 1px solid #B7B7B7;
    border-bottom: 0;
 }
 .m-t-10{
    margin-top: 10px;
  }
</style>
