<template>
  <section class='sys-main'>
    <el-row class = "query-condition">
        <el-form :label-width="labelFormWidth.seven" :model="subData" ref="subData" :rules="rules" size="mini" label-position="right">
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="委托企业" prop="info.corpName" :rules="rules.corpName">
                <el-select v-model="subData.info.corpName" filterable clearable
                  remote style="width:100%"
                  placeholder="输入2个字后搜索"
                  :disabled="isDetail"
                  :remote-method="companyListFun"
                  :no-data-text="noDataText"
                  :default-first-option="true"
                  @focus="companyListOptions=[];">
                  <el-option
                    v-show="searchCorpInfoView"
                    v-for="(item,index) in companyListOptions"
                    :key="item.ownerCodeScc +'companyListOptions'+index"
                    :label="item.ownerName"
                    :value="item.ownerName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="许可证类型" prop="info.licenseType" :rules="rules.licenseType">
                <el-select placeholder="请选择许可证类型" v-model="subData.info.licenseType"
                filterable clearable
                :disabled="isDetail"
                style="width:100%">
                  <el-option
                    v-for="item in saasLicType"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :span="12" :xs='24'>
              <el-form-item label="许可证编号" prop="info.licenseNo" :rules="rules.licenseNo">
                <el-input clearable size="mini" :maxlength="30" v-model="subData.info.licenseNo" :disabled="isDetail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs='24'>
              <el-form-item label="有效截止日期" prop="info.expiryDate" :rules="rules.expiryDate">
                <el-date-picker size="mini" type="date" style="width:100%" v-model="subData.info.expiryDate" :disabled="isDetail"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :span="12" :xs='24'>
              <el-form-item label="上传时间" prop="info.updateTime" :rules="rules.updateTime">
                <el-input clearable size="mini" v-model="subData.info.updateTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs='24'>
              <el-form-item label="可用次数" prop="info.availableNum" :rules="rules.availableNum" >
                <el-select style="width:100%"
                  v-model="subData.info.availableNum"
                  :disabled="isDetail"
                  filterable clearable
                  placeholder="请选择许可证可用次数">
                  <el-option label="一批一证" value="1"></el-option>
                  <el-option label="非一批一证" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="涉证商品">
                <el-table class='sys-table-table'
                  border highlight-current-row size="mini"
                  :data="subData.goods">
                  <el-table-column label="商品名称" min-width="100" :maxlength="10">
                    <template slot-scope="scope">
                      <el-form-item label-width="0px" :prop="'goods.'+ subData.goods.indexOf(scope.row) + '.gName'  " :rules="rules.gName" class="form-item-mg0">
                        <el-input clearable size="mini" :disabled="isDetail" v-model="scope.row.gName" :maxlength="10"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品编号" min-width="100" :maxlength="20">
                    <template slot-scope="scope">
                      <el-form-item label-width="0px" :prop="'goods.'+ subData.goods.indexOf(scope.row) + '.gNo'  " :rules="rules.gNo" class="form-item-mg0">
                        <el-input clearable size="mini" :disabled="isDetail" v-model="scope.row.gNo" :maxlength="20"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="申报数量" min-width="100">
                    <template slot-scope="scope">
                      <el-form-item label-width="0px" :prop="'goods.'+ subData.goods.indexOf(scope.row) + '.declaredQuantity'  " :rules="rules.declaredQuantity" class="form-item-mg0">
                        <el-input clearable size="mini" :disabled="isDetail" v-model="scope.row.declaredQuantity" :maxlength="10"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="剩余可用数量" min-width="100">
                    <template slot-scope="scope">
                      <el-form-item label-width="0px" class="form-item-mg0">
                        <el-input size="mini" disabled v-model="scope.row.declaredQuantity"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <div class='sys-td-c'>
                        <el-button type="text" class="table-icon list-icon-delete" @click="deleteGoods(subData.goods.indexOf(scope.row))" title="删除" v-if="!isDetail"><i></i></el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button size="mini" @click="addRelatedGoods" v-if="!isDetail" style="margin-top:18px;"><img src="../../../../assets/img/icon/btn-add.png"/>&nbsp;&nbsp;增加涉证商品</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="许可证文件" prop="info.licenseUrl" :rules="rules.licenseUrl">
              <el-upload
              action="http://127.0.0.1"
              :before-upload="beforeUpload"
              :file-list="fileLists"
              :show-file-list="fileType">
              <img v-if="isImg  && !fileType" :src="subData.info.licenseUrl" class="detail-img" @click.stop="showfile(subData.info.licenseUrl)">
              <img v-if="isPdf  && !fileType" src="../../../../assets/img/icon/pdf.png" @click.stop="showfile(subData.info.licenseUrl)" class="detail-img">
              <img v-if="isWord  && !fileType" src="../../../../assets/img/icon/word.png" @click.stop="showfile(subData.info.licenseUrl)" class="detail-img">
              <img v-if="isExcel  && !fileType" src="../../../../assets/img/icon/excel.png" @click.stop="showfile(subData.info.licenseUrl)" class="detail-img">
              <el-row>
               <el-button size="mini" type="primary" v-if="!isDetail">重新上传</el-button>
              </el-row>
            </el-upload>
            </el-form-item>
          </el-row>
          <el-row class="query-btn">
            <el-button size="mini" v-if="isDetail" @click="edit">编辑</el-button>
            <el-button size="mini" type="primary" @click="submit">确认</el-button>
            <el-button size="mini" v-if="!isDetail" @click="toDetail">取消</el-button>
          </el-row>
        </el-form>
    </el-row>
  </section>
