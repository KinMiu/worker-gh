const model = require('../model/alat')
const { requestResponse } = require('../config/respons')
const fs = require('fs');
const path = require('path');
const alat = require('../model/alat');
let response



const dataLog = async (req, res) => {
  try {

    fs.readFile('./public/data.json', 'utf-8', async (err, data) => {
      if (err) {
        console.log('Error Reading File ', err)
        res.json({ error: 'Error reading data file' });
        return
      }
      const dataJson = JSON.parse(data)
      const idDataJson = dataJson.map((data) => data.ID)

      const dataAlat = await model.find({ GUID: { $in: idDataJson } }).lean()
      const alatobj = {}

      dataAlat.forEach((alat) => {
        alatobj[alat.GUID] = alat
      })

      const dataMerge = dataJson.map((data) => {
        return { ...data, dataAlat: alatobj[data.ID] }
      })

      const allData = Object.values(dataMerge)

      // io.emit('dataLog', { ...allData })
      console.log(allData)
      response = { ...requestResponse.suksesWithData, allData }
    })

  } catch (error) {
    console.log(`${error}`)
    res.status(500).json({ error: 'Internal server error' });
  }
  res.json(response)
}

const dataAlat = async () => {
  try {
    const data = await model.find()
    const response = { ...requestResponse.suksesWithData, data }
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  dataLog,
  dataAlat
}
