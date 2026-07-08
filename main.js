const { app, BrowserWindow } = require('electron/main')

const { setupAppMenu } = require('./src/main/menu')
const { createTray } = require('./src/main/tray')
const { registerIpcHandlers } = require('./src/main/ipc-handlers')
const { registerShortcuts, unregisterAllShortcuts } = require('./src/main/shortcuts')
const { createMainWindow, createSubWindow } = require('./src/main/windows')
const { setupIpcRelay } = require('./src/main/ipc-relay')

// ====== 应用启动 ======
app.whenReady().then(() => {
  setupAppMenu()
  createTray()
  registerIpcHandlers()
  registerShortcuts()
  setupIpcRelay()        // 窗口间消息中继
  createMainWindow()     // 主窗口
  createSubWindow()      // 子窗口

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
      createSubWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  unregisterAllShortcuts()
})
