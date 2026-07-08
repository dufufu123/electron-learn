const { BrowserWindow, ipcMain, app } = require('electron/main')
const path = require('node:path')
const { setupContextMenu } = require('./menu')

// 窗口引用
let mainWindow = null
let subWindow = null
let fromMainWindow = null

// 判断是否开发模式
const isDev = !app.isPackaged
const VITE_URL = 'http://localhost:5173'

function getMainWindow() {
  return mainWindow
}

// ====== 加载页面（dev 连 Vite，prod 加载构建文件）======
function loadWindowContent(win, page) {
  if (isDev) {
    win.loadURL(`${VITE_URL}/${page}`).catch(() => {
      console.warn('Vite 开发服务器未启动，请先执行 npx vite')
      win.loadFile(path.join(__dirname, '..', '..', 'dist', 'renderer', page))
    })
  } else {
    win.loadFile(path.join(__dirname, '..', '..', 'dist', 'renderer', page))
  }
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

  loadWindowContent(mainWindow, 'main/index.html')
  setupContextMenu(mainWindow)

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
    frame: false,
    title: '子窗口',
    webPreferences: {
      preload: path.join(__dirname, '..', '..', 'preload.js')
    }
  })

  loadWindowContent(subWindow, 'sub/index.html')

  subWindow.on('closed', () => {
    subWindow = null
  })

  return subWindow
}

// ====== 创建 fromMain 窗口（由主窗口按钮触发）======
function createFromMainWindow() {
  fromMainWindow = new BrowserWindow({
    width: 400,
    height: 350,
    title: 'fromMain 窗口',
    webPreferences: {
      preload: path.join(__dirname, '..', '..', 'preload.js')
    }
  })

  loadWindowContent(fromMainWindow, 'from-main/index.html')

  fromMainWindow.on('closed', () => {
    fromMainWindow = null
  })

  return fromMainWindow
}

// ====== IPC 中继：窗口 ←→ 主进程 ←→ 窗口 ======
function setupIpcRelay() {
  ipcMain.on('to-sub', (event, message) => {
    console.log('主窗口 → 子窗口:', message)
    if (subWindow) {
      subWindow.webContents.send('from-main-window', message)
    }
    if (fromMainWindow) {
      fromMainWindow.webContents.send('from-main-window', message)
    }
  })

  ipcMain.on('to-main', (event, message) => {
    console.log('子窗口 → 主窗口:', message)
    if (mainWindow) {
      mainWindow.webContents.send('from-sub-window', message)
    }
  })

  // 主窗口触发打开 fromMain 窗口
  ipcMain.on('open-from-main-window', () => {
    createFromMainWindow()
  })

  ipcMain.on('window-minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.on('window-close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
}

module.exports = { createMainWindow, createSubWindow, setupIpcRelay, getMainWindow }
