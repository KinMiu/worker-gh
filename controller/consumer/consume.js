let response

function consumer(conn) {
    try {
        const q = '1'
        const on_open = (err, ch) => {
            ch.consume(q, (msg) => {
                if(msg === null) {
                    console.log('PESAN TIDAK ADA')
                }
                ch.ack(msg)
                const data = String(msg.content.toString())
                const splitData = data.split('#')
                const MAC = splitData[0]
                const DATA_SENSOR = splitData[1]
                // const DataS = DATA_SENSOR
                let keterangan = ''

                if( DATA_SENSOR <= 10 ) {
                    keterangan = 'Kurang/Tidak Aman'
                } else if (DATA_SENSOR == 11 || DATA_SENSOR == 12) {
                    keterangan = 'Aman'
                } else {
                    keterangan = 'Berlebih/TIdak Aman'
                }

                console.log(MAC + ' ' + DATA_SENSOR + ' ' + keterangan)

                const responseData = {
                    MAC: MAC,
                    DATA_SENSOR: DATA_SENSOR,
                    KETERANGAN: keterangan 
                }
                
                response = { ...responseData }
            })
        }
        conn.createChannel(on_open)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    consumer
}