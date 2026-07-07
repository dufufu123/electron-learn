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

// ====== 读取文件内容（新增）======
document.getElementById('read-btn').addEventListener('click', async () => {
  const result = await window.electronAPI.readFile()
  if (result) {
    document.getElementById('read-path').innerText = `文件路径: ${result.filePath}`
    document.getElementById('file-content').value = result.content
  } else {
    document.getElementById('read-path').innerText = '未选择文件'
  }
})

// ====== 保存文件（新增）======
document.getElementById('save-btn').addEventListener('click', async () => {
  const content = document.getElementById('file-content').value
  if (!content) {
    document.getElementById('save-result').innerText = '请先读取文件或输入内容'
    return
  }
  const result = await window.electronAPI.saveFile(content)
  if (result.success) {
    document.getElementById('save-result').innerText = `保存成功: ${result.filePath}`
  } else {
    document.getElementById('save-result').innerText = '已取消保存'
  }
})

// ====== 窗口间通信（新增）======
// 主窗口 → 子窗口
document.getElementById('to-sub-btn').addEventListener('click', () => {
  const msg = document.getElementById('to-sub-input').value
  if (!msg) return
  window.electronAPI.send('to-sub', msg)
  console.log('已发送到子窗口:', msg)
})

// 主窗口 ← 子窗口（接收子窗口发来的消息）
window.electronAPI.on('from-sub-window', (message) => {
  document.getElementById('from-sub').innerText = `子窗口发来的消息: ${message}`
})



