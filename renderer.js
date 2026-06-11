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



