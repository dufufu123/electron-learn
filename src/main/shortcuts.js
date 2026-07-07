const { BrowserWindow, globalShortcut } = require('electron/main')

// ====== 注册全局快捷键 ======
function registerShortcuts() {
  globalShortcut.register('CmdOrCtrl+Shift+E', () => {
    console.log('全局快捷键被按下！')
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      win.show()
      win.focus()
    }
  })
}

// ====== 注销所有全局快捷键 ======
function unregisterAllShortcuts() {
  globalShortcut.unregisterAll()
}

module.exports = { registerShortcuts, unregisterAllShortcuts }
