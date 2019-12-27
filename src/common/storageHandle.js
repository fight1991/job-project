const edocCodeSpecial = {
  '70000001': 'order',
  '70000002': 'license'
}
let edocCodes
export default {
  edocCodeHandle (result) {
    edocCodes = result && result.map(item => {
      return {
        ...item,
        relatedBusiness: edocCodeSpecial[item.codeField] ? edocCodeSpecial[item.codeField] : 'common'
      }
    })
    return edocCodes
  },
  getEdocCodesByRelatedBusiness (edocCodes, relatedBusiness = 'common') {
    if (!edocCodes) {
      edocCodes = window.localStorage.getItem('SAAS_EDOC_CODE')
    }
    return edocCodes.filter(item => (item.relatedBusiness === 'common' || item.relatedBusiness === relatedBusiness))
  }
}
