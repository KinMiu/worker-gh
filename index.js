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
require('dotenv').config()

app.use(cors({ origin: ['http://192.168.61.62:8080', 'https://backend-tes-taupe.vercel.app/'] }))
app.use(express.json({ extended: true, limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.json({
    msg: 'selamat datang di API',
  })
})

const io = new Server(server, {
  cors: {
    origin: ['https://smart-agriculture-afandiakbar16.vercel.app', 'https://backend-tes-taupe.vercel.app'],
    methods: ["GET", "POST"],
  }
})


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
      // console.log(data)
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
