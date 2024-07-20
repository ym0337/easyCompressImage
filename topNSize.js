// 排序文件大小

const fs = require('fs').promises;
const path = require('path');

// 输入和输出文件夹
const INPUT_DIR = 'input_dir'; // 必填

let fileCount = 0; // 统计
const topN = 30; // 筛选前 N 的数据
const filesObj = [];

// 递归处理文件夹
async function processDirectory(inputDir) {
  const items = await fs.readdir(inputDir, { withFileTypes: true });

  for (const item of items) {
    const inputPath = path.join(inputDir, item.name);

    if (item.isDirectory()) {
      // 递归处理子文件夹
      await processDirectory(inputPath);
    } else if (item.isFile()) {
      fileCount++;
      const size = await getFileSize(inputPath)
      filesObj.push({name: inputPath, size: size})
    }
  }
}

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes ;
  } catch (err) {
    console.error('Error getting file stats:', err);
  }
}

// 运行入口
async function compress(){
  try {
    await processDirectory(INPUT_DIR);
    console.log(`遍历文件共 ${yellowText(fileCount)} 个`);
    filesObj.sort((a, b) => b.size - a.size);
    filesObj.length = topN
    console.log(filesObj)
  } catch (error) {
    console.error('Error processing images:', error);
  }
};

compress();

// ANSI 转义序列：绿色字体
// const greenText = '\x1b[32mGreen Text\x1b[0m';
// console.log(greenText);
// 其他常用颜色代码包括 31 红色、32 绿色、33 黄色、34 蓝色等
function redText(text){
  return `\x1b[31m${text}\x1b[0m`;
}

function greenText(text){
  return `\x1b[32m${text}\x1b[0m`;
}

function yellowText(text){
  return `\x1b[33m${text}\x1b[0m`;
}

function blueText(text){
  return `\x1b[34m${text}\x1b[0m`;
}


