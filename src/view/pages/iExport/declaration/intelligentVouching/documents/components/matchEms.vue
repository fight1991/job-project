<template>
  <!-- 备注、唛码的组件 -->
  <section>
    <el-dialog :modal-append-to-body='false'
      title='核注清单匹对'
      :visible.sync="matchEmsVisiable"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :before-close='closeMatchEmsCompnent'
      @open="matchEmsShow"
      v-loading="$store.state.loading"
      v-dialogDrag
      class="sys-dec-class"
      width="640px">
      <div style="text-align: center;font-size: 13px;">
        <span class='tips-warning ems-tips'></span>
        <span class=''>请注意，当前报关单与关联的核注清单并不匹配，请跟换关联核注清单或更改报关单内容。</span>
      </div>
      <div class='ems-title'>
        <span>表头</span>
      </div>
      <div>
        <el-table
          :data="compareHead"
          :max-height='200' style="width: 100%" size="mini"
          ref="decLicTable"
          highlight-current-row border>
          <el-table-column prop="fieldName" label="字段名称" min-width="80"></el-table-column>
          <el-table-column prop="billValue" label="核注清单" min-width="100"></el-table-column>
          <el-table-column prop="decValue" label="报关单" min-width="100"></el-table-column>
        </el-table>
      </div>
      <div v-if='bodyShow'>{{bodyShow}}</div>
      <div class='ems-title'>
        <span>表体</span>
      </div>
      <div>
        <el-table
          :data="compareBody"
          :height='defualtHeight' style="width: 100%" size="mini"
          ref="decLicTable"
          highlight-current-row border
          row-key="id"
          @expand-change='changeExpand'
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="gNo" label="报关单商品序号" min-width="120"></el-table-column>
          <el-table-column prop="fieldName" label="字段名称" min-width="80"></el-table-column>
          <el-table-column prop="billValue" label="核注清单" min-width="100"></el-table-column>
          <el-table-column prop="decValue" label="报关单" min-width="100"></el-table-column>
        </el-table>
      </div>
      <div style='height: 10px; margin-top: 5px;'>
         <el-checkbox size="mini" v-model="coverFlag" style='float:left'>覆盖时覆盖规格型号</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-primary-btn" @click="cancle">更换关联核注</el-button>
        <el-button class="dialog-primary-btn" @click="config">覆盖报关单</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
// import util from '@/common/util.js'
// import decUtil from '../../common/decUtil'
export default {
  name: 'select-company',
  props: {
    matchEmsVisiable: {
      type: Boolean,
      default: false
    },
    compareResult: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      coverFlag: false,
      compareBody: [],
      compareHead: [],
      defualtHeight: 100,
      bodyShow: ''
    }
  },
  methods: {
    matchEmsShow () {
      this.defualtHeight = 100
      this.coverFlag = false
      this.compareBody = this.compareResult.compareBody
      this.compareHead = this.compareResult.compareHead
      this.bodyShow = this.compareResult.tips
    },
    closeMatchEmsCompnent () {
      this.$emit('close:matchEms', null)
    },
    cancle () {
      this.$emit('close:matchEms', null)
    },
    config () {
      this.$emit('close:matchEms', {coverFlag: this.coverFlag, compareBody: this.compareBody, compareHead: this.compareHead})
    },
    changeExpand (row, expanded) {
      if (expanded) {
        this.defualtHeight = 200
      } else {
        this.defualtHeight = 150
      }
    }
  }
}
</script>

<style scoped lang="less">
.ems-title {
    text-align: center;
    margin: 10px 0;
    font-size: 14px;
}
.ems-tips {
    vertical-align: middle;
    margin-bottom: 5px;
}
</style>
