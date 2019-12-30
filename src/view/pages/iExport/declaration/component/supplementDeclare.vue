<template>
  <!-- 补充申报 组件 -->
  <el-dialog :modal-append-to-body='false'
      title="报关补充申报界面"
      :visible.sync="supplDecVisible"
      :show-close='false'
      class='sys-dec-class'
      :close-on-click-modal = 'false'
      width="1000px">
      <el-dialog :modal-append-to-body='false'
          title="复制"
          :visible.sync="copySuppVisible"
          append-to-body
          class='sys-dec-class'
          width="700px">
          <el-table
                ref="copySuppTable"
                :data="copySuppList"
                highlight-current-row
                :height='200'
                style="width: 100%"
                size="mini" border>
                <el-table-column  label="" min-width="35" align="center">
                  <template slot-scope="scope">
                    <input
                    class="template-radio"
                    :value="scope.$index"
                    v-model="copySuppRadio"
                    name = "copyGoods"
                    @click="copySuppSelect(scope.$index, scope.row)"
                    type="radio"/>
                  </template>
                </el-table-column>
                <el-table-column prop="gNo"  label="序号"  min-width="50" ></el-table-column>
                <el-table-column prop="codeTs" label="商品编号" min-width="100"></el-table-column>
                <el-table-column prop="gName" label="商品名称" width="300"></el-table-column>
                <el-table-column  min-width="200">
                  <template slot-scope="scope">
                    <span>{{scope.row.supTypeCheck | changeCheckbox}}</span>
                  </template>
                </el-table-column>
            </el-table>
            <el-checkbox-group v-model="copySupTypeCheck"  class="m-t-10">
                <el-checkbox label="A" :disabled="ADisabled">价格</el-checkbox>
                <el-checkbox label="B" :disabled="BDisabled">归类</el-checkbox>
                <el-checkbox label="C" :disabled="CDisabled">原产地</el-checkbox>
            </el-checkbox-group>
            <div class="m-t-10">
              <span>补充申报数据将被复制到序号为【{{this.supplementRadio}}】的商品上</span>
            </div>
            <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
              <el-button class='dialog-primary-btn' @click="configCopy" :disabled="initParams.isDisabled">确定</el-button>
              <el-button class='dialog-btn' @click="cancleCopy">取消</el-button>
            </div>
      </el-dialog>
      <el-dialog :modal-append-to-body='false'
          title="填制说明"
          :visible.sync="fillInstructionsVisible"
          :close-on-click-modal = 'false'
          append-to-body
          class='sys-dec-class'
          width="1000px">
          <!-- 填制说明 -->
          <fill-instructions></fill-instructions>
          <div slot="footer"  class="sys-dialog-footer" style="text-align:center;">
            <el-button class='dialog-primary-btn' @click="sureFillInstructions">确定</el-button>
          </div>
      </el-dialog>
       <div class='suppDec'>
          <div>
              <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-copy" @click="copySupDec" :disabled="initParams.isDisabled">&nbsp;复制</el-button>
              <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-print" @click="printSupDec" >&nbsp;打印</el-button>
              <el-button type="primary" class='dec-h-24' size="mini" icon="fa fa-copy" @click="specification">&nbsp;填制说明</el-button>
              <el-button type="primary" class='dec-h-24' size="mini" icon="el-icon-back" @click="backDeclare">&nbsp;返回报关单</el-button>
            </div>
            <div>
              <el-table
                ref="supplementTable"
                :data="supplementTableList"
                highlight-current-row
                :height='200'
                style="width: 100%"
                size="mini" border>
                <el-table-column  label="" min-width="35" align="center">
                  <template slot-scope="scope">
                    <input
                    class="template-radio"
                    :value="scope.row.gNo"
                    v-model="supplementRadio"
                    name = "goods"
                    @click="supplementTableSelect(scope.$index, scope.row)"
                    type="radio"/>
                  </template>
                </el-table-column>
                <el-table-column prop="gNo"  label="序号"  min-width="40" ></el-table-column>
                <el-table-column prop="codeTs" label="商品编号" min-width="100"></el-table-column>
                <el-table-column prop="gName" label="商品名称" min-width="400"></el-table-column>
                <el-table-column  min-width="200">
                  <template slot-scope="scope">
                      <el-checkbox-group v-model="scope.row.supTypeCheck" >
                        <el-checkbox label="A" @change="selectedSupType('A', scope.row)">价格</el-checkbox>
                        <el-checkbox label="B" @change="selectedSupType('B', scope.row)">归类</el-checkbox>
                        <el-checkbox label="C" @change="selectedSupType('C', scope.row)">原产地</el-checkbox>
                      </el-checkbox-group>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div>
              <el-tabs v-model="activeName" @tab-click="tabsClick">
                <el-tab-pane label="价格补充申报" name="first">
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
                                  <el-input v-model="priceSupplementForm.brandCn" placeholder="中文" :maxlength="50" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="priceSupplementForm.brandEn" placeholder="英文" :maxlength="100" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                              </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24">
                              <el-form-item label="买方" label-width="200px">
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.buyer" placeholder="名称" :maxlength="150" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.buyerContact" placeholder="联系人" :maxlength="50" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.buyerAddr" placeholder="地址" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.buyerTel" placeholder="电话" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                                    <el-input v-model="priceSupplementForm.seller" placeholder="名称" :maxlength="150" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.sellerContact" placeholder="联系人" :maxlength="50" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.sellerAddr" placeholder="地址" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.sellerTel" placeholder="电话" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                                    <el-input v-model="priceSupplementForm.factory" placeholder="名称" :maxlength="150" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.factoryContact" placeholder="联系人" :maxlength="50" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.factoryAddr" placeholder="地址" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="priceSupplementForm.factoryTel" placeholder="电话" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                              <el-input v-model="priceSupplementForm.contrDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                              <el-form-item label="发票编号" label-width="200px">
                                <el-input v-model="priceSupplementForm.invoiceNo" :maxlength="50" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="发票日期" label-width="160px">
                              <el-input v-model="priceSupplementForm.invoiceDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                            <el-checkbox-group v-model="priceSupplementForm.iBabRelValue" :disabled="priceDisabled || initParams.isDisabled">
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
                                <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                                <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
                              </el-radio-group>
                            </div>
                            <div>
                              <label>如有影响，那么进口货物的成交价格</label>
                            </div>
                            <el-radio-group v-model="priceSupplementForm.iPriceClose" :disabled="priceDisabled || initParams.isDisabled">
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
                                  <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                                  <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
                                </el-radio-group>
                              </div>
                              <div>
                                <label >(二)货物的价格是否受到使货物的成交价格无法确定的条件或因素的影响？</label>
                                <el-radio-group v-model="priceSupplementForm.iOtherEffect">
                                  <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                                  <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
                                </el-radio-group>
                              </div>
                              <div>
                                <el-input type="textarea"  v-model="priceSupplementForm.iNote1" :maxlength='255'
                                :disabled="priceDisabled || initParams.isDisabled"
                                placeholder='如果上述任一问题的回答为"是",请说明限制、条件或因素的内容'></el-input>
                              </div>
                              <div>
                                <label>如果影响货物成交价格的条件或因素可以以客观量化数据表示，请将其填写在三(二)栏中。</label>
                              </div>
                              <div>
                                <label >(三)买方是否应直接或间接支付与进口货物有关并作为货物销售条件的特许权使用费？</label>
                                <el-radio-group v-model="priceSupplementForm.iIsusefee" size="mini">
                                  <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                                  <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
                                </el-radio-group>
                              </div>
                              <div>
                                <label >(四)卖方是否直接或间接从买方对该货物进口后销售、处置或者使用所得中获得收益？</label>
                                <el-radio-group v-model="priceSupplementForm.iIsprofit" size="mini">
                                  <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                                  <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
                                </el-radio-group>
                              </div>
                              <div>
                                <el-input type="textarea"  v-model="priceSupplementForm.iNote2" :maxlength='255'
                                :disabled="priceDisabled || initParams.isDisabled"
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
                                  :disabled="priceDisabled || initParams.isDisabled"
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
                                <el-input   v-model="priceSupplementForm.invoicePrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.invoiceAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.invoiceNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="7">(二)间接支付的货款</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.goodsPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.goodsAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.goodsNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td rowspan="12" colspan="1">(三)未包括在发票价格中的费用和价值</td>
                              <td rowspan="3" colspan="3">1、买方负担的费用：</td>
                              <td colspan="3">(1)除购货佣金以外的佣金和经纪费</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iCommissionPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iCommissionAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iCommissionNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(2)与该货物视为一体的容器费用</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iContainerPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iContainerAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iContainerNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(3)包装材料与包装劳务费用</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iPackPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iPackAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iPackNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3" rowspan="4">2、与进口货物的生产与销售有关的，由买方以免费或者以低于成本的方式提供货物或服务：</td>
                              <td colspan="3">(1)进口货物包含的材料、部件、零件和类似货物</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iPartPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iPartAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iPartNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(2)在生产进口货物过程中使用的工具、模具和类似货物</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iToolPrice" :maxlength='20'  :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iToolAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iToolNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(3)在生产进口货物过程中消耗的材料</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iLossPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input   v-model="priceSupplementForm.iLossAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input   v-model="priceSupplementForm.iLossNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(4)在境外进行的为生产进口货物所需的工程设计、技术研发、工艺及制图等相关服务</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iDesignPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iDesignAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input   v-model="priceSupplementForm.iDesignNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="6">3、特许权使用费 一 参见第二(三)栏</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iUsefeePrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iUsefeeAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                                </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iUsefeeNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="6">
                                4、卖方直接或间接从买方对货物进口后转售、处置或使用所得中获得收益 一参见第二(四)栏
                              </td>
                              <td colspan="1">
                                <el-input   v-model="priceSupplementForm.iProfitPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iProfitAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iProfitNote" :maxlength='255' :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>

                            <tr>
                              <td colspan="3" rowspan="3">5、货物运抵境内输入地点起卸前的费用：</td>
                              <td colspan="3">(1)运输费用</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iFeePrice" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iFeeAmount" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input   v-model="priceSupplementForm.iFeeNote" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(2)运输相关费用</td>
                              <td colspan="1">
                                <el-input   v-model="priceSupplementForm.iOtherPrice" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iOtherAmount" :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iOtherNote" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">(3)保险费</td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iInsurPrice" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled">
                                </el-input>
                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iInsurAmount" :maxlength='20' :disabled="priceDisabled || initParams.isDisabled"></el-input>

                              </td>
                              <td colspan="1">
                                <el-input  v-model="priceSupplementForm.iInsurNote" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                                <el-input  :maxlength='20'  v-model="priceSupplementForm.invoicePrice" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="2">
                                <el-input  :maxlength='20' v-model="priceSupplementForm.invoiceAmount" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="3">
                                <el-input  :maxlength='255' v-model="priceSupplementForm.invoiceNote" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">二、间接支付的货款</td>
                              <td colspan="2">
                                <el-input  :maxlength='20' v-model="priceSupplementForm.goodsPrice" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="2">
                                <el-input  :maxlength='20' v-model="priceSupplementForm.goodsAmount" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                              <td colspan="3">
                                <el-input  :maxlength='255' v-model="priceSupplementForm.goodsNote" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="10"><label>三、出口关税是否已经从申报价格中扣除</label>
                                <el-radio-group v-model="priceSupplementForm.eIsDutyDel" size="mini">
                                  <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                                  <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
                                </el-radio-group>
                              </td>
                            </tr>
                          </table>
                          <el-row>
                            <el-col :span="24">
                            <label>其他需要说明的情况(可另附页)</label>
                          </el-col>
                          <el-col :span="24">
                              <el-input type="textarea" v-model="priceSupplementForm.otherNote"  :maxlength="1000" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                              <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">是</el-radio>
                              <el-radio label="0" :disabled="priceDisabled || initParams.isDisabled">否</el-radio>
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
                                <el-input v-model="priceSupplementForm.declAddr" :maxlength="255" :disabled="priceDisabled || initParams.isDisabled"></el-input>
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
                                <el-radio label="1" :disabled="priceDisabled || initParams.isDisabled">进出口货物收发货人</el-radio>
                                <el-radio label="2" :disabled="priceDisabled || initParams.isDisabled">委托申报的报关企业</el-radio>
                              </el-radio-group>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                              <el-form-item label="邮编" label-width="200px">
                                <el-input v-model="priceSupplementForm.declPost" :maxlength="10" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="电话" label-width="160px">
                              <el-input v-model="priceSupplementForm.declTel"  :maxlength="20" :disabled="priceDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                    </el-form>
                  </div>
                  <!-- 价格补充申报的 组件 -->
                  <!-- <price-supplement :initParams="initPricesupp"></price-supplement> -->
                </el-tab-pane>
                <el-tab-pane label="归类补充申报" name="second">
                  <div class="border">
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
                                  <el-input v-model="classifySupplementForm.brandCn" placeholder="中文" :maxlength="50" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="classifySupplementForm.brandEn" placeholder="英文" :maxlength="100" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                              </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24">
                              <el-form-item label="买方" label-width="200px">
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.buyer" placeholder="名称" :maxlength="150" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.buyerContact" placeholder="联系人" :maxlength="50" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.buyerAddr" placeholder="地址" :maxlength="255" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.buyerTel" placeholder="电话" :maxlength="20" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
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
                                    <el-input v-model="classifySupplementForm.seller" placeholder="名称" :maxlength="150" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.sellerContact" placeholder="联系人" :maxlength="50" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.sellerAddr" placeholder="地址" :maxlength="255" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.sellerTel" placeholder="电话" :maxlength="20" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
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
                                    <el-input v-model="classifySupplementForm.factory" placeholder="名称" :maxlength="150" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.factoryContact" placeholder="联系人" :maxlength="50" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                </el-row>
                                <el-row>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.factoryAddr" placeholder="地址" :maxlength="255" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                                  </el-col>
                                  <el-col :span="12">
                                    <el-input v-model="classifySupplementForm.factoryTel" placeholder="电话" :maxlength="20" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
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
                              <el-input v-model="classifySupplementForm.contrDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                              <el-form-item label="发票编号" label-width="200px">
                                <el-input v-model="classifySupplementForm.invoiceNo" :maxlength="50" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="发票日期" label-width="160px">
                              <el-input v-model="classifySupplementForm.invoiceDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="19">
                              <span>该商品是否取得过海关预归类决定书？如选择"是",请填写一下3项。</span>
                          </el-col>
                          <el-col :span="5">
                            <el-radio-group v-model="classifySupplementForm.isClassdecision" size="mini">
                              <el-radio label="1" :disabled="classifyDisabled || initParams.isDisabled">是</el-radio>
                              <el-radio label="0" :disabled="classifyDisabled || initParams.isDisabled">否</el-radio>
                            </el-radio-group>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8">
                              <el-form-item label="预归类决定书编号" label-width="150px">
                                <el-input v-model="classifySupplementForm.decisionNo" :maxlength="30" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="7">
                            <el-form-item label="预归类决定书商品编码" label-width="150px">
                              <el-input v-model="classifySupplementForm.codeTsDecision" :maxlength="10" placeholder="yyyyMMdd" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="9">
                              <el-form-item label="作出预归类决定的直属海关" label-width="200px">
                                <el-select placeholder="" v-model="classifySupplementForm.decisionCus"  style="width:100%"
                                  :disabled="classifyDisabled || initParams.isDisabled"
                                  @focus="tipsFillMessage('','saasCustomsRel3','SAAS_CUSTOMS_REL')"
                                  remote default-first-option
                                  filterable
                                  :remote-method="checkParamsList"
                                  :popper-append-to-body = 'false' clearable >
                                    <el-option
                                      v-for="item in initParams.saasCustomsRel3"
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
                            <label>该商品是否曾被海关取消化验？</label>
                            <el-radio-group v-model="classifySupplementForm.isSampletest" size="mini">
                              <el-radio label="1" :disabled="classifyDisabled || initParams.isDisabled">是</el-radio>
                              <el-radio label="0" :disabled="classifyDisabled || initParams.isDisabled">否</el-radio>
                            </el-radio-group>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24">
                            <label>请按以下选中项填写相关说明：</label>
                          </el-col>
                          <el-col :span="24">
                            <el-checkbox-group v-model="classifySupplementForm.gOptionsValue">
                              <el-row class="border-bottom">
                                <el-col :span="3">
                                  <el-checkbox label="0" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('0')">A成分及比例</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="1" :disabled="classifyDisabled || initParams.isDisabled"  @change="changeGOptions('1')">B原料及组成</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="2" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('2')">C生产/加工工艺</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="3" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('3')">D构成</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="4" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('4')">E技术参数</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="5" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('5')">F具体规格</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="6" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('6')">G工作原理</el-checkbox>
                                </el-col>
                              </el-row>
                              <el-row class="border-bottom">
                                <el-col :span="3">
                                  <el-checkbox label="7" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('7')">H车型排量</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="8" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('8')">I功能</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="9" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('9')">J用途</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="10" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('10')">K加工程度</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="11" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('11')">L性能指标</el-checkbox>
                                </el-col>
                                <el-col :span="3">
                                  <el-checkbox label="12" :disabled="classifyDisabled || initParams.isDisabled" @change="changeGOptions('12')">M其他信息</el-checkbox>
                                </el-col>
                              </el-row>
                            </el-checkbox-group>
                          </el-col>
                          <el-col :span="24">
                            <el-input placeholder="请在此填写（请注明上述相应选项项号，也可在本申报单后随附）：" :disabled="classifyDisabled || initParams.isDisabled" v-model="classifySupplementForm.otherNote"></el-input>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24">
                            <span>申报说明：对本申报单各项填报内容及所附单证的真实性和完整性承担法律责任，并愿意提供与海关归类有关的其它任何资料和单证，如有不实，由海关按有关规定处理。
                            </span>
                          </el-col>
                          <el-col :span="24">
                            <label> 对以上申报内容是否需要海关予以保密？ </label>
                            <el-radio-group v-model="classifySupplementForm.isClassdecision" size="mini">
                              <el-radio label="1" :disabled="classifyDisabled || initParams.isDisabled">是</el-radio>
                              <el-radio label="0" :disabled="classifyDisabled || initParams.isDisabled">否</el-radio>
                            </el-radio-group>
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
                                <el-input v-model="classifySupplementForm.declAddr" :maxlength="255" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
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
                              <el-radio-group v-model="classifySupplementForm.agentType" size="mini">
                                <el-radio label="1" :disabled="classifyDisabled || initParams.isDisabled">进出口货物收发货人</el-radio>
                                <el-radio label="2" :disabled="classifyDisabled || initParams.isDisabled">委托申报的报关企业</el-radio>
                              </el-radio-group>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                              <el-form-item label="邮编" label-width="200px">
                                <el-input v-model="classifySupplementForm.declPost" :maxlength="10" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="电话" label-width="160px">
                              <el-input v-model="classifySupplementForm.declTel"  :maxlength="20" :disabled="classifyDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                    </el-form>
                  </div>
                  <!-- 归类补充申报的 组件 -->
                  <!-- <classify-supplement :initParams="initClassifysupp" @backDatas="returnClassifysupplement" ></classify-supplement> -->
                </el-tab-pane>
                <el-tab-pane label="原产地补充申报" name="third">
                  <div class='border'>
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
                                <el-input v-model="orignSupplementForm.brandCn" placeholder="中文" :maxlength="50" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                              </el-col>
                              <el-col :span="12">
                                <el-input v-model="orignSupplementForm.brandEn" placeholder="英文" :maxlength="100" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                              </el-col>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                            <el-form-item label="买方" label-width="200px">
                              <el-row>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.buyer" placeholder="名称" :maxlength="150"  :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.buyerContact" placeholder="联系人" :maxlength="50"  :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.buyerAddr" placeholder="地址" :maxlength="255"  :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.buyerTel" placeholder="电话" :maxlength="20"  :disabled="orignDisabled || initParams.isDisabled"></el-input>
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
                                  <el-input v-model="orignSupplementForm.seller" placeholder="名称" :maxlength="150" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.sellerContact" placeholder="联系人" :maxlength="50" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.sellerAddr" placeholder="地址" :maxlength="255" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.sellerTel" placeholder="电话" :maxlength="20" :disabled="orignDisabled || initParams.isDisabled"></el-input>
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
                                  <el-input v-model="orignSupplementForm.factory" placeholder="名称" :maxlength="150" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.factoryContact" placeholder="联系人" :maxlength="50" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.factoryAddr" placeholder="地址" :maxlength="255" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                                </el-col>
                                <el-col :span="12">
                                  <el-input v-model="orignSupplementForm.factoryTel" placeholder="电话" :maxlength="20" :disabled="orignDisabled || initParams.isDisabled"></el-input>
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
                            <el-input v-model="orignSupplementForm.contrDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="发票编号" label-width="200px">
                              <el-input v-model="orignSupplementForm.invoiceNo" :maxlength="50" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="发票日期" label-width="160px">
                            <el-input v-model="orignSupplementForm.invoiceDate" :maxlength="8" placeholder="yyyyMMdd" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                            <el-form-item label="运输方式" label-width="200px">
                              <el-radio-group v-model="orignSupplementForm.trafMode" size="mini">
                                <el-radio label="1" :disabled="orignDisabled || initParams.isDisabled">联运</el-radio>
                                <el-radio label="2" :disabled="orignDisabled || initParams.isDisabled">空运</el-radio>
                                <el-radio label="3" :disabled="orignDisabled || initParams.isDisabled">海运</el-radio>
                                <el-radio label="4" :disabled="orignDisabled || initParams.isDisabled">陆运</el-radio>
                              </el-radio-group>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="直接运输" label-width="200px">
                              <el-radio-group v-model="orignSupplementForm.isDirecttraf">
                                <el-radio label="1" :disabled="orignDisabled || initParams.isDisabled">是</el-radio>
                                <el-radio label="0" :disabled="orignDisabled || initParams.isDisabled">否</el-radio>
                              </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="中转国(地区)" label-width="200px">
                              <el-select placeholder="" v-model="orignSupplementForm.transitCountry"
                                :disabled="orignDisabled || initParams.isDisabled"
                                @focus="tipsFillMessage('','saasCountry3','SAAS_COUNTRY')"
                                remote default-first-option
                                filterable
                                :remote-method="checkParamsList"
                                :popper-append-to-body = 'false'
                                clearable  style="width:100%">
                                <el-option
                                  v-for="item in saasCountry3"
                                  :key="item.codeField"
                                  :label="item.codeField + '-' + item.nameField"
                                  :value="item.codeField">
                                </el-option>
                              </el-select>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="到货口岸" label-width="200px">
                              <el-select placeholder="" v-model="orignSupplementForm.destPort"  style="width:100%"
                                :disabled="orignDisabled || initParams.isDisabled"
                                @focus="tipsFillMessage('','saasCustomsRel1','SAAS_CUSTOMS_REL')"
                                remote default-first-option
                                filterable
                                :remote-method="checkParamsList"
                                :popper-append-to-body = 'false' clearable>
                                  <el-option
                                    v-for="item in saasCustomsRel1"
                                    :key="item.codeField"
                                    :label="item.codeField + '-' + item.nameField"
                                    :value="item.codeField">
                                  </el-option>
                              </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="申报口岸" label-width="160px">
                            <el-select placeholder="" v-model="orignSupplementForm.declPort"  style="width:100%"
                                :disabled="orignDisabled || initParams.isDisabled"
                                @focus="tipsFillMessage('','saasCustomsRel2','SAAS_CUSTOMS_REL')"
                                remote default-first-option
                                filterable
                                :remote-method="checkParamsList"
                                :popper-append-to-body = 'false' clearable>
                                  <el-option
                                    v-for="item in saasCustomsRel2"
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
                              <el-input v-model="orignSupplementForm.billNo" :maxlength="32" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="原产国(地区)" label-width="200px">
                              <el-select placeholder="" v-model="orignSupplementForm.originCountry"
                                :disabled="orignDisabled || initParams.isDisabled"
                                @focus="tipsFillMessage('','saasCountry1','SAAS_COUNTRY')"
                                remote default-first-option
                                filterable
                                :remote-method="checkParamsList"
                                :popper-append-to-body = 'false'
                                clearable  style="width:100%">
                                <el-option
                                  v-for="item in saasCountry1"
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
                                <el-radio label="1" :disabled="orignDisabled || initParams.isDisabled">外包装</el-radio>
                                <el-radio label="2" :disabled="orignDisabled || initParams.isDisabled">内包装</el-radio>
                                <el-radio label="3" :disabled="orignDisabled || initParams.isDisabled">产品本体</el-radio>
                                <el-radio label="4" :disabled="orignDisabled || initParams.isDisabled">无</el-radio>
                              </el-radio-group>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="原产地证书签发机构及所在国家(地区)" label-width="200px">
                              <el-select placeholder="" v-model="orignSupplementForm.certCountry"
                                :popper-append-to-body = 'false' :disabled="orignDisabled || initParams.isDisabled"
                                @focus="tipsFillMessage('','saasCountry2','SAAS_COUNTRY')"
                                remote default-first-option
                                filterable
                                :remote-method="checkParamsList"
                                clearable  style="width:100%">
                                <el-option
                                  v-for="item in saasCountry2"
                                  :key="item.codeField"
                                  :label="item.codeField + '-' + item.nameField"
                                  :value="item.codeField">
                                </el-option>
                              </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="原产地证书编号" label-width="200px">
                              <el-input v-model="orignSupplementForm.certNo" :maxlength="30" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="适用的原产地标准" label-width="200px">
                              <el-radio-group v-model="orignSupplementForm.certStandard">
                                <el-radio label="1" :disabled="orignDisabled || initParams.isDisabled">完全获得</el-radio>
                                <el-radio label="2" :disabled="orignDisabled || initParams.isDisabled">税号改变</el-radio>
                                <el-radio label="3" :disabled="orignDisabled || initParams.isDisabled">制造或加工工序</el-radio>
                                <el-radio label="4" :disabled="orignDisabled || initParams.isDisabled">从价百分比</el-radio>
                                <el-radio label="5" :disabled="orignDisabled || initParams.isDisabled">混合标准</el-radio>
                                <el-radio label="6" :disabled="orignDisabled || initParams.isDisabled">其他标准</el-radio>
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
                            <el-input v-model="orignSupplementForm.otherNote" :maxlength="1000" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <span>申报说明：对本申报单各项填报内容及所附单证的真实性和完整性承担法律责任，并愿意提供与海关归类有关的其它任何资料和单证，如有不实，由海关按有关规定处理。
                          </span>
                        </el-col>
                        <el-col :span="24">
                          <label> 对以上申报内容是否需要海关予以保密？ </label>
                          <el-radio-group v-model="orignSupplementForm.isClassdecision">
                            <el-radio label="1" :disabled="orignDisabled || initParams.isDisabled">是</el-radio>
                            <el-radio label="0" :disabled="orignDisabled || initParams.isDisabled">否</el-radio>
                          </el-radio-group>
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
                              <el-input v-model="orignSupplementForm.declAddr" :maxlength="255" :disabled="orignDisabled || initParams.isDisabled"></el-input>
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
                              <el-radio label="1" :disabled="orignDisabled || initParams.isDisabled">进出口货物收发货人</el-radio>
                              <el-radio label="2" :disabled="orignDisabled || initParams.isDisabled">委托申报的报关企业</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="邮编" label-width="200px">
                              <el-input v-model="orignSupplementForm.declPost" :maxlength="10" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="电话" label-width="160px">
                            <el-input v-model="orignSupplementForm.declTel"  :maxlength="20" :disabled="orignDisabled || initParams.isDisabled"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                  <!-- 原产地补充申报的组件 -->
                  <!-- <origin-supplement :initParams="initOriginsupp" @backDatas="returnOriginsupplement"></origin-supplement> -->
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
    </el-dialog>
