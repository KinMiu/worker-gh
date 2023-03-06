const mongoose = require('mongoose');

const userModel = mongoose.Schema ({
    ADC: {
        type: String
    },
    keerangan: {
        type: String
    }
})

module.exports = mongoose.model('ph', userModel);