</template>

<script>
import validator from '@/common/validator'
import util from '@/common/util'
import commonParam from '@/common/commonParam'
export default {
  data () {
    return {
      rules: {
        corpName: [{ required: true, message: '请输入委托企业', trigger: 'blur' }],
        licenseType: [{ required: true, message: '请选择许可证类型', trigger: 'change' }],
        licenseNo: [{ required: true, message: '请输入许可证编号', trigger: 'blur' }],
        licenseUrl: [{ required: true, message: '请选择上传文件', trigger: 'change' }],
        expiryDate: [{ required: true, message: '请选择有效截止日期', trigger: 'change' }],
        availableNum: [{ required: true, message: '请选择可用次数', trigger: 'change' }],
        gNo: [{ required: true, validator: this.checkvalidate, message: '请输入商品编号(数字)', trigger: 'blur' }],
        gName: [{ validator: this.checkValid, message: '商品名称为中英文', trigger: 'blur' }],
        declaredQuantity: [{ required: true, validator: validator.Zz0, message: '请输入申报数量', trigger: 'blur' }]
      },
      controller: {
        requiredColor: true
      },
      isDetail: false,
      subData: {
        info: {
          corpName: '',
          licensePid: '',
          ownerCodeScc: '',
          licenseType: '',
          licenseUrl: '',
          licenseNo: '',
          expiryDate: '',
          updateTime: '',
          availableNum: ''
        },
        goods: [{
          relatedGoodsPid: '',
          licensePid: '',
          gName: '',
          gNo: '',
          declaredQuantity: '',
          availableQuantity: this.declaredQuantity
        }]
      },
      type: '',
      searchCorpInfoView: false,
      noDataText: '暂无匹配数据',
      companyListOptions: [],
      fileLists: [], // 存放文件
      fileType: true,
      isImg: false,
      isPdf: false,
      isWord: false,
      isExcel: false,
      saasLicType: []
    }
  },
  created () {
    this.reset()
    this.getCommonParams()
    this.type = this.$route.query.type
    this.subData.info.licensePid = this.$route.query.id
    this.subData.info.ownerCodeScc = this.$route.query.ownerCodeScc
    if (this.type === 'detail') {
      this.isDetail = true
    } else {
      this.isDetail = false
    }
  },
  mounted () {
    this.querylist()
  },
  watch: {
    '$route': function (to, from) {
      // 初始化组件
      if (to.path.indexOf('manageDetail') === -1) {
        return
      }
      this.reset()
      this.getCommonParams()
      this.type = to.query.type
      this.subData.info.licensePid = to.query.id
      this.subData.info.ownerCodeScc = to.query.ownerCodeScc
      if (this.type === 'detail') {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
      this.querylist()
    }
  },
  methods: {
    // 重置
    reset () {
      this.subData = {
        info: {
          corpName: '',
          licensePid: '',
          ownerCodeScc: '',
          licenseType: '',
          licenseUrl: '',
          licenseNo: '',
          expiryDate: '',
          updateTime: '',
          availableNum: ''
        },
        goods: [{
          relatedGoodsPid: '',
          licensePid: '',
          gName: '',
          gNo: '',
          declaredQuantity: '',
          availableQuantity: this.declaredQuantity
        }]
      }
      this.$nextTick(() => {
        this.$refs['subData'].clearValidate()
      })
    },
    // 校验委托企业
    checkValid (rule, value, callback) {
      if (!util.isEmpty(value)) {
        const pattern = /^[A-Za-z\u4e00-\u9fa5]+$/
        if (!pattern.test(value)) {
          this.$refs['subData'].clearValidate()
          callback(new Error(''))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验商品编码
    checkvalidate (rule, value, callback) {
      if (util.isEmpty(value)) {
        this.$refs['subData'].clearValidate()
        callback(new Error(''))
      } else {
        const pattern = /^[0-9]+$/
        if (!pattern.test(value)) {
          this.$refs['subData'].clearValidate()
          callback(new Error(''))
        } else {
          callback()
        }
      }
    },
    // 编辑
    edit () {
      this.isDetail = false
    },
    // 更多上传
    addRelatedGoods () {
      this.subData.goods.push({
        relatedGoodsPid: '',
        licensePid: '',
        gName: '',
        gNo: '',
        declaredQuantity: '',
        availableQuantity: this.declaredQuantity
      })
    },
    // 保存
    submit () {
      this.$refs['subData'].validate((valId) => {
        if (!valId) {
          return false
        }
        if (this.subData.goods.length === 0) {
          this.$message({
            message: '涉证商品不能为空',
            type: 'error'
          })
          return false
        }
        if (this.fileLists.length > 0 && this.fileType) {
          this.subData.info.licenseUrl = this.fileLists[0].url
        }
        this.subData.goods.forEach(item => {
          item.availableQuantity = item.declaredQuantity
        })
        this.subData.info.expiryDate = util.dateFormat(this.subData.info.expiryDate, 'yyyy-MM-dd')
        this.subData.info.updateTime = ''
        this.$store.dispatch('ajax', {
          url: 'API@/saas-document-center/license/edit',
          data: this.subData,
          router: this.$router,
          success: (res) => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.toDetail()
          }
        })
      })
    },
    // 跳转详情页
    toDetail () {
      this.$store.dispatch('CloseTab', this.$route.name)
      this.$router.push({
        path: '/dataCenter/license',
        query: {
          sccCode: this.subData.info.ownerCodeScc,
          corpName: encodeURIComponent(this.subData.info.corpName)
        }
      })
    },
    // 显示详情
    querylist () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-document-center/license/queryDetail',
        data: {pid: this.subData.info.licensePid},
        router: this.$router,
        success: (res) => {
          let subData = res.result
          subData.info = res.result.info
          subData.goods = util.isEmpty(res.result.goods) ? [] : res.result.goods
          subData.goods.forEach(item => {
            item.availableQuantity = item.declaredQuantity
          })
          let url = subData.info.licenseUrl
          if (!util.isEmpty(url)) {
            let suffix = util.getFileTypeByName(url)
            if (suffix === 'image/jpeg' || suffix === 'image/png' || suffix === 'image/gif' || suffix === 'image/bmp') {
              this.fileType = false
              this.isImg = true
              this.isPdf = false
              this.isWord = false
              this.isExcel = false
            } else {
              if (suffix === 'application/pdf') {
                this.fileType = false
                this.isImg = false
                this.isPdf = true
                this.isWord = false
                this.isExcel = false
              } else if (suffix === 'application/msword' || suffix === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                this.fileType = false
                this.isImg = false
                this.isPdf = false
                this.isWord = true
                this.isExcel = false
              } else if (suffix === 'application/vnd.ms-excel' || suffix === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.fileType = false
                this.isImg = false
                this.isPdf = false
                this.isWord = false
                this.isExcel = true
              }
            }
          }
          this.subData = subData
        }
      })
    },
    // 刪除
    deleteGoods (index) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        modalAppendToBody: true,
        domMount: this.$el.parentNode,
        type: 'warning'
      }).then(() => {
        this.subData.goods.splice(index, 1)
      }).catch(() => {
      })
    },
    // 获取企业list
    companyListFun (val) {
      if (val !== '') {
        if (val.length >= 2) {
          this.$store.dispatch('ajax', {
            url: 'API@/saas-document-center/dccommon/queryLicenseCorps',
            data: val.trim(),
            router: this.$router,
            success: (res) => {
              if (util.isEmpty(res.result)) {
                this.companyListOptions = []
                this.searchCorpInfoView = false
                this.noDataText = '暂无匹配数据'
              } else {
                this.companyListOptions = res.result
                this.searchCorpInfoView = true
              }
            }
          })
        }
      }
    },
    // 上传图片前的格式及大小判断
    beforeUpload (file) {
      this.fileLists = []
      if (!util.getFileTypeByName(file.name)) {
        this.$message({
          message: '上传文件暂时只支持图片/PDF/word/Excel格式',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') && !(Math.ceil(file.size / 1024) <= 2048)) {
        this.$message({
          message: '上传图片大小不能超过2MB',
          type: 'error'
        })
        this.$emit('closeEditUpload')
      } else if (util.getFileTypeByName(file.name) && !(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') && !(Math.ceil(file.size / 1024) <= 10240)) {
        this.$message({
          message: '上传文件大小不能超过10MB',
          type: 'error'
        })
      } else {
        let param = new FormData()
        param.append('multiFile', file, file.name)
        let sccCode = this.$store.state.userLoginInfo.sccCode
        let date = util.dateFormat(new Date(), 'yyyyMM')
        param.append('filePath', '/longshine/document/' + sccCode + '/license/' + date)
        this.$store.dispatch('upload', {
          url: 'FILE@/saas-upload/upload/uploadFile',
          data: param,
          isLoad: false,
          router: this.$router,
          success: (res) => {
            this.subData.info.licenseUrl = res.result.url
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp') {
              this.fileType = false
              this.isImg = true
              this.isPdf = false
              this.isWord = false
              this.isExcel = false
            } else {
              this.fileLists.push({
                name: res.result.name,
                url: res.result.url
              })
              if (file.type === 'application/pdf') {
                this.fileType = false
                this.isImg = false
                this.isPdf = true
                this.isWord = false
                this.isExcel = false
              } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                this.fileType = false
                this.isImg = false
                this.isPdf = false
                this.isWord = true
                this.isExcel = false
              } else if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.fileType = false
                this.isImg = false
                this.isPdf = false
                this.isWord = false
                this.isExcel = true
              }
            }
            this.$refs['subData'].clearValidate('subData.info.licenseUrl')
          }
        })
      }
      return false
    },
    // // 预览
    // showfileUrl (file) {
    //   util.fileView(file.url)
    // },
    // 文件点击事件
    showfile (url) {
      if (!util.isEmpty(url)) {
        util.fileView(url)
      }
    },
    // 获取公共字典list
    getCommonParams () {
      let par = ['SAAS_LICENSE']
      let tableNames = commonParam.isRequire(par)
      if (tableNames.length > 0) {
        this.$store.dispatch('ajax', {
          url: 'API@/saas-dictionary/dictionary/getParam',
          data: {
            'tableNames': tableNames
          },
          router: this.$router,
          success: (res) => {
            commonParam.saveParams(res.result)
            this.saasLicType = JSON.parse(window.localStorage.getItem('SAAS_LICENSE'))
          }
        })
      } else {
        this.saasLicType = JSON.parse(window.localStorage.getItem('SAAS_LICENSE'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.query-condition {
    background-color: #fff;
    padding: 20px;
  }
  .query-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
  }
  .query-btn {
    text-align: center;
    margin: 12px 0;
  }
  .license-close-icon{
      width: 20px;
      height: 20px;
      display: inline-block;
      background: url('../../../../assets/img/icon/close.png') no-repeat;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }
  .license-card{
    position: relative;
    margin-bottom: 20px;
    padding-right: 10px;
  }
  .detail-img,.no-pic{
    display: inline-block;
    padding-right: 10px;
    margin-bottom: 12px;
    width: 88px;
    height: 88px;
    cursor: pointer;
  }
.sys-back-btn{
    display: inline-block;
    font-size: 13px;
    color: @font-color-main;
    vertical-align: middle;
    cursor: pointer;
    .back-btn{
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 5px;
        background: url('../../../../assets/img/icon/back.png') no-repeat center center;
        background-size: 100%;
        vertical-align: middle;
    }
}
</style>
