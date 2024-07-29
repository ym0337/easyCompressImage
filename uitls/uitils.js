const path = require('path');
const fs = require('fs');

function writeFile (filePath, content) {
  try {
    // 使用 fs.writeFileSync 方法创建文件
    fs.writeFileSync(filePath, content);
    console.log(`${filePath} 创建成功`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  writeFile
}