const express = require('express');
const router = express.Router()

router.get('/test', (req, res) => {
    res.send('This is a get test')
})

module.exports = router