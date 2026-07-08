<template>
  <div class="sub-app">
    <!-- 自定义标题栏 -->
    <div class="title-bar">
      <span>子窗口</span>
      <div class="btns">
        <button @click="minWin" title="最小化">—</button>
        <button @click="maxWin" title="最大化">□</button>
        <button @click="closeWin" class="btn-close" title="关闭">✕</button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="content">
      <p>{{ fromMainMsg }}</p>
      <input v-model="msg" type="text" placeholder="输入发给主窗口的消息" />
      <button @click="sendToMain">发回主窗口</button>
      <p>{{ replyStatus }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const fromMainMsg = ref('')
const msg = ref('')
const replyStatus = ref('')

// 监听主窗口发来的消息
onMounted(() => {
  window.electronAPI.on('from-main-window', (message) => {
    fromMainMsg.value = `主窗口发来的消息: ${message}`
  })
})

// 发消息回主窗口
const sendToMain = () => {
  if (!msg.value) return
  window.electronAPI.send('to-main', msg.value)
  replyStatus.value = '消息已发出'
}

// 窗口控制
const minWin = () => window.electronAPI.windowControls.minimize()
const maxWin = () => window.electronAPI.windowControls.maximize()
const closeWin = () => window.electronAPI.windowControls.close()
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

.title-bar {
  height: 32px;
  background: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  -webkit-app-region: drag;
  user-select: none;
}
.title-bar span { color: #ecf0f1; font-size: 13px; }
.title-bar .btns { -webkit-app-region: no-drag; display: flex; gap: 8px; }
.title-bar button {
  background: none; border: none; color: #ecf0f1;
  font-size: 14px; cursor: pointer; padding: 2px 6px;
}
.title-bar button:hover { background: rgba(255,255,255,0.15); }
.title-bar .btn-close:hover { background: #e74c3c; }

.content { padding: 16px; font-family: sans-serif; }
p { color: #555; margin-bottom: 8px; }
input { margin-right: 8px; }
button { margin-bottom: 8px; }
</style>
