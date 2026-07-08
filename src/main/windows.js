const { BrowserWindow, app } = require('electron/main')
const path = require('node:path')
const { setupContextMenu } = require('./menu')

// 窗口引用（只在本模块内读写，外部通过 getter 访问）
let mainWindow = null
let subWindow = null
let fromMainWindow = null

const isDev = !app.isPackaged
const VITE_URL = 'http://localhost:5173'

// ====== 外部获取窗口引用 ======
function getMainWindow() { return mainWindow }
function getSubWindow() { return subWindow }
function getFromMainWindow() { return fromMainWindow }

// ====== 加载页面 ======
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

  subWindow.on('closed', () => { subWindow = null })
  return subWindow
}

// ====== 创建 fromMain 窗口 ======
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

  fromMainWindow.on('closed', () => { fromMainWindow = null })
  return fromMainWindow
}

module.exports = {
  createMainWindow,
  createSubWindow,
  createFromMainWindow,
  getMainWindow,
  getSubWindow,
  getFromMainWindow
}
