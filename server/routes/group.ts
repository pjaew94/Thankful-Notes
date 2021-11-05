import express from 'express';

const router = express.Router()

router.get('/', (req, res) => {
    res.send('group')
})

module.exports = router