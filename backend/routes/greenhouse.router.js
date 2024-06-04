const express = require('express');
const router = express.Router();
const { addGreenhouse, getGreenhouses } = require('../controllers/greenhouse.controller');

router.post('/add-greenhouse', addGreenhouse);
router.get('/greenhouses', getGreenhouses);
module.exports = router;
