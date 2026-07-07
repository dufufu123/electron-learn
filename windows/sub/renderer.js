// 监听主窗口发来的消息
window.electronAPI.on('from-main-window', (message) => {
  document.getElementById('from-main').innerText = `主窗口发来的消息: ${message}`
})

// 发消息回主窗口
document.getElementById('reply-btn').addEventListener('click', () => {
  const msg = document.getElementById('msg-input').value
  if (!msg) return
  window.electronAPI.send('to-main', msg)
  document.getElementById('reply-status').innerText = '消息已发出'
})
