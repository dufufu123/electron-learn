const { BrowserWindow, Tray, nativeImage, Menu } = require('electron/main')

let tray = null

function createTray() {
  // 创建 16x16 蓝色图标
  const iconSize = 16
  const iconBuffer = Buffer.alloc(iconSize * iconSize * 4) // RGBA
  for (let i = 0; i < iconSize * iconSize; i++) {
    iconBuffer[i * 4] = 0x42      // R
    iconBuffer[i * 4 + 1] = 0x85  // G
    iconBuffer[i * 4 + 2] = 0xF4  // B
    iconBuffer[i * 4 + 3] = 0xFF  // A
  }
  const trayIcon = nativeImage.createFromBuffer(iconBuffer, {
    width: iconSize,
    height: iconSize
  })

  tray = new Tray(trayIcon)
  tray.setToolTip('Electron 学习应用')

  // 托盘右键菜单
  const trayMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.show()
      }
    },
    { label: '退出', role: 'quit' }
  ])
  tray.setContextMenu(trayMenu)

  // 左键点击 → 切换窗口显示/隐藏
  tray.on('click', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return
    win.isVisible() ? win.hide() : win.show()
  })
}

module.exports = { createTray }
