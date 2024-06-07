const express = require('express');
const router = express.Router();
const { addGreenhouse, getGreenhouses, oneGreenhouseById, addSensorDataByGreenhouseName } = require('../controllers/greenhouse.controller');

router.post('/add-greenhouse', addGreenhouse);
router.get('/greenhouses', getGreenhouses);
router.get('/greenhouse/:id', oneGreenhouseById);
router.post('/greenhouse/:greenhouseName/sensor-data', addSensorDataByGreenhouseName);

module.exports = router;
