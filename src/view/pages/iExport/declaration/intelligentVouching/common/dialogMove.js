import Vue from 'vue'
// v-dialogMove: 弹窗拖拽属性
Vue.directive('dialogMove', {
  // bind (el, binding, vnode, oldVnode) {
  //   const dialogHeaderEl = el.querySelector('.unDialog-header')
  //   const dragDom = el.querySelector('.unDialog')
  //   // dialogHeaderEl.style.cursor = 'move';
  //   dialogHeaderEl.style.cssText += ';cursor:move;'
  //   dragDom.style.cssText += ';top:0px;'
  //   // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  //   const sty = (function () {
  //     if (window.document.currentStyle) {
  //       return (dom, attr) => dom.currentStyle[attr]
  //     } else {
  //       return (dom, attr) => getComputedStyle(dom, false)[attr]
  //     }
  //   })()
  //   dialogHeaderEl.onmousedown = (e) => {
  //     // 鼠标按下，计算当前元素距离可视区的距离
  //     const disX = e.clientX - dialogHeaderEl.offsetLeft
  //     const disY = e.clientY - dialogHeaderEl.offsetTop
  //     const screenWidth = document.body.clientWidth // body当前宽度
  //     const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)
  //     const dragDomWidth = dragDom.offsetWidth // 对话框宽度
  //     const dragDomheight = dragDom.offsetHeight // 对话框高度
  //     const minDragDomLeft = dragDom.offsetLeft
  //     const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
  //     const minDragDomTop = dragDom.offsetTop
  //     const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight
  //     // 获取到的值带px 正则匹配替换
  //     let styL = sty(dragDom, 'left')
  //     let styT = sty(dragDom, 'top')
  //     // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
  //     if (styL.includes('%')) {
  //       styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
  //       styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
  //     } else {
  //       styL = +styL.replace(/\px/g, '')

  //       styT = +styT.replace(/\px/g, '')
  //     }
  //     document.onmousemove = function (e) {
  //       // 通过事件委托，计算移动的距离
  //       let left = e.clientX - disX
  //       let top = e.clientY - disY
  //       // 边界处理
  //       if (-(left) > minDragDomLeft) {
  //         left = -(minDragDomLeft)
  //       } else if (left > maxDragDomLeft) {
  //         left = maxDragDomLeft
  //       }
  //       if (-(top) > minDragDomTop) {
  //         top = -(minDragDomTop)
  //       } else if (top > maxDragDomTop) {
  //         top = maxDragDomTop
  //       }
  //       // 移动当前元素
  //       dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
  //     }
  //     document.onmouseup = function (e) {
  //       document.onmousemove = null
  //       document.onmouseup = null
  //     }
  //   }
  // }
  inserted: (el, binding, vnode, oldVnode) => {
    let $header = el.querySelector('.unDialog-header')
    let $dialog = el.querySelector('.unDialog')
    let $closeBtn = el.querySelector('.unDialog-close')
    let tempH = $dialog.style.marginTop
    $header.style.cursor = 'move'
    $header.style.userSelect = 'none'
    $dialog.style.margin = 0
    $dialog.style.position = 'fixed'
    // 清除margin值改用定位方式
    $dialog.style.top = tempH
    $dialog.style.left = '50%'
    $dialog.style.transform = 'translateX(-50%)'
    $header.onmousedown = function (s) {
      console.log('2232')
      // 重新获取dialog框
      let $dialog_ = el.querySelector('.unDialog')
      // 获取遮罩层, dialog框在遮罩层中移动
      let $modal = document.querySelector('.page-tab-content')
      // 计算可移动的最大距离
      let maxX = $modal.offsetWidth - $dialog_.offsetWidth / 2
      let maxY = $modal.offsetHeight - $dialog_.offsetHeight
      let posX = $dialog_.offsetLeft // 距离父元素左边的距离
      let posY = $dialog_.offsetTop // 距离父元素上边的距离
      // 注册鼠标移动事件
      document.onmousemove = function (m) {
        // 鼠标移动时,计算需要位移距离 初始位置 + 鼠标位移距离
        let moveX = m.clientX - s.clientX + posX
        let moveY = m.clientY - s.clientY + posY
        let x = moveX <= $dialog_.offsetWidth / 2 ? $dialog_.offsetWidth / 2 : moveX >= maxX ? maxX : moveX
        let y = moveY <= 0 ? 0 : moveY >= maxY ? maxY : moveY
        $dialog_.style.left = x + 'px'
        $dialog_.style.top = y + 'px'
      }
    }
    document.onmouseup = function (e) {
      this.onmousemove = null
    }
    document.onmouseleave = function (e) {
      this.onmousemove = null
    }
    if ($closeBtn) {
      $closeBtn.onmouseenter = function (e) {
        document.onmousemove = null
      }
    }
  }
})
