const path = require('path')

exports.customFormat = data => {
  var spritesheetImageUrl = data.sprites[0].image;
  var groupedSprites = formatSprites(data.sprites)
  var sharedSelector = Object.keys(groupedSprites)
      .map(spriteKey => generateIconName(groupedSprites[spriteKey].pure))
      .join(', ');
  var shared = dli(`
      ${sharedSelector} {
          background: url(${spritesheetImageUrl});
          display: inline-block;
          vertical-align: middle;
      }
  `);
  var perImage = Object.keys(groupedSprites)
      .map(spriteKey => {
        var iconName = generateIconName(groupedSprites[spriteKey].pure)
        return generateCssByType(groupedSprites[spriteKey].pure, 'pure', iconName) + generateCssByType(groupedSprites[spriteKey].H, 'H', iconName) + 
        generateCssByType(groupedSprites[spriteKey].D, 'D', iconName)
      })
      .join('');

  return shared + '\n' + perImage;
};
function generateCssByType(sprite, type, iconName) {
  if(sprite) {
    var className 
    var subClassName = iconName.startsWith('.list') ? iconName.substring(0, iconName.length - 2 ) : iconName
    switch (type) {
      case 'H':
        className = `${subClassName}:hover i,${subClassName}:focus i, .el-table ${subClassName} i`
        break;
      case 'D':
        className = `${subClassName}.is-disabled i,${subClassName}.is-disabled:hover i`
        break;
      default: 
        className = iconName
    }
    return dli(`
          ${className} {
              width: ${sprite.width}px;
              height: ${sprite.height}px;
              background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
          }
        `)
  }
  return ''
}
function formatSprites (sprites) {
  var groupByName = {}
  sprites.forEach(sprite => {
    var gorupName = sprite.name
    var type = 'pure'
    if(gorupName.endsWith('D')) {
      type = 'D'
      gorupName = gorupName.substring(0,gorupName.length-1)
    }
    if(gorupName.endsWith('H')) {
      type = 'H'
      gorupName = gorupName.substring(0,gorupName.length-1)
    }
    if(!groupByName[gorupName]) {
      groupByName[gorupName] = {}
    }
    groupByName[gorupName][type] = sprite
  })
  return groupByName
}
// drop last indentation
function dli(s) {
  const lines = s.split('\n').filter(s => s.trim().length);
  const lastIndentLength = /^\s*/.exec(lines[lines.length - 1])[0].length;
  return s
      .split('\n')
      .map(line => line.slice(lastIndentLength))
      .join('\n');
}

function generateIconName(sprite) {
  var parsed = path.parse(sprite.source_image);
  var dir = parsed.dir.split(path.sep);
  var moduleName = dir[dir.length - 1];
  var iconName = ''
  switch (moduleName) {
    case 'icon-aside':
      iconName = '.icons-menu-' + sprite.name
      break;
    default:
      iconName = '.list' + (sprite.name.indexOf('icon') === 0 ? '' : '-icon') + '-' + sprite.name + ' i'
  }
  return iconName
}