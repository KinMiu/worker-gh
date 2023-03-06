const userModel = require('../model/userModel')
const { requestResponse } = require('../config/respons')

exports.getalldata = () => 
new Promise(async (resolve, reject) => {
  userModel.find({})
  .then((user) => {
    resolve(requestResponse.suksesWithData(user))
  }).catch((err) => {
    reject(requestResponse.kesalahan)
  })
})

exports.getLatestData = () => 
new Promise(async(resolve, reject) => {
  await userModel.findOne({}, {sort: {date: +1}})
  .then((data) => {
    resolve({
      status: true,
      msg: 'get data',
      data: data
    })
  }).catch((err) => {
    reject({
      status: false,
      msg: 'fail'
    })
  })
})
