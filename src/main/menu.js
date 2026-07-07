const { Menu } = require('electron/main')

// ====== 应用菜单模板 ======
const appMenuTemplate = [
  {
    label: '文件',
    submenu: [
      {
        label: '打开文件',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          console.log('菜单：打开文件被点击')
        }
      },
      { type: 'separator' },
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销', role: 'undo' },
      { label: '重做', role: 'redo' },
      { type: 'separator' },
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' }
    ]
  },
  {
    label: '视图',
    submenu: [
      { label: '重新加载', role: 'reload' },
      { label: '开发者工具', role: 'toggleDevTools' }
    ]
  }
]

// ====== 设置应用菜单 ======
function setupAppMenu() {
  const appMenu = Menu.buildFromTemplate(appMenuTemplate)
  Menu.setApplicationMenu(appMenu)
}

// ====== 设置右键菜单 ======
function setupContextMenu(win) {
  win.webContents.on('context-menu', (event, params) => {
    const contextMenu = Menu.buildFromTemplate([
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { type: 'separator' },
      {
        label: '检查元素',
        click: () => win.webContents.inspectElement(params.x, params.y)
      }
    ])
    contextMenu.popup()
  })
}

module.exports = { setupAppMenu, setupContextMenu }
