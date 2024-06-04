const { get } = require('mongoose');
const Greenhouse = require('../modals/greenhouse.model');



const addGreenhouse = async (req, res) => {
    const { greenhouseName, location, numberOfPlants, plantType } = req.body;
    
    try {
        const greenhouse = new Greenhouse({ greenhouseName, location, numberOfPlants, plantType });
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


module.exports = { addGreenhouse, getGreenhouses };