export default {
  // 指令的定义
  inserted: (el, binding, vnode, oldVnode) => {
    let $header = el.querySelector('.unDialog-header')
    let $dialog = el
    $header.style.cursor = 'move'
    $header.style.userSelect = 'none'
    $dialog.style.margin = 0
    $dialog.style.position = 'fixed'
    // 清除margin值改用定位方式
    $header.onmousedown = function (s) {
      // 重新获取dialog框
      let $dialog_ = el
      // 获取遮罩层, dialog框在遮罩层中移动
      let $modal = document.querySelector('.page-tab-content')
      // 计算可移动的最大距离
      let maxX = $modal.offsetWidth - $dialog_.offsetWidth + 400
      let maxY = $modal.offsetHeight - $dialog_.offsetHeight + 400
      let posX = $dialog_.offsetLeft // 距离父元素左边的距离
      let posY = $dialog_.offsetTop // 距离父元素上边的距离
      s.preventDefault()
      s.stopPropagation()
      // 注册鼠标移动事件
      document.onmousemove = function (m) {
        // 鼠标移动时,计算需要位移距离 初始位置 + 鼠标位移距离
        let moveX = m.clientX - s.clientX + posX
        let moveY = m.clientY - s.clientY + posY
        let x = moveX <= 0 ? 0 : moveX >= maxX ? maxX : moveX
        let y = moveY <= 0 ? 0 : moveY >= maxY ? maxY : moveY
        $dialog_.style.left = x + 'px'
        $dialog_.style.top = y + 'px'
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
      document.onmouseleave = function (e) {
        document.onmousemove = null
        document.onmouseleave = null
      }
    }
  }
}
