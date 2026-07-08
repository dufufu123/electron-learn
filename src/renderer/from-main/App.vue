<template>
  <div class="from-main-app">
    <h1>我是 fromMain 窗口</h1>
    <p>通过主窗口的按钮打开</p>

    <h2>发给主窗口</h2>
    <input v-model="msg" type="text" placeholder="输入内容" />
    <button @click="sendToMain">发送</button>
    <p>{{ status }}</p>

    <p>{{ fromMain }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const msg = ref('')
const status = ref('')
const fromMain = ref('')

onMounted(() => {
  window.electronAPI.on('from-main-window', (message) => {
    fromMain.value = `主窗口发来的消息: ${message}`
  })
})

const sendToMain = () => {
  if (!msg.value) return
  window.electronAPI.send('to-main', msg.value)
  status.value = '已发送'
}
</script>

<style>
.from-main-app { padding: 16px; font-family: sans-serif; }
p { color: #555; }
input { margin-right: 8px; }
</style>
