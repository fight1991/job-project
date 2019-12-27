<template>
  <section class='sys-main'>
    <!-- 返回按钮 -->
    <el-row>
      <el-col :span='12' :xs='24'>
        <span @click="back" class="sys-back-btn list-icon-back"><i style='margin-bottom: 3px;'></i>返回</span>
      </el-col>
      <el-col :span='12' :xs='24'>
        <div style="text-align: right;"><el-button size="mini" type="primary" v-if="isDeclare" @click="declare">申报</el-button></div>
      </el-col>
    </el-row>
    <!-- 返回按钮 end-->
    <el-row>
      <div class='query-body'>
        <el-row class="form-table-panel">
          <el-form :model="headData" label-width="150px" size="mini">
            <el-row>
              <el-col :span="6">
                <el-form-item label="进出口口岸">
                  <!-- <el-select size="mini" v-model="headData.iEPort"  :disabled="isDetail" style="width:100%;" placeholder=" "
                    @focus="tipsFillMessage('cusCustomsCodeList','SAAS_CUSTOMS_REL')"
                    filterable remote default-first-option clearable
                    :remote-method="checkParamsList"
                    @change="checkParamsList">
                    <el-option
                      v-for="item in cusCustomsCodeList"
                      :key="item.codeField"
                      :label="item.codeField+'-'+item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="headData.iEPortValue" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录入单位">
                  <el-input v-model="headData.inputCompanyName" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="操作员">
                  <el-input v-model="headData.operateName" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报状态">
                  <el-select v-model="headData.rtnFlag" filterable style="width:100%;" :disabled="isDetail">
                    <el-option v-for="(item,index) in rtnList" :key="item.value+index" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="总运单号">
                  <el-input v-model="headData.billNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="舱单进出口标志">
                  <el-select v-model="headData.iEFlag" placeholder=" " :disabled="isDetail" style="width:100%;" filterable>
                    <el-option v-for="item in iEFlagList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="统一编号">
                  <el-input :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运输工具航次(班)号">
                  <el-input v-model="headData.voyageNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="中文运输工具名称">
                  <el-input v-model="headData.trafCnName" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="英文运输工具名称">
                  <el-input v-model="headData.trafEnName" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="进港日期">
                  <el-input v-model="headData.iEDate" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="起运港/抵运港">
                  <!-- <el-select size="mini" v-model="headData.destinationPort" placeholder=" " style="width:100%;" :disabled="isDetail"
                    @focus="tipsFillMessage('portList','SAAS_PORT')"
                    filterable remote default-first-option clearable
                    :remote-method="checkParamsList"
                    @change="checkParamsList">
                    <el-option
                      v-for="item in portList"
                      :key="item.codeField"
                      :label="item.codeField+'-'+item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="headData.destinationPortValue" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="分运单总数">
                  <el-input v-model="headData.billNum" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总重量(公斤)">
                  <el-input v-model="headData.tGrossWt" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总件数">
                  <el-input v-model="headData.tPackNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运输方式">
                  <!-- <el-select size="mini" v-model="headData.trafMode" placeholder=" " style="width:100%;" :disabled="isDetail"
                    @focus="tipsFillMessage('trafList','SAAS_TRANSPORT_TYPE')"
                    filterable remote default-first-option clearable
                    :remote-method="checkParamsList"
                    @change="checkParamsList">
                    <el-option
                      v-for="item in trafList"
                      :key="item.codeField"
                      :label="item.codeField+'-'+item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="headData.trafModeValue" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="记录类型">
                  <el-select v-model="headData.applType" placeholder=" " :disabled="isDetail" style="width:100%;" filterable>
                    <el-option v-for="item in recordTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报日期">
                  <el-input v-model="headData.dDate" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <span class="no-input"></span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
      </div>
    </el-row>
    <el-row>
      <div class='query-body'>
        <el-row class="mg-b-20">
          <el-table class='sys-table-table express-table' :data="headData.mftList" border highlight-current-row size="mini" @row-click="rowClick">
            <el-table-column label="顺序号" min-width="110">
              <template slot-scope="scope">
                <div class='sys-td-l'>{{scope.row.orderNo}}</div>
              </template>
            </el-table-column>
            <el-table-column label="分运单号" min-width="130">
              <template slot-scope="scope">
                <div class='sys-td-l'>{{scope.row.assBillNo}}</div>
              </template>
            </el-table-column>
            <el-table-column label="主要货物名称" min-width="160">
              <template slot-scope="scope">
                <div class='sys-td-l'>{{scope.row.mainGName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="件数" min-width="110">
              <template slot-scope="scope">
                <div class='sys-td-r'>{{scope.row.packNo}}</div>
              </template>
            </el-table-column>
            <el-table-column label="重量" min-width="110">
              <template slot-scope="scope">
                <div class='sys-td-r'>{{scope.row.grossWt}}</div>
              </template>
            </el-table-column>
            <el-table-column label="价值" min-width="110">
              <template slot-scope="scope">
                <div class='sys-td-r'>{{scope.row.tradeTotal}}</div>
              </template>
            </el-table-column>
            <el-table-column label="币制" min-width="110">
              <template slot-scope="scope">
                <div class='sys-td-c'>{{scope.row.tradeCurrValue}}</div>
              </template>
            </el-table-column>
            <el-table-column label="申报日期" width="140">
              <template slot-scope="scope">
                <div class='sys-td-c'>{{scope.row.dDate}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="form-table-panel">
          <el-form :model="bodyData" label-width="150px" size="mini">
            <el-row>
              <el-col :span="6">
                <el-form-item label="顺序号">
                  <el-input v-model="bodyData.orderNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总运单号">
                  <el-input v-model="bodyData.billNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="分运单号">
                  <el-input v-model="bodyData.assBillNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="主要货物名称">
                  <el-input v-model="bodyData.mainGName" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="件数">
                  <el-input v-model="bodyData.packNo" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="重量(公斤)">
                  <el-input v-model="bodyData.grossWt" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="价值">
                  <el-input v-model="bodyData.tradeTotal" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="币制">
                  <!-- <el-select size="mini" v-model="bodyData.tradeCurr" placeholder=" " style="width:100%;" :disabled="isDetail"
                    @focus="tipsFillMessage('curList','SAAS_CURR')"
                    filterable remote default-first-option clearable
                    :remote-method="checkParamsList"
                    @change="checkParamsList">
                    <el-option
                      v-for="item in curList"
                      :key="item.codeField"
                      :label="item.codeField+'-'+item.nameField"
                      :value="item.codeField">
                    </el-option>
                  </el-select> -->
                  <el-input v-model="bodyData.tradeCurrValue" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="申报日期">
                  <el-input v-model="bodyData.dDate" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="">
                  <span class="no-input"></span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
      </div>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      isDetail: false, // 是否是详情
      headData: {},
      detailList: [],
      bodyData: {},
      iEFlagList: [{
        value: 'I',
        label: '进口'
      }, {
        value: 'E',
        label: '出口'
      }], // 舱单进出口标志
      recordTypeList: [{
        value: 'M',
        label: '追加或修改'
      }, {
        value: 'N',
        label: '新增'
      }], // 记录类型
      tableNameList: {
        tableNames: [
          'SAAS_CUSTOMS_REL', // 海关关区
          'SAAS_PORT', // 港口
          'SAAS_TRANSPORT_TYPE', // 运输方式
          'SAAS_CURR' // 币制
        ]
      }, // 字典标明
      selectObj: {
        obj: '',
        params: ''
      },
      cusCustomsCodeList: [],
      portList: [],
      trafList: [],
      curList: [],
      rtnList: [{
        value: 'DD',
        label: '暂存'
      }, {
        value: 'DZ',
        label: '发送中'
      }, {
        value: 'DN',
        label: '发送失败'
      }, {
        value: 'NN',
        label: '海关入库失败'
      }, {
        value: 'NY',
        label: '海关入库成功'
      }, {
        value: 'DN',
        label: '数据中心入库失败'
      }, {
        value: 'DY',
        label: '数据中心入库成功'
      }], // 状态
      isDeclare: true // 是否显示申报按钮
    }
  },
  watch: {
    '$route' (newVal, oldVal) {
      if (newVal.name === 'shipBillDetail') {
        this.getDetail()
        if (this.$route.params.status === 'DD') {
          this.isDeclare = true
        } else {
          this.isDeclare = false
        }
      }
    }
  },
  created () {
    this.getCommonParam()
    if (this.$route.params.type === 'detail') {
      this.isDetail = true
      if (this.$route.params.status === 'DD') {
        this.isDeclare = true
      } else {
        this.isDeclare = false
      }
    }
  },
  methods: {
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      } else {
        this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL'))
        this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE'))
        this.trafList = JSON.parse(window.localStorage.getItem('SAAS_TRANSPORT_TYPE'))
        this.curList = JSON.parse(window.localStorage.getItem('SAAS_CURR'))
        this.getDetail()
      }
    },
    // 获取公共字典list
    getCommonParams (datas) {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/dictionary/getParam',
        data: datas,
        router: this.$router,
        success: (res) => {
          commonParam.saveParams(res.result)
          this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL'))
          this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE'))
          this.trafList = JSON.parse(window.localStorage.getItem('SAAS_TRANSPORT_TYPE'))
          this.curList = JSON.parse(window.localStorage.getItem('SAAS_CURR'))
          this.getDetail()
        }
      })
    },
    // 提示需要填写的内容
    tipsFillMessage (obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    checkParamsList (query) {
      if (query !== '') {
        let keyValue = query.toString().trim()
        let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
        let filterList = []
        if (util.isEmpty(keyValue)) {
          this[this.selectObj.obj] = list.slice(0, 30)
        } else {
          filterList = list.filter(item => {
            let str = item.codeField + '-' + item.nameField
            return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
          })
          this[this.selectObj.obj] = filterList.slice(0, 30)
        }
      } else {
        if (!util.isEmpty(JSON.parse(window.localStorage.getItem(this.selectObj.params)))) {
          this[this.selectObj.obj] = JSON.parse(window.localStorage.getItem(this.selectObj.params)).slice(0, 30)
        }
      }
    },
    // 获取详情
    getDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/queryMftDetail',
        data: {mftHeadPid: this.$route.params.id},
        router: this.$router,
        success: (res) => {
          this.headData = util.isEmpty(res.result) ? {} : res.result
          this.bodyData = {}
        }
      })
    },
    // 申报
    declare () {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/nexp/customs/declareMft',
        data: {mftHeadPids: [this.$route.params.id]},
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.result.statusValue,
            type: 'success'
          })
          this.getDetail()
          this.isDeclare = false
        }
      })
    },
    // 返回
    back () {
      // this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        name: 'shipBillList'
      })
    },
    // 点击行显示详情
    rowClick (row) {
      this.bodyData = {}
      this.bodyData = util.simpleClone(row)
      this.bodyData.billNo = this.headData.billNo
    }
  }
}
</script>
<style lang="less" scoped>
.no-input{
  display: inline-block;
}
.mg-b-20{
  margin-bottom: 20px;
}
</style>
