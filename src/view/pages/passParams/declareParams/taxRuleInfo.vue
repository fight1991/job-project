<template>
  <section class='sys-main'>
    <!-- 返回按钮 -->
    <!-- <el-row style="margin-bottom: 15px;">
      <el-col :span='18' :xs='24'>
        <span @click="$router.push({name:'taxRule'})" class="sys-back-btn"><i class="back-btn"></i>返回</span>
      </el-col>
    </el-row> -->
    <!-- 返回按钮 end-->
    <el-row class="params-info">
      <el-row class="params-border-panel">
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">商品编号</div>
              <div class="param-right">{{taxForm.codeTs}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">商品名称</div>
              <div class="param-right">{{taxForm.gName}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">申报要素</div>
              <div class="param-right">{{taxForm.gModel}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="param-row">
            <el-col :span="8">
              <div class="param-row">
                <div class="param-left params-borderR">法定第一计量单位</div>
                <div class="param-right params-borderR">{{taxForm.unit1}}&nbsp;&nbsp;&nbsp;{{taxForm.unit1Value}}</div>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="param-row">
                <div class="param-left params-borderR">法定第二单位</div>
                <div class="param-right">{{taxForm.unit2}}&nbsp;&nbsp;&nbsp;{{taxForm.unit2Value}}</div>
              </div>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">最惠国进口税率</div>
              <div class="param-right params-borderR">{{taxForm.lowRate}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">普通进口税率</div>
              <div class="param-right params-borderR">{{taxForm.highRate}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">暂定进口税率</div>
              <div class="param-right">{{taxForm.tempRate}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">消费税率</div>
              <div class="param-right params-borderR">{{taxForm.commRate}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">出口税率</div>
              <div class="param-right params-borderR">{{taxForm.outRate}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">出口退税率</div>
              <div class="param-right">{{taxForm.otherRate}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">协定税率</div>
              <div class="param-right">{{taxForm.agreedRate}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">特惠税率</div>
              <div class="param-right">{{taxForm.preferentialRate}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">增值税率</div>
              <div class="param-right params-borderR">{{taxForm.taxRate}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">监管条件</div>
              <div class="param-right params-borderR">{{taxForm.controlMa}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="param-row">
              <div class="param-left params-borderR">检验检疫类别</div>
              <div class="param-right">{{taxForm.ciqMa}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">品目注释</div>
              <div class="param-right">{{taxForm.itemNote}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="param-row">
              <div class="param-left params-borderR">备注</div>
              <div class="param-right">{{taxForm.noteS}}</div>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <el-row>
        <div style="margin-top:4px;">
          注：<br><span>东盟：&nbsp;文莱、柬埔寨、印尼、老挝、马来西亚、缅甸、菲律宾、新加坡、泰国、越南</span>
            <br><span>亚太：&nbsp;大韩民国、斯里兰卡民主社会主义共和国、孟加拉人民共和国、印度共和国、老挝人民民主共和国</span>
            <br><span>亚太2国：&nbsp;孟加拉人民共和国、老挝人民民主共和国</span>
            <br><span>LDC1：&nbsp;埃塞俄比亚联邦民主共和国、布隆迪共和国、赤道几内亚共和国、刚果民主共和国、吉布提共和国、几内亚共和国、几内亚比绍共和国、莱索托王国、马达加斯加共和国、马拉维共和国、马里共和国、莫桑比克共和国、南苏丹共和国、塞拉利昂共和国、塞内加尔共和国、苏丹共和国、索马里联邦共和国、坦桑尼亚联合共和国、乌干达共和国、乍得共和国、中非共和国、阿富汗伊斯兰共和国、也门共和国、瓦努阿图共和国、科摩罗联盟、毛里塔尼亚伊斯兰共和国、多哥共和国、利比里亚共和国、卢旺达共和国、安哥拉共和国、赞比亚共和国、尼泊尔联邦民主共和国、尼日尔共和国、厄立特里亚国、柬埔寨王国</span>
            <br><span>LDC2：&nbsp;贝宁共和国、东帝汶民主共和国、缅甸联邦共和国</span>
            <br><span>LDC3：&nbsp;孟加拉人民共和国</span>
        </div>
      </el-row>
    </el-row>
  </section>
</template>
<script>
import util from '@/common/util'
export default {
  data () {
    return {
      taxForm: {},
      code: '',
      hsCode: ''
    }
  },
  watch: {
    '$route' (newVal, oldVal) {
      if (newVal.name === 'taxRuleInfo') {
        this.code = newVal.query.id
        this.hsCode = newVal.query.hsCode
        this.getDetail()
      }
    }
  },
  created () {
    this.code = this.$route.query.id
    this.hsCode = this.$route.query.hsCode
    this.getDetail()
  },
  mounted () {
  },
  methods: {
    // 获取详情
    getDetail () {
      this.$store.dispatch('ajax', {
        url: 'API@/saas-dictionary/decParam/getComplexDetail',
        data: {code: this.code, hsCode: this.hsCode},
        router: this.$router,
        success: (res) => {
          this.taxForm = util.isEmpty(res.result) ? {} : res.result
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.params-info{
  padding: 20px;
  background: #fff;
  .params-border-panel{
    border: 1px solid #b7b7b7;
    border-bottom: none;
    .el-row{
      border-bottom: 1px solid #B7B7B7;
      .params-borderR{
        border-right: 1px solid #B7B7B7;
      }
    }
    .param-row{
      display: table;
      width: 100%;
      >div{
        display: table-cell;
      }
      .param-left{
        width: 140px;
        padding: 15px 10px;
        text-align: center;
      }
      .param-right{
        padding: 15px 10px;
        word-break: break-all;
        span{
          margin: 0 4px;
        }
      }
    }
  }
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
