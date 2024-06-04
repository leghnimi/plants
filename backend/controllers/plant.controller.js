const Plant = require('../modals/plants.model');
const getPlants = async (req, res) => {
    try {
        const plants = await Plant.find();
        res.status(200).json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getPlants };