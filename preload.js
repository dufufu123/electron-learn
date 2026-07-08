const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // 除函数之外，我们也可以暴露变量
})

// 新增：单向通信的 send 方法
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  // 新增：文件读写
  readFile: () => ipcRenderer.invoke('read-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),

  // ====== 窗口控制（无边框窗口用）======
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
  }
})