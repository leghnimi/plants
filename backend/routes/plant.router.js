const express = require('express');
const router = express.Router();
const { getPlants, getPlantByName} = require('../controllers/plant.controller');

router.get('/plants', getPlants);
router.get('/plants/:plantName', getPlantByName);

module.exports = router;