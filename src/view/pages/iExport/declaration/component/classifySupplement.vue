<template>
  <!-- 归类补充申报 组件 -->
  <section>
    <el-form ref="classifySupplementForm" :model="classifySupplementForm" size="mini" >
        <el-row>
           <el-col :span="12">
              <el-form-item label="补充申报单统一编号" label-width="200px">
                <el-input v-model="classifySupplementForm.preSupid" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="补充申报单编号" label-width="160px">
              <el-input v-model="classifySupplementForm.supId" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="报关单第几项商品" label-width="200px">
                <el-input v-model="classifySupplementForm.gNo" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" label-width="160px">
              <el-input v-model="classifySupplementForm.gName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="规格型号" label-width="200px">
                <el-input v-model="classifySupplementForm.gModel" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="商品编码" label-width="160px">
              <el-input v-model="classifySupplementForm.codeTs" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="品牌" label-width="200px">
                <el-col :span="12">
                  <el-input v-model="classifySupplementForm.brandCn" placeholder="中文" :maxlength="50"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="classifySupplementForm.brandEn" placeholder="英文" :maxlength="100"></el-input>
                </el-col>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
              <el-form-item label="买方" label-width="200px">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.buyer" placeholder="名称" :maxlength="150"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.buyerContact" placeholder="联系人" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.buyerAddr" placeholder="地址" :maxlength="255"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.buyerTel" placeholder="电话" :maxlength="20"></el-input>
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
                    <el-input v-model="classifySupplementForm.seller" placeholder="名称" :maxlength="150"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.sellerContact" placeholder="联系人" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.sellerAddr" placeholder="地址" :maxlength="255"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.sellerTel" placeholder="电话" :maxlength="20"></el-input>
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
                    <el-input v-model="classifySupplementForm.factory" placeholder="名称" :maxlength="150"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.factoryContact" placeholder="联系人" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.factoryAddr" placeholder="地址" :maxlength="255"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="classifySupplementForm.factoryTel" placeholder="电话" :maxlength="20"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="合同协议号" label-width="200px">
                <el-input v-model="classifySupplementForm.contrNo" :maxlength="50" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="签约日期" label-width="160px">
              <el-input v-model="classifySupplementForm.contrDate" :maxlength="8" placeholder="yyyyMMdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="发票编号" label-width="200px">
                <el-input v-model="classifySupplementForm.invoiceNo" :maxlength="50"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="发票日期" label-width="160px">
              <el-input v-model="classifySupplementForm.invoiceDate" :maxlength="8" placeholder="yyyyMMdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="19">
              <span>该商品是否取得过海关预归类决定书？如选择"是",请填写一下3项。</span>
           </el-col>
          <el-col :span="5">
            <el-radio-group v-model="priceSupplementForm.isClassDecision">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="6">
              <el-form-item label="预归类决定书编号" label-width="100px">
                <el-input v-model="classifySupplementForm.decisionNo" :maxlength="30"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="6">
            <el-form-item label="预归类决定书商品编码" label-width="100px">
              <el-input v-model="classifySupplementForm.codeTsDecision" :maxlength="10" placeholder="yyyyMMdd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="作出预归类决定的直属海关" label-width="100px">
                <el-select placeholder="" v-model="priceSupplementForm.decisionCus"  style="width:100%"
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
            <label>该商品是否取得过海关预归类决定书？如选择"是",请填写一下3项。</label>
            <el-radio-group v-model="priceSupplementForm.isClassDecision">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <label>请按以下选中项填写相关说明：</label>
          </el-col>
          <el-col :span="24">
            <el-checkbox-group v-model="gOptions">
              <el-checkbox label="1">A成分及比例</el-checkbox>
              <el-checkbox label="2">B原料及组成</el-checkbox>
              <el-checkbox label="3">C生产/加工工艺</el-checkbox>
              <el-checkbox label="4">D构成</el-checkbox>
              <el-checkbox label="5">E技术参数</el-checkbox>
              <el-checkbox label="6">F具体规格</el-checkbox>
              <el-checkbox label="7">G工作原理</el-checkbox>
              <el-checkbox label="8">H车型排量</el-checkbox>
              <el-checkbox label="9">I功能</el-checkbox>
              <el-checkbox label="10">J用途</el-checkbox>
              <el-checkbox label="11">K加工程度</el-checkbox>
              <el-checkbox label="12">L性能指标</el-checkbox>
              <el-checkbox label="13">M其他信息</el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="24">
            <el-input placeholder="请在此填写（请注明上述相应选项项号，也可在本申报单后随附）："></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>申报说明：对本申报单各项填报内容及所附单证的真实性和完整性承担法律责任，并愿意提供与海关归类有关的其它任何资料和单证，如有不实，由海关按有关规定处理。
            </span>
          </el-col>
          <el-col :span="24">
            <label> 对以上申报内容是否需要海关予以保密？ </label>
            <el-radio-group v-model="priceSupplementForm.isClassDecision">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="申报人签名" label-width="200px">
                <el-input v-model="classifySupplementForm.declName"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="填报日期" label-width="160px">
              <el-input v-model="classifySupplementForm.declDate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="申报人签名" label-width="200px">
                <el-input v-model="classifySupplementForm.declName" disabled></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="填报日期" label-width="160px">
              <el-input v-model="classifySupplementForm.declDate" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="单位地址" label-width="200px">
                <el-input v-model="classifySupplementForm.declAddr" :maxlength="255"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="申报单位" label-width="160px">
              <el-input v-model="classifySupplementForm.agentName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="申报单位类型" label-width="160px">
              <el-radio-group v-model="priceSupplementForm.agentType">
                <el-radio :label="1">进出口货物收发货人</el-radio>
                <el-radio :label="2">委托申报的报关企业</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
              <el-form-item label="邮编" label-width="200px">
                <el-input v-model="classifySupplementForm.declPost" :maxlength="10"></el-input>
              </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="电话" label-width="160px">
              <el-input v-model="classifySupplementForm.declTel"  :maxlength="20" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'classify-supplement',
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
      iEFlag: '',
      classifySupplementForm: {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: '', // 补充申报单类型
        brandCn: '', // 品牌中文
        brandEn: '', // 品牌英文
        buyer: '', // 买方名称
        buyerContact: '', // 买方联系人
        buyerAddr: '', // 买方地址
        buyerTel: '', // 买方电话
        seller: '', // 卖方名称
        sellerContact: '', // 卖方联系人
        sellerAddr: '', // 卖方地址
        sellerTel: '', // 卖方电话
        factory: '', // 生产厂商名称
        factoryContact: '', // 生产厂商联系人
        factoryAddr: '', // 生产厂商地址
        factoryTel: '', // 生产厂商电话
        contrNo: '', // 合同协议号
        contrDate: '', // 签约日期
        invoiceNo: '', // 发票编号
        invoiceDate: '', // 发票日期
        iBabrel: '', // 进口货物申报项。
        iPriceEffect: '', // 进口货物申报项。
        iPriceClose: '', // 进口货物申报项。
        iOtherLimited: '', // 进口货物申报项。
        iOtherEffect: '', // 进口货物申报项。
        iNote1: '', // 进口货物申报项。
        iIsusefee: '', // 进口货物申报项。
        iIsprofit: '', // 进口货物申报项。
        iNote2: '', // 进口货物申报项。
        curr: '', // 价格申报项，币制
        invoicePrice: '', // 价格申报项，发票价格单位金额
        invoiceAmount: '', // 价格申报项，发票价格总金额
        invoiceNote: '', // 价格申报项，发票价格备注
        goodsPrice: '', // 价格申报项，间接支付/收取的货款单位金额，进口是间接支付，出口是间接收取
        goodsAmount: '', // 价格申报项，间接支付/收取的货款总金额，进口是间接支付，出口是间接收取
        goodsNote: '', // 价格申报项，间接支付/收取的货款备注，进口是间接支付，出口是间接收取
        iCommissionPrice: '', // 价格申报项，进口货物除购货佣金以外的佣金和经纪费单位金额
        iCommissionAmount: '', // 进口货物除购货佣金以外的佣金和经纪费总金额
        iCommissionNote: '', // 进口货物除购货佣金以外的佣金和经纪费备注
        iContainerPrice: '', // 与该进口货物视为一体的容器费用单位金额
        iContainerAmount: '', // 与该进口货物视为一体的容器费用总金额
        iContainerNote: '', // 与该进口货物视为一体的容器费用备注
        iPackPrice: '', // 进口货物包装材料和包装劳务费用单位金额
        iPackAmount: '', // 进口货物包装材料和包装劳务费用总金额
        iPackNote: '', // 进口货物包装材料和包装劳务费用备注
        iPartPrice: '', // 进口货物包含的材料、部件、零件和类似货物单位金额
        iPartAmount: '', // 进口货物包含的材料、部件、零件和类似货物总金额
        iPartNote: '', // 进口货物包含的材料、部件、零件和类似货物备注
        iToolPrice: '', // 在生产进口货物过程中使用的工具、模具和类似货物单位金额
        iToolAmount: '', // 在生产进口货物过程中使用的工具、模具和类似货物总金额
        iToolNote: '', // 在生产进口货物过程中使用的工具、模具和类似货物备注
        iLossPrice: '', // 在生产进口货物过程中消耗的材料单位金额
        iLossAmount: '', // 在生产进口货物过程中消耗的材料总金额
        iLossNote: '', // 在生产进口货物过程中消耗的材料备注
        iDesignPrice: '', // 进口货物在境外进行的为生产进口货物所需的工程设计、技术研发、工艺及制图等相关服务单位金额
        iDesignAmount: '', // 进口货物在境外进行的为生产进口货物所需的工程设计、技术研发、工艺及制图等相关服务总金额
        iDesignNote: '', // 进口货物在境外进行的为生产进口货物所需的工程设计、技术研发、工艺及制图等相关服务备注
        iUsefeePrice: '', // 价格申报项，特许权使用费单位金额
        iUsefeeAmount: '', // 特许权使用费总金额
        iUsefeeNote: '', // 特许权使用费备注
        iProfitPrice: '', // 卖方直接或间接从买方对货物进口后转售、处置或使用所得中获得的收益单位金额
        iProfitAmount: '', // 卖方直接或间接从买方对货物进口后转售、处置或使用所得中获得的收益总金额
        iProfitNote: '', // 卖方直接或间接从买方对货物进口后转售、处置或使用所得中获得的收益备注
        iFeePrice: '', // 进口货物运输费用单位金额
        iFeeAmount: '', // 进口货物运输费用总金额
        iFeeNote: '', // 进口货物运输费用备注
        iOtherPrice: '', // 进口货物运输相关费用单位金额
        iOtherAmount: '', // 进口货物运输相关费用总金额
        iOtherNote: '', // 进口货物运输相关费用备注
        iInsurPrice: '', // 进口货物保险费单位金额
        iInsurAmount: '', // 进口货物保险费总金额
        iInsurNote: '', // 进口货物保险费备注
        eIsdutydel: '', // 出口关税是否已经从申报价格中扣除
        gnameOther: '', // 商品其他名称
        codetsOther: '', // 出口国地区海关商品编码
        isClassdecision: '', // 归类申报项
        decisionNo: '', // 预归类决定书编号
        codetsDecision: '', // 预归类决定书商品编码
        decisionCus: '', // 作出预归类决定的直属海关
        isSampletest: '', // 该商品是否曾被海关取样化验：
        gOptions: '', // 归类申报项，商品信息选项：
        trafMode: '', // 运输方式
        isDirecttraf: '', // 是否直接运输：
        transitCountry: '', // 中转国地区，如果选择非直接运输，必填
        destPort: '', // 原产地申报项，到货口岸
        declPort: '', // 原产地申报项，申报口岸
        billNo: '', // 提单编号
        originCountry: '', // 原产地申报项
        originMark: '', // 原产地申报项，原产国地区标记的位置：
        certCountry: '', // 原产地申报项，原产地证书签发机构及所在国家地区，非参数选项，可录入汉字或字母
        certNo: '', // 原产地申报项，原产地证书编号
        certStandard: '', // 原产地申报项，适用的原产地标准：
        otherNote: '', // 公共申报项，其他需要说明的情况
        isSecret: '', // 对以上申报内容是否需要海关予以保密：
        agentType: '', // 申报单位类型
        declAddr: '', // 申报人单位地址
        declPost: '', // 申报人邮编
        declTel: '', // 申报人电话
        operType: '', // 操作类型
        icCardid: '', // 操作员ic卡号
        clientSeqno: '', // 报关单中心统一编号
        signDate: '', // 签名日期
        signData: '', // 签名信息
        preSupid: '', // 补充申报单统一编号
        createUser: '', // 创建人
        createTime: ''// 创建时间
      }
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
