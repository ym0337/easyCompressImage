const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');


const fileName = '图层管理梳理-0726.xlsx'

const inputFilePath = path.join(__dirname, '/resoure', fileName);
const outputFilePath = path.join(__dirname, '/resoure/images');

// 创建工作簿实例
const workbook = new ExcelJS.Workbook();

if (!fs.existsSync(outputFilePath)) {
  fs.mkdirSync(outputFilePath);
}

// 读取Excel文件
async function extractImagesFromExcel (filePath) {
  await workbook.xlsx.readFile(filePath);

  // 图片资源
  const images = workbook.media;

  // 假设读取第一张工作表
  const worksheet = workbook.getWorksheet('Sheet1');

  // 遍历工作表中的每一行
  // worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
  //   console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)}`);
  // });
  const row = worksheet.getRow(2).values;
  console.log(row)

  // 遍历并保存每个图片
  images.forEach((image, index) => {
    // console.log(image)
    // const outputPath = path.join(outputFilePath, `image_${index}.${image.extension}`);
    // fs.writeFileSync(outputPath, image.buffer);
    // console.log(`图片已保存为: ${outputPath}`);
  });
}

// 调用函数，传入Excel文件路径
extractImagesFromExcel(inputFilePath);