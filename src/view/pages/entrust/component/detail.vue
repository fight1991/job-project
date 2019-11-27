<template>
  <section class="dec-query-table">
    <el-table class='sys-table-table dec-table' :data="detailList" border highlight-current-row size="mini">
      <el-table-column label="行号" min-width="100" type="index" align="left"></el-table-column>
      <el-table-column label="接单编号" min-width="150" align="left">
        <template slot-scope="scope">
          {{scope.row.innerNo}}
        </template>
      </el-table-column>
      <el-table-column label="接单编号分号" min-width="150" align="left">
        <template slot-scope="scope">
          {{scope.row.bossId}}
        </template>
      </el-table-column>
      <el-table-column label="统一编号" min-width="150" align="left">
        <template slot-scope="scope">
          {{scope.row.seqNo || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="件数" min-width="150" align="right">
        <template slot-scope="scope">
          {{scope.row.packNo || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="毛重(KG)" min-width="150" align="right">
        <template slot-scope="scope">
          {{scope.row.grossWt || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <a href="javascript:void(0)" class="list-icon-look border-0" title="查看" @click="lookFun(scope.row)"><i class='dec-i'></i></a>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import util from '@/common/util'
import config from '@/config/config'
export default {
  data () {
    return {
      detailList: []
    }
  },
  props: ['data'],
  created () {
    this.getList()
  },
  mounted () {

  },
  methods: {
    // 获取列表数据
    getList () {
      this.$post({
        url: 'API@/dec-common/ccba/entrust/queryDecOrInvtOrLoginfo',
        data: this.data,
        success: (res) => {
          let list = util.isEmpty(res.result) ? [] : res.result
          for (let i in list) {
            list[i].packNo = this.data.packNo
            list[i].grossWt = this.data.grossWt
          }
          this.detailList = list
        }
      })
    },
    // 跳转至报关单/备案清单/核注清单
    lookFun (val) {
      if (val.entrustBusiness === 'invt') {
        let iEFlag = this.$route.meta.iEFlag === 'import' ? 'I' : 'E'
        let url = config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'].EMS + `/dec/datainput/${iEFlag}/taxList?type=view&headPid=${val.decPid}&entrust=entrust`
        if (window.sessionStorage.getItem('sysId') === 'CCBA') {
          window.parent.postMessage({type: 'EMS', data: {tabId: 'look-' + val.decPid, url: url, operationType: 'look', id: val.decPid, title: '核注清单查看'}}, '*')
        }
      } else {
        let decType = val.declTrnrel === '2' ? 'recordList' : 'declaration'
        this.gotoDecPage(decType, this.$route.meta.iEFlag, 'look', val.decPid)
      }
    },
    /**
     * 跳转 新增、详情、编辑
     * @param funFlag  功能页面 declaration 报关单   recordList 备案清单 decTemplate 初始值模板
     * @param flag  进出口标识
     * @param pid  报关单主键  可不传
     * @param operationType 操作   add 新增 look 查看  edit 编辑
     */
    gotoDecPage (funFlag, flag, operationType, pid = 'new') {
      let routeName
      let tabName
      if (funFlag === 'declaration') {
        if (flag === 'import') {
          if (operationType === 'look') {
            tabName = '进口报关单'
            routeName = 'importDecLook'
          } else if (operationType === 'edit') {
            tabName = '进口报关单'
            routeName = 'importDecEdit'
          }
        } else if (flag === 'export') {
          if (operationType === 'look') {
            tabName = '出口报关单'
            routeName = 'exportDecLook'
          } else if (operationType === 'edit') {
            tabName = '出口报关单'
            routeName = 'exportDecEdit'
          }
        }
      }
      if (funFlag === 'recordList') {
        if (flag === 'import') {
          if (operationType === 'look') {
            tabName = '进境备案清单'
            routeName = 'importRecordLook'
          } else if (operationType === 'edit') {
            tabName = '进境备案清单'
            routeName = 'importRecordEdit'
          }
        } else if (flag === 'export') {
          if (operationType === 'look') {
            tabName = '出境备案清单'
            routeName = 'exportRecordLook'
          } else if (operationType === 'edit') {
            tabName = '出境备案清单'
            routeName = 'exportRecordEdit'
          }
        }
      }
      this.$router.push({
        name: routeName,
        params: {
          'pid': pid,
          'setTitle': tabName + '-' + pid,
          'setId': routeName + operationType + pid
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.dec-i{
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
</style>
