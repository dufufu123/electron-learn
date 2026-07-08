const { BrowserWindow, ipcMain } = require('electron/main')
const { createFromMainWindow, getMainWindow, getSubWindow, getFromMainWindow } = require('./windows')

// ====== 注册所有 IPC 中继 + 窗口控制 ======
function setupIpcRelay() {
  // --- 窗口间消息转发 ---

  // 主窗口 → 子窗口 / fromMain 窗口
  ipcMain.on('to-sub', (event, message) => {
    console.log('主窗口 → 其他窗口:', message)
    const sub = getSubWindow()
    const fromMain = getFromMainWindow()
    if (sub) sub.webContents.send('from-main-window', message)
    if (fromMain) fromMain.webContents.send('from-main-window', message)
  })

  // 子窗口 → 主窗口
  ipcMain.on('to-main', (event, message) => {
    console.log('其他窗口 → 主窗口:', message)
    const main = getMainWindow()
    if (main) main.webContents.send('from-sub-window', message)
  })

  // 主窗口触发打开 fromMain 窗口
  ipcMain.on('open-from-main-window', () => {
    createFromMainWindow()
  })

  // --- 无边框窗口控制 ---
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

module.exports = { setupIpcRelay }
