const mongoose = require('mongoose');

const GreenhouseSchema = new mongoose.Schema({
    greenhouseName: {
        type: String,
        required: true,
        unique: true
    },
    plantType:{
        type: String,
        required: true
    }
    ,
    location: {
        type: String,
        required: true
    },
    numberOfPlants: {
        type: Number,
        required: true
    },
}
    , {
        timestamps: true
    }
);

module.exports = mongoose.model('Greenhouse', GreenhouseSchema);
