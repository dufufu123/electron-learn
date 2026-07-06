const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

// 双向通信（已有）
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // 打印 'pong'
}
func()

// 单向通信（新增）
document.getElementById('send-btn').addEventListener('click', () => {
  window.electronAPI.send('notify-main', '你好主进程，这是渲染进程发来的消息！')
  console.log('消息已发送')
})

// ====== 监听主进程推送的消息（新增）======
window.electronAPI.on('from-main', (message) => {
  console.log('渲染进程收到主进程消息:', message)
  document.getElementById('main-msg').innerText = `收到主进程消息: ${message}`
})

// ====== 打开文件对话框（新增）======
document.getElementById('file-btn').addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFileDialog()
  if (filePath) {
    document.getElementById('file-path').innerText = `你选择的文件: ${filePath}`
  } else {
    document.getElementById('file-path').innerText = '未选择文件'
  }
})



