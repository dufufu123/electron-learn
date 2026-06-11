const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  // ====== 双向通信：handle / invoke（已有）======
  ipcMain.handle('ping', () => 'pong')

  // ====== 单向通信：send / on（新增）======
// 渲染进程发来消息，主进程只需接收，不需要返回值
  ipcMain.on('notify-main', (event, message) => {
    console.log('主进程收到消息:', message) // 在终端里能看到
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