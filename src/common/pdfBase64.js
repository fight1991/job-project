const _ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const _PADCHAR = '='
export default {
  encode: function (s) {
    // if (arguments.length !== 1) {
    //   return
    // }
    s = String(s)
    let i
    let b10
    let x = []
    let imax = s.length - s.length % 3
    if (s.length === 0) {
      return s
    }
    for (i = 0; i < imax; i += 3) {
      b10 = (this.getbyte(s, i) << 16) | (this.getbyte(s, i + 1) << 8) | this.getbyte(s, i + 2)
      x.push(_ALPHA.charAt(b10 >> 18))
      x.push(_ALPHA.charAt((b10 >> 12) & 0x3F))
      x.push(_ALPHA.charAt((b10 >> 6) & 0x3f))
      x.push(_ALPHA.charAt(b10 & 0x3f))
    }

    switch (s.length - imax) {
      case 1:
        b10 = this.getbyte(s, i) << 16
        x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _PADCHAR + _PADCHAR)
        break

      case 2:
        b10 = (this.getbyte(s, i) << 16) | (this.getbyte(s, i + 1) << 8)
        x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _ALPHA.charAt((b10 >> 6) & 0x3f) + _PADCHAR)
        break
    }

    return x.join('')
  },
  getbyte64: function (s, i) {
    var idx = _ALPHA.indexOf(s.charAt(i))
    if (idx === -1) {
      return false
    }
    return idx
  },
  getbyte: function (s, i) {
    let x = s.charCodeAt(i)
    return x
  }
}
