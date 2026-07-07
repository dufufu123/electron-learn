const { BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { setupContextMenu } = require('./menu')

// 窗口引用
let mainWindow = null
let subWindow = null

function getMainWindow() {
  return mainWindow
}

// ====== 创建主窗口 ======
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', '..', 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
  setupContextMenu(mainWindow)

  // 主进程主动推送
  setTimeout(() => {
    mainWindow.webContents.send('from-main', '你好渲染进程，这是主进程主动推来的消息！')
  }, 3000)

  return mainWindow
}

// ====== 创建子窗口 ======
function createSubWindow() {
  subWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: '子窗口',
    webPreferences: {
      preload: path.join(__dirname, '..', '..', 'preload.js')
    }
  })

  subWindow.loadFile(path.join('windows', 'sub', 'index.html'))

  // 子窗口关闭时清空引用
  subWindow.on('closed', () => {
    subWindow = null
  })

  return subWindow
}

// ====== IPC 中继：窗口 ←→ 主进程 ←→ 窗口 ======
function setupIpcRelay() {
  // 主窗口 → 子窗口
  ipcMain.on('to-sub', (event, message) => {
    console.log('主窗口 → 子窗口:', message)
    if (subWindow) {
      subWindow.webContents.send('from-main-window', message)
    }
  })

  // 子窗口 → 主窗口
  ipcMain.on('to-main', (event, message) => {
    console.log('子窗口 → 主窗口:', message)
    if (mainWindow) {
      mainWindow.webContents.send('from-sub-window', message)
    }
  })
}

module.exports = { createMainWindow, createSubWindow, setupIpcRelay, getMainWindow }
