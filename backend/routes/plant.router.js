const express = require('express');
const router = express.Router();
const { getPlants} = require('../controllers/plant.controller');

router.get('/plants', getPlants);

module.exports = router;