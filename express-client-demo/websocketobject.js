const msgBox = document.getElementById('msg-need-send')
const sendBtn = document.getElementById('send-btn')
const exit = document.getElementById('exit')
const receiveBox = document.getElementById('receive-box')

// 可以重新连接的socket
class WebSocketObject {
	constructor(url, cbFunction) {
		this.url = url
		this.cbFunction = cbFunction
		this.wsClosed = false
		this.ws = null
		this._connect()
	}

	_connect() {
		this.wsClosed = false
		this.ws = new WebSocket('ws://localhost:3000/websocket/test')
		this.ws.onopen = (e) => {}
		this.ws.onmessage = (data) => {
			this.cbFunction(data)
		}
		this.ws.onclose = () => {
			if (!this.wsClosed) {
				setTimeout(() => {
					console.log('reconnect')
					this._connect()
				}, 5000)
			}
		}
	}

	start() {
		this._connect()
	}

	send(message) {
		if (this.ws) {
			this.ws.send(message)
		}
	}

	close() {
		this.wsClosed = true
		if (this.ws) {
			this.ws.close()
		}
	}
}

const tempFunction = (data) => {
	receiveBox.innerHTML += `<p>${data.data}</p>`
	receiveBox.scrollTo({
		top: receiveBox.scrollHeight,
		behavior: "smooth"
	})
}
const wsObject = new WebSocketObject('ws://localhost:3000/websocket/test', tempFunction)

sendBtn.onclick = () => {
	wsObject.send(msgBox.value)
}

exit.onclick = () => {
	wsObject.close()
}