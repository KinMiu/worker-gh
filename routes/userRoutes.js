const router = require('express').Router()
const userController = require('../controller/userController')

router.get('/getalldata', (req, res) => {
  userController.getalldata()
  .then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
})

router.get('/getlatestdata', (req, res) => {
  userController.getLatestData()
  .then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
})

module.exports = router