// 定义form表单 label的统一宽度
const labelWidth = {
  data () {
    return {
      labelFormWidth: {
        seven: '107px', // label 7个字的宽度 超过6个字折行,配合css使用
        six: '93px', // label 6个字的宽度
        five: '79px',
        four: '67px',
        three: '51px',
        two: '37px'
      }
    }
  }
}

export { labelWidth }
