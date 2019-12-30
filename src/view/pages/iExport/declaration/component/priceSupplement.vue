<template>
  <!-- 价格补充申报 组件 -->
  <div class='border'>
    <el-form ref="priceSupplementForm" :model="priceSupplementForm" size="mini" >
        <el-row>
          <el-col :span="12">
              <el-form-item label="补充申报单统一编号" label-width="200px">
                <el-input v-model="priceSupplementForm.preSupid"  disabled></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补充申报单编号" label-width="160px">
              <el-input v-model="priceSupplementForm.supId"  disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="报关单第几项商品" label-width="200px">
                <el-input v-model="priceSupplementForm.gNo"  disabled></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" label-width="160px">
              <el-input v-model="priceSupplementForm.gName"  disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="规格型号" label-width="200px">
                <el-input v-model="priceSupplementForm.gModel"  disabled></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编码" label-width="160px">
              <el-input v-model="priceSupplementForm.codeTs"  disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <el-form-item label="品牌" label-width="200px">
                <el-col :span="12">
                  <el-input v-model="priceSupplementForm.brandCn" placeholder="中文" :maxlength="50" :disabled="priceDisabled"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="priceSupplementForm.brandEn" placeholder="英文" :maxlength="100" :disabled="priceDisabled"></el-input>
                </el-col>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <el-form-item label="买方" label-width="200px">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.buyer" placeholder="名称" :maxlength="150" :disabled="priceDisabled"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.buyerContact" placeholder="联系人" :maxlength="50" :disabled="priceDisabled"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.buyerAddr" placeholder="地址" :maxlength="255" :disabled="priceDisabled"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.buyerTel" placeholder="电话" :maxlength="20" :disabled="priceDisabled"></el-input>
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
                    <el-input v-model="priceSupplementForm.seller" placeholder="名称" :maxlength="150" :disabled="priceDisabled"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.sellerContact" placeholder="联系人" :maxlength="50" :disabled="priceDisabled"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.sellerAddr" placeholder="地址" :maxlength="255" :disabled="priceDisabled"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.sellerTel" placeholder="电话" :maxlength="20" :disabled="priceDisabled"></el-input>
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
                    <el-input v-model="priceSupplementForm.factory" placeholder="名称" :maxlength="150" :disabled="priceDisabled"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.factoryContact" placeholder="联系人" :maxlength="50" :disabled="priceDisabled"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.factoryAddr" placeholder="地址" :maxlength="255" :disabled="priceDisabled"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="priceSupplementForm.factoryTel" placeholder="电话" :maxlength="20" :disabled="priceDisabled"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="合同协议号" label-width="200px">
                <el-input v-model="priceSupplementForm.contrNo" :maxlength="50" disabled></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签约日期" label-width="160px">
              <el-input v-model="priceSupplementForm.contrDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="priceDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="发票编号" label-width="200px">
                <el-input v-model="priceSupplementForm.invoiceNo" :maxlength="50" :disabled="priceDisabled"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票日期" label-width="160px">
              <el-input v-model="priceSupplementForm.invoiceDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="priceDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align:center">
          <span>{{initParams.iEFlag === 'I' ? '进口货物部分' : '出口货物部分'}}</span>
        </el-row>
        <el-row v-if="initParams.iEFlag === 'I'">
          <el-col :span="4">
            <span>一、买卖双方之间的关系</span>
          </el-col>
          <el-col :span="20">
            <div>
                <label >买卖双方之间存在以下关系</label>
            </div>
            <el-checkbox-group v-model="priceSupplementForm.iBabRelValue" :disabled="priceDisabled">
              <el-checkbox label="0">买卖双方为同一家族成员;</el-checkbox><br>
              <el-checkbox label="1">买卖双方互为商业上的高级职员或董事;</el-checkbox><br>
              <el-checkbox label="2">买卖双方都直接或间接地受第三方控制;</el-checkbox><br>
              <el-checkbox label="3">买卖双方共同直接或间接地控制第三方;</el-checkbox><br>
              <el-checkbox label="4">一方直接或间接地拥有控制或持有对象5%或以上的公开放行的有表决权的股票或股份;</el-checkbox><br>
              <el-checkbox label="5">一方直接或间接地拥有控制或持有对象5%或以上的公开放行的有表决权的股票或股份;</el-checkbox><br>
              <el-checkbox label="6">一方是另一方雇员、高级职员或董事;</el-checkbox><br>
              <el-checkbox label="7">买卖双方是同一合伙的成员。</el-checkbox>
            </el-checkbox-group>
            <div>
              <label >以上关系是否影响进口货物的成交价格?</label>
              <el-radio-group v-model="priceSupplementForm.iPriceEffect">
                <el-radio label="1" :disabled="priceDisabled">是</el-radio>
                <el-radio label="0" :disabled="priceDisabled">否</el-radio>
              </el-radio-group>
            </div>
            <div>
              <label>如有影响，那么进口货物的成交价格</label>
            </div>
            <el-radio-group v-model="priceSupplementForm.iPriceClose" :disabled="priceDisabled">
                <el-radio  label="1" >
                  与同时或大约同时向境内无特殊关系的买方出售的相同或类似货物的成交价格相近
                </el-radio><br>
                <el-radio label="2" >
                  与同时或大约同时相同或类似货物的倒扣价格相近;
                </el-radio><br>
                <el-radio  label="3" >
                  与同时或大约同时相同或类似货物的计算价格相近;
                </el-radio><br>
                <el-radio label="4" >
                  没有以上相近的价格;
                </el-radio>
            </el-radio-group>
            <div>
              <label>如有以上相近的价格，请提供相关证明材料。</label>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="initParams.iEFlag === 'I'">
          <el-col :span="4">
            <span>二、交易的条件</span>
          </el-col>
          <el-col :span="20">
            <div>
                <label >(一)买方处置或使用货物时是否受到除行政法规规定的限制以及对货物销售地域限制以外的限制？</label>
                <el-radio-group v-model="priceSupplementForm.iOtherLimited">
                  <el-radio label="1" :disabled="priceDisabled">是</el-radio>
                  <el-radio label="0" :disabled="priceDisabled">否</el-radio>
                </el-radio-group>
              </div>
              <div>
                <label >(二)货物的价格是否受到使货物的成交价格无法确定的条件或因素的影响？</label>
                <el-radio-group v-model="priceSupplementForm.iOtherEffect">
                  <el-radio label="1" :disabled="priceDisabled">是</el-radio>
                  <el-radio label="0" :disabled="priceDisabled">否</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input type="textarea"  v-model="priceSupplementForm.iNote1" :maxlength='255'
                :disabled="priceDisabled"
                placeholder='如果上述任一问题的回答为"是",请说明限制、条件或因素的内容'></el-input>
              </div>
              <div>
                <label>如果影响货物成交价格的条件或因素可以以客观量化数据表示，请将其填写在三(二)栏中。</label>
              </div>
              <div>
                <label >(三)买方是否应直接或间接支付与进口货物有关并作为货物销售条件的特许权使用费？</label>
                <el-radio-group v-model="priceSupplementForm.iIsusefee" size="mini">
                  <el-radio label="1" :disabled="priceDisabled">是</el-radio>
                  <el-radio label="0" :disabled="priceDisabled">否</el-radio>
                </el-radio-group>
              </div>
              <div>
                <label >(四)卖方是否直接或间接从买方对该货物进口后销售、处置或者使用所得中获得收益？</label>
                <el-radio-group v-model="priceSupplementForm.iIsprofit" size="mini">
                  <el-radio label="1" :disabled="priceDisabled">是</el-radio>
                  <el-radio label="0" :disabled="priceDisabled">否</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input type="textarea"  v-model="priceSupplementForm.iNote2" :maxlength='255'
                :disabled="priceDisabled"
                placeholder='如存在以上特许权使用费和收益的支付，且其金额在进口时不能确定的，请说明'></el-input>
              </div>
          </el-col>
        </el-row>
          <table v-if="initParams.iEFlag === 'I'"  class ='table-input'>
            <tr>
              <td rowspan="2" colspan="7">三、费用状况</td>
              <td colspan="1">币制</td>
              <td colspan="2">
                <el-select placeholder="" v-model="priceSupplementForm.curr"  style="width:100%"
                  :disabled="priceDisabled"
                  @focus="tipsFillMessage('','saasCurr','SAAS_CURR')"
                  remote  default-first-option
                  filterable
                  :remote-method="checkParamsList"
                  :popper-append-to-body = 'false' clearable>
                    <el-option
                      v-for="item in saasCurr"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td colspan="1">单位金额</td>
              <td colspan="1">总金额</td>
              <td colspan="1">备注</td>
            </tr>
            <tr>
              <td colspan="7">(一)发票价格</td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.invoicePrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.invoiceAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.invoiceNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="7">(二)间接支付的货款</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.goodsPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.goodsAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.goodsNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td rowspan="12" colspan="1">(三)未包括在发票价格中的费用和价值</td>
              <td rowspan="3" colspan="3">1、买方负担的费用：</td>
              <td colspan="3">(1)除购货佣金以外的佣金和经纪费</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iCommissionPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iCommissionAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iCommissionNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(2)与该货物视为一体的容器费用</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iContainerPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iContainerAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iContainerNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(3)包装材料与包装劳务费用</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iPackPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iPackAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iPackNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3" rowspan="4">2、与进口货物的生产与销售有关的，由买方以免费或者以低于成本的方式提供货物或服务：</td>
              <td colspan="3">(1)进口货物包含的材料、部件、零件和类似货物</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iPartPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iPartAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iPartNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(2)在生产进口货物过程中使用的工具、模具和类似货物</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iToolPrice" :maxlength='20'  :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iToolAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iToolNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(3)在生产进口货物过程中消耗的材料</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iLossPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.iLossAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.iLossNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(4)在境外进行的为生产进口货物所需的工程设计、技术研发、工艺及制图等相关服务</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iDesignPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iDesignAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.iDesignNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="6">3、特许权使用费 一 参见第二(三)栏</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iUsefeePrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iUsefeeAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
                </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iUsefeeNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                4、卖方直接或间接从买方对货物进口后转售、处置或使用所得中获得收益 一参见第二(四)栏
              </td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.iProfitPrice" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iProfitAmount" :maxlength='20' :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iProfitNote" :maxlength='255' :disabled="priceDisabled"></el-input>
              </td>
            </tr>

            <tr>
              <td colspan="3" rowspan="3">5、货物运抵境内输入地点起卸前的费用：</td>
              <td colspan="3">(1)运输费用</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iFeePrice" :maxlength="20" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iFeeAmount" :maxlength="20" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.iFeeNote" :maxlength="255" :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(2)运输相关费用</td>
              <td colspan="1">
                <el-input   v-model="priceSupplementForm.iOtherPrice" :maxlength="20" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iOtherAmount" :maxlength="20" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iOtherNote" :maxlength="255" :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">(3)保险费</td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iInsurPrice" :maxlength='20' :disabled="priceDisabled">
                </el-input>
              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iInsurAmount" :maxlength='20' :disabled="priceDisabled"></el-input>

              </td>
              <td colspan="1">
                <el-input  v-model="priceSupplementForm.iInsurNote" :maxlength="255" :disabled="priceDisabled"></el-input>
              </td>
            </tr>
        </table>
        <table v-else class ='table-input' style="width: 100%;">
            <tr>
              <td colspan="5" rowspan="2"></td>
              <td colspan="2" >币制</td>
              <td colspan="5">
                <el-select placeholder="" v-model="priceSupplementForm.curr"  style="width:100%"
                  @focus="tipsFillMessage('','saasCurr','SAAS_CURR')"
                  remote default-first-option
                  filterable
                  :remote-method="checkParamsList"
                  :popper-append-to-body = 'false' clearable>
                    <el-option
                      v-for="item in saasCurr"
                      :key="item.codeField"
                      :label="item.codeField + '-' + item.nameField"
                      :value="item.codeField">
                    </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td colspan="2" >单位金额</td>
              <td colspan="2" >总金额</td>
              <td colspan="3">备注</td>
            </tr>
            <tr>
              <td colspan="3">一、发票价格</td>
              <td colspan="2">
                <el-input  :maxlength='20'  v-model="priceSupplementForm.invoicePrice" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="2">
                <el-input  :maxlength='20' v-model="priceSupplementForm.invoiceAmount" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="3">
                <el-input  :maxlength='255' v-model="priceSupplementForm.invoiceNote" :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="3">二、间接支付的货款</td>
              <td colspan="2">
                <el-input  :maxlength='20' v-model="priceSupplementForm.goodsPrice" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="2">
                <el-input  :maxlength='20' v-model="priceSupplementForm.goodsAmount" :disabled="priceDisabled"></el-input>
              </td>
              <td colspan="3">
                <el-input  :maxlength='255' v-model="priceSupplementForm.goodsNote" :disabled="priceDisabled"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="10"><label>三、出口关税是否已经从申报价格中扣除</label>
                <el-radio-group v-model="priceSupplementForm.eIsDutyDel" size="mini">
                  <el-radio label="1" :disabled="priceDisabled">是</el-radio>
                  <el-radio label="0" :disabled="priceDisabled">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
          </table>
          <el-row>
            <el-col :span="24">
            <label>其他需要说明的情况(可另附页)</label>
          </el-col>
          <el-col :span="24">
              <el-input type="textarea" v-model="priceSupplementForm.otherNote"  :maxlength="1000" :disabled="priceDisabled"></el-input>
          </el-col>
          </el-row>
        <el-row>
          <el-col :span="24">
            <span>申报说明：对本申报单各项填报内容及所附单证的真实性和完整性承担法律责任，并愿意提供与海关归类有关的其它任何资料和单证，如有不实，由海关按有关规定处理。
            </span>
          </el-col>
          <el-col :span="24">
            <label> 对以上申报内容是否需要海关予以保密？ </label>
            <el-radio-group v-model="priceSupplementForm.isClassdecision" size="mini">
              <el-radio label="1" :disabled="priceDisabled">是</el-radio>
              <el-radio label="0" :disabled="priceDisabled">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="申报人签名" label-width="200px">
                <el-input v-model="priceSupplementForm.declName" disabled></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填报日期" label-width="160px">
              <el-input v-model="priceSupplementForm.declDate" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="单位地址" label-width="200px">
                <el-input v-model="priceSupplementForm.declAddr" :maxlength="255" :disabled="priceDisabled"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申报单位" label-width="160px">
              <el-input v-model="priceSupplementForm.agentName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="申报单位类型" label-width="160px">
              <el-radio-group v-model="priceSupplementForm.agentType" size="mini">
                <el-radio label="1" :disabled="priceDisabled">进出口货物收发货人</el-radio>
                <el-radio label="2" :disabled="priceDisabled">委托申报的报关企业</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="邮编" label-width="200px">
                <el-input v-model="priceSupplementForm.declPost" :maxlength="10" :disabled="priceDisabled"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" label-width="160px">
              <el-input v-model="priceSupplementForm.declTel"  :maxlength="20" :disabled="priceDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'price-supplement',
  props: {
    initParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {}
}
</script>

<style scoped lang="less">
.border{
    border: 1px solid #B7B7B7;
 }

</style>
