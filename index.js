const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// 输入和输出文件夹
const INPUT_DIR = 'input_dir'; // 必填
const OUTPUT_DIR = 'output_dir'; // 必填

let imageCount = 0; // 统计图片数量

// 压缩后的品质，越高压缩效果越差 1 - 100
const PNG_QUALITY = 80; 
const JPEG_QUALITY = 80;

// 压缩 PNG 图像
async function compressPNG(inputPath, outputPath) {
  await sharp(inputPath)
    .png({ quality: PNG_QUALITY })
    .toFile(outputPath);
    const rate = greenText(await calculateCompressionRate(inputPath, outputPath));
    console.log(`Compressed ${inputPath} as PNG to ${outputPath} 减少${rate}`);
}

// 压缩 JPEG 图像
async function compressJPEG(inputPath, outputPath) {
  await sharp(inputPath)
    .jpeg({ quality: JPEG_QUALITY })
    .toFile(outputPath);
    const rate = greenText(await calculateCompressionRate(inputPath, outputPath));
    console.log(`Compressed ${inputPath} as PNG to ${outputPath} 减少${rate}`);
}

// 递归处理文件夹
async function processDirectory(inputDir, outputDir) {
  const items = await fs.readdir(inputDir, { withFileTypes: true });
  await fs.mkdir(outputDir, { recursive: true });

  for (const item of items) {
    const inputPath = path.join(inputDir, item.name);
    const outputPath = path.join(outputDir, item.name);

    if (item.isDirectory()) {
      // 递归处理子文件夹
      await processDirectory(inputPath, outputPath);
    } else if (item.isFile()) {
      // 压缩图像文件
      const ext = path.extname(item.name).toLowerCase();
      if (ext === '.png') {
        imageCount++;
        await compressPNG(inputPath, outputPath);
        // console.log(`Compressed ${inputPath} as PNG to ${outputPath}`);
      } else if (ext === '.jpg' || ext === '.jpeg') {
        imageCount++;
        await compressJPEG(inputPath, outputPath);
        // console.log(`Compressed ${inputPath} as JPEG to ${outputPath}`);
      } else {
        await fs.copyFile(inputPath, outputPath);
        // console.log(`Copied ${item.name} to ${outputPath}`);
      }
    }
  }
}

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes ;
    const fileSizeInKB = fileSizeInBytes / 1024; // 转换为KB
    const fileSizeInMB = fileSizeInKB / 1024;   // 转换为MB
    console.log(`File size: ${fileSizeInBytes} bytes (${fileSizeInKB.toFixed(2)} KB, ${fileSizeInMB.toFixed(2)} MB)`);
  } catch (err) {
    console.error('Error getting file stats:', err);
  }
}

// 计算压缩率
async function calculateCompressionRate(inputPath, outputPath) {
  const inputSize = await getFileSize(inputPath);
  const outputSize = await getFileSize(outputPath);
  const compressionRate = (inputSize - outputSize) / inputSize * 100;
  // console.log(`Compression rate: ${compressionRate.toFixed(2)}%`);
  return `${compressionRate.toFixed(2)}%`
}

// 递归删除文件夹
async function deleteFolder(folderPath) {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`删除文件夹: ${redText(folderPath)} ${blueText('成功')}`);
  } catch (error) {
    console.error(`Error deleting folder ${folderPath}:`, error);
  }
}

// 删除 outputDir 文件夹
const folderToDelete = path.join(__dirname, OUTPUT_DIR);

// 开始处理
(async () => {
  try {
    await deleteFolder(folderToDelete);
    await processDirectory(INPUT_DIR, OUTPUT_DIR);
    console.log(`所以图片已经操作完,共 ${yellowText(imageCount)} 张`);
  } catch (error) {
    console.error('Error processing images:', error);
  }
})();


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


