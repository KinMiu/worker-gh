const router = require('express').Router()
const setTanam = require('../controller/setTanam')

router.get('/get/:id', (req, res) => {
    setTanam.getAllDataByID(req.params.id)
        .then((result) => {
            res.json(result)
        })
})

module.exports = router