</template>

<script>
import util from '@/common/util'
import fillInstructions from './filInstructions.vue'

export default {
  components: {
    fillInstructions
  },
  name: 'supplement-declare',
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
      activeName: 'first',
      iEFlag: '', // 进出口标识
      saasCurr: [], // 币制参数
      supplementTableList: [], // 商品信息
      saasCountry1: [], // 国家
      saasCountry2: [], // 国家
      saasCountry3: [], // 国家
      saasCustomsRel1: [], // 海关关区
      saasCustomsRel2: [], // 海关关区
      saasCustomsRel3: [], // 海关关区
      supplementRadio: '', // 单选
      orignDisabled: true, // 控制原产地证的填写
      priceDisabled: true, // 控制价格的填写
      classifyDisabled: true, // 归类的填写
      supplDecVisible: false, //
      orignSupplementForm: {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: 'C', // 补充申报单类型
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
        createTime: '', // 创建时间
        gName: '', // 商品名称)
        gModel: '', // 规格型号
        codeTs: '', // 商品编码
        declName: '', // 申报人签名
        declDate: '', // 填报日期
        agentName: '', // 填报日期
        iBabRelValue: [],
        gOptionsValue: [] // 请按以下选中项填写相关说明
      },
      priceSupplementForm: {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: 'A', // 补充申报单类型
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
        createTime: '', // 创建时间
        gName: '', // 商品名称)
        gModel: '', // 规格型号
        codeTs: '', // 商品编码
        declName: '', // 申报人签名
        declDate: '', // 填报日期
        agentName: '', // 填报日期
        iBabRelValue: [],
        gOptionsValue: [] // 请按以下选中项填写相关说明
      },
      classifySupplementForm: {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: 'B', // 补充申报单类型
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
        createTime: '', // 创建时间
        gName: '', // 商品名称)
        gModel: '', // 规格型号
        codeTs: '', // 商品编码
        declName: '', // 申报人签名
        declDate: '', // 填报日期
        agentName: '', // 填报日期
        iBabRelValue: [],
        gOptionsValue: [] // 请按以下选中项填写相关说明
      },
      selectObj: {
        obj: '',
        params: ''
      },
      priceSelect: {
        'curr': {obj: 'saasCurr', params: 'SAAS_CURR'} // 币制
      },
      orignSelect: {
        'destPort': {obj: 'saasCustomsRel1', params: 'SAAS_CUSTOMS_REL'}, // 到货口岸
        'declPort': {obj: 'saasCustomsRel2', params: 'SAAS_CUSTOMS_REL'}, // 申报口岸
        'certCountry': {obj: 'saasCountry2', params: 'SAAS_COUNTRY'}, // 原产地证书签发机构及所在国家
        'originCountry': {obj: 'saasCountry1', params: 'SAAS_COUNTRY'}, // 原产国(地区)
        'transitCountry': {obj: 'saasCountry3', params: 'SAAS_COUNTRY'} // 原产国(地区)
      },
      classifySelect: {
        'decisionCus': {obj: 'saasCustomsRel3', params: 'SAAS_CUSTOMS_REL'} // 作出预归类决定的直属海关
      },
      initPricesupp: {
        iEFlag: this.iEFlag, // 进出口标识
        saasCurr: this.saasCurr, // 币制参数
        priceSupplementForm: this.priceSupplementForm,
        priceDisabled: this.priceDisabled // 控制价格的填写
      },
      copySuppVisible: false, // 控制复制的弹出框
      copySuppList: [], // 复制的商品列表
      copySuppRadio: '', // 选中数据
      copySupTypeCheck: [], // 需要复制的项目
      ADisabled: true, // 价格多选框
      BDisabled: true, // 归类多选框
      CDisabled: true, // 原产地多选框
      fillInstructionsVisible: false // 填制说明
    }
  },
  mounted () {
    // 初始化 下拉参数
    this.iEFlag = this.initParams.iEFlag
    this.supplementTableList = this.initParams.goodList
    for (let i in this.supplementTableList) {
      let sup = []
      let list = this.supplementTableList[i].decSupplements
      if (list !== null) {
        for (let n in list) {
          sup.push(list[n].supType)
          list[n]['iBabRelValue'] = []
          list[n]['gOptionsValue'] = []
          if (list[n].supType === 'A') { // 转换买卖双方之间的关系
            let value = list[n].iBabrel.split('') // '0100'拆成['0', '1', '0', '0']
            for (let m in value) {
              if (value[m] === '1') {
                list[n].iBabRelValue.push(m.toString())
              }
            }
          } else if (list[n].supType === 'B') { // 转换买卖双方之间的关系
            let value = list[n].gOptions.split('') // '0100'拆成['0', '1', '0', '0']
            for (let m in value) {
              if (value[m] === '1') {
                list[n].gOptionsValue.push(m.toString())
              }
            }
          }
        }
      } else {
        this.supplementTableList[i].decSupplements = []
      }
      this.supplementTableList[i]['supTypeCheck'] = sup
    }
    // 显示
    this.supplDecVisible = this.initParams.supplDecVisible
  },
  filters: {
    changeCheckbox (value) {
      let arr = []
      for (let i in value) {
        if (value[i] === 'A') {
          arr.push('价格')
        } else if (value[i] === 'B') {
          arr.push('归类')
        } else if (value[i] === 'C') {
          arr.push('原产地')
        }
      }
      return arr.join('|')
    }
  },
  methods: {
    configBtn () {
      this.$emit('backDatas', {goodList: this.supplementTableList})
    },
    cancleBtn () {
      this.$emit('cancLeData')
    },
    // 复制补充说明
    copySupDec () {
      if (util.isEmpty(this.supplementRadio)) {
        this.messageTips('请选择一条需要复制的数据', 'error')
        return false
      }
      this.copySuppList = util.simpleClone(this.supplementTableList)
      // 去掉需要被复制的商品
      for (let i in this.copySuppList) {
        if (this.copySuppList[i].gNo === this.supplementRadio) {
          this.copySuppList.splice(i, 1)
        }
      }
      this.copySuppVisible = true
    },
    // 打印补充说明
    printSupDec () {
      if (util.isEmpty(this.supplementRadio)) {
        this.messageTips('选择一条需要打印的数据', 'error')
        return false
      }
      let pid = []
      let index = parseInt(this.supplementRadio) - 1 // 补充申报选的的数据 index
      let checked = this.supplementTableList[index].decSupplements
      for (let i in checked) {
        if (!util.isEmpty(checked[i]).pid) {
          pid.push(checked[i].pid.toString())
        }
      }
      if (pid.length === 0) {
        this.messageTips('没有可打印的数据', 'error')
        return false
      }
      this.$post({
        url: 'API@/dec-common/dec/common/exportSupplementPdf',
        data: {
          'supIds': pid,
          'ieFlag': this.initParams.iEFlag
        },
        success: (res) => {
          for (let i in res.result) {
            window.open(res.result[i], '_blank')
          }
        }
      })
    },
    // 填制说明
    specification () {
      this.fillInstructionsVisible = true
    },
    // 返回报关单
    backDeclare () {
      // 处理数据
      for (let i in this.supplementTableList) {
        let supData = this.supplementTableList[i].decSupplements
        for (let n in supData) {
          if (supData[n].supType === 'A') { // 转换买卖双方之间的关系
            let model = ['0', '0', '0', '0', '0', '0', '0', '0']
            for (let m in supData[n].iBabRelValue) {
              let index = supData[n].iBabRelValue[m]
              model[parseInt(index)] = '1'
            }
            supData[n].iBabrel = model.join('')
          } else if (supData[n].supType === 'B') { // 转换买卖双方之间的关系
            let model = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
            for (let m in supData[n].gOptionsValue) {
              let index = supData[n].gOptionsValue[m]
              model[parseInt(index)] = '1'
            }
            supData[n].gOptions = model.join('')
          }
        }
      }
      this.cancleBtn()
    },
    // 选择
    supplementTableSelect (index, row) {
      // 先统一置灰 清除数据
      this.orignDisabled = true // 控制原产地证的填写
      this.priceDisabled = true // 控制价格的填写
      this.classifyDisabled = true // 归类的填写
      this.refreshPrice()
      this.refreshClassify()
      this.refreshOrign()
      this.saasCurr = []
      this.saasCustomsRel1 = []
      this.saasCustomsRel2 = []
      this.saasCustomsRel3 = []
      this.saasCountry1 = []
      this.saasCountry2 = []
      this.saasCountry3 = []
      // 设置数据
      for (let i in row.decSupplements) {
        if (row.decSupplements[i].supType === 'A') {
          this.priceSupplementForm = row.decSupplements[i]
          this.initSelect(this.priceSelect, this.priceSupplementForm)
          this.priceDisabled = false // 控制价格的填写
        } else if (row.decSupplements[i].supType === 'B') {
          this.classifySupplementForm = row.decSupplements[i]
          this.initSelect(this.classifySelect, this.classifySupplementForm)
          this.classifyDisabled = false // 归类的填写
        } else if (row.decSupplements[i].supType === 'C') {
          this.initSelect(this.orignSelect, this.orignSupplementForm)
          this.orignSupplementForm = row.decSupplements[i]
          this.orignDisabled = false // 控制原产地证的填写
        }
      }
    },
    refreshPrice () {
      this.priceSupplementForm = {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: 'A', // 补充申报单类型
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
        createTime: '', // 创建时间
        gName: '', // 商品名称)
        gModel: '', // 规格型号
        codeTs: '', // 商品编码
        declName: '', // 申报人签名
        declDate: '', // 填报日期
        agentName: '', // 填报日期
        iBabRelValue: [],
        gOptionsValue: [] // 请按以下选中项填写相关说明
      }
    },
    refreshClassify () {
      this.classifySupplementForm = {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: 'B', // 补充申报单类型
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
        createTime: '', // 创建时间
        gName: '', // 商品名称)
        gModel: '', // 规格型号
        codeTs: '', // 商品编码
        declName: '', // 申报人签名
        declDate: '', // 填报日期
        agentName: '', // 填报日期
        iBabRelValue: [],
        gOptionsValue: [] // 请按以下选中项填写相关说明
      }
    },
    refreshOrign () {
      this.orignSupplementForm = {
        pid: '', // 主键
        decListPid: '', // 报关单表体DEC_LIST_PID
        decPid: '', // 报关单表头PID
        cusCiqNo: '', // 关检关联号
        supid: '', // 补充申报单编号
        gNo: '', // 补充申报单商品序号
        supType: 'C', // 补充申报单类型
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
        createTime: '', // 创建时间
        gName: '', // 商品名称)
        gModel: '', // 规格型号
        codeTs: '', // 商品编码
        declName: '', // 申报人签名
        declDate: '', // 填报日期
        agentName: '', // 填报日期
        iBabRelValue: [],
        gOptionsValue: [] // 请按以下选中项填写相关说明
      }
    },
    // 选择 补充申报类型
    selectedSupType (type, row) {
      let select = row.supTypeCheck // 变化后的值
      this.supplementRadio = row.gNo
      // 如果是选中事件
      if (type === 'A') {
        this.activeName = 'first' // 切换到点击的行
        if (util.isExistInArray(type, select)) { // 勾选
        // 给 价格补充申报 归类补充申报  原产地补充申报 赋当前选中的值
          this.refreshPrice()
          this.priceSupplementForm.gNo = row.gNo
          this.priceSupplementForm.gName = row.gName
          this.priceSupplementForm.gModel = row.gModel
          this.priceSupplementForm.codeTs = row.codeTs
          this.priceSupplementForm.contrNo = this.initParams.contrNo
          this.priceSupplementForm.declName = this.initParams.userName // 申报人签名
          this.priceSupplementForm.agentName = this.initParams.agentName // 申报单位
          this.priceSupplementForm.declDate = this.getTodayDate()
          row.decSupplements.push(util.simpleClone(this.priceSupplementForm))
          for (let i in row.decSupplements) {
            if (row.decSupplements[i].supType === 'A') {
              this.priceSupplementForm = row.decSupplements[i]
              this.priceDisabled = false // 控制价格的填写
            } else if (row.decSupplements[i].supType === 'B') {
              this.classifySupplementForm = row.decSupplements[i]
              this.classifyDisabled = false // 归类的填写
            } else if (row.decSupplements[i].supType === 'C') {
              this.orignSupplementForm = row.decSupplements[i]
              this.orignDisabled = false // 控制原产地证的填写
            }
          }
        } else { // 取消
          this.$confirm('是否删除该补充申报单？', '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => { // 确定
            // 删除补充申报
            for (let i in row.decSupplements) {
              if (row.decSupplements[i].supType === 'A') {
                row.decSupplements.splice(i, 0)
                break
              }
            }
            this.saasCurr = []
            this.refreshPrice()
            this.priceDisabled = true
          }).catch(() => { // 取消
            row.supTypeCheck.push('A')
          })
        }
      } else if (type === 'B') {
        this.activeName = 'second'
        if (util.isExistInArray(type, select)) { // 勾选
        // 给 价格补充申报 归类补充申报  原产地补充申报 赋当前选中的值
          this.refreshClassify()
          this.classifySupplementForm.gNo = row.gNo
          this.classifySupplementForm.gName = row.gName
          this.classifySupplementForm.gModel = row.gModel
          this.classifySupplementForm.codeTs = row.codeTs
          this.classifySupplementForm.contrNo = this.initParams.contrNo
          this.classifySupplementForm.declName = this.initParams.userName // 申报人签名
          this.classifySupplementForm.agentName = this.initParams.agentName // 申报单位
          this.classifySupplementForm.declDate = this.getTodayDate()
          row.decSupplements.push(util.simpleClone(this.classifySupplementForm))
          for (let i in row.decSupplements) {
            if (row.decSupplements[i].supType === 'A') {
              this.priceSupplementForm = row.decSupplements[i]
              this.priceDisabled = false // 控制价格的填写
            } else if (row.decSupplements[i].supType === 'B') {
              this.classifySupplementForm = row.decSupplements[i]
              this.classifyDisabled = false // 归类的填写
            } else if (row.decSupplements[i].supType === 'C') {
              this.orignSupplementForm = row.decSupplements[i]
              this.orignDisabled = false // 控制原产地证的填写
            }
          }
          this.classifyDisabled = false
        } else { // 取消
          this.$confirm('是否删除该补充申报单？', '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => { // 确定
            // 删除补充申报
            for (let i in row.decSupplements) {
              if (row.decSupplements[i].supType === 'B') {
                row.decSupplements.splice(i, 0)
                break
              }
            }
            this.saasCustomsRel3 = []
            this.refreshClassify()
            this.classifyDisabled = true
          }).catch(() => { // 取消
            row.supTypeCheck.push('B')
          })
        }
      } else if (type === 'C') {
        this.activeName = 'third'
        if (util.isExistInArray(type, select)) { // 勾选
        // 给 价格补充申报 归类补充申报  原产地补充申报 赋当前选中的值
          this.refreshOrign()
          this.orignSupplementForm.gNo = row.gNo
          this.orignSupplementForm.gName = row.gName
          this.orignSupplementForm.gModel = row.gModel
          this.orignSupplementForm.codeTs = row.codeTs
          this.orignSupplementForm.contrNo = this.initParams.contrNo
          this.orignSupplementForm.declName = this.initParams.userName // 申报人签名
          this.orignSupplementForm.agentName = this.initParams.agentName // 申报单位
          this.orignSupplementForm.declDate = this.getTodayDate()
          row.decSupplements.push(util.simpleClone(this.orignSupplementForm))
          for (let i in row.decSupplements) {
            if (row.decSupplements[i].supType === 'A') {
              this.priceSupplementForm = row.decSupplements[i]
              this.priceDisabled = false // 控制价格的填写
            } else if (row.decSupplements[i].supType === 'B') {
              this.classifySupplementForm = row.decSupplements[i]
              this.classifyDisabled = false // 归类的填写
            } else if (row.decSupplements[i].supType === 'C') {
              this.orignSupplementForm = row.decSupplements[i]
              this.orignDisabled = false // 控制原产地证的填写
            }
          }
          this.orignDisabled = false
        } else { // 取消
          this.$confirm('是否删除该补充申报单？', '提示', {
            modalAppendToBody: true,
            domMount: this.$el.parentNode,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => { // 确定
            // 删除补充申报
            for (let i in row.decSupplements) {
              if (row.decSupplements[i].supType === 'C') {
                row.decSupplements.splice(i, 0)
                break
              }
            }
            this.saasCustomsRel1 = []
            this.saasCustomsRel2 = []
            this.saasCountry1 = []
            this.saasCountry2 = []
            this.saasCountry3 = []
            this.refreshOrign()
            this.orignDisabled = true
          }).catch(() => { // 取消
            row.supTypeCheck.push('C')
          })
        }
      }
      // 如果是取消选中事件
      this.supplementTableList.push({})
      this.supplementTableList.pop()
    },
    // 显示补充类型标签
    tabsClick () {

    },
    // 选择变化
    changeGOptions (type) {
      let modelA = ['A();', 'B();', 'C();', 'D();', 'E();', 'F();', 'G();', 'H();', 'I();', 'J();', 'K();', 'L();', 'M();']
      let select = this.classifySupplementForm.gOptionsValue
      if (util.isExistInArray(type, select)) { // 如果是勾选
        this.classifySupplementForm.otherNote += modelA[parseInt(type)]
      } else { // 取消勾选
        let str = modelA[parseInt(type)].substring(0, 1)
        let regStr = str + '\\(([a-zA-Z0-9_\\u4e00-\\u9fa5]*)\\);'
        let reg = new RegExp(regStr, 'g')
        this.classifySupplementForm.otherNote = this.classifySupplementForm.otherNote.replace(reg, '')
      }
    },
    // 获取今天的日期
    getTodayDate () {
      let date = new Date()
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      if (mon.toString().length === 1) {
        mon = '0' + mon
      }
      let day = date.getDate()
      if (day.toString().length === 1) {
        day = '0' + day
      }
      return year + '-' + mon + '-' + day
    },
    tipsFillMessage (value, obj, params) {
      this.selectObj = {
        obj: obj,
        params: params
      }
    },
    checkParamsList (query) {
      let keyValue = query.toString().trim()
      let list = JSON.parse(window.localStorage.getItem(this.selectObj.params))
      let filterList = []
      if (util.isEmpty(keyValue)) {
        this[this.selectObj.obj] = list.slice(0, 10)
      } else {
        filterList = list.filter(item => {
          let str = ''
          let fitlerParmaTable = ['SAAS_CURR', 'SAAS_WRAP', 'SAAS_TRADE', 'SAAS_CONTAINER_MODEL', 'SAAS_COUNTRY']
          if (util.isExistInArray(this.selectObj.params, fitlerParmaTable)) {
            str = item.codeField + '-' + item.nameField + ' ' + item.otherField + ' ' + item.extendField
          } else {
            str = item.codeField + '-' + item.nameField
          }
          return str.toLowerCase().indexOf(keyValue.toLowerCase()) > -1
        })
        this[this.selectObj.obj] = filterList.slice(0, 10)
      }
    },
    /**
     * 初始化 下拉框
     * @param arr 定义的每个模块的数据
     * @param form 表单
     */
    initSelect (arr, form) {
      for (let key in arr) {
        let selectValue = form[key]
        this.selectObj = arr[key]
        if (util.isEmpty(selectValue)) {
          continue
        } else {
          this.checkParamsList(selectValue)
        }
      }
    },
    // 选择需要复制商品的信息
    copySuppSelect (index, row) {
      // 先统一置为true  禁掉选择功能
      this.ADisabled = true
      this.BDisabled = true
      this.CDisabled = true
      this.copySupTypeCheck = []
      let checked = row.supTypeCheck
      for (let i in checked) {
        if (checked[i] === 'A') {
          this.ADisabled = false
        } else if (checked[i] === 'B') {
          this.BDisabled = false
        } else if (checked[i] === 'C') {
          this.CDisabled = false
        }
      }
    },
    // 确定复制
    configCopy () {
      if (util.isEmpty(this.copySuppRadio)) {
        this.messageTips('至少选择一条数据')
        return false
      }
      if (this.copySupTypeCheck.length === 0) {
        this.messageTips('没有可复制的数据')
        return false
      }
      let index = parseInt(this.supplementRadio) - 1 // 补充申报选的的数据 index
      let copyIndex = parseInt(this.copySuppRadio) // 复制选规则的数据index
      for (let i in this.copySupTypeCheck) {
        if (util.isExistInArray(this.copySupTypeCheck[i], this.supplementTableList[index].supTypeCheck)) { // 替换
          // 遍历 选择的商品的补充申报
          let copyList = this.copySuppList[copyIndex].decSupplements
          let copyVo
          for (let m in copyList) {
            if (copyList[m].supType === this.copySupTypeCheck[i]) {
              copyVo = util.simpleClone(copyList[m])
              break
            }
          }
          let needCopyList = this.supplementTableList[index].decSupplements
          // 遍历 需要修改 补充申报
          for (let n in needCopyList) {
            if (needCopyList[n].supType === this.copySupTypeCheck[i]) {
              copyVo.gNo = needCopyList[n].gNo // 报关单第几项商品
              copyVo.gName = needCopyList[n].gName // 商品名称
              copyVo.codeTs = needCopyList[n].codeTs // 商品名称
              copyVo.gModel = needCopyList[n].gModel // 规格型号
              copyVo.preSupid = '' // 补充申报单统一编号
              copyVo.supId = '' // 补充申报单编号
              copyVo.pid = '' // 补充申报技术主键
              needCopyList[n] = copyVo
              break
            }
          }
        } else { // 新增
          // 遍历 选择的商品的补充申报
          let copyList = this.copySuppList[copyIndex].decSupplements
          let copyVo
          for (let m in copyList) {
            if (copyList[m].supType === this.copySupTypeCheck[i]) {
              copyVo = util.simpleClone(copyList[m])
              break
            }
          }
          copyVo.gNo = this.supplementTableList[index].gNo // 报关单第几项商品
          copyVo.gName = this.supplementTableList[index].gName // 商品名称
          copyVo.codeTs = this.supplementTableList[index].codeTs // 商品名称
          copyVo.gModel = this.supplementTableList[index].gModel // 规格型号
          copyVo.preSupid = '' // 补充申报单统一编号
          copyVo.supId = '' // 补充申报单编号
          copyVo.pid = '' // 补充申报技术主键
          this.supplementTableList[index].decSupplements.push(copyVo)
        }
      }
      let check = this.supplementTableList[index].decSupplements
      let decCheck = []
      for (let i in check) {
        if (check[i].supType === 'A') {
          decCheck.push('A')
          this.priceSupplementForm = check[i]
          this.initSelect(this.priceSelect, this.priceSupplementForm)
          this.priceDisabled = false
        } else if (check[i].supType === 'B') {
          decCheck.push('B')
          this.classifySupplementForm = check[i]
          this.initSelect(this.classifySelect, this.classifySupplementForm)
          this.classifyDisabled = false
        } else if (check[i].supType === 'C') {
          decCheck.push('C')
          this.orignSupplementForm = check[i]
          this.initSelect(this.orignSelect, this.orignSupplementForm)
          this.orignDisabled = false
        }
      }
      this.supplementTableList[index].supTypeCheck = decCheck
      this.supplementTableList.push({})
      this.supplementTableList.pop()
      this.copySuppVisible = false
    },
    // 取消复制
    cancleCopy () {
      this.copySuppVisible = false
    },
    sureFillInstructions () {
      this.fillInstructionsVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.template-radio{
  width: 15px;
  height: 15px;
  vertical-align: middle;
}
.border{
    border: 1px solid #B7B7B7;
 }
 .border-bottom {
   border-bottom: 0;
 }
 .m-t-10{
   margin-top: 10px;
 }
</style>
