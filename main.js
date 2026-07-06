const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage } = require('electron/main')
const path = require('node:path')

// ====== 应用菜单模板（新增）======
const menuTemplate = [
  {
    label: '文件',
    submenu: [
      {
        label: '打开文件',
        accelerator: 'CmdOrCtrl+O',  // 快捷键
        click: () => {
          // 点击菜单项时打印（仅演示，实际操作用 IPC 通知渲染进程）
          console.log('菜单：打开文件被点击')
        }
      },
      { type: 'separator' },        // 分隔线
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'                // Electron 内置角色，直接退出应用
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

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  // ====== 右键菜单（新增）======
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

  // ====== 主进程 → 渲染进程：主动推送（新增）======
  // 3秒后主进程主动向渲染进程发一条消息
  setTimeout(() => {
    win.webContents.send('from-main', '你好渲染进程，这是主进程主动推来的消息！')
  }, 3000)

  return win  // 返回 win 引用，方便后续使用
}

app.whenReady().then(() => {
  // ====== 设置应用菜单（新增）======
  const appMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(appMenu)

  // ====== 系统托盘（新增）======
  // 创建一个 16x16 蓝色图标（教学用，实际项目用图标文件）
  const iconSize = 16
  const iconBuffer = Buffer.alloc(iconSize * iconSize * 4) // RGBA
  for (let i = 0; i < iconSize * iconSize; i++) {
    iconBuffer[i * 4] = 0x42      // R（红色值）
    iconBuffer[i * 4 + 1] = 0x85  // G（绿色值）
    iconBuffer[i * 4 + 2] = 0xF4  // B（蓝色值）
    iconBuffer[i * 4 + 3] = 0xFF  // A（不透明）
  }
  const trayIcon = nativeImage.createFromBuffer(iconBuffer, {
    width: iconSize,
    height: iconSize
  })

  const tray = new Tray(trayIcon)
  tray.setToolTip('Electron 学习应用') // 鼠标悬停时提示文字

  // 托盘的右键菜单
  const trayMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.show()
    }},
    { label: '退出', role: 'quit' }
  ])
  tray.setContextMenu(trayMenu)

  // 左键点击托盘图标 → 切换窗口显示/隐藏
  tray.on('click', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return
    win.isVisible() ? win.hide() : win.show()
  })

  // ====== 双向通信：handle / invoke（已有）======
  ipcMain.handle('ping', () => 'pong')

  // ====== 单向通信：send / on（新增）======
// 渲染进程发来消息，主进程只需接收，不需要返回值
  ipcMain.on('notify-main', (event, message) => {
    console.log('主进程收到消息:', message) // 在终端里能看到
  })

  // ====== 原生对话框（新增）======
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择一个文件',
      properties: ['openFile'] // 允许选择文件
    })
    // canceled 为 true 表示用户点了取消，没有选文件
    if (result.canceled) return null
    return result.filePaths[0] // 返回所选文件的完整路径
  })
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})