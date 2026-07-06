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
  // 新增：监听主进程推送的消息
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  // 新增：打开文件对话框
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog')
})