const express = require('express');
const expressWs = require('express-ws')
const router = express.Router()
expressWs(router);

function getSourceData () {
  return [
    { item: "学习", count: Math.floor(Math.random() * 20 + 10) },
    { item: "听歌", count: Math.floor(Math.random() * 20 + 10) },
    { item: "锻炼", count: Math.floor(Math.random() * 20 + 10) },
    { item: "游戏", count: Math.floor(Math.random() * 20 + 10) },
    { item: "发呆", count: Math.floor(Math.random() * 20 + 10) }
  ]
}

router.ws('/test', (ws, req) => {
  ws.send('连接成功')
  let interval
  interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      // ws.send(Math.random().toFixed(2))
      ws.send(JSON.stringify(getSourceData()))
    } else {
      clearInterval(interval)
    }
  }, 1000)

  ws.on('message', msg => {
    ws.send(msg)
  })
})

module.exports = router
