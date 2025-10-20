const express = require('express');
const router = express.Router()
const Aicontroller = require('../controllers/ai.controller')

router.post('/get-review', Aicontroller.getReview)

module.exports = router;