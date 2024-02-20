const router = require('express').Router()
const { sendRMQ } = require('../controller/app')

router.post('/senddata', (req, res) => {
    try {
        const data1 = req.body
        const data = {
            MAX: data1.DATA_SENSOR.MAX,
            MIN: data1.DATA_SENSOR.MIN
        }
        console.log(data)
        const topic = data1.MAC_ADDRESS
        sendRMQ(topic, data)
        res.json({ msg: 'SUCCESS SEND TO RMQ' })
    } catch (error) {
        console.log('TERJADI ERROR : ', error)
        res.json({ msg: 'TERJADI ERROR' })
    }

})

module.exports = router
