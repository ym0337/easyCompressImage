// 读取excel,生成树结构
// 非常注意,不能有合并项,不然读不出合并的数据
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const {writeFile} = require('./uitls/uitils.js')

const fileName = '菜单调整V1-20240726.xlsx'

const filePath = path.join(__dirname, '/resoure', fileName);


// 读取Excel文件
const workbook = xlsx.readFile(filePath);

// 获取第一个工作表的名称
const sheetName = workbook.SheetNames[1];

// 获取第一个工作表的内容
const worksheet = workbook.Sheets[sheetName];

// 将工作表内容转换为JSON格式
const data = xlsx.utils.sheet_to_json(worksheet);
if (data) {
  // data.shift(); // 删除第一列表头
  // console.log(data,'data')
}

// 输出读取的数据(这个表格有用的数据范围)
// console.log(data[1].业务域);
// console.log(data[data.length - 1].__EMPTY_6);

// 创建一级节点
const dom1 = createDom('业务域', data);
// 创建二级节点
const dom2 = createDom('一级菜单', data);
// 创建三级节点
const dom3 = createDom('二级菜单', data);
// 创建四级节点
const dom4 = createDom('三级菜单', data, 'id');

const DomObj = [];

// 组装一级菜单
dom1.forEach(item => {
  DomObj.push({
    // ...item,
    '业务域': item['业务域'],
    name: item['业务域'],
    defaultIcon: item['defaultIcon业务域'],
    activeIcon: item['activeIcon业务域'],
    list: []
  })
});

// 组装二级菜单
dom2.forEach(item => {
  DomObj.forEach(item2 => {
    if (item2.name === item['业务域']) {
      item2.list.push({
        // ...item,
        '业务域': item['业务域'],
        '一级菜单': item['一级菜单'],
        name: item['一级菜单'],
        defaultIcon: item['defaultIcon业务域'],
        activeIcon: item['activeIcon业务域'],
        permissionCode: item['permissionCode一级菜单'],
        list: [],
      })
    }

  })
});

// 组装三级菜单
dom3.forEach(item => {
  DomObj.forEach(item2 => {
    item2.list && item2.list.forEach(item3 => {
      if (item2.name === item['业务域']) {
        if (item3.name === item['一级菜单']) {
          item3.list.push({
            // ...item,
            '业务域': item['业务域'],
            '一级菜单': item['一级菜单'],
            '二级菜单': item['二级菜单'],
            name: item['二级菜单'],
            defaultIcon: '',
            activeIcon: '',
            list: [],
          })
        }
      }
    })
  })
});

// 组装四级菜单
dom4.forEach(item => {
  DomObj.forEach(item2 => {
    item2.list.forEach(item3 => {
      item3.list.forEach(item4 => {
        if (item2.name === item['业务域'] && item3.name === item['一级菜单'] && item4.name === item['二级菜单']) {
          item4.list.push({
            ...item,
            name: item['三级菜单'],
            list: null
          })
        }
      })
    })
  })
});

// JSON.stringify()方法用于将JavaScript对象转换为JSON字符串，第二个参数null表示不替换任何值，第三个参数2表示格式化输出，每两个层级缩进两个空格。最后，使用export default将转换后的字符串作为模块的默认输出。
const content = `export default ${JSON.stringify(DomObj, null, 2)}`;
const filePathOut = path.join(__dirname, '/resoure', 'menus.js');
writeFile(filePathOut, content)

function createDom (type, data, id='') {
  const seen = new Set();
  const uniqueArray = [];
  data.filter(item => {
    const keyValue = item[id] || item[type];
    if (seen.has(keyValue)) {
      return false;
    } else {
      seen.add(keyValue);
      uniqueArray.push({
        ...item,
        '业务域': item['业务域'],
        '一级菜单': item['一级菜单'] || '',
        '二级菜单': item['二级菜单'] || '',
        name: item[type],
        list: []
      });
      return true;
    }
  });
  return uniqueArray.filter(item => (item.name && item.name !== '/'))
}
