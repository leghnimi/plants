const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    plantName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    plantPicture: {
        type: String,
        required: false
    },
}
    , {
        timestamps: true
    }
);
module.exports = mongoose.model('Plant', PlantSchema);