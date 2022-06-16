const smiles = function (root) {
  var checksmiles = setInterval(function () {
    clearInterval(checksmiles)
    if ((typeof window.MV.emoticonList == 'undefined') || (window.MV.emoticonList.length == 0)) return
    const smileWrapper = root.el.querySelector('.smile-icons ul')
    const smileBar = root.el.querySelector('.smile-bar ul')
    const smileList = window.MV.emoticonList || []
    for (var i = 0; i < smileList.length; i++) {
      var li = document.createElement('li')
      var barli = document.createElement('li')
      for (var j = 0; j < smileList[i].length; j++) {
        var img = document.createElement('img')
        img.setAttribute(
          'data-src',
          `${smileList[i][j]}`
        )
        try { li.appendChild(img) } catch (e) {}
        if (j === 0) {
          img = document.createElement('img')
          img.setAttribute('data-src', `${smileList[i][0]}`)
          try { barli.appendChild(img) } catch (e) {}
        }
      }
      try { smileWrapper.appendChild(li) } catch (e) {}
      try { smileBar.appendChild(barli) } catch (e) {}
    }
    root.config.lazyload && root.config.lazyload.observe()
    try {
      root.el.querySelector('.smile-icons > ul > li:nth-child(1)').style.display = 'block'
      var btn = document.querySelectorAll('.smile-bar > ul > li')
      var show = document.querySelectorAll('.smile-icons > ul > li')
      for (var k = 0; k < btn.length; k++) {
      // 把当前按钮的下标保存，按下按钮对应显示下标一致的盒子，其它盒子隐藏
        btn[k].index = k
        btn[k].onclick = function () {
        // 遍历每个按钮样式清空
        // 遍历每个盒子隐藏
          for (var j = 0; j < btn.length; j++) {
            btn[j].className = ''
            show[j].style.display = 'none'
          }
          // this表示当前按钮
          this.className = 'active'
          // 盒子显示按钮下标的那个盒子，this。index是开始时保存的按钮下标
          show[this.index].style.display = 'block'
        }
      }
    } catch (e) {}
  }, 10)
}
module.exports = smiles
