const { ipcMain, dialog } = require('electron/main')
const fs = require('node:fs')

// ====== 注册所有 IPC 处理器 ======
function registerIpcHandlers() {
  // --- 双向通信 ---
  ipcMain.handle('ping', () => 'pong')

  // --- 单向通信 ---
  ipcMain.on('notify-main', (event, message) => {
    console.log('主进程收到消息:', message)
  })

  // --- 文件对话框 ---
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择一个文件',
      properties: ['openFile']
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  // --- 读取文件 ---
  ipcMain.handle('read-file', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择一个文本文件',
      properties: ['openFile']
    })
    if (result.canceled) return null

    const filePath = result.filePaths[0]
    const content = fs.readFileSync(filePath, 'utf-8')
    console.log('文件读取成功:', filePath)
    return { filePath, content }
  })

  // --- 保存文件 ---
  ipcMain.handle('save-file', async (event, content) => {
    const result = await dialog.showSaveDialog({
      title: '保存文件',
      defaultPath: '新建文档.txt'
    })
    if (result.canceled) return { success: false }

    fs.writeFileSync(result.filePath, content, 'utf-8')
    console.log('文件保存成功:', result.filePath)
    return { success: true, filePath: result.filePath }
  })
}

module.exports = { registerIpcHandlers }
