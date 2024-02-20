const router = require("express").Router();
const axios = require('axios')
const mqtt = require('mqtt')
const fs = require('fs')
const mongo = require('mongoose')
const db = mongo.connection
const dbConf = require('../config/database')
require('dotenv').config()

koneksi()
reconnect()
let response;

const option = {
  protocol: "amqp",
  hostname: "rmq1.pptik.id",
  port: "5672",
  username: "shadoofpertanian",
  password: "TaniBertani19",
  vhost: "/shadoofpertanian",
}

// 'amqps://tvnhpzdi:K_SqZtJ6pVOXILcWXpaDMa34mFZ7wq0x@albatross.rmq.cloudamqp.com/tvnhpzdi'

async function koneksiRmq() {
  require("amqplib/callback_api").connect({
    protocol: "amqp",
    hostname: "103.167.112.188",
    port: "5672",
    username: "shaker",
    password: "123",
    vhost: "/shaker",
  },
    async function (err, conn) {
      try {
        if (err) {
          reconnect();
        } else {
          console.log("CONNECTING TO RMQ");
          // consumer(conn)
          setInterval(async () => {
            try {

              const res = await axios.get('https://smart-agriculture-indol.vercel.app/alat/get')
              console.log('SUCCESS CONNECTING TO SERVICE 1')
              const data = res.data.data

              // console.log(data)

              const q = data.map((item) => item.NAMA_ALAT)
              const qlength = data.length
              let queue
              for (let i = 0; i < qlength; i++) {
                queue = q[i];
                consume(conn, queue)
                // console.log(queue)
              }
            } catch (error) {
              reconnect()
              console.log('SERVICE 1 FAIL TO CONNECTED')
            }
          }, 10000)
        }
      } catch (err) {
        reconnect()
      }
    }
  );
}

const mqttOption = {
  url: 'mqtt://103.167.112.188:1883',
  username: '/shaker:shaker',
  password: '123'
}

const sendRMQ = (topic, data) => {
  const client = mqtt.connect(mqttOption.url, {
    username: mqttOption.username,
    password: mqttOption.password
  })
  client.on('connect', () => {
    client.publish(topic, JSON.stringify(data), { qos: 1 })
    client.end()
  })
}

async function consume(conn, queue) {
  try {
    const data = queue
    conn.createChannel(function (err, ch) {
      if (err) {
        koneksiRmq()
      }

      // ch.assertQueue(data, { durable: true })

      ch.consume(data, msg => {
        ch.ack(msg)
        const data = String(msg.content.toString())
        const dataJson = JSON.parse(data)

        const responseData = {
          MAC_ADDRESS: dataJson.MAC,
          DATA_SENSOR: dataJson.DATA,
          KETERANGAN: dataJson.KET,
          DATE_TIME: new Date(Date.now()),
        }

        try {
          save(responseData)
        } catch (error) {
          console.log('error 1')
        }

        // saveMessageToJson(responseData)
      }, { noAck: false })
      // ch.close()
    })
  } catch (error) {
    console.log(error)
  }
}

const save = async (responseData) => {
  try {
    const collection = db.collection(`sensor`)
    await collection.insertOne(responseData)
    // console.log('success save')
  } catch (error) {
    console.error(error)
  }
}

async function koneksi() {
  mongo.connect('mongodb+srv://admin:uo5sgXzc9tz9mdWo@cluster0.c84ve12.mongodb.net/sensor?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    db.once('open', () => console.log('BERHASIL TERHUBUNG KE DATABASE'));
  } catch (err) {
    db.on('error', (error) => console.log(error));
    console.log('error');
  }
}

// function saveMessageToJson(data) {
//   const filePath = 'public/data.json';

//   try {
//     let existingData = []
//     try {
//       const jsonData = fs.readFileSync(filePath, 'utf8');
//       existingData = JSON.parse(jsonData);
//     } catch (error) {
//       console.log(`${error}`)
//     }
//     existingData.push(data);

//     fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
//   } catch (error) {
//     console.log(`Terjadi error saat menyimpan data: ${error}`);
//   }
// }

async function reconnect() {
  console.log("Menghubungkan kembali ke RabbitMQ");
  koneksiRmq();
}

module.exports = { router, sendRMQ };


