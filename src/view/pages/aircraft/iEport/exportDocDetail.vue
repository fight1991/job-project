<template>
  <section class='sys-main'>
    <!-- 头部 -->
    <el-row class='sys-header'>
      <el-form label-width="0px">
        <el-row v-if="isEdit" class="mg-b-15">
          <el-button size="mini" class="default-btn" @click="saveData(false)">暂存</el-button>
          <el-button type="primary" size="mini" class="primary-btn" @click="declare">申报</el-button>
        </el-row>
      </el-form>
    </el-row>
    <!-- 头部end -->
    <!-- 主显示框 -->
    <el-row class="airvehicle-panel airvehicle-form">
      <el-form :label-width="isEdit?'92px':'173px'" :model="submitData" ref="submitData" :rules="rules" size="mini">
        <el-row class="import-edit-title">航空器动态信息</el-row>
        <el-row :gutter="30" class="pd-l-15">
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航空器注册编号':'航空器注册编号：'" prop="aircraftNo" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable maxlength="25" v-model="submitData.aircraftNo"  v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.aircraftNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航班号':'航班号：'" prop="flightNo">
              <el-input size="mini" clearable maxlength="20" v-model="submitData.flightNo" v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.flightNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'航班日期':'航班日期：'" prop="flightDate">
              <el-date-picker size="mini" v-model="submitData.flightDate" v-if="isEdit" type="date" style="width:100%"></el-date-picker>
              <span v-else class="color-txt">{{submitData.flightDate | date('yyyy-MM-dd')}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'驶离港口':'驶离港口：'" prop="departurePort">
              <el-select size="mini" v-model="submitData.departurePort" v-if="isEdit" style="width:100%;"
                @focus="tipsFillMessage('portList','SAAS_SW_AIRPORT_CODE')"
                filterable remote default-first-option clearable
                :remote-method="checkParamsList"
                @change="checkParamsList">
                <el-option
                  v-for="item in portList"
                  :key="item.codeField"
                  :label="item.codeField+'-'+item.nameField"
                  :value="item.codeField">
                </el-option>
              </el-select>
              <span v-else class="color-txt">{{submitData.departurePort}}-{{submitData.departurePortValue}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'海关关区':'海关关区：'">
              <el-select size="mini" v-model="submitData.cusCustomsCode" v-if="isEdit" style="width:100%;"
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
              </el-select>
              <span v-else class="color-txt">{{submitData.cusCustomsCode}}-{{submitData.cusCustomsCodeValue}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'驶离时间':'驶离时间：'" prop="dTime">
              <el-date-picker  v-if="isEdit" v-model="submitData.dTime" style="width:100%" type="datetime" placeholder=""></el-date-picker>
              <span v-else class="color-txt">{{submitData.dTime | date()}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'停靠机位':'停靠机位：'" prop="arrivalPosition">
              <el-input size="mini" v-model.number="submitData.arrivalPosition" maxlength="35" clearable v-if="isEdit"></el-input>
              <span v-else class="color-txt">{{submitData.arrivalPosition}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'机组人数':'机组人数：'" prop="aircrewSum">
              <el-input size="mini" v-model.number="submitData.aircrewSum" maxlength="5" clearable v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.aircrewSum!==''&& submitData.aircrewSum!== null?submitData.aircrewSum+'人':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'国际旅客人数':'国际旅客人数：'" prop="interPassengerSum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.interPassengerSum" maxlength="5" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.interPassengerSum!==''&& submitData.interPassengerSum!== null?submitData.interPassengerSum+'人':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'国内旅客人数':'国内旅客人数：'" prop="localePassengerSum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.localePassengerSum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.localePassengerSum!==''&& submitData.localePassengerSum!== null?submitData.localePassengerSum+'人':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'国际行李件数':'国际行李件数：'" prop="interBaggageNum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.interBaggageNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.interBaggageNum!==''&& submitData.interBaggageNum!== null?submitData.interBaggageNum+'件':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'国内行李件数':'国内行李件数：'" prop="localeBaggageNum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.localeBaggageNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.localeBaggageNum!==''&& submitData.localeBaggageNum!== null?submitData.localeBaggageNum+'件':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'旅客名单份数':'旅客名单份数：'" prop="passengerBillNum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.passengerBillNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.passengerBillNum!==''&& submitData.passengerBillNum!== null?submitData.passengerBillNum+'份':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'机组名单份数':'机组名单份数：'" prop="aircrewBillNum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.aircrewBillNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.aircrewBillNum!==''&& submitData.aircrewBillNum!== null?submitData.aircrewBillNum+'份':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'机组物品申报单份数':'机组物品申报单份数：'" prop="aircrewCargoBillNum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.aircrewCargoBillNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.aircrewCargoBillNum!==''&& submitData.aircrewCargoBillNum!== null?submitData.aircrewCargoBillNum+'份':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'货物申报单份数':'货物申报单份数：'" prop="cargoBillNum" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.cargoBillNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.cargoBillNum!==''&& submitData.cargoBillNum!== null?submitData.cargoBillNum+'份':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'货邮件数':'货邮件数：'" prop="goodsNum">
              <el-input size="mini" clearable v-model.number="submitData.goodsNum" maxlength="10" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.goodsNum!==''&& submitData.goodsNum!== null?submitData.goodsNum+'件':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'货邮重量(千克)':'货邮重量(千克)：'" prop="goodsQuantity" :class="{'more-txt-lh': isEdit}">
              <el-input size="mini" clearable v-model.number="submitData.goodsQuantity" maxlength="35" v-if="isEdit"></el-input>
              <span v-else class="color-txt" v-text="submitData.goodsQuantity!==''&& submitData.goodsQuantity!== null?submitData.goodsQuantity+'千克':''"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'是否有健康异常':'是否有健康异常：'" prop="healthStatus" :class="{'more-txt-lh': isEdit}">
              <el-select size="mini" v-model="submitData.healthStatus" v-if="isEdit" clearable style="width:100%;">
                <el-option v-for="item in statusList" :value="item.value" :label="item.text" :key="item.value"></el-option>
              </el-select>
              <span v-else class="color-txt" v-text="submitData.healthStatus === '1'?'是':'否'"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'是否发现病媒生物':'是否发现病媒生物：'" prop="vectorOrganisms" :class="{'more-txt-lh': isEdit}">
              <el-select size="mini" v-model="submitData.vectorOrganisms" v-if="isEdit" clearable style="width:100%;">
                <el-option v-for="item in statusList" :value="item.value" :label="item.text" :key="item.value"></el-option>
              </el-select>
              <span v-else class="color-txt" v-text="submitData.vectorOrganisms === '1'?'是':'否'"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'是否发现外来有害生物':'是否发现外来有害生物：'" prop="harmfulOrganisms" :class="{'more-txt-lh': isEdit}">
              <el-select size="mini" v-model="submitData.harmfulOrganisms" v-if="isEdit" clearable style="width:100%;">
                <el-option v-for="item in statusList" :value="item.value" :label="item.text" :key="item.value"></el-option>
              </el-select>
              <span v-else class="color-txt" v-text="submitData.vectorOrganisms === '1'?'是':'否'"></span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="6">
            <el-form-item :label="isEdit?'是否有有效灭蚊证明':'是否有有效灭蚊证明：'" prop="mosquitoEradication" :class="{'more-txt-lh': isEdit}">
              <el-select size="mini" v-model="submitData.mosquitoEradication" v-if="isEdit" clearable style="width:100%;">
                <el-option v-for="item in statusList" :value="item.value" :label="item.text" :key="item.value"></el-option>
              </el-select>
              <span v-else class="color-txt" v-text="submitData.vectorOrganisms === '1'?'是':'否'"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="airvehicle-form-row pd-l-15 mg-b-10" :gutter="30">
          <el-col :span="24" v-if="isEdit">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="submitData.memo" rows="2" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="备注：">
              <span class="break-text color-txt">{{submitData.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row class="airvehicle-panel airvehicle-table">
      <el-row class="import-edit-title">机组名单信息</el-row>
      <el-row class="airvehicle-table-icon mg-b-15" v-if="isEdit">
        <el-button size="mini" class="list-btns list-icon-delete" @click="deletes"><i></i>删除</el-button>
        <div class="airvehicle-list-drop" style="float:right;">
          <el-popover popper-class="airvehicle-table-popper">
            <ul>
              <li v-for="(item,index) in thList" :key="index">
                <el-checkbox size="mini" v-model="item.value">{{item.text}}</el-checkbox>
              </li>
            </ul>
            <el-button size="mini" class="list-btns list-btn-drop list-icon-dropdown" slot="reference"><i></i></el-button>
          </el-popover>
        </div>
      </el-row>
      <el-table class='sys-table-table' :data="submitData.cdsAirMemberVO" :height="250" border highlight-current-row size="mini" @selection-change="selectVal">
        <el-table-column  type="selection" min-width="50" align="center" v-if="isEdit"></el-table-column>
        <el-table-column label="序号" width="100" prop="serialNo" align="left" v-if="thList[0].value"></el-table-column>
        <el-table-column label="姓名" prop="mName" min-width="100" align="center" v-if="thList[1].value"></el-table-column>
        <el-table-column label="性别" min-width="50" align="center" v-if="thList[2].value">
          <template slot-scope="scope">
            <div v-text="scope.row.gender==='M'?'男':'女'"></div>
          </template>
        </el-table-column>
        <el-table-column label="国籍" prop="nationalityValue" align="center" min-width="180" v-if="thList[3].value"></el-table-column>
        <el-table-column label="职务" prop="careerValue" align="left" min-width="150" v-if="thList[4].value"></el-table-column>
        <el-table-column label="证件类型" prop="certTypeValue" align="left" min-width="150" v-if="thList[5].value"></el-table-column>
        <el-table-column label="证件号" prop="certNo" align="left" min-width="150" v-if="thList[6].value"></el-table-column>
        <el-table-column label="备注" prop="memo" align="left" min-width="180" v-if="thList[7].value"></el-table-column>
      </el-table>
    </el-row>
    <!-- 主显示框end -->
  </section>
</template>
<script>
import util from '@/common/util'
import validator from '@/common/validator'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      rules: {
        aircraftNo: [{ required: true, message: '请输入航空器注册编号', trigger: 'blur' }],
        flightNo: [{ required: true, message: '请输入航班号', trigger: 'blur' }, { validator: validator.numEn, message: '请输入大写英文、数字', trigger: 'blur' }],
        interPassengerSum: [{ required: true, message: '请输入国际旅客人数', trigger: 'blur' }, {validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        aircrewSum: [{ required: true, message: '请输入机组人数', trigger: 'blur' }, {validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        flightDate: [{ required: true, message: '请选择航班日期', trigger: 'blur' }],
        departurePort: [{ required: true, message: '请选择驶离港口', trigger: 'change' }],
        dTime: [{ required: true, message: '请选择驶离时间', trigger: 'blur' }],
        healthStatus: [{ required: true, message: '请选择是否有健康异常', trigger: 'change' }],
        vectorOrganisms: [{ required: true, message: '请选择是否发现病媒生物', trigger: 'change' }],
        harmfulOrganisms: [{ required: true, message: '请选择是否发现外来有害生物', trigger: 'change' }],
        mosquitoEradication: [{ required: true, message: '请选择是否有有效灭蚊证明', trigger: 'change' }],
        arrivalPosition: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        localePassengerSum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        interBaggageNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        localeBaggageNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        passengerBillNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        aircrewBillNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        aircrewCargoBillNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        cargoBillNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        goodsNum: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}],
        goodsQuantity: [{validator: this.validateNum, message: '请输入数字', trigger: 'blur'}]
      },
      submitData: {
        aircraftNo: '',
        flightNo: '',
        departurePort: '',
        healthStatus: '',
        vectorOrganisms: '',
        harmfulOrganisms: '',
        mosquitoEradication: '',
        interPassengerSum: '',
        aircrewSum: '',
        flightDate: '',
        dTime: '',
        arrivalPosition: '',
        cusCustomsCode: '',
        memo: '',
        localePassengerSum: '',
        localeBaggageNum: '',
        interBaggageNum: '',
        goodsQuantity: '',
        goodsNum: '',
        cargoBillNum: '',
        aircrewCargoBillNum: '',
        aircrewBillNum: '',
        passengerBillNum: '',
        cdsAirMemberVO: []
      }, // 查询传参
      statusList: [{
        value: '0',
        text: '否'
      }, {
        value: '1',
        text: '是'
      }], // 是否列表
      isEdit: true, // true 编辑 false 详情
      thList: [{
        value: true,
        text: '序号'
      }, {
        value: true,
        text: '姓名'
      }, {
        value: true,
        text: '性别'
      }, {
        value: true,
        text: '国籍'
      }, {
        value: true,
        text: '职务'
      }, {
        value: true,
        text: '证件类型'
      }, {
        value: true,
        text: '证件号'
      }, {
        value: true,
        text: '备注'
      }], // 表头
      resultList: [], // 表格数据
      tableNameList: {
        tableNames: [
          'SAAS_SW_AIRPORT_CODE', // 港口
          'SAAS_CUSTOMS_REL' // 海关关区
        ]
      }, // 字典标明
      selectObj: {
        obj: '',
        params: ''
      },
      selectList: [{
        obj: 'cusCustomsCodeList',
        params: 'SAAS_CUSTOMS_REL'
      }, {
        obj: 'portList',
        params: 'SAAS_SW_AIRPORT_CODE'
      }],
      portList: [], // 抵达港口数据
      cusCustomsCodeList: [], // 海关关区数据
      selectData: []
    }
  },
  created () {
    this.getCommonParam()
    if (this.$route.params.type === 'edit') {
      this.isEdit = true
    } else {
      this.isEdit = false
    }
  },
  mounted () {
  },
  methods: {
    // 判断缓存中是否有数据
    getCommonParam () {
      let map = {tableNames: []}
      map.tableNames = commonParam.isRequire(this.tableNameList.tableNames)
      if (map.tableNames.length > 0) {
        this.getCommonParams(map)
      } else {
        this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE')).slice(0, 30)
        this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
        this.getDetail(false)
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
          this.portList = JSON.parse(window.localStorage.getItem('SAAS_SW_AIRPORT_CODE')).slice(0, 30)
          this.cusCustomsCodeList = JSON.parse(window.localStorage.getItem('SAAS_CUSTOMS_REL')).slice(0, 30)
          this.getDetail(false)
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
      if (query) {
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
    // 校验数字
    validateNum (rule, value, callback) {
      if (!util.isEmpty(value)) {
        if (!Number.isInteger(Number(value))) {
          callback(new Error(''))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 暂存
    saveData (type) {
      this.$refs['submitData'].validate((valId) => {
        if (!valId) {
          return false
        }
        this.submitData.ioFlag = 'O'
        if (this.submitData.localePassengerSum === '' || this.submitData.localePassengerSum === null) {
          this.submitData.localePassengerSum = '0'
        }
        if (this.submitData.localeBaggageNum === '' || this.submitData.localeBaggageNum === null) {
          this.submitData.localeBaggageNum = '0'
        }
        if (this.submitData.interBaggageNum === '' || this.submitData.interBaggageNum === null) {
          this.submitData.interBaggageNum = '0'
        }
        if (this.submitData.goodsQuantity === '' || this.submitData.goodsQuantity === null) {
          this.submitData.goodsQuantity = '0'
        }
        if (this.submitData.goodsNum === '' || this.submitData.goodsNum === null) {
          this.submitData.goodsNum = '0'
        }
        if (this.submitData.cargoBillNum === '' || this.submitData.cargoBillNum === null) {
          this.submitData.cargoBillNum = '0'
        }
        if (this.submitData.aircrewCargoBillNum === '' || this.submitData.aircrewCargoBillNum === null) {
          this.submitData.aircrewCargoBillNum = '0'
        }
        if (this.submitData.aircrewBillNum === '' || this.submitData.aircrewBillNum === null) {
          this.submitData.aircrewBillNum = '0'
        }
        if (this.submitData.passengerBillNum === '' || this.submitData.passengerBillNum === null) {
          this.submitData.passengerBillNum = '0'
        }
        if (this.submitData.arrivalPosition === '' || this.submitData.arrivalPosition === null) {
          this.submitData.arrivalPosition = '0'
        }
        // 重新排序
        for (let i in this.submitData.cdsAirMemberVO) {
          this.submitData.cdsAirMemberVO[i].serialNo = parseInt(i) + 1
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/common/saveCdsAirMainDeclareVO',
          data: this.submitData,
          router: this.$router,
          success: (res) => {
            if (!type) {
              this.$message({
                message: '暂存成功',
                type: 'success'
              })
            }
            this.getDetail(false)
            // this.$router.push({name: '出境、港单证申报'})
          }
        })
      })
    },
    // 申报
    declare () {
      let ids = []
      ids.push(this.$route.params.id)
      let data = {
        ids: ids,
        operType: '0'
      }
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/declareCdsAirDoc',
        data: data,
        router: this.$router,
        success: (res) => {
          this.$message({
            message: res.result.statusValue,
            type: 'success'
          })
          this.getDetail(false)
        }
      })
    },
    // 获取详情
    getDetail (type) {
      this.$store.dispatch('ajax', {
        url: 'API@/dec-common/cds/common/getCdsMainDeclare',
        data: {preMainDeclareId: this.$route.params.id},
        router: this.$router,
        success: (res) => {
          if (!util.isEmpty(res.result)) {
            this.submitData = res.result
            if (this.submitData.arrivalPosition === '' || this.submitData.arrivalPosition === null) {
              this.submitData.arrivalPosition = '0'
            }
            if (this.submitData.localePassengerSum === '' || this.submitData.localePassengerSum === null) {
              this.submitData.localePassengerSum = '0'
            }
            if (this.submitData.localeBaggageNum === '' || this.submitData.localeBaggageNum === null) {
              this.submitData.localeBaggageNum = '0'
            }
            if (this.submitData.interBaggageNum === '' || this.submitData.interBaggageNum === null) {
              this.submitData.interBaggageNum = '0'
            }
            if (this.submitData.goodsQuantity === '' || this.submitData.goodsQuantity === null) {
              this.submitData.goodsQuantity = '0'
            }
            if (this.submitData.goodsNum === '' || this.submitData.goodsNum === null) {
              this.submitData.goodsNum = '0'
            }
            if (this.submitData.cargoBillNum === '' || this.submitData.cargoBillNum === null) {
              this.submitData.cargoBillNum = '0'
            }
            if (this.submitData.aircrewCargoBillNum === '' || this.submitData.aircrewCargoBillNum === null) {
              this.submitData.aircrewCargoBillNum = '0'
            }
            if (this.submitData.aircrewBillNum === '' || this.submitData.aircrewBillNum === null) {
              this.submitData.aircrewBillNum = '0'
            }
            if (this.submitData.passengerBillNum === '' || this.submitData.passengerBillNum === null) {
              this.submitData.passengerBillNum = '0'
            }
            for (let i of this.selectList) {
              if (i.obj === 'cusCustomsCodeList') {
                this.selectObj = i
                this.checkParamsList(this.submitData.cusCustomsCode)
              } else {
                this.selectObj = i
                this.checkParamsList(this.submitData.departurePort)
              }
            }
            if (type) {
              this.saveData(true)
            }
          }
        }
      })
    },
    // 多选框
    selectVal (val) {
      this.selectData = val
    },
    // 删除
    deletes () {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'error'
        })
        return false
      }
      this.$confirm('确定删除选中数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        let ids = []
        for (let i of this.selectData) {
          ids.push(i.memberId)
        }
        let data = {
          ids: ids,
          type: '3'
        }
        this.$store.dispatch('ajax', {
          url: 'API@/dec-common/cds/common/deleteCds',
          data: data,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getDetail(true)
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import (less) '../css/common.less';
</style>
