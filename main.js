const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

const { setupAppMenu, setupContextMenu } = require('./src/main/menu')
const { createTray } = require('./src/main/tray')
const { registerIpcHandlers } = require('./src/main/ipc-handlers')
const { registerShortcuts, unregisterAllShortcuts } = require('./src/main/shortcuts')

// ====== 创建窗口 ======
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  setupContextMenu(win) // 右键菜单

  // 主进程主动推送（3秒后）
  setTimeout(() => {
    win.webContents.send('from-main', '你好渲染进程，这是主进程主动推来的消息！')
  }, 3000)
}

// ====== 应用启动 ======
app.whenReady().then(() => {
  setupAppMenu()        // 应用菜单
  createTray()          // 系统托盘
  registerIpcHandlers() // IPC 通信
  registerShortcuts()   // 全局快捷键
  createWindow()        // 创建窗口

  // macOS: 点击 Dock 图标时无窗口则重新创建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 非 macOS: 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 退出前清理
app.on('will-quit', () => {
  unregisterAllShortcuts()
})
