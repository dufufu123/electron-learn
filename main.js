const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
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

  // ====== 主进程 → 渲染进程：主动推送（新增）======
  // 3秒后主进程主动向渲染进程发一条消息
  setTimeout(() => {
    win.webContents.send('from-main', '你好渲染进程，这是主进程主动推来的消息！')
  }, 3000)

  return win  // 返回 win 引用，方便后续使用
}

app.whenReady().then(() => {
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