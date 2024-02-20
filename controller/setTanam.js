
const axios = require('axios')
const { requestResponse } = require('../config/respons')
const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt')
const db = require('mongoose')
const mongo = db.connection
require('dotenv').config()

const dataLog1 = async ({ IDUSER }) => {
  // console.log(IDUSER)
  try {
    // const user = 'c7168458-ec88-4515-afd3-9b7f13489501'
    const res = await axios.get(`https://smart-agriculture-indol.vercel.app/settanam/getbyuser/${IDUSER}`)
    const data = res.data.data
    // console.log(data)
    // const data = await model.find({ IDUSER: IDUSER })
    const resultArray = [];
    for (const document of data) {
      const alatData = {};
      for (const alat of document.ALAT_DATA) {
        const idAlat = alat.MAC_ADDRESS;
        // console.log(idAlat)
        const dataFromMongoDB = await mongo.collection('sensor')
          .find({ MAC_ADDRESS: idAlat })
          .sort({ DATE_TIME: -1 })
          .limit(1)
          .toArray()
        // console.log(dataFromMongoDB)
        if (dataFromMongoDB && dataFromMongoDB.length > 0) {
          alat.DATA_SENSOR = [dataFromMongoDB[0]];
          // console.log(dataFromMongoDB[0]);
        } else {
          alatData[idAlat] = null;
          console.log(`Data not found for IDUSER: ${IDUSER} and MAC: ${idAlat}`);
        }
      }
      const result = {
        ...document,
      };
      // console.log(result)
      resultArray.push(result);
    }
    // console.log(resultArray)
    return resultArray
  } catch (error) {
    console.log(`Error : ${error}`)
  }
}

// const dataLog = async ({ IDUSER }) => {
//   try {
//     const res = await axios.get(`http://localhost:3000/getbyuser/${IDUSER}`)
//     const data = res.data.data
//     // const data = await model.find({ IDUSER: IDUSER })

//     const resultArray = [];
//     for (const document of data) {
//       const alatData = {};
//       for (const alat of document.ALAT) {
//         const idAlat = alat.MAC_ADDRESS;
//         const matchingDataFromFile = await getDataFromFile(idAlat)
//         const dataTerbaru = matchingDataFromFile.reduce((a, b) => {
//           return new Date(b.DATE_TIME) > new Date(a.DATE_TIME) ? b : a
//         })

//         const index = document.ALAT_DATA.findIndex(item => item.MAC_ADDRESS === idAlat);
//         if (index !== -1) {
//           document.ALAT_DATA[index].DATA_SENSOR = [dataTerbaru];
//         }

//         alatData[idAlat] = dataTerbaru
//       }

//       const dataTerbaruArray = Object.values(alatData)

//       const result = {
//         ...document,
//         DATA_SENSOR: dataTerbaruArray,
//       };
//       resultArray.push(result);
//     }
//     console.log(data)
//     console.log(resultArray)
//     // return data

//   } catch (error) {
//     console.log(`${error}`)
//   }
// }

const getAllDataByID = async (id) => {
  try {
    const res = await axios.get(`https://smart-agriculture-indol.vercel.app/alat/get/${id}`)
    const data = res.data.data
    const sensor = await getDataFromFile(data.MAC_ADDRESS)

    return response = { ...data, DATA_SENSOR: sensor }
  } catch (error) {
    console.log(error)
  }
}

const getDataFromFile = (idAlat) => {
  return new Promise((resolve, reject) => {
    fs.readFile('public/data.json', 'utf8', (err, data) => {
      if (err) {
        reject(
          console.error("Error reject : ", err)
        );
        return;
      } else {
        // console.log('data')
        try {
          const jsonData = JSON.parse(data);
          const matchingData = jsonData.filter((item) => item.ID === idAlat)
          resolve(matchingData)
        } catch (error) {
          console.error("Error Resolve", error)
        }
      }
    });
  });
};

module.exports = {
  dataLog1,
  getAllDataByID
}
