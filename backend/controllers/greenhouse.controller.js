const { get } = require('mongoose');
const Greenhouse = require('../modals/greenhouse.model');



const addGreenhouse = async (req, res) => {
    const { greenhouseName, numberOfPlants, plantType, city } = req.body;
    const { latitude, longitude } = req.body.location;
    
    try {
        const greenhouse = new Greenhouse({ 
            greenhouseName, 
            location: { latitude, longitude }, 
            numberOfPlants, 
            plantType,
            city
        });
        await greenhouse.save();

        res.status(201).json({ message: 'Greenhouse created successfully', greenhouse });
    } catch (error) {
        if (error.code === 11000) { 
            res.status(400).json({ message: 'Greenhouse name already used', error: error.message });
        } else {
            res.status(500).json({ message: 'An error occurred while creating the greenhouse', error: error.message });
        }
    }
}

const getGreenhouses = async (req, res) => {
    try {
        const greenhouses = await Greenhouse.find();
        res.status(200).json(greenhouses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const oneGreenhouseById = async (req, res) => {
    const { id } = req.params;

    try {
        const greenhouse = await Greenhouse.findById(id);
        res.status(200).json(greenhouse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addSensorDataByGreenhouseName = async (req, res) => {
    const { greenhouseName } = req.params;
    const { date, time, temperature, humidity, light, soilMoisture, soilTemp, note } = req.body;

    try {
        const greenhouse = await Greenhouse.findOne({ greenhouseName });

        if (!greenhouse) {
            return res.status(404).json({ message: 'Greenhouse not found' });
        }

        // Find the sensor data for the current date
        const sensorData = greenhouse.sensors.find(sensor => sensor.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);

        if (sensorData) {
            // If sensor data for the current date exists, check if data for the same time already exists
            const existingTimeData = sensorData.data.find(data => data.time === time);

            if (existingTimeData) {
                // If data for the same time already exists, return an error
                return res.status(400).json({ message: 'Les données ont déjà été saisies pour cette date et heure' });
            }

            // Add the new data
            sensorData.data.push({ time, temperature, humidity, light, soilMoisture, soilTemp, note });
        } else {
            // If sensor data for the current date doesn't exist, create a new document
            greenhouse.sensors.push({ date, data: [{ time, temperature, humidity, light, soilMoisture, soilTemp, note }] });
        }

        await greenhouse.save();

        res.status(201).json({ message: 'Sensor data added successfully', greenhouse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = { addGreenhouse, getGreenhouses, oneGreenhouseById, addSensorDataByGreenhouseName };