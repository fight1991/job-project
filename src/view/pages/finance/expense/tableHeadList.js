export default {
  data () {
    return {
      fieldList: {},
      headFieldList: {
        orderNo: {
          label: '接单编号',
          checked: true
        },
        decNo: {
          label: '报关单号',
          checked: true
        },
        billNo: {
          label: '提单号',
          checked: true
        },
        businessType: {
          label: '业务类型',
          checked: true
        },
        entrustCompanyName: {
          label: '委托企业',
          checked: true
        },
        iEFlag: {
          label: '进出口',
          checked: true
        },
        dclPlcCuscd: {
          label: '申报地海关',
          checked: true
        },
        sailDay: {
          label: '开航日',
          checked: true
        },
        releaseDay: {
          label: '放行时间',
          checked: true
        },
        status: {
          label: '状态',
          checked: true
        },
        receives: {
          label: '应收总额',
          checked: true
        },
        pays: {
          label: '应付总额',
          checked: true
        }
      }
    }
  },
  methods: {
    columnFieldChange () {
      this.$store.dispatch('ajax', {
        url: 'API@saas-finance/bill/customLine',
        data: this.fieldList,
        router: this.$router,
        isLoad: false,
        success: () => {

        }
      })
    }
  }
}
