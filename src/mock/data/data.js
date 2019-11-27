import Mock from 'mockjs'

export default {
  // token 检验
  token () {
    return Mock.mock({
      'code': '0000',
      'message': '操作成功',
      'result': {
        'companyRelationId': '',
        'userId': '100000005',
        'companyId': '100000009',
        'departmentName': '',
        'positionName': '',
        'userName': '汉武帝',
        'isDefault': '',
        'status': 'SUA3',
        'companyType': '@pick(["3", "1", "2", "4"])',
        'companyName': '大汉集团',
        'depId': '',
        'posId': '100000004',
        'posCoutry': '',
        'mobile': '18000000001',
        'weChat': '',
        'companyCode': 'CU10000000A'
      }
    })
  },
  // 上传文件
  upload () {
    return Mock.mock({
      'code': '0000',
      'message': '操作成功',
      'result': {
        'name': '文件121',
        'size': 30,
        'url': 'http://www.baidu.com'
      }
    })
  }
}
