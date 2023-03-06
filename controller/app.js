const router = require('express').Router();
var q = '1';
const mongo = require('mongoose');
const db = mongo.connection;
koneksiRmq();

function koneksiRmq() {
  require('amqplib/callback_api').connect('amqps://tvnhpzdi:K_SqZtJ6pVOXILcWXpaDMa34mFZ7wq0x@albatross.rmq.cloudamqp.com/tvnhpzdi',
    function (err, conn) {
      try {
        if (err) {
          console.log(err);
          reconnect();
        } else {
          console.log('terhubung ke RMQ');
          consumer(conn);
        }
      } catch (err) {
        console.log('Terjadi Kesalahan server di rabbitMQ');
      }
    }
  );
}

koneksi();

function consumer(conn) {
  try {
    var sukses = conn.createChannel(on_open);
    function on_open(err, ch) {
      ch.consume(q, function (msg) {
        if (msg == null) {
          console.log('Pesan Tidak Ada');
        } else {
          ch.ack(msg);
          const dataku = String(msg.content.toString());
          const datamu = String('{ "ADC" : ' + dataku + ' }');
          console.log(datamu);
          var json = String(datamu);
          const obj = JSON.parse(json);
          var ADC = obj.ADC;
          const History = {
            ADC: ADC,
            keterangan: 'aman',
            date: new Date()
          };
          try {
            save(History);
          } catch (err) {
            console.log('err');
          }
        }
      });
    }
  } catch (err) {
    console.log('error');
  }
}



function save(history) {
  try {
    db.collection('phs').insertOne(history, function (err) {
      if (err) {
        console.log('Gagal');
      }
    });
  } catch (err) {
    console.log('error');
  }
}

function koneksi() {
  mongo.connect('mongodb+srv://admin:uo5sgXzc9tz9mdWo@cluster0.c84ve12.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    db.once('open', () => console.log('berhasil terhubung ke database'));
  } catch (err) {
    db.on('error', (error) => console.log(error));
    console.log('error');
  }
}

function reconnect() {
  console.log('Menghubungkan kembali ke RabbitMQ');
  koneksiRmq(setInterval, 90000);
}

module.exports = { router, koneksi };
