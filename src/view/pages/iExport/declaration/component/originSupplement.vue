<template>
  <!-- 原产地补充申报 组件 -->
  <section>
    <el-form ref="orignSupplementForm" :model="orignSupplementForm" size="mini" >
        <el-row>
           <el-col :span="12">
              <el-form-item label="补充申报单统一编号" label-width="200px">
                <el-input v-model="orignSupplementForm.preSupid" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="补充申报单编号" label-width="160px">
              <el-input v-model="orignSupplementForm.supId" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="报关单第几项商品" label-width="200px">
                <el-input v-model="orignSupplementForm.gNo" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" label-width="160px">
              <el-input v-model="orignSupplementForm.gName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="规格型号" label-width="200px">
                <el-input v-model="orignSupplementForm.gModel" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="商品编码" label-width="160px">
              <el-input v-model="orignSupplementForm.codeTs" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="品牌" label-width="200px">
                <el-col :span="12">
                  <el-input v-model="orignSupplementForm.brandCn" placeholder="中文" :maxlength="50"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="orignSupplementForm.brandEn" placeholder="英文" :maxlength="100"></el-input>
                </el-col>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="买方" label-width="200px">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.buyer" placeholder="名称" :maxlength="150"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.buyerContact" placeholder="联系人" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.buyerAddr" placeholder="地址" :maxlength="255"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.buyerTel" placeholder="电话" :maxlength="20"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="卖方" label-width="200px">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.seller" placeholder="名称" :maxlength="150"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.sellerContact" placeholder="联系人" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.sellerAddr" placeholder="地址" :maxlength="255"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.sellerTel" placeholder="电话" :maxlength="20"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="生产厂商" label-width="200px">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.factory" placeholder="名称" :maxlength="150"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.factoryContact" placeholder="联系人" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.factoryAddr" placeholder="地址" :maxlength="255"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="orignSupplementForm.factoryTel" placeholder="电话" :maxlength="20"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="合同协议号" label-width="200px">
                <el-input v-model="orignSupplementForm.contrNo" :maxlength="50" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="签约日期" label-width="160px">
              <el-input v-model="orignSupplementForm.contrDate" :maxlength="8" placeholder="yyyyMMdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="发票编号" label-width="200px">
                <el-input v-model="orignSupplementForm.invoiceNo" :maxlength="50"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="发票日期" label-width="160px">
              <el-input v-model="orignSupplementForm.invoiceDate" :maxlength="8" placeholder="yyyyMMdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="运输方式" label-width="200px">
                <el-radio-group v-model="orignSupplementForm.trafMode">
                  <el-radio :label="1">联运</el-radio>
                  <el-radio :label="2">空运</el-radio>
                  <el-radio :label="3">海运</el-radio>
                  <el-radio :label="4">陆运</el-radio>
                </el-radio-group>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="直接运输" label-width="200px">
                <el-radio-group v-model="orignSupplementForm.isDirectTraf">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="到货口岸" label-width="200px">
                <el-select placeholder="" v-model="orignSupplementForm.destPort"  style="width:100%"
                  :popper-append-to-body = 'false' clearable filterable>
                    <el-option
                      v-for="item in initParams.saasCustomsRel"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="申报口岸" label-width="160px">
               <el-select placeholder="" v-model="orignSupplementForm.destPort"  style="width:100%"
                  :popper-append-to-body = 'false' clearable filterable>
                    <el-option
                      v-for="item in initParams.saasCustomsRel"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="提单编号" label-width="200px">
                <el-input v-model="orignSupplementForm.billNo" :maxlength="32"></el-input>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="原产国(地区)" label-width="200px">
                <el-select placeholder="" v-model="orignSupplementForm.originCountry"
                  :popper-append-to-body = 'false'
                  clearable filterable  style="width:100%">
                  <el-option
                    v-for="item in saasCountry"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
           </el-col>
           <el-col :span="12">
              <el-form-item label="原产国(地区)标记的位置" label-width="200px">
                <el-radio-group v-model="orignSupplementForm.originMark">
                  <el-radio :label="1">外包装</el-radio>
                  <el-radio :label="2">内包装</el-radio>
                  <el-radio :label="3">产品本体</el-radio>
                  <el-radio :label="4">无</el-radio>
                </el-radio-group>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="原产地证书签发机构及所在国家(地区)" label-width="200px">
                <el-select placeholder="" v-model="orignSupplementForm.certCountry"
                  :popper-append-to-body = 'false'
                  clearable filterable  style="width:100%">
                  <el-option
                    v-for="item in saasCountry"
                    :key="item.codeField"
                    :label="item.codeField + '-' + item.nameField"
                    :value="item.codeField">
                  </el-option>
                </el-select>
              </el-form-item>
           </el-col>
           <el-col :span="12">
              <el-form-item label="原产地证书编号" label-width="200px">
                <el-input v-model="orignSupplementForm.certNo" :maxlength="30"></el-input>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="适用的原产地标准" label-width="200px">
                <el-radio-group v-model="orignSupplementForm.certStandard">
                  <el-radio :label="1">完全获得</el-radio>
                  <el-radio :label="2">税号改变</el-radio>
                  <el-radio :label="3">制造或加工工序</el-radio>
                  <el-radio :label="4">从价百分比</el-radio>
                  <el-radio :label="5">混合标准</el-radio>
                  <el-radio :label="6">其他标准</el-radio>
                </el-radio-group>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <label>其他需要说明的情况(针对上述项目需要进一步说明的);</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <el-input v-model="orignSupplementForm.otherNote" :maxlength="1000"></el-input>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>申报说明：对本申报单各项填报内容及所附单证的真实性和完整性承担法律责任，并愿意提供与海关归类有关的其它任何资料和单证，如有不实，由海关按有关规定处理。
            </span>
          </el-col>
          <el-col :span="24">
            <label> 对以上申报内容是否需要海关予以保密？ </label>
            <el-radio-group v-model="orignSupplementForm.isClassDecision">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="申报人签名" label-width="200px">
                <el-input v-model="orignSupplementForm.declName"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="填报日期" label-width="160px">
              <el-input v-model="orignSupplementForm.declDate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="申报人签名" label-width="200px">
                <el-input v-model="orignSupplementForm.declName" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="填报日期" label-width="160px">
              <el-input v-model="orignSupplementForm.declDate" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="单位地址" label-width="200px">
                <el-input v-model="orignSupplementForm.declAddr" :maxlength="255"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="申报单位" label-width="160px">
              <el-input v-model="orignSupplementForm.agentName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="申报单位类型" label-width="160px">
              <el-radio-group v-model="orignSupplementForm.agentType">
                <el-radio :label="1">进出口货物收发货人</el-radio>
                <el-radio :label="2">委托申报的报关企业</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="邮编" label-width="200px">
                <el-input v-model="orignSupplementForm.declPost" :maxlength="10"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="电话" label-width="160px">
              <el-input v-model="orignSupplementForm.declTel"  :maxlength="20" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'origin-supplement',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      extraNote: ''
    }
  },
  mounted () {
  },
  methods: {
    configBtn () {
      this.$emit('backDatas', {})
    },
    cancleBtn () {
      this.$emit('cancLeData')
    }
  }
}
</script>

<style scoped lang="less">

</style>
