require('dotenv').config()
const express = require('express')
const app = express()
const port = 3001
const http = require('http')
const server = http.createServer(app)
const { dataLog1 } = require('./controller/setTanam.js')
const cors = require('cors');
const { router: routerWorker } = require('./controller/app.js');
const { Server } = require('socket.io')
const { access } = require('fs')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.json({
    msg: 'selamat datang di API',
  })
})
app.use(
  cors()
);

const io = new Server(server, { cors: { origin: ["http://localhost:3000", "http://192.168.61.62:8080", 'http://smart-agriculture-afandiakbar16.vercel.app'] } })


app.use('/worker', routerWorker)
app.use('/datalog', require('./routes/getAllLog.js'))
app.use('/send', require('./routes/sendRMQ.js'))


//connection Socket IO
const dataToClient = (client, data) => {
  client.emit('dataUpdate', data)
}

io.on('connection', (socket) => {
  console.log('User Connected')
  socket.on("send_message", async (data) => {
    try {
      const { IDUSER } = data
      console.log(IDUSER)
      console.log("data")
      const value = await dataLog1({ IDUSER })
      // console.log(IDUSER)
      dataToClient(socket, value)
    } catch (error) {
      console.error('ERROR TERJADI SAAT DAPATKAN DATA', error)
    }
  })
})

server.listen(process.env.PORT, () => {
  console.log('SERVER RUNNING IN PORT : ' + process.env.PORT)
})
