<template>
  <div class="app">
    <h1>Hello from Electron + Vue 3!</h1>
    <p>👋</p>

    <!-- 版本信息 — 之前用 innerText，现在用 {{ }} -->
    <p>{{ versionInfo }}</p>

    <!-- IPC 通信 -->
    <button @click="doPing">调用 Ping</button>
    <p>{{ pingResult }}</p>

    <!-- 单向通信 -->
    <button @click="notifyMain">向主进程发送消息</button>

    <!-- 文件对话框 -->
    <button @click="openFile">打开文件</button>
    <p>{{ filePath }}</p>

    <!-- 文件操作 -->
    <h2>文件操作</h2>
    <button @click="readFile">读取文本文件</button>
    <p>{{ readPath }}</p>
    <textarea v-model="fileContent" rows="8" placeholder="文件内容将显示在这里..."></textarea>
    <br/>
    <button @click="saveFile">保存文件</button>
    <p>{{ saveResult }}</p>

    <!-- 窗口间通信 -->
    <h2>窗口间通信</h2>
    <input v-model="toSubMsg" type="text" placeholder="输入发给子窗口的消息" />
    <button @click="sendToSub">发给子窗口</button>
    <p>{{ fromSubMsg }}</p>

    <!-- 右键菜单区域 -->
    <div class="context-area">
      在此区域右键点击，查看右键菜单
    </div>
  </div>
</template>

<script setup>
// ====== Vue 3 Composition API ======
import { ref, onMounted } from 'vue'

// --- 响应式数据（替代之前的 getElementById）---
const versionInfo = ref('')
const pingResult = ref('')
const filePath = ref('')
const fileContent = ref('')
const readPath = ref('')
const saveResult = ref('')
const toSubMsg = ref('')
const fromSubMsg = ref('')

// --- 生命周期：页面加载完成 ---
onMounted(() => {
  // 版本信息
  versionInfo.value = `Chrome ${window.versions.chrome()}, Node ${window.versions.node()}, Electron ${window.versions.electron()}`

  // 监听主进程推送
  window.electronAPI.on('from-main', (msg) => {
    console.log('渲染进程收到:', msg)
  })

  // 监听子窗口发来的消息
  window.electronAPI.on('from-sub-window', (msg) => {
    fromSubMsg.value = `子窗口发来的消息: ${msg}`
  })
})

// --- 方法 ---
const doPing = async () => {
  const res = await window.versions.ping()
  pingResult.value = `Ping 结果: ${res}`
}

const notifyMain = () => {
  window.electronAPI.send('notify-main', '你好主进程！')
}

const openFile = async () => {
  const path = await window.electronAPI.openFileDialog()
  filePath.value = path ? `你选择的文件: ${path}` : '未选择文件'
}

const readFile = async () => {
  const result = await window.electronAPI.readFile()
  if (result) {
    readPath.value = `文件路径: ${result.filePath}`
    fileContent.value = result.content
  } else {
    readPath.value = '未选择文件'
  }
}

const saveFile = async () => {
  if (!fileContent.value) {
    saveResult.value = '请先读取文件或输入内容'
    return
  }
  const result = await window.electronAPI.saveFile(fileContent.value)
  saveResult.value = result.success ? `保存成功: ${result.filePath}` : '已取消保存'
}

const sendToSub = () => {
  if (!toSubMsg.value) return
  window.electronAPI.send('to-sub', toSubMsg.value)
}
</script>

<style>
.app { font-family: sans-serif; padding: 16px; }
p { color: #555; }
button { margin-right: 8px; margin-bottom: 8px; }
textarea { width: 100%; margin-bottom: 8px; }
input { margin-right: 8px; }
.context-area {
  margin-top: 20px; padding: 20px;
  background: #f0f0f0; border: 1px dashed #999;
  text-align: center;
}
</style>
