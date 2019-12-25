<template>
  <!-- 业务跟踪明细组件 -->
  <section>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="业务跟踪" name="bussiness">
        <div class='query-table'>
          <!-- 列表 list -->
          <el-table class='sys-table-table'
            :data="dataList" border
            highlight-current-row
            size="mini"  height="400">
            <el-table-column label="时间" prop="date" min-width="100"></el-table-column>
            <el-table-column label="系统状态" prop="statusValue" min-width="80">
              <template slot-scope="scope">
                <!-- 业务状态为审核驳回 -->
                <div v-if="scope.row.status == '4'">
                  <span class="red">{{scope.row.statusValue}}</span>
                </div>
                <div v-else>
                  <span>{{scope.row.statusValue}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="申报状态" prop="decStatusValue" min-width="120">
              <template slot-scope="scope">
                <!-- 异常节点:报关单状态为预录入接收失败 海关入库失败、退单、删单、查验通知 业务状态为 审核驳回-->
                <div v-if="scope.row.decStatus == '3'|| scope.row.decStatus == '5'|| scope.row.decStatus == '6'|| scope.row.decStatus == '8'|| scope.row.decStatus == '11'|| scope.row.status == '4' || scope.row.decStatusValue === '删单'|| scope.row.decStatusValue === '改单' || scope.row.decStatusValue === '查验'">
                  <span class="red">{{scope.row.decStatusValue}}</span>
                </div>
                <div v-else>
                  <span>{{scope.row.decStatusValue}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" min-width="300">
              <template slot-scope="scope">
                <!-- 业务状态为 接单生成 0 设置可以 -->
                <div v-if="scope.row.status == '0'">
                  <span>接单编号:</span>
                  <a href="javascript:void(0)" style='color: #409eff;' @click="lookBossInfo(scope.row)">{{scope.row.note}}</a>
                </div>
                <!-- 业务状态为预录入2 并且 报关单状态为 001-->
                <div v-else-if="scope.row.status == '2' && scope.row.note !== ''">
                  <span>报关单系统编号:</span>
                  <a href="javascript:void(0)" style='color: #409eff;' @click="lookDecInfo(scope.row)">{{scope.row.note}}</a>
                </div>
                <div v-else>
                  <span class="red" v-if="scope.row.decStatus == '3'|| scope.row.decStatus == '5'|| scope.row.decStatus == '6'|| scope.row.decStatusValue === '删单' || scope.row.decStatusValue === '改单' || scope.row.decStatusValue === '查验' || scope.row.decStatus == '11'|| scope.row.status == '4' || scope.row.status == '8'">{{scope.row.note}}</span>
                  <span v-else>{{scope.row.note}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作人" prop="updateUser" min-width="80"></el-table-column>
            <el-table-column label="更多信息"  min-width="120">
              <template slot-scope="scope">
                <!-- 业务状态 为审核驳回4 和业务状态为审核通过并且 报关状态为暂存的时候 显示 审核记录  && scope.row.decStatus === '001'-->
                <div v-if="(scope.row.status == '4' || scope.row.status == '6') && (scope.row.pkId !== null)">
                  <a href="javascript:void(0)" style='color: #409eff;' @click="lookDeCheck(scope.row)">审核记录</a>
                </div>
                <!-- 报关状态为退单时6，更多信息显示报关单备份按钮 -->
                <div v-if="scope.row.decStatus === '6'">
                  <a href="javascript:void(0)" style='color: #409eff;' @click="lookDecDetail(scope.row)">查看报关单</a>
                </div>
                <!-- 报关状态为 删改单时，并且操作状态 位A新增 U更新的时候显示删改单按钮 -->
                <div v-if="(scope.row.decStatusValue === '删单'|| scope.row.decStatusValue === '改单' || scope.row.decStatusValue === '查验') && (scope.row.delDecstatus === 'A' || scope.row.delDecstatus === 'U')">
                  <a href="javascript:void(0)" style='color: #409eff;' @click="lookDecdRegister(scope.row)">查看删改单</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="区块链溯源" name="blockchain">
        <el-table
          ref="blockchainTable"
          :data="blockchainList"
          highlight-current-row border
          size='mini'
          height="400" style="width: 100%">
          <el-table-column  type='index' label="序号" min-width="50"></el-table-column>
          <el-table-column  property="operateTime" label="时间" min-width="150"></el-table-column>
          <el-table-column  property="dataNode" label="溯源节点" min-width="120"></el-table-column>
          <el-table-column  property="matter" label="溯源信息" min-width="200"></el-table-column>
          <el-table-column  property="inputCompanyName" label="操作人所属企业" min-width="150"></el-table-column>
          <el-table-column  property="operator" label="操作人" min-width="100"></el-table-column>
          <el-table-column  property="hashCode" label="区块Hash" min-width="100"></el-table-column>
          <el-table-column  property="note" label="更多信息" min-width="100"></el-table-column>
          <el-table-column type="expand" fixed="right">
            <template slot-scope="props">
              <div style='padding:10px;'>
                <p style='font-weight:700;font-size: 13px;'>溯源信息:</p>
                <span>{{props.row.matter}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import util from '@/common/util'
import decUtil from '../decPage/common/decUtil'
export default {
  name: 'tracke-detail',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {
          bossId: '',
          decPid: ''
        }
      }
    }
  },
  data () {
    return {
      dataList: [], // 列表数据
      bossId: '',
      decPid: '',
      activeName: 'bussiness',
      blockchainList: []
    }
  },
  created () {
    let data = util.simpleClone(this.initParams)
    this.bossId = data.bossId
    this.decPid = data.decPid
    this.queryDetail()
    this.queryBlockchain()
  },
  mounted () {
  },
  methods: {
    configBtn () {
      this.$emit('backDatas')
    },
    cancleBtn () {
      this.$emit('cancLeData')
    },
    // 查询业务跟踪明细
    queryDetail () {
      let para = {}
      if (util.isEmpty(this.bossId)) {
        para['decPid'] = this.decPid
      } else {
        para['bossId'] = this.bossId
      }
      this.$post({
        url: 'API@/dec-common/ccba/review/decHisQueryDetail',
        data: para,
        success: (res) => {
          this.dataList = res.result
        }
      })
    },
    // 查询区块链信息
    queryBlockchain () {
      let para = {}
      // if (util.isEmpty(this.bossId)) {
      para['decPid'] = this.decPid
      // } else {
      para['bossId'] = this.bossId
      // }
      this.$post({
        url: 'API@/dec-common/ccba/log/getLogs',
        data: para,
        success: (res) => {
          this.blockchainList = res.result
        }
      })
    },
    // 打开审核
    lookDeCheck (row) {
      if (util.isEmpty(row.pkId)) {
        this.messageTips('数据未备份', 'error')
        return
      }
      this.$router.push({
        name: 'decReviewedLook',
        params: {
          'pid': row.pkId,
          'setTitle': '报关单审核预览' + '-' + row.pkId,
          'setId': 'decReviewedLook' + 'look' + row.pkId
        },
        query: {
          type: 'checkHistory'
        }
      })
    },
    // 查看报关单
    lookDecInfo (row) {
      if (util.isEmpty(row.declTrnrel) || util.isEmpty(row.iEFlag)) {
        return
      }
      let funFlag = 'declaration'
      let flag = 'import'
      let operationType = 'look'
      if (row.iEFlag === 'E') {
        flag = 'export'
      }
      let decPid = row.note
      if (row.declTrnrel === '2' || row.declTrnrel === '0') { // 报关单或备案清单
        if (row.declTrnrel === '2') {
          funFlag = 'recordList'
        }
        decUtil.gotoDecPage(funFlag, flag, operationType, decPid, 'dec', {}, this)
      } else {
        if (row.declTrnrel === '1') {
          funFlag = 'declaration'
        } else if (row.declTrnrel === '3') {
          funFlag = 'recordList'
        } else if (row.declTrnrel === '4') {
          funFlag = 'secondDec'
        }
        this.gotoTransPage(funFlag, flag, operationType, decPid)
      }
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 转关提前报关   recordList 转关提前备案清单 secondDec 出口二次转关
     * @param flag  进出口标识 import export
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoTransPage (funFlag, flag, operationType, pid = 'new', queryParam = {}) {
      let routeParam = {
        'declaration@import@look': {tabName: '进口转关提前报关', routeName: 'importTransitDecLook'},
        'declaration@import@edit': {tabName: '进口转关提前报关', routeName: 'importTransitDecEdit'},
        'declaration@export@look': {tabName: '出口转关提前报关', routeName: 'exportTransitDecLook'},
        'declaration@export@edit': {tabName: '出口转关提前报关', routeName: 'exportTransitDecEdit'},
        'recordList@import@look': {tabName: '进境转关提前备案清单', routeName: 'importTransitRecordListLook'},
        'recordList@import@edit': {tabName: '进境转关提前备案清单', routeName: 'importTransitRecordListEdit'},
        'recordList@export@look': {tabName: '出境转关提前备案清单', routeName: 'exportTransitRecordListLook'},
        'recordList@export@edit': {tabName: '出境转关提前备案清单', routeName: 'exportTransitRecordListEdit'},
        'secondDec@export@look': {tabName: '出口转关提前报关', routeName: 'exportTransitSecondDecLook'},
        'secondDec@export@edit': {tabName: '出口转关提前报关', routeName: 'exportTransitRecordListEdit'}
      }
      let para = `${funFlag}@${flag}@${operationType}`
      let routeName = routeParam[para].routeName
      let tabName = routeParam[para].tabName
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
        },
        query: queryParam
      })
    },
    // 查看接单
    lookBossInfo (row) {
      let routeName
      if (row.iEFlag === 'I') {
        routeName = 'iOrderReceiving'
      } else {
        routeName = 'eOrderReceiving'
      }
      this.$router.push({
        name: routeName,
        query: {
          'innerNo': row.note,
          setId: 'look' + routeName + row.note
        }
      })
    },
    // 查看备份的报关单
    lookDecDetail (row) {
      if (util.isEmpty(row.declTrnrel) || util.isEmpty(row.iEFlag) || util.isEmpty(row.decVo)) {
        return
      }
      let funFlag = 'declaration'
      let flag = 'import'
      let operationType = 'look'
      if (row.iEFlag === 'E') {
        flag = 'export'
      }
      let queryParam = {
        'type': 'lookHistory'
      }
      let decPid = JSON.parse(row.decVo).decHeadVO.decPid
      window.localStorage.setItem('decHistory', row.decVo)
      if (row.declTrnrel === '2' || row.declTrnrel === '0') { // 报关单或备案清单
        if (row.declTrnrel === '2') {
          funFlag = 'recordList'
        }
        decUtil.gotoDecPage(funFlag, flag, operationType, decPid, 'dec', queryParam, this)
      } else {
        if (row.declTrnrel === '1') {
          funFlag = 'declaration'
        } else if (row.declTrnrel === '3') {
          funFlag = 'recordList'
        } else if (row.declTrnrel === '4') {
          funFlag = 'secondDec'
        }
        this.gotoTransPage(funFlag, flag, operationType, decPid, queryParam)
      }
    },
    // 查看删改单
    lookDecdRegister (row) {
      window.localStorage.setItem('decRegisterHistory', row.info)
      this.$router.push({
        name: 'decRegisterList',
        query: {
          'type': 'redirect'
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .red{
    color: red;
  }
</style>